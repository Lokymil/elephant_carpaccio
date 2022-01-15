import { Server } from "http";
import { Server as Socket } from "socket.io";
import { generateCart } from "../cart/cart";
import { Invoice } from "../invoice/invoice.types";
import { getTeam, resetValidAnswerStreak } from "../team/team";
import { Team } from "../team/team.types";
import { SocketType } from "./socket.types";
import {
  cartRate,
  totalDuration,
  startDifficulty,
  wrongAnswerFactor,
  noAnswwerFactor,
  validAnswerStreakThreshold,
} from "../conf";
import { numberOfDifficultyLevel } from "../difficulty/difficulty";

const difficultyMaxDuration = totalDuration / (numberOfDifficultyLevel - 1);

export const initSocket = (server: Server) => {
  const io = new Socket(server, { cors: { origin: "*" } });

  const teams: Team[] = [];
  let isStarted = false;
  let expectedInvoice: Invoice;
  let currentPrice: number;
  let difficulty = startDifficulty;
  let startingTimestamp: number;
  let startingDifficultyTimestamp: number;

  /**
   * Setup socket for scoring display
   */
  io.of("/scores").on("connection", (socket) => {
    console.log("Scores connected");

    const teamSender = setInterval(
      () =>
        socket.emit("current", {
          isStarted,
          teams,
          difficulty,
          remainingTime: getRemainingTime(),
          remainingDifficultyTime: getRemainingDifficultyTime(),
        }),
      1000
    );

    socket.on("start", startSendingCarts);

    socket.on("disconnect", () => {
      clearInterval(teamSender);
      console.log("Scores disconnected");
    });
  });

  /**
   * Setup socket for team interaction
   */
  io.of("/team").on("connection", (socket) => {
    let team: Team;

    socket.on("auth", (teamName) => {
      team = getTeam(teams, teamName);
      console.log(`${teamName} connected`);
    });

    socket.on("invoice", (invoice) => {
      if (team) {
        updateFromInvoice(socket, team, invoice);
      }
    });

    socket.on("disconnect", (): void => {
      console.log(`${team?.name} disconnected`);
    });
  });

  /**
   * Validate invoice and update team and difficulty accordingly
   */
  const updateFromInvoice = (
    socket: SocketType,
    team: Team,
    invoice: Invoice
  ): void => {
    if (invoice === expectedInvoice) {
      team.points += Math.round(currentPrice);
      team.validAnswerInARow += 1;
      team.hasAnswerLast = true;
      socket.emit("invoice", `OK | your points: ${team.points}`);
    } else {
      team.points -= Math.round(currentPrice * wrongAnswerFactor);
      socket.emit(
        "invoice",
        `KO ${expectedInvoice} | your points: ${team.points}`
      );
      team.validAnswerInARow = 0;
    }

    checkDifficultyIncrease();
  };

  /**
   * Increase difficulty and reset timestamp
   */
  const increaseDifficulty = () => {
    difficulty++;
    startingDifficultyTimestamp = new Date().getTime();
    console.log(`--------> Difficulty updated to ${difficulty}`);
  };

  /**
   * Update difficulty if a team has a long enough win streak
   */
  const checkDifficultyIncrease = () => {
    if (
      teams.some((team) => team.validAnswerInARow >= validAnswerStreakThreshold)
    ) {
      increaseDifficulty;
      resetValidAnswerStreak(teams);
    }
  };

  /**
   * Update teams for not answering team
   */
  const removePointsFromNotAnsweringTeams = () => {
    teams.forEach((team) => {
      if (!team.hasAnswerLast) team.points -= currentPrice * noAnswwerFactor;
      team.hasAnswerLast = false;
    });
  };

  /**
   * Compute remaining for total dev time
   */
  const getRemainingTime = () => {
    const now = new Date().getTime();
    const elapseTime = startingTimestamp ? now - startingTimestamp : 0;
    return totalDuration - elapseTime;
  };

  /**
   * Compute remaining for total dev time
   */
  const getRemainingDifficultyTime = () => {
    const now = new Date().getTime();
    const elapseTime = startingDifficultyTimestamp
      ? now - startingDifficultyTimestamp
      : 0;
    return difficultyMaxDuration - elapseTime;
  };

  /**
   * Trigger scheduler to send cart at given rate
   * Start timeout to stop after a given delay
   */
  const startSendingCarts = (): void => {
    console.log(`
    ----------------------
    Start sending cart for 1 hour
    Difficulty: ${difficulty}
    ----------------------
    `);
    isStarted = true;
    startingTimestamp = new Date().getTime();
    startingDifficultyTimestamp = new Date().getTime();

    /**
     *
     */
    const cartSenderInterval = setInterval(() => {
      removePointsFromNotAnsweringTeams();
      const { cart, price, invoice } = generateCart(difficulty);
      currentPrice = price;
      expectedInvoice = invoice;
      io.of("/team").emit("cart", cart);
    }, cartRate);

    const difficultyAutoIncrease = setInterval(() => {
      increaseDifficulty();
    }, difficultyMaxDuration);

    /**
     * Stop sending carts after one hour
     */
    setTimeout(() => {
      clearInterval(cartSenderInterval);
      clearInterval(difficultyAutoIncrease);
      isStarted = false;
      difficulty = startDifficulty;

      console.log(`
    ----------------------
    Stop sending cart !
    Reset difficulty to ${difficulty}
    ----------------------
      `);
    }, totalDuration);
  };
};

import { Server } from "http";
import { Server as Socket } from "socket.io";
import { generateCart } from "../cart/cart";
import { Invoice } from "../invoice/invoice.types";
import { getTeam, resetValidAnswerStreak, Team, Teams } from "../team/team";
import {
  cartRate,
  totalDuration,
  startDifficulty,
  wrongAnswerFactor,
  noAnswerFactor,
  validAnswerStreakThreshold,
  countTeamWithHighStreakThreshold,
} from "../conf";
import { numberOfDifficultyLevel } from "../difficulty/difficulty";

const difficultyMaxDuration = totalDuration / (numberOfDifficultyLevel - 1);

export const initSocket = (server: Server) => {
  const io = new Socket(server, { cors: { origin: "*" } });

  let isStarted = false;
  let expectedInvoice: Invoice;
  let currentPrice = 0;
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
          teams: Teams,
          difficulty: Math.min(difficulty, numberOfDifficultyLevel - 1),
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
      team = getTeam(teamName);
      if (team.connected) {
        console.log(`${teamName} tried to connect twice`);
        socket.disconnect(true);
        // Team must stay connected
        team.connect();
      } else {
        team.connect();
        console.log(`${teamName} connected`);
      }
    });

    socket.on("invoice", (invoice) => {
      if (team) {
        socket.emit(
          "invoice",
          team.updateTeamFromInvoice(
            invoice,
            expectedInvoice,
            currentPrice,
            wrongAnswerFactor
          )
        );
        checkDifficultyIncrease();
      }
    });

    socket.on("disconnect", (): void => {
      console.log(`${team?.name || "Unknown"} disconnected`);
      team?.disconnect();
    });
  });

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
    const countTeamWithHighStreak = Teams.reduce((count, team) => {
      if (team.validAnswerInARow >= validAnswerStreakThreshold) {
        return count + 1;
      }
      return count;
    }, 0);
    if (countTeamWithHighStreak >= countTeamWithHighStreakThreshold) {
      increaseDifficulty();
      resetValidAnswerStreak();
    }
  };

  /**
   * Update teams for not answering team
   */
  const removePointsFromNotAnsweringTeams = () => {
    Teams.forEach((team) => {
      if (!team.hasAnswerLast) {
        team.points -= currentPrice * noAnswerFactor;
        team.resetWinStreak();
      }
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
    Start sending cart for ${totalDuration / 60000} minutes with 1 cart per ${
      cartRate / 1000
    } seconds
    Invalid answer losing points rate: -${wrongAnswerFactor * 100} %
    No answer losing points rate: -${noAnswerFactor * 100} %
    Difficulty: ${difficulty}
    Difficulty auto update: ${totalDuration / (4 * 60000)} minutes
    Difficulty winstreak update: ${countTeamWithHighStreakThreshold} attendee(s) with ${validAnswerStreakThreshold} valid answers in a row
    ----------------------
    `);
    isStarted = true;
    startingTimestamp = new Date().getTime();
    startingDifficultyTimestamp = new Date().getTime();

    /**
     * Send cart, check difficulty auto-update and check for team that has not answered
     */
    const cartSenderInterval = setInterval(() => {
      if (getRemainingDifficultyTime() <= 0) {
        increaseDifficulty();
      }
      removePointsFromNotAnsweringTeams();
      const { cart, price, invoice } = generateCart(difficulty);
      currentPrice = price;
      expectedInvoice = invoice;
      console.log("Emitted cart: " + JSON.stringify(cart));
      io.of("/team").emit("cart", cart);
    }, cartRate);

    /**
     * Stop sending carts after one hour
     */
    setTimeout(() => {
      clearInterval(cartSenderInterval);
      isStarted = false;
      difficulty = startDifficulty;
      startingTimestamp = 0;
      startingDifficultyTimestamp = 0;

      console.log(`
    ----------------------
    Stop sending cart !
    Reset difficulty to ${difficulty}
    ----------------------
      `);
    }, totalDuration);
  };
};

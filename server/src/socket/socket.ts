import { Server } from "http";
import { Server as Socket } from "socket.io";
import events from "events";
import { generateCart } from "../cart/cart";
import { Invoice } from "../invoice/invoice.types";
import { getTeam, resetValidAnswerStreak, Team, Teams } from "../team/team";
import {
  cartRate,
  totalDuration,
  wrongAnswerFactor,
  noAnswerFactor,
  validAnswerStreakThreshold,
  countTeamWithHighStreakThreshold,
} from "../conf";
import DifficultyHandler from "../difficulty/DifficultyHandler";
import CartHandler from "../cart/CartHandler";

const gameEvents = new events.EventEmitter();

const difficultyHandler = new DifficultyHandler(totalDuration, gameEvents);
const cartHandler = new CartHandler(
  totalDuration,
  difficultyHandler,
  gameEvents
);

export const initSocket = (server: Server) => {
  const io = new Socket(server, { cors: { origin: "*" } });

  let currentPrice = 0;

  /**
   * Setup socket for scoring display
   */
  io.of("/scores").on("connection", (socket) => {
    console.log("Scores connected");

    const teamSender = setInterval(
      () =>
        socket.emit("current", {
          isStarted: cartHandler.isStarted && difficultyHandler.isStarted,
          teams: Teams,
          difficulty: difficultyHandler.currentDifficulty,
          remainingTime: cartHandler.getRemainingTime(),
          remainingDifficultyTime: difficultyHandler.getRemainingTime(),
        }),
      1000
    );

    socket.on("start", () => gameEvents.emit("start"));

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
            cartHandler.expectedInvoice,
            cartHandler.expectedPrice,
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
      difficultyHandler.forceUpgrade();
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

  gameEvents.on("newCart", (cart) => {
    removePointsFromNotAnsweringTeams();
    io.of("/team").emit("cart", cart);
  });

  gameEvents.on("start", () => {
    console.log(`
    ----------------------
    Start sending cart for ${totalDuration / 60000} minutes with 1 cart per ${
      cartRate / 1000
    } seconds
    Invalid answer losing points rate: -${wrongAnswerFactor * 100} %
    No answer losing points rate: -${noAnswerFactor * 100} %
    Difficulty: ${difficultyHandler.currentDifficulty}
    Difficulty auto update: ${totalDuration / (4 * 60000)} minutes
    Difficulty winstreak update: ${countTeamWithHighStreakThreshold} attendee(s) with ${validAnswerStreakThreshold} valid answers in a row
    ----------------------
    `);
  });

  gameEvents.on("end", () => {
    console.log(`
    ----------------------
    Stop sending cart !
    Reset difficulty to ${difficultyHandler.currentDifficulty}
    ----------------------
      `);
  });
};

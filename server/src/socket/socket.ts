import { Server } from "http";
import { Server as Socket } from "socket.io";
import { generateCart } from "../cart/cart";
import { Invoice } from "../invoice/invoice.types";
import { getTeam, resetValidAnswerStreak } from "../team/team";
import { Team } from "../team/team.types";

export const initSocket = (server: Server) => {
  const io = new Socket(server, { cors: { origin: "*" } });

  const teams: Team[] = [];
  let isStarted = false;

  io.of("/scores").on("connection", (socket) => {
    console.log("Scores connected");

    const teamSender = setInterval(
      () => socket.emit("current", { isStarted, teams }),
      5000
    );

    socket.on("start", startSendingCarts);

    socket.on("disconnect", () => {
      clearInterval(teamSender);
      console.log("Scores disconnected");
    });
  });

  const validAnswerStreakThreshold = 10;
  let expectedInvoice: Invoice;
  let currentPrice: number;
  let difficulty = 0;

  io.of("/team").on("connection", (socket) => {
    let team: Team;

    socket.on("auth", (teamName) => {
      team = getTeam(teams, teamName);
      console.log(`${teamName} connected`);
    });

    socket.on("invoice", (invoice) => {
      if (!team) return;

      if (invoice === expectedInvoice) {
        team.points += Math.round(currentPrice);
        team.validAnswerInARow += 1;
        socket.emit("invoice", "OK");
      } else {
        team.points -= Math.round(currentPrice / 2);
        socket.emit("invoice", `KO ${expectedInvoice}`);
        team.validAnswerInARow = 0;
      }

      checkDifficultyUpdate();
    });

    socket.on("disconnect", (): void => {
      console.log(`team ${team?.name} disconnected`);
    });
  });

  const checkDifficultyUpdate = () => {
    if (
      teams.some((team) => team.validAnswerInARow >= validAnswerStreakThreshold)
    ) {
      difficulty++;
      console.log(`Difficulty updated to ${difficulty}`);
      resetValidAnswerStreak(teams);
    }
  };

  const startSendingCarts = (): void => {
    console.log(`
    ----------------------
    Start sending cart for 1 hour
    Difficulty: ${difficulty}
    ----------------------
    `);
    isStarted = true;

    const cartSenderInterval = setInterval(() => {
      const { cart, price, invoice } = generateCart(difficulty);
      currentPrice = price;
      expectedInvoice = invoice;
      io.of("/team").emit("cart", cart);
    }, 10000);

    /**
     * Stop sending carts after one hour
     */
    setTimeout(() => {
      isStarted = false;
      difficulty = 0;
      clearInterval(cartSenderInterval);
      console.log(`
    ----------------------
    Stop sending cart !
    Reset difficulty to ${difficulty}
    ----------------------
      `);
    }, 3600000);
  };
};

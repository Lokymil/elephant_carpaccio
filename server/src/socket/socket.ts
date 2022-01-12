import { Server } from "http";
import { Server as Socket } from "socket.io";
import { generateCart } from "../cart/cart";
import { Invoice } from "../invoice/invoice.types";
import { getTeam, resetValidAnswerStreak } from "../team/team";
import { Team } from "../team/team.types";

export const initSocket = (server: Server) => {
  const io = new Socket(server);

  const teams: Team[] = [];
  const validAnswerStreakThreshold = 10;
  let expectedInvoice: Invoice;
  let currentPrice: number;
  let difficulty = 0;

  io.of("/scores").on("connection", (socket) => {
    console.log("Scores connected");

    setInterval(() => socket.emit("current", teams), 5000);

    socket.on("disconnect", () => {
      console.log("Scores disconnected");
    });
  });

  io.of("/team").on("connection", (socket) => {
    let team: Team;

    socket.on("auth", (teamName) => {
      team = getTeam(teams, teamName);
      console.log(`${teamName} connected`);
    });

    socket.on("invoice", (invoice) => {
      if (!team) return;

      console.log(invoice);

      if (invoice === expectedInvoice) {
        team.points += Math.round(currentPrice);
        team.validAnswerInARow += 1;
        socket.emit("invoice", "OK");
      } else {
        team.points -= Math.round(currentPrice / 2);
        socket.emit("invoice", `KO ${expectedInvoice}`);
        team.validAnswerInARow = 0;
      }

      if (
        teams.some(
          (team) => team.validAnswerInARow >= validAnswerStreakThreshold
        )
      ) {
        difficulty++;
        resetValidAnswerStreak(teams);
      }
    });

    socket.on("disconnect", () => {
      console.log(`team ${team?.name} disconnected`);
    });
  });

  // TODO adjust emit frequency
  setInterval(() => {
    const { cart, price, invoice } = generateCart(difficulty);
    currentPrice = price;
    expectedInvoice = invoice;
    io.of("/team").emit("cart", cart);
  }, 10000);
};

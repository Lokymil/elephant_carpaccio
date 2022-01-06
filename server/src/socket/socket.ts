import { Server } from "http";
import { Server as Socket } from "socket.io";
import { generateCart } from "../cart/cart";
import { Invoice } from "../invoice/invoice.types";
import { getTeam } from "../team/team";
import { Team } from "../team/team.types";

export const initSocket = (server: Server) => {
  const io = new Socket(server);

  const teams: Team[] = [];
  let expectedInvoice: Invoice;
  let currentPrice: number;

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

      if (invoice === expectedInvoice) {
        team.points += Math.round(currentPrice);
        socket.emit("invoice", "OK");
      } else {
        team.points -= Math.round(currentPrice / 2);
        socket.emit("invoice", `KO ${expectedInvoice}`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`team ${team?.name} disconnected`);
    });
  });

  setInterval(() => {
    // TODO make "generateCart" adapt to difficulty level
    const { cart, price, invoice } = generateCart();
    currentPrice = price;
    expectedInvoice = invoice;
    io.of("/team").emit("cart", cart);
  }, 15000);
};

import { Server } from "http";
import { Server as Socket } from "socket.io";
import { generateCart } from "./cart";
import { Cart } from "./cart.types";
import { getTeam } from "./team";
import { Team } from "./team.types";

export const initSocket = (server: Server) => {
  const io = new Socket(server);

  const teams: Team[] = [];
  let lastSentCart: Cart;

  io.of("/team").on("connection", (socket) => {
    let team: Team;

    socket.on("auth", (teamName) => {
      team = getTeam(teams, teamName);
    });

    socket.on("invoice", (invoice) => {
      if (!team) return;

      // TODO validate invoice
      team.points += 10;
      socket.emit("invoice", "OK");
    });

    socket.on("disconnect", () => {
      console.log(`team ${team?.name} disconnected`);
    });
  });

  setInterval(() => {
    // TODO make "generateCart" to return expected result to ease validation
    // TODO make "generateCart" adapt to difficulty level
    lastSentCart = generateCart();
    io.of("/team").emit("cart", lastSentCart);
    io.of("/scores").emit("current", teams);
  }, 15000);
};

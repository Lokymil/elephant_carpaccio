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

  io.of("/scores").on("connection", (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  io.of("/team").on("connection", (socket) => {
    let team: Team;

    socket.on("auth", (teamName) => {
      team = getTeam(teams, teamName);
    });

    socket.on("disconnect", () => {
      console.log(`team ${team?.name} disconnected`);
    });
  });

  setInterval(() => {
    lastSentCart = generateCart();
    io.of("/team").emit("cart", lastSentCart);
  }, 15000);
};

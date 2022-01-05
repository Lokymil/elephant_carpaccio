import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

// TODO : identify client to keep track of who do what

io.of("/scores").on("connection", (socket) => {
  console.log("a user connected");

  console.log(socket);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

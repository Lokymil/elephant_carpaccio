import express from "express";
import http from "http";
import { initSocket } from "./socket";

const app = express();
const server = http.createServer(app);

initSocket(server);

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

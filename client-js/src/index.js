const io = require("socket.io-client");

const socket = io("http://localhost:3000/team");

socket.on("connect", () => {
  console.log(`Connected with id : ${socket.id}`);
  socket.emit("auth", "JS");
});

socket.on("cart", (cart) => {
  console.log(cart);
});

socket.on("disconnect", () => {
  console.log("Disconnected"); // undefined
});

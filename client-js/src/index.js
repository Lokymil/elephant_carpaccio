const io = require("socket.io-client");
const invoiceGenerator = require("./invoice/invoice");

const socket = io("http://localhost:3000/team");

socket.on("connect", () => {
  console.log(`Connected with id : ${socket.id}`);
  socket.emit("auth", "JS");
});

socket.on("cart", (cart) => {
  const invoice = invoiceGenerator(cart);
  socket.emit("invoice", invoice);
});

socket.on("disconnect", () => {
  console.log("Disconnected"); // undefined
});

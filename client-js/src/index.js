const io = require("socket.io-client");
const { name, host } = require("./conf");
const invoiceGenerator = require("./invoice/invoice");

const socket = io(`http://${host}:3000/team`);

socket.on("connect", () => {
  console.log(`Connected with id : ${socket.id}`);
  socket.emit("auth", name);
});

socket.on("cart", (cart) => {
  const invoice = invoiceGenerator(cart);
  socket.emit("invoice", invoice);
});

socket.on("invoice", (invoice) => {
  console.log(`Result: ${invoice}`);
});

socket.on("disconnect", () => {
  console.log("Disconnected"); // undefined
});

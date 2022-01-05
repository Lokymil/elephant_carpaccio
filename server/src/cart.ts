import { Cart, Invoice } from "./cart.types";

export const generateCart = (): {
  cart: Cart;
  invoice: Invoice;
  price: number;
} => {
  const cart: Cart = {
    prices: [10],
    quantities: [1],
    country: "FR",
    reduction: "STANDARD",
  };

  const price = 10;

  const invoice = `${price} €`;

  return { cart, price, invoice };
};

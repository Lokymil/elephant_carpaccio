import { Cart } from "./cart.types";

export const generateCart = (): Cart => ({
  prices: [10],
  quantities: [1],
  country: "FR",
  reduction: "STANDARD",
});

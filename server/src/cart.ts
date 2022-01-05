import { Cart } from "./cart.types";

export const generateCart = (): Cart => ({
  prices: [65.6, 27.26, 32.68],
  quantities: [6, 8, 10],
  country: "FR",
  reduction: "STANDARD",
});

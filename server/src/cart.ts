import { Cart, Country, Invoice, Reduction } from "./cart.types";
import { getInvoice } from "./invoice";

const getRandomFrom1ToX = (upperBound: number): number => {
  const randFrom0ToXMinus1 = Math.random() * (upperBound - 1);
  const roundRandFrom0ToXMinus1 = Math.round(randFrom0ToXMinus1);
  return roundRandFrom0ToXMinus1 + 1;
};

const getPricesAndQuantity = (): {
  prices: number[];
  quantities: number[];
} => {
  const prices: number[] = [];
  const quantities: number[] = [];

  const itemNumber = getRandomFrom1ToX(3);
  for (let itemIndex = 0; itemIndex < itemNumber; itemIndex++) {
    prices.push(Math.max(getRandomFrom1ToX(100), 10));
    quantities.push(getRandomFrom1ToX(10));
  }

  return { prices, quantities };
};

const generateCountry = (countries: Country[]): Country => {
  return countries[getRandomFrom1ToX(countries.length) - 1];
};

const generateReduction = (reductions: Reduction[]): Reduction => {
  return reductions[getRandomFrom1ToX(reductions.length) - 1];
};

export const generateCart = (): {
  cart: Cart;
  invoice: Invoice;
  price: number;
} => {
  const cart: Cart = {
    ...getPricesAndQuantity(),
    country: generateCountry(["FR", "US", "UK"]),
    reduction: generateReduction([
      "STANDARD",
      "-50%",
      "-10%",
      "-50% FIRST",
      "-50% LAST",
      "SPECIAL",
    ]),
  };

  return { cart, ...getInvoice(cart) };
};

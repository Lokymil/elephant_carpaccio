import { Country } from "../country/country.types";
import { Cart, Reduction } from "./cart.types";
import { getInvoice } from "../invoice/invoice";
import { Invoice } from "../invoice/invoice.types";
import { getOptionsByDifficulty } from "../difficulty/difficulty";

const getRandomFrom1ToX = (upperBound: number): number => {
  const randFrom0ToXMinus1 = Math.random() * (upperBound - 1);
  const roundRandFrom0ToXMinus1 = Math.round(randFrom0ToXMinus1);
  return roundRandFrom0ToXMinus1 + 1;
};

const getPricesAndQuantity = (
  possibleNumberOfItems: number[]
): {
  prices: number[];
  quantities: number[];
} => {
  const prices: number[] = [];
  const quantities: number[] = [];

  const itemNumber =
    possibleNumberOfItems[getRandomFrom1ToX(possibleNumberOfItems.length - 1)];
  for (let itemIndex = 0; itemIndex < itemNumber; itemIndex++) {
    prices.push(Math.max(getRandomFrom1ToX(100), 10));
    quantities.push(getRandomFrom1ToX(10));
  }

  return { prices, quantities };
};

const generateCountry = (possibleCountries: Country[]): Country => {
  return possibleCountries[getRandomFrom1ToX(possibleCountries.length) - 1];
};

const generateReduction = (possibleReductions: Reduction[]): Reduction => {
  return possibleReductions[getRandomFrom1ToX(possibleReductions.length) - 1];
};

// TODO unit test this ?
export const generateCart = (
  difficulty: number
): {
  cart: Cart;
  invoice: Invoice;
  price: number;
} => {
  const { possibleNumberOfItems, possibleCountries, possibleReductions } =
    getOptionsByDifficulty(difficulty);
  const cart: Cart = {
    ...getPricesAndQuantity(possibleNumberOfItems),
    country: generateCountry(possibleCountries),
    reduction: generateReduction(possibleReductions),
  };

  return { cart, ...getInvoice(cart) };
};

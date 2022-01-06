import { Country } from "../country/country.types";
import { Cart, Reduction } from "./cart.types";
import { getInvoice } from "../invoice/invoice";
import { Invoice } from "../invoice/invoice.types";

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

export const generateCart = (): {
  cart: Cart;
  invoice: Invoice;
  price: number;
} => {
  const cart: Cart = {
    ...getPricesAndQuantity([1, 2, 3]),
    country: generateCountry([Country.FR, Country.UK, Country.US]),
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

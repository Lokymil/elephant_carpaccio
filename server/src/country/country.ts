import { Country } from "./country.types";

export const countryMapping = {
  FR: { factor: 1, symbol: "€" },
  UK: { factor: 1.42, symbol: "£" },
  US: { factor: 1.314, symbol: "$" },
};

const roundForPrice = (price: number): number => {
  return Math.round(price * 100) / 100;
};

export const applyConversion = (price: number, country: Country): number => {
  const { factor } = countryMapping[country];
  return roundForPrice(price * factor);
};

export const getCountrySymbol = (country: Country): string =>
  countryMapping[country].symbol;

import { Country } from "../country/country.types";

export type Cart = {
  prices: number[];
  quantities: number[];
  country: Country;
  reduction: Reduction;
};

export type Reduction =
  | "STANDARD"
  | "-50%"
  | "-10%"
  | "-50% FIRST"
  | "-50% LAST"
  | "SPECIAL";

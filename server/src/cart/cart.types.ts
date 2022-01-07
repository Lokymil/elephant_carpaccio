import { Country } from "../country/country.types";

export type Cart = {
  prices: number[];
  quantities: number[];
  country: Country;
  reduction: Reduction;
};

export enum Reduction {
  STANDARD = "STANDARD",
  HALF = "HALF",
  TENTH = "TENTH",
  HALF_FIRST = "HALF_FIRST",
  HALF_LAST = "HALF_LAST",
  SPECIAL = "SPECIAL",
}

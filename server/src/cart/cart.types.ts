import { Country } from "../country/country.types";

export type Cart = {
  prices: number[];
  quantities: number[];
  country: Country;
  reduction: Reduction;
};

export enum Reduction {
  STANDARD = "STANDARD",
  HALF = "-50%",
  TENTH = "-10%",
  HALF_FIRST = "-50% FIRST",
  HALF_LAST = "-50% LAST",
  SPECIAL = "SPECIAL",
}

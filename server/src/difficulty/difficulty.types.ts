import { Reduction } from "../cart/cart.types";
import { Country } from "../country/country.types";

export type DifficultyStage = {
  possibleNumberOfItems: number[];
  maxQuantityPerItem: number;
  possibleCountries: Country[];
  possibleReductions: Reduction[];
};

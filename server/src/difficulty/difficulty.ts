import { Reduction } from "../cart/cart.types";
import { Country } from "../country/country.types";
import { DifficultyStage } from "./difficulty.types";

/**
 * Duplicated values are used to simulate pseudo random chance to get
 * value occuring more often
 */
const difficultyStages: DifficultyStage[] = [
  {
    possibleNumberOfItems: [1, 1, 1, 1, 1, 1, 1, 1, 2, 3],
    possibleCountries: [Country.FR],
    possibleReductions: [Reduction.STANDARD],
  },
  {
    possibleNumberOfItems: [1, 2, 3],
    possibleCountries: [Country.FR],
    possibleReductions: [
      Reduction.STANDARD,
      Reduction.STANDARD,
      Reduction.STANDARD,
      Reduction.HALF,
      Reduction.TENTH,
    ],
  },
  {
    possibleNumberOfItems: [1, 2, 3],
    possibleCountries: [Country.FR, Country.UK],
    possibleReductions: [Reduction.STANDARD, Reduction.HALF, Reduction.TENTH],
  },
  {
    possibleNumberOfItems: [1, 2, 3],
    possibleCountries: [Country.FR, Country.UK, Country.US],
    possibleReductions: [
      Reduction.STANDARD,
      Reduction.HALF,
      Reduction.TENTH,
      Reduction.HALF_FIRST,
      Reduction.HALF_LAST,
    ],
  },
  {
    possibleNumberOfItems: [3, 4, 5, 6],
    possibleCountries: [Country.FR, Country.UK, Country.US],
    possibleReductions: [
      Reduction.STANDARD,
      Reduction.HALF,
      Reduction.TENTH,
      Reduction.HALF_FIRST,
      Reduction.HALF_LAST,
      Reduction.SPECIAL,
    ],
  },
];

export const getOptionsByDifficulty = (difficulty: number): DifficultyStage => {
  return difficultyStages[Math.min(difficulty, 4)];
};

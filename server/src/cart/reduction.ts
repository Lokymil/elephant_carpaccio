import { Reduction } from "./cart.types";

export const reductionFactor = {
  [Reduction.STANDARD]: () => 1,
  [Reduction.HALF]: () => 0.5,
  [Reduction.TENTH]: () => 0.9,
  [Reduction.HALF_FIRST]: (index: number) => (index === 0 ? 0.5 : 1),
  [Reduction.HALF_LAST]: (index: number, length: number) =>
    index === length - 1 ? 0.5 : 1,
  [Reduction.SPECIAL]: (index: number) => 1 - Math.min(0.1 * (index + 1), 0.5),
};

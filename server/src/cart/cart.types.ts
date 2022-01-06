export type Cart = {
  prices: number[];
  quantities: number[];
  country: Country;
  reduction: Reduction;
};

export type Invoice = string;

export type Country = "FR" | "US" | "UK";

export type Reduction =
  | "STANDARD"
  | "-50%"
  | "-10%"
  | "-50% FIRST"
  | "-50% LAST"
  | "SPECIAL";

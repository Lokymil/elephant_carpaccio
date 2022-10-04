import { Cart, Reduction } from "../cart/cart.types";
import { applyConversion, getCountrySymbol } from "../country/country";
import { Country } from "../country/country.types";

const withDecimal = (price: number): string => price.toFixed(2);

const getFinalInvoiceFromReducedPriceAndCountry = (
  price: number,
  country: Country
) => {
  const finalPrice = applyConversion(price, country);
  const countrySymbol = getCountrySymbol(country);

  return {
    price: finalPrice,
    invoice: `${withDecimal(finalPrice)} ${countrySymbol}`,
  };
};

const getInvoiceGlobalReduction = (
  cart: Cart
): { price: number; invoice: string } => {
  const pricePriorReduction = cart.prices.reduce(
    (finalPrice, itemPrice, index) => {
      const currentPrice = itemPrice * cart.quantities[index];
      return finalPrice + currentPrice;
    },
    0
  );

  let pricePriorCountryConversion: number;
  switch (cart.reduction) {
    case Reduction.HALF:
      pricePriorCountryConversion = pricePriorReduction * 0.5;
      break;
    case Reduction.TENTH:
      pricePriorCountryConversion = pricePriorReduction * 0.9;
      break;
    default:
      pricePriorCountryConversion = pricePriorReduction;
  }

  return getFinalInvoiceFromReducedPriceAndCountry(
    pricePriorCountryConversion,
    cart.country
  );
};

const getInvoiceFirstReduction = (
  cart: Cart
): { price: number; invoice: string } => {
  const pricePriorCountryConversion = cart.prices.reduce(
    (finalPrice, itemPrice, index) => {
      const factor = index === 0 ? 0.5 : 1;
      const currentPrice = itemPrice * cart.quantities[index] * factor;
      return finalPrice + currentPrice;
    },
    0
  );

  return getFinalInvoiceFromReducedPriceAndCountry(
    pricePriorCountryConversion,
    cart.country
  );
};

const getInvoiceLastReduction = (
  cart: Cart
): { price: number; invoice: string } => {
  const pricePriorCountryConversion = cart.prices.reduce(
    (finalPrice, itemPrice, index, arr) => {
      const factor = index === arr.length - 1 ? 0.5 : 1;
      const currentPrice = itemPrice * cart.quantities[index] * factor;
      return finalPrice + currentPrice;
    },
    0
  );

  return getFinalInvoiceFromReducedPriceAndCountry(
    pricePriorCountryConversion,
    cart.country
  );
};

const getInvoiceSpecialReduction = (
  cart: Cart
): { price: number; invoice: string } => {
  const pricePriorCountryConversion = cart.prices.reduce(
    (finalPrice, itemPrice, index) => {
      const factor = Math.max(1 - (index + 1) / 10, 0.5);
      const currentPrice = itemPrice * cart.quantities[index] * factor;
      return finalPrice + currentPrice;
    },
    0
  );

  return getFinalInvoiceFromReducedPriceAndCountry(
    pricePriorCountryConversion,
    cart.country
  );
};

export const getInvoice = (cart: Cart): { price: number; invoice: string } => {
  switch (cart.reduction) {
    case Reduction.HALF_FIRST:
      return getInvoiceFirstReduction(cart);
    case Reduction.HALF_LAST:
      return getInvoiceLastReduction(cart);
    case Reduction.SPECIAL:
      return getInvoiceSpecialReduction(cart);
    case Reduction.STANDARD:
    case Reduction.TENTH:
    case Reduction.HALF:
    default:
      return getInvoiceGlobalReduction(cart);
  }
};

export const isInvoiceValid = (
  receivedInvoice: string,
  expectedInvoice: string
) => {
  if (!receivedInvoice.match(/^\d+(,|.)\d{2} (\$|£|€)$/i)) {
    return false;
  }

  const formattedInvoice = receivedInvoice.replace(",", ".");
  return formattedInvoice === expectedInvoice;
};

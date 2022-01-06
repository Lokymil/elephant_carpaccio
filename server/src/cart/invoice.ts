import { Cart, Country } from "./cart.types";
import { applyConversion, getCountrySymbol } from "../country";

const getFinalInvoiceFromReducedPriceAndCountry = (
  price: number,
  country: Country
) => {
  const finalPrice = applyConversion(price, country);
  const countrySymbol = getCountrySymbol(country);

  return { price: finalPrice, invoice: `${finalPrice} ${countrySymbol}` };
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
    case "-50%":
      pricePriorCountryConversion = pricePriorReduction * 0.5;
      break;
    case "-10%":
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

export const getInvoice = (cart: Cart): { price: number; invoice: string } => {
  switch (cart.reduction) {
    case "STANDARD":
    case "-10%":
    case "-50%":
    default:
      return getInvoiceGlobalReduction(cart);
  }
};

import { Cart, Reduction } from "../cart/cart.types";
import { reductionFactor } from "../cart/reduction";
import { countryMapping } from "../country/country";
import { Country } from "../country/country.types";

const formatInvoice = (price: number, country: Country): string => {
  return `${price.toFixed(2)} ${countryMapping[country].symbol}`;
};

export const getInvoice = ({
  prices,
  quantities,
  country,
  reduction,
}: Cart): { price: number; invoice: string } => {
  const price = prices.reduce((finalPrice, itemPrice, index) => {
    return (
      finalPrice +
      itemPrice *
        quantities[index] *
        reductionFactor[reduction](index, prices.length) *
        countryMapping[country].factor
    );
  }, 0);

  return { price, invoice: formatInvoice(price, country) };
};

export const isInvoiceValid = (
  receivedInvoice: string,
  expectedInvoice: string
) => {
  if (!/^\d+(,|.)\d{2} (\$|£|€)$/i.test(receivedInvoice)) {
    return false;
  }

  const formattedInvoice = receivedInvoice.replace(",", ".");
  return formattedInvoice === expectedInvoice;
};

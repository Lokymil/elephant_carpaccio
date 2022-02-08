import { Cart, Reduction } from "../cart/cart.types";
import { countryMapping } from "../country/country";
import { Country } from "../country/country.types";
import { getInvoice } from "./invoice";

const getCart = ({
  reduction = Reduction.STANDARD,
  country = Country.FR,
}: {
  reduction?: Reduction;
  country?: Country;
}): Cart => ({
  prices: [10, 50, 100],
  quantities: [2, 1, 5],
  reduction,
  country,
});

describe("general cases", () => {
  it(`should
        - sum multiplied price by corresponding quantities
        - apply no reduction
        - not convert currency
        - return computed price and invoice
      when
        - reduction is STANDARD
        - country is FR`, () => {
    const cart: Cart = getCart({});

    const { price, invoice } = getInvoice(cart);

    const expectedPrice = 20 + 50 + 500;
    expect(price).toBe(expectedPrice);
    expect(invoice).toBe(`${expectedPrice.toFixed(2)} €`);
  });

  it(`should
        - sum multiplied price by corresponding quantities
        - apply reduction
        - convert currency
        - return computed price and invoice
      when
        - reduction is other than STANDARD
        - country is other than FR`, () => {
    const cart: Cart = getCart({
      reduction: Reduction.SPECIAL,
      country: Country.UK,
    });

    const { price, invoice } = getInvoice(cart);

    const expectedPrice =
      (20 * 0.9 + 50 * 0.8 + 500 * 0.7) * countryMapping.UK.factor;
    expect(price).toBe(expectedPrice);
    expect(invoice).toBe(
      `${expectedPrice.toFixed(2)} ${countryMapping.UK.symbol}`
    );
  });
});

describe("with reduction", () => {
  it(`should divide by 2 result when reduction is HALF`, () => {
    const cart: Cart = getCart({ reduction: Reduction.HALF });

    const { price, invoice } = getInvoice(cart);

    const expectedPrice = (20 + 50 + 500) * 0.5;
    expect(price).toBe(expectedPrice);
    expect(invoice).toBe(`${expectedPrice.toFixed(2)} €`);
  });

  it(`should reduce by 10% when reduction is TENTH`, () => {
    const cart: Cart = getCart({ reduction: Reduction.TENTH });

    const { price, invoice } = getInvoice(cart);

    const expectedPrice = (20 + 50 + 500) * 0.9;
    expect(price).toBe(expectedPrice);
    expect(invoice).toBe(`${expectedPrice.toFixed(2)} €`);
  });

  it(`should reduce by 50% only the first item when reduction is HALF_FIRST`, () => {
    const cart: Cart = getCart({ reduction: Reduction.HALF_FIRST });

    const { price, invoice } = getInvoice(cart);

    const expectedPrice = 20 * 0.5 + 50 + 500;
    expect(price).toBe(expectedPrice);
    expect(invoice).toBe(`${expectedPrice.toFixed(2)} €`);
  });

  it(`should reduce by 50% only the first item when reduction is HALF_LAST`, () => {
    const cart: Cart = getCart({ reduction: Reduction.HALF_LAST });

    const { price, invoice } = getInvoice(cart);

    const expectedPrice = 20 + 50 + 500 * 0.5;
    expect(price).toBe(expectedPrice);
    expect(invoice).toBe(`${expectedPrice.toFixed(2)} €`);
  });

  it(`should reduce by 10% first item, 20% second item and so on to a max of 50% 
      when 
        - reduction is SPECIAL
        - less than 5 items`, () => {
    const cart: Cart = getCart({ reduction: Reduction.SPECIAL });

    const { price, invoice } = getInvoice(cart);

    const expectedPrice = 20 * 0.9 + 50 * 0.8 + 500 * 0.7;
    expect(price).toBe(expectedPrice);
    expect(invoice).toBe(`${expectedPrice.toFixed(2)} €`);
  });

  it(`should reduce by 10% first item, 20% second item and so on to a max of 50% 
      when 
        - reduction is SPECIAL 
        - more than 5 items`, () => {
    const cart: Cart = {
      prices: [10, 50, 100, 200, 300, 400],
      quantities: [2, 1, 5, 1, 1, 1],
      reduction: Reduction.SPECIAL,
      country: Country.FR,
    };

    const { price, invoice } = getInvoice(cart);

    const expectedPrice =
      20 * 0.9 + 50 * 0.8 + 500 * 0.7 + 200 * 0.6 + 300 * 0.5 + 400 * 0.5;
    expect(price).toBe(expectedPrice);
    expect(invoice).toBe(`${expectedPrice.toFixed(2)} €`);
  });
});

describe("with other countries", () => {
  it(`should convert to Pound and use Pound symbol when country is UK`, () => {
    const cart: Cart = getCart({ country: Country.UK });

    const { price, invoice } = getInvoice(cart);

    const expectedPrice = (20 + 50 + 500) * countryMapping.UK.factor;
    expect(price).toBe(expectedPrice);
    expect(invoice).toBe(
      `${expectedPrice.toFixed(2)} ${countryMapping.UK.symbol}`
    );
  });

  it(`should convert to Dollar and use Dollar symbol when country is US`, () => {
    const cart: Cart = getCart({ country: Country.US });

    const { price, invoice } = getInvoice(cart);

    const expectedPrice = (20 + 50 + 500) * countryMapping.US.factor;
    expect(price).toBe(expectedPrice);
    expect(invoice).toBe(
      `${expectedPrice.toFixed(2)} ${countryMapping.US.symbol}`
    );
  });
});

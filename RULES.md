# All the rules

---

## :warning: If you are an attendee, you have nothing to do here ! :warning:

### By reading this file as an attendee, you will make this workshop pointless.

### Be kind to your workshop leader and close this file without reading it.

---

## Table of content

- [Expected invoice](#expected-invoice)
- [Prices](#prices)
- [Quantities](#quantities)
- [Country](#country)
  - [UK](#uk)
  - [US](#us)
- [Reduction](#reduction)
  - [STANDARD](#standard)
  - [HALF](#half)
  - [TENTH](#tenth)
  - [HALF_FIRST](#half_first)
  - [HALF_LAST](#half_last)
  - [SPECIAL](#special)
- [Difficulty](#difficulty)
  - [Level 0](#level-0)
  - [Level 1](#level-1)
  - [Level 2](#level-2)
  - [Level 3](#level-3)
  - [Level 4](#level-4)

---

## Expected invoice

Any answered invoice must follow these rules:

- start with the price in digit with 2 decimals (even if it is an integer)
- end by currency symbol
- have a whitespace between price and currency symbol

Examples:

```js
"42.00 €";
"27.50 £";
"1256.50 $";
```

---

## Prices

Any price is between 10 and 100, included.

---

## Quantities

Any quantity is between 1 and 10, included.

---

## Country

### UK

Exchange rate is `1.42`. They must multiply the final price by this rate.

### US

Exchange rate is `1.314`. They must multiply the final price by this rate.

---

## Reduction

### `STANDARD`

There is no reduction

### `HALF`

Final price must be reduced by 50%.

```
finalPrice * 0.5
```

### `TENTH`

Final price must be reduced by 10%.

```
finalPrice * 0.9
```

### `HALF_FIRST`

Price of the first item must be reduced by 50%.

```
prices[0] * quantities[0] * 0.5
```

### `HALF_LAST`

Price of the last item must be reduced by 50%.

```
prices[X] * quantities[X] * 0.5
```

### `SPECIAL`

Price of the first item must be reduced by 10%.
Price of the second item must be reduced by 20%.
Price of the third item must be reduced by 30%.
Price of the forth item must be reduced by 40%.
Price of the fifth item must be reduced by 50%.
Price of the sixth item must be reduced by 50%.
Price of the seventh item must be reduced by 50%.
Price of the eighth item must be reduced by 50%.
Price of the nineth item must be reduced by 50%.
Price of the tenth item must be reduced by 50%.

```
prices[0] * quantities[0] * 0.1
prices[1] * quantities[1] * 0.2
prices[2] * quantities[2] * 0.3
prices[3] * quantities[3] * 0.4
prices[4] * quantities[4] * 0.5
prices[5] * quantities[5] * 0.5
prices[6] * quantities[6] * 0.5
prices[7] * quantities[7] * 0.5
prices[8] * quantities[8] * 0.5
prices[9] * quantities[9] * 0.5
```

---

## Difficulty

### Level 0

Number of different item:

- 70% chance of 1 item
- 20% chance of 2 items
- 10% chance of 3 items

Max quantity per item:

- `1`

Possible country:

- `FR`

Possible reduction:

- `STANDARD`

### Level 1

Number of different item:

- 1 to 3

Max quantity per item:

- `5`

Possible country:

- `FR`

Possible reduction:

- `STANDARD` at 60%
- `HALF` at 20%
- `TENTH` at 20%

### Level 2

Number of different item:

- 1 to 3

Max quantity per item:

- `10`

Possible country:

- `FR`
- `UK`

Possible reduction:

- `STANDARD` at 33.3%
- `HALF` at 33.3%
- `TENTH` at 33.3%

### Level 3

Number of different item:

- 1 to 3

Max quantity per item:

- `10`

Possible country:

- `FR`
- `UK`
- `US`

Possible reduction:

- `STANDARD` at 20%
- `HALF` at 20%
- `TENTH` at 20%
- `HALF_FIRST` at 20%
- `HALF_LAST` at 20%

### Level 4

Number of different item:

- 3 to 6

Max quantity per item:

- `10`

Possible country:

- `FR`
- `UK`
- `US`

Possible reduction:

- `STANDARD` at 12.5%
- `HALF` at 12.5%
- `TENTH` at 12.5%
- `HALF_FIRST` at 12.5%
- `HALF_LAST` at 12.5%
- `SPECIAL` at 37.5%

---

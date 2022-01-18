# JS

This program is a bootstrap you will have to hack to earn points !

## Install

You need to have installed:

- [Node 16](https://nodejs.org/en/download/)

## Setup

To make it work, you have to change properties in [`src/conf.js`](./src/conf.js) as:

- `host`: IP provided by your workshop leader
- `name`: your own name, team name or anything that can identify you. Be careful, if you have the same name as someone else in this workshop, your connection will be refused.

## How can I start the server ?

To make it run, use these commands :

#### With NPM

```sh
cd client-js
npm install
npm start
```

#### With Yarn

```sh
cd client-js
yarn
yarn start
```

:warning: If it works, stop here until your workshop leader presses the "start" button. When the timer has started, you can code.

## What should I do to earn points ?

To parse a cart properly, you have to change the `getInvoiceFromCart` function in [`src/invoice/invoice.js`](./src/invoice/invoice.js) and return the correct invoice value.

To know what rules you will have to create, ask your team leader.

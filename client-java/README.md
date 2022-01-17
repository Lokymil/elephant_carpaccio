# Java

This program is a bootstrap you will have to hack to earn points !

## Install

You need to have installed:

- [Java 11](https://adoptium.net/?variant=openjdk11)
- [IntelliJ](https://www.jetbrains.com/idea/download/) or [Eclipse](https://www.eclipse.org/downloads/)

## Setup

To make it work, you have to change properties in [`application.properties`](./src/main/resources/application.properties) as:

- `host`: IP provided by your workshop leader
- `name`: your own name, team name or anything that can identify you. Be carful, if you have the same name as someone else in this workshop, your connection will be refused.

## How can I start the server ?

Download Maven dependencies then you can use IntelliJ or Eclipse to start `main` method in [ElephantCarpaccioApplication.java](./src/main/java/fr/arrestier/elephantcarpaccio/ElephantCarpaccioApplication.java).

:warning: If it works, stop here until your workshop leader press the "start" button. When the timer has started, you can code.

## What should I do to earn points ?

To parse a cart properly, you have to change `getInvoiceFromCart` method in [`invoice/InvoiceGenerator.java`](./src/main/java/fr/arrestier/elephantcarpaccio/invoice/InvoiceGenerator.java) and return the correct invoice value.

To know what rules you will have to create, ask your team leader.

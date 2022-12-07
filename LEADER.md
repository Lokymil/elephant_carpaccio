# How to lead this workshop

To lead this workshop, you will have to make a server run on your computer.  
Once the server is set up and running, you will just have to lead the workshop without taking care of anything other than your attendees.

This server will send a shopping cart to your attendees, they will have to answer with a valid invoice.  
Every time a cart is sent your attendees will :

- win points if invoice is valid
- lose few points if invoice is wrong
- lose a lots of points they do not answer at all
  To monitor these points, you will have to start a web interface displaying all necessary information for you and your attendees.

## Table of Content

- [Setup](#setup)
  - [Install](#install)
  - [Start server](#start-server)
  - [Start scoring interface](#start-scoring-interface)
- [Begin your workshop](#begin-your-workshop)
  - [Your introduction speech](#your-introduction-speech)
  - [Explain starting rules](#explain-starting-rules)
  - [Questions](#questions)
  - [Start](#start)
- [Lead your workshop](#lead-your-workshop)
  - [Answering questions](#answering-questions)
  - [Monitoring](#monitoring)
- [End your workshop](#end-your-workshop)
- [All the rules](#all-the-rules)
- [Customization](#customization)
  - [Basic](#basic)
  - [Advanced](#advanced)
- [Troubleshoot](#troubleshoot)
  - [Attendee cannot connect](#attendee-cannot-connect)
  - [Attendee are disconnect right away](#attendee-are-disconnect-right-away)
  - [Attendee program crashes](#attendee-program-crashes)

---

## Setup

### Install

First of all, you have to install necessary tools to make the server run.  
Server and scoring interface are both developed with NodeJS 16.  
To install NodeJS, you have to go [here](https://nodejs.org/en/).

### Start server

Then you will have to start the cart server. To do so, open a new terminal in this folder and run these commands :

#### With NPM

```sh
cd server
npm install
npm start
```

#### With yarn

```sh
cd server
yarn
yarn start
```

Once you see `Server is started on ?.?.?.?`, your server is running !

#### Allow you attendees to connect

Take note of displayed IP (`?.?.?.?`) and give this address to your attendees. They will update the target host of their own project to receive carts.

:warning: This address may change every time you change the network. Be sure to give your attendees the latest

### Start scoring interface

To start sending a shopping cart to your attendees and monitor scores and remaining time, you will have to start this interface.  
To do so, open a new terminal in this folder and run these commands :

#### With NPM

```sh
cd scoring
npm install
npm start
```

#### With yarn

```sh
cd scoring
yarn
yarn start
```

When the score interface is ready, a new tab on your default browser will open on [http://localhost:3001/](http://localhost:3001/).

#### Check your attendees connection

Wait for every team or attendees to be displayed on this interface before starting this workshop.

:warning: Even if everyone's name is displayed, do not click `Start` yet !

---

## Begin your workshop

At this point all your attendees must be connected and from now on you will role play a Product Owner or a CEO talking to the dev team.
:warning: From now until you press `Start` (see below), your attendees must not write any code.

### Your introduction speech

You are a small e-shopping company. The team in charge of developing shopping cart just deliver their first version. Your team (your attendees) must develop the invoice module that will receive a cart and must return the corresponding invoice (i.e.: `354.00 €` decimals must be present).  
Be careful, your clients are extremely picky and will refuse any invoice that is not exactly what they expected. Even a trailing white space will make an invoice invalid.

The expected invoice must match following rules:

- Start with price
  - Have an integer part matching final price
  - Have a decimal part matching final price
  - Decimal part must always have 2 digits
  - Decimal separator must be either '.' or ','
- End by currency symbol
- Have a white space between price and currency

### Explain starting rules

#### Provided cart

A cart will be emitted every **10 seconds**. The will have the following format :

- `prices` : list of integers representing the price of each unique item selected by the client (index matches with `quantities`)
- `quantities` : list of integers representing quantity each item selected by the client (index matches with `prices`)
- `country` : string representing the country of the buyer
- `reduction` : string representing the type of reduction to be applied

#### Difficulty

Your company is still small and you have but few clients. At the beginning, the shopping cart will be small and not very challenging. As time pass and invoice reliability increases, clients will be more numerous and more confident. At the same time, cart dev team will add new features and your company might deploy in a new country. Then the shopping cart will be bigger and more complex.

This complexity is represented by a difficulty level from 0 (easiest) to 4 (hardest). Every X minutes in a given difficulty, the level increases (depending on workshop duration).  
It may increases earlier if enough attendees have enough valid answer in a row.

> _Notes:_  
> _The number of attendees to be in win streak and the win streak length before increasing difficulty can be weaked in `server/src/conf.ts` file:_
>
> - _`winStreakThreshold` for win streak length, default is 10_
> - _`countTeamWithHighStreakThreshold` for number of attendees to have long enough win streak, default is 1_
>
> _It is adviced to increase those values if_
>
> - _your attendees have huge gap between their experience level, increasing `winStreakThreshold` is adviced_
> - _you have more than 5~6 attendees, adding 1 to `countTeamWithHighStreakThreshold` every 5~6 attendees is adviced (i.e.: 12 attendees = `countTeamWithHighStreakThreshold` set to 3)_

#### What their module must do

1. calculate total price from `prices` and `quantities`
2. apply reduction
3. apply exchange rate, provided prices are in €
4. return invoice as `final price with 2 decimals + white space + currency symbol` (:warning: final price is not rounded, just truncated)

#### Possible reductions

- `STANDARD` : no reduction
- `HALF` : price is reduced by 50%
- `TENTH` : price is reduced by 10%

#### Possible country

- `FR` : currency is `€`
- `UK` : currency is `£`, mind the exchange rate !

> _Notes:_  
> _Oh silly you ! You forgot to tell them what the exchange rate was._  
> _This "on purpose" error will be a bit frustrating for your attendees, but the point is to make them rush into a coding a solution they think smart without questionning their own assumptions._
>
> _What we would have expect from them is to call you, their PO, to ask you what the exchange rate is before doing anything on this topic. But they will most likely try get it online and find out that it does not work, thinking it comes from their implementation._  
> _Then be careful not to let them try fixing something that is not broken for too long._

> _Notes:_  
> _Providing too much rules is at the beginning (country appears only at difficulty 2) is important to ensure some of your attendees will try to implements everything at once, instead of a "try and learn" approch._  
> _By doing so we increase the number of feedback we will have at the end to debrief with._

#### Scoring

- For every correct invoice, the client pays the price and you win as much money as the invoice's price (you win as many points).
- For every incorrect invoice, the client calls the client's service and asks for a refund of half the price. Then you lose as much money as half invoice's price (you lose as much points).
- For every shopping cart you do not generate an invoice for, the client does not have to pay, then you lose as much money as the invoice's price (you lose as many points).

In other word, a correct answer grant 100% points, an incorrect answer remove 50% points and no answer at all remove 100%.

> _Notes:_  
> _The point is to force every attendee to keep their program running. A partial service is still better than no service at all. It should help them understand that having quick feedback and trying to make a quick but partial solution is better than an exhaustive but slow solution._
>
> _You can customize these value by changing `wrongAnswerFactor` and `noAnswerFactor` in `server/src/conf.ts`._

### Avoid cheating

It is extremly important to ask you attendees not to look anywhere else than they are asked to. If they do otherwise, they might see what are the next rules to implement too early and it will make this workshop pointless.  
Be sure to kindly remind them not to do so for the sake of workshop's relevance.

### Questions

If they have questions, try to answer without giving too much. They must accept not knowing everything, as it is in real life when you design a new big feature.

You must not explain all the rules in the first place. Giving a few rules at the beginning is to tempt them to make an exhaustive solution. But new rules will appear and those who make small steps and adapt to changes will earn more points.

### Start

At this point, everyone must have a running invoice module connected to the server (and appears in the scoring interface) and every attendees must have understood the starting rules.  
When your attendees are ready, press `start` and allow them to code.  
**Remind them that they must restart their programme for every changes they want to apply.**

---

## Lead your workshop

From now on, all you have to do is monitor scores and difficulty level, and answer questions when new rules appear.

### Answering questions

Questions will generally appear at difficulty level 2. Answer only if a question is about something they have seen, never answer if an attendees tries to over-engineer or anticipate what is to come.

> _Notes:_  
> _They must name information they want to have an answer. It will force them to generate feedbacks from their code (i.e.: have some logs)_
>
> - _ANSWER : "What is reduction HALF_FIRST ?"_
> - _DO NOT ANSWER : "What are the new reductions ?"_

Try to answer what is strictly necessary and answer only to the one asking.

> _Notes:_  
> _To keep your answer secret you can write on a paper to be sure no one will overhear what you say._

The point is to force them to monitor the impact of each modification to ensure they are doing the right changes. And if not, they must ask their Product Owner, you.

If you want to make it harder, you can simulate a briefing for every difficulty increase. As a Product Owner, you are requested to a meeting to understand the new rules and achievement of your company. As a consequence, you may not answer any question for the first few minutes of a difficulty level.

### Monitoring

It is strongly advised to display scores to every attendees to add competition between them. Also it can help them know if they are taking the right decision and adjust if not.

In the score interface, you will have :

- attendees list with:
  - their score
  - their valid answer streak
  - their connection state (red = disconnected and not answering, green = connected and answering)
- time remaining for the end of development time
- current difficulty
- time remaining before difficulty auto-increase

To motivate your attendees, you can:

- frequently announce current scores as if it was a sports championship
- make small role played announcement on difficulty increase (i.e.: "we open a shop in a new country", "sell service added a brand new reduction")
- help attendees with lowest score for them not to be too frustrated

---

## End your workshop

Once you reach the end of the timer, the server will stop sending shopping cart to your attendees. Display scores and declare who won.

At this point, your main tool will be scores. Write them on a white board and ask each attendees what decision they made (i.e.: "stop answering every time there was an incorrect invoice"). Write those down and, by associating it with their score, try to decide with everyone why it is a good or bad decision.

If all your attendees have fairly the same development level, those who made small changes and kept answering even if it was not perfect will have the best scores. Try to make them find that small changes and frequent feedback is better than huge changes to be exhaustive straight away even if it takes time.

---

## All the rules

You can check all the rules in this file [./RULES.md](./RULES.md)

---

## Customization

### Basic

You can adjust a few parameters to match your need or attendees' experience by changing variables in `server/src/conf.ts`.

- `cartRate`: delay between two carts in milliseconds
- `totalDuration`: total time for your attendees to develop their module. Difficulty auto update delay will be 1/4 of this duration. In other words, if your attendees do not manage to have 10 valid answers in a row in any difficulty level, they will never see the last difficulty.
- `startDifficulty`: difficulty level to start with between 0 (easiest) to 4 (hardest). It is advised to start at 0 or 1.
- `wrongAnswerFactor`: factor used to calculate how many points to lose if invoice is wrong
- `noAnswerFactor`: factor used to calculate how many points to lose if no invoice is provided for a given cart
- `winStreakThreshold`: number of valid answer in a row required to increase difficulty earlier than auto increase
- `countTeamWithHighStreakThreshold`: number of attendees to have enough valid answer in a row to increase difficulty ealier than auto increase

### Advanced

You can change any files in `server/src` to create your own rules.  
You might want to begin with `server/src/difficulty/difficulty.ts` where all difficulty rules are defined. There you can adjust any difficulty level, remove or add a level as long as new rules are implemented.

---

## Troubleshoot

### Attendee cannot connect

You can see this by having one or multiple attendees missing in the team list on the score interface.

1. Be sure they change the `host` configuration value to your IP.
2. Be sure you are both on the same sub-network (same wifi, same ethernet connection)
3. Be sure your network does not block local communication

If none of this works, try this on another network and restart your server to have your new IP.

If it still does not work, you can open a new terminal and use this command to try and find another IP :

```sh
ifconfig
```

Finally, if nothing works, try to use your mobile on Hotspot. You and your attendees must be connected to the hotspot network.  
There is usually no restriction on those network then it should work.

### Attendee are disconnect right away

They have in their output a disconnection message right after they connect.

The system does not allow multiple connect for a given attendee / team name.

1. Be sure they have a uniq name in their configuration value
2. Be sure they do not have multiple program instance running, only one must run

### Attendee program crashes

1. Be sure it is not due to their code
2. Be sure they did not changes any other code that the specified one

If none of this works, make them restore the code to repository state.

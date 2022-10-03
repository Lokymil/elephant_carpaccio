import { noAnswerFactor, wrongAnswerFactor } from "../conf";
import gameEvents from "../events/gameEvents";
import { Invoice } from "../invoice/invoice.types";

export class Team {
  hasAnswerLast = false;
  points = 0;
  name: string;
  validAnswerInARow = 0;
  connected = false;

  constructor(name: string) {
    this.name = name;

    gameEvents.on("newCart", (_, price) => {
      if (!this.hasAnswerLast) {
        this.points -= Math.round(price * noAnswerFactor);
      }
      this.hasAnswerLast = false;
    });

    gameEvents.on("difficultyUpgrade", () => this.resetWinStreak());
  }

  resetWinStreak = (): void => {
    this.validAnswerInARow = 0;
  };

  increaseWinStreak = (): void => {
    this.validAnswerInARow += 1;
  };

  connect = (): void => {
    this.connected = true;
  };

  disconnect = (): void => {
    this.connected = false;
    this.validAnswerInARow = 0;
  };

  validateInvoice = (
    invoice: Invoice,
    expectedInvoice: Invoice,
    currentPrice: number
  ): string => {
    this.hasAnswerLast = true;

    if (invoice === expectedInvoice) {
      this.points += Math.round(currentPrice);
      this.increaseWinStreak();
      return `OK | your points: ${this.points}`;
    } else {
      this.points -= Math.round(currentPrice * wrongAnswerFactor);
      this.resetWinStreak();
      return `KO ${expectedInvoice} | your points: ${this.points}`;
    }
  };
}

export const Teams: Team[] = [];

export const addTeam = (teamName: string): Team => {
  const newTeam = new Team(teamName);
  Teams.push(newTeam);
  return newTeam;
};

export const getTeam = (teamName: string): Team => {
  return Teams.find((team) => team.name === teamName) || addTeam(teamName);
};

export const resetValidAnswerStreak = (): void => {
  Teams.forEach((team) => {
    team.resetWinStreak();
  });
};

import { Invoice } from "../invoice/invoice.types";

export class Team {
  hasAnswerLast = false;
  points = 0;
  name: string;
  validAnswerInARow = 0;
  connected = false;

  constructor(name: string) {
    this.name = name;
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
  };

  updateTeamFromInvoice = (
    invoice: Invoice,
    expectedInvoice: Invoice,
    currentPrice: number,
    wrongAnswerFactor: number
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

import { noAnswerFactor, wrongAnswerFactor } from '../conf';
import gameEvents from '../events/gameEvents';
import { isInvoiceValid } from '../invoice/invoice';
import { Invoice } from '../invoice/invoice.types';

export class Team {
  // Creating a team considering it has answer previous cart allow to avoid
  // removing points on first cart emitted or if someone connects afterwards
  hasAnswerLast = true;
  points = 0;
  name: string;
  totalWins = 0;
  winStreak = 0;
  connected = false;

  constructor(name: string) {
    this.name = name;

    gameEvents.on('newCart', (_, price) => {
      if (!this.hasAnswerLast) {
        this.points -= Math.round(price * noAnswerFactor);
        this.resetWinStreak();
      }
      this.hasAnswerLast = false;
    });

    gameEvents.on('difficultyUpgrade', () => this.resetWinStreak());
  }

  increaseTotalNbrOfWins = (): void => {
    this.totalWins += 1;
    this.increaseWinStreak();
  };

  resetWinStreak = (): void => {
    this.winStreak = 0;
  };

  increaseWinStreak = (): void => {
    this.winStreak += 1;
  };

  connect = (): void => {
    this.connected = true;
  };

  disconnect = (): void => {
    this.connected = false;
    this.winStreak = 0;
  };

  validateInvoice = (
    invoice: Invoice,
    expectedInvoice: Invoice,
    expectedPrice: number
  ): string => {
    this.hasAnswerLast = true;

    if (isInvoiceValid(invoice, expectedInvoice)) {
      this.points += Math.round(expectedPrice);
      this.increaseTotalNbrOfWins();
      return `OK | your points: ${this.points}`;
    } else {
      this.points -= Math.round(expectedPrice * wrongAnswerFactor);
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

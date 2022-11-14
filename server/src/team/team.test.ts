import { noAnswerFactor, wrongAnswerFactor } from '../conf';
import gameEvents from '../events/gameEvents';
import { Invoice } from '../invoice/invoice.types';
import { Team } from './team';

const expectedInvoice: Invoice = '42.00 €';
const expectedPrice = 42;

describe('Team class', () => {
  it('should add points and increase win streak on valid invoice', () => {
    const team = new Team('My awesome team');

    expect(team.points).toBe(0);
    expect(team.winStreak).toBe(0);

    team.validateInvoice(expectedInvoice, expectedInvoice, expectedPrice);

    expect(team.points).toBe(expectedPrice);
    expect(team.winStreak).toBe(1);
  });

  it('should remove points with "wrongAnswerFactor" and reset win streak on wrong invoice', () => {
    const team = new Team('My awesome team');
    team.points = 100;
    team.winStreak = 5;

    expect(team.points).toBe(100);
    expect(team.winStreak).toBe(5);

    team.validateInvoice('WRONG ANSWER', expectedInvoice, expectedPrice);

    expect(team.points).toBe(100 - expectedPrice * wrongAnswerFactor);
    expect(team.winStreak).toBe(0);
  });

  it('should reset has answer flag when a new cart is emitted', () => {
    const team = new Team('My awesome team');
    team.hasAnswerLast = true;

    gameEvents.emit('newCart', {}, expectedPrice, expectedInvoice);

    expect(team.hasAnswerLast).toBe(false);
  });

  it('should not remove points nor reset winstreak on new cart if team has answered previous invoice with valid answer', () => {
    const team = new Team('My awesome team');

    team.validateInvoice(expectedInvoice, expectedInvoice, expectedPrice);
    expect(team.points).toBe(expectedPrice);
    expect(team.winStreak).toBe(1);

    gameEvents.emit('newCart', {}, expectedPrice, expectedInvoice);
    expect(team.points).toBe(expectedPrice);
    expect(team.winStreak).toBe(1);
  });

  it('should not remove points on new cart if team has answered previous invoice with wrong answer', () => {
    const team = new Team('My awesome team');

    team.validateInvoice('WRONG ANSWER', expectedInvoice, expectedPrice);
    expect(team.points).toBe(-expectedPrice * wrongAnswerFactor);

    gameEvents.emit('newCart', {}, expectedPrice, expectedInvoice);
    expect(team.points).toBe(-expectedPrice * wrongAnswerFactor);
  });

  it('should remove points with "noAnswerFactor" and reset winstreak on new cart if team has not answered previous invoice at all', () => {
    const team = new Team('My awesome team');
    team.points = 100;
    team.winStreak = 5;

    gameEvents.emit('newCart', {}, expectedPrice, expectedInvoice);
    expect(team.points).toBe(100 - expectedPrice * noAnswerFactor);
    expect(team.winStreak).toBe(0);
  });

  it('should reset winstreak without changing points on difficulty increase', () => {
    const team = new Team('My awesome team');
    team.points = 100;
    team.winStreak = 5;

    gameEvents.emit('difficultyUpgrade');
    expect(team.points).toBe(100);
    expect(team.winStreak).toBe(0);
  });
});

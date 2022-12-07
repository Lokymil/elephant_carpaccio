import {
  countTeamWithHighStreakThreshold,
  startDifficulty,
  winStreakThreshold,
} from '../conf';
import gameEvents from '../events/gameEvents';
import { Teams } from '../team/team';
import TimeHandler from '../time/TimeHandler';
import { numberOfDifficultyLevel } from './difficulty';

export default class DifficultyHandler extends TimeHandler {
  currentDifficulty: number;
  #maxDifficulty: number;
  #autoUpgrade?: NodeJS.Timeout;

  constructor(totalGameDuration: number) {
    super(totalGameDuration / (numberOfDifficultyLevel - 1));
    this.#maxDifficulty = numberOfDifficultyLevel - 1;
    this.currentDifficulty = startDifficulty;

    gameEvents.on('start', () => this.start());
    gameEvents.on('end', () => this.end());

    gameEvents.on('newCart', () => {
      if (
        Teams.filter((team) => team.winStreak >= winStreakThreshold).length >=
        countTeamWithHighStreakThreshold
      ) {
        this.#forceUpgrade();
      }
    });
  }

  start(): void {
    super.start();
    this.#autoUpgrade = setTimeout(() => {
      this.#upgrade();
      this.start();
    }, this.totalDuration);
  }

  end(): void {
    super.end();
    if (this.#autoUpgrade) {
      clearTimeout(this.#autoUpgrade);
    }
    this.currentDifficulty = 0;
  }

  #upgrade(): void {
    this.currentDifficulty = Math.min(
      this.currentDifficulty + 1,
      this.#maxDifficulty
    );

    gameEvents.emit('difficultyUpgrade', this.currentDifficulty);
    console.log(`--------> Difficulty updated to ${this.currentDifficulty}`);
  }

  #forceUpgrade(): void {
    this.#upgrade();
    if (this.#autoUpgrade) {
      clearTimeout(this.#autoUpgrade);
    }
    this.start();
  }
}

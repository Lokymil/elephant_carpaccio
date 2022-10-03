import { startDifficulty, totalDuration } from "../conf";
import TimeHandler from "../time/TimeHandler";
import { numberOfDifficultyLevel } from "./difficulty";

class DifficultyHandler extends TimeHandler {
  currentDifficulty: number;
  maxDifficulty: number;
  autoUpgrade?: NodeJS.Timeout;

  constructor(totalGameDuration: number) {
    super(totalGameDuration / (numberOfDifficultyLevel - 1));
    this.maxDifficulty = numberOfDifficultyLevel - 1;
    this.currentDifficulty = startDifficulty;
  }

  start(): void {
    super.start();
    this.autoUpgrade = setTimeout(() => {
      this.#upgrade();
      this.start();
    }, this.totalDuration);
  }

  end(): void {
    super.end();
    if (this.autoUpgrade) {
      clearTimeout(this.autoUpgrade);
    }
    this.currentDifficulty = 0;
  }

  #upgrade(): void {
    this.currentDifficulty = Math.min(
      this.currentDifficulty + 1,
      this.maxDifficulty
    );
    console.log(`--------> Difficulty updated to ${this.currentDifficulty}`);
  }

  forceUpgrade(): void {
    this.#upgrade();
    if (this.autoUpgrade) {
      clearTimeout(this.autoUpgrade);
    }
    this.start();
  }
}

export default new DifficultyHandler(totalDuration);

import events from "events";
import { startDifficulty } from "../conf";
import TimeHandler from "../time/TimeHandler";
import { numberOfDifficultyLevel } from "./difficulty";

export default class DifficultyHandler extends TimeHandler {
  gameEvents: events;
  currentDifficulty: number;
  maxDifficulty: number;
  autoUpgrade?: NodeJS.Timeout;

  constructor(totalGameDuration: number, gameEvents: events) {
    super(totalGameDuration / (numberOfDifficultyLevel - 1));
    this.maxDifficulty = numberOfDifficultyLevel - 1;
    this.currentDifficulty = startDifficulty;
    this.gameEvents = gameEvents;

    gameEvents.on("start", () => this.start());
    gameEvents.on("end", () => this.end());
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

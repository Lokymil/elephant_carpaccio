export default class TimeHandler {
  totalDuration: number;
  isStarted = false;
  startingTimestamp?: number;

  constructor(totalDuration: number) {
    this.totalDuration = totalDuration;
  }

  start(): void {
    this.isStarted = true;
    this.startingTimestamp = new Date().getTime();
  }

  getElapsedTime(): number {
    const now = new Date().getTime();
    return this.startingTimestamp ? now - this.startingTimestamp : 0;
  }

  getRemainingTime(): number {
    return this.totalDuration - this.getElapsedTime();
  }

  end(): void {
    this.isStarted = false;
    this.startingTimestamp = 0;
  }
}

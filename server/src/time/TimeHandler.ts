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

  getRemainingTime(): number {
    const now = new Date().getTime();
    const elapseTime = this.startingTimestamp
      ? now - this.startingTimestamp
      : 0;
    return this.totalDuration - elapseTime;
  }

  end(): void {
    this.isStarted = false;
    this.startingTimestamp = 0;
  }
}

import events from "events";
import { cartRate } from "../conf";
import DifficultyHandler from "../difficulty/DifficultyHandler";
import TimeHandler from "../time/TimeHandler";
import { generateCart } from "./cart";

export default class CartHandler extends TimeHandler {
  gameEvents: events;
  difficultyHandler: DifficultyHandler;
  cartSender?: NodeJS.Timer;
  gameOverTimeout?: NodeJS.Timeout;
  expectedPrice = 0;
  expectedInvoice = "0.00 €";

  constructor(
    totalDuration: number,
    difficultyHandler: DifficultyHandler,
    gameEvents: events
  ) {
    super(totalDuration);
    this.difficultyHandler = difficultyHandler;
    this.gameEvents = gameEvents;
    gameEvents.on("start", () => this.start());
  }

  start(): void {
    super.start();
    this.#emitCart();
    this.gameOverTimeout = setTimeout(() => {
      this.end();
    }, this.totalDuration);
  }

  #emitCart(): void {
    this.cartSender = setInterval(() => {
      const { cart, price, invoice } = generateCart(
        this.difficultyHandler.currentDifficulty
      );
      this.expectedPrice = price;
      this.expectedInvoice = invoice;
      this.gameEvents.emit("newCart", cart);
      console.log("Emitted cart: " + JSON.stringify(cart));
    }, cartRate);
  }

  #stopSendCart(): void {
    if (this.cartSender) {
      clearInterval(this.cartSender);
    }
  }

  end(): void {
    super.end();
    this.#stopSendCart();
    if (this.gameOverTimeout) {
      clearTimeout(this.gameOverTimeout);
    }

    this.gameEvents.emit("end");
  }
}

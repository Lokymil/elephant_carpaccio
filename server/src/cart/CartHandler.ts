import { cartRate } from "../conf";
import DifficultyHandler from "../difficulty/DifficultyHandler";
import gameEvents from "../events/gameEvents";
import TimeHandler from "../time/TimeHandler";
import { generateCart } from "./cart";

export default class CartHandler extends TimeHandler {
  difficultyHandler: DifficultyHandler;
  cartSender?: NodeJS.Timer;
  gameOverTimeout?: NodeJS.Timeout;
  expectedPrice = 0;
  expectedInvoice = "0.00 €";

  constructor(totalDuration: number, difficultyHandler: DifficultyHandler) {
    super(totalDuration);
    this.difficultyHandler = difficultyHandler;

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
      gameEvents.emit("newCart", cart, price, invoice);
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

    gameEvents.emit("end");
  }
}

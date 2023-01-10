/*
## Description:
- Avoids coupling between who needs a specific action and the executor of its action.
- Chaining the receiver objects of this action until an object handle the action.
- Each handler decides either to process the request OR to pass it to the next handler in the chain.
- A handler can decide not to pass the request further down the chain and effectively stop.

## Problem
- We have one treatment for each different received param and we've implemented a specific class for each one.
- Now we need to pass a lot of classes for our client class constructor.

## Solution
- Chain of Responsibility: We can chain all this classes "in only one handler" and then pass this one to the client.
Making our coude reusable.
*/

// -----> WRONG: Passing all handlers and creating if clauses to verify the right one
interface WrongCalculatorHandler {
  calculatePrice(productQuantity: number): number;
}

class WrongNormalPriceHandler implements WrongCalculatorHandler {
  calculatePrice(productQuantity: number): number {
    return productQuantity * 1
  }
}

class WrongDiscountPriceHandler implements WrongCalculatorHandler {
  calculatePrice(productQuantity: number): number {
    return productQuantity * .5
  }
}

class WrongTwicePriceHandler implements WrongCalculatorHandler {
  calculatePrice(productQuantity: number): number {
    return productQuantity * 2
  }
}

class WrongClient {
  constructor(
    private readonly normalPriceHandler: WrongCalculatorHandler,
    private readonly discountPriceHandler: WrongCalculatorHandler,
    private readonly twicePriceHandler: WrongCalculatorHandler
  ) { }

  payProducts(productQuantity: number, isTwice: boolean, hasDiscount: boolean) {
    let value = 0;

    if (!isTwice && !hasDiscount) {
      value = this.normalPriceHandler.calculatePrice(productQuantity)
    }

    if (hasDiscount) {
      value = this.discountPriceHandler.calculatePrice(productQuantity)
    }

    if (isTwice) {
      value = this.twicePriceHandler.calculatePrice(productQuantity)
    }

    return `Products quantity: 2, payed value: $${value}`
  }
}

const wrongNormalPriceHandler = new WrongNormalPriceHandler()
const wrongDiscountPriceHandler = new WrongDiscountPriceHandler()
const wrongTwicePriceHandler = new WrongTwicePriceHandler()
const wrongClient = new WrongClient(wrongNormalPriceHandler, wrongDiscountPriceHandler, wrongTwicePriceHandler)

console.log(wrongClient.payProducts(2, true, false)) // Products quantity: 2, payed value: $4

// -----> CORRECT: We follow the OCP principle.
interface PriceCalculatorHandler {
  next?: PriceCalculatorHandler;
  calculatePrice(productQuantity: number, isTwice: boolean, hasDiscount: boolean): number;
}

class NormalPriceCalculatorHandler implements PriceCalculatorHandler {
  constructor(public next?: PriceCalculatorHandler) { }

  calculatePrice(productQuantity: number, isTwice: boolean, hasDiscount: boolean): number {
    if (!isTwice && !hasDiscount) {
      return productQuantity * 1
    }
    if (!this.next) throw new Error('Invalid handler')
    return this.next.calculatePrice(productQuantity, isTwice, hasDiscount)
  }
}

class DiscountPriceCalculatorHandler implements PriceCalculatorHandler {
  constructor(public next?: PriceCalculatorHandler) { }

  calculatePrice(productQuantity: number, isTwice: boolean, hasDiscount: boolean): number {
    if (hasDiscount) {
      return productQuantity * .5
    }
    if (!this.next) throw new Error('Invalid handler')
    return this.next.calculatePrice(productQuantity, isTwice, hasDiscount)
  }
}

class TwicePriceCalculatorHandler implements PriceCalculatorHandler {
  constructor(public next?: PriceCalculatorHandler) { }

  calculatePrice(productQuantity: number, isTwice: boolean, hasDiscount: boolean): number {
    if (isTwice) {
      return productQuantity * 2
    }
    if (!this.next) throw new Error('Invalid handler')
    return this.next.calculatePrice(productQuantity, isTwice, hasDiscount)
  }
}

class Client {
  constructor(
    private readonly handler: PriceCalculatorHandler,
    private readonly isTwice: boolean,
    private readonly hasDiscount: boolean
  ) { }

  payProducts() {
    const value = this.handler.calculatePrice(2, this.isTwice, this.hasDiscount)
    return `Products quantity: 2, payed value: $${value}`
  }
}

const twicePriceCalculatorHandler = new TwicePriceCalculatorHandler();
const discountPriceCalculatorHandler = new DiscountPriceCalculatorHandler(twicePriceCalculatorHandler);
const normalPriceCalculatorHandler = new NormalPriceCalculatorHandler(discountPriceCalculatorHandler);
const client = new Client(normalPriceCalculatorHandler, true, false) // "Improving strategy" and passing only one handler

console.log(client.payProducts()) // Products quantity: 2, payed value: $4

// In this way we have this chain:
// 1. normalPriceCalculatorHandler -> 2. discountPriceCalculatorHandler -> 3. twicePriceCalculatorHandler
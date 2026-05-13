"use strict";
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
Making our code reusable.
*/
Object.defineProperty(exports, "__esModule", { value: true });
class WrongNormalPriceHandler {
    calculatePrice(productQuantity) {
        return productQuantity * 1;
    }
}
class WrongDiscountPriceHandler {
    calculatePrice(productQuantity) {
        return productQuantity * .5;
    }
}
class WrongTwicePriceHandler {
    calculatePrice(productQuantity) {
        return productQuantity * 2;
    }
}
class WrongClient {
    normalPriceHandler;
    discountPriceHandler;
    twicePriceHandler;
    constructor(normalPriceHandler, discountPriceHandler, twicePriceHandler) {
        this.normalPriceHandler = normalPriceHandler;
        this.discountPriceHandler = discountPriceHandler;
        this.twicePriceHandler = twicePriceHandler;
    }
    payProducts(productQuantity, isTwice, hasDiscount) {
        let value = 0;
        if (!isTwice && !hasDiscount) {
            value = this.normalPriceHandler.calculatePrice(productQuantity);
        }
        if (hasDiscount) {
            value = this.discountPriceHandler.calculatePrice(productQuantity);
        }
        if (isTwice) {
            value = this.twicePriceHandler.calculatePrice(productQuantity);
        }
        return `Products quantity: 2, paid value: $${value}`;
    }
}
const wrongNormalPriceHandler = new WrongNormalPriceHandler();
const wrongDiscountPriceHandler = new WrongDiscountPriceHandler();
const wrongTwicePriceHandler = new WrongTwicePriceHandler();
const wrongClient = new WrongClient(wrongNormalPriceHandler, wrongDiscountPriceHandler, wrongTwicePriceHandler);
console.log(wrongClient.payProducts(2, true, false)); // Products quantity: 2, paid value: $4
class NormalPriceCalculatorHandler {
    next;
    constructor(next) {
        this.next = next;
    }
    calculatePrice(productQuantity, isTwice, hasDiscount) {
        if (!isTwice && !hasDiscount) {
            return productQuantity * 1;
        }
        if (!this.next)
            throw new Error('Invalid handler');
        return this.next.calculatePrice(productQuantity, isTwice, hasDiscount);
    }
}
class DiscountPriceCalculatorHandler {
    next;
    constructor(next) {
        this.next = next;
    }
    calculatePrice(productQuantity, isTwice, hasDiscount) {
        if (hasDiscount) {
            return productQuantity * .5;
        }
        if (!this.next)
            throw new Error('Invalid handler');
        return this.next.calculatePrice(productQuantity, isTwice, hasDiscount);
    }
}
class TwicePriceCalculatorHandler {
    next;
    constructor(next) {
        this.next = next;
    }
    calculatePrice(productQuantity, isTwice, hasDiscount) {
        if (isTwice) {
            return productQuantity * 2;
        }
        if (!this.next)
            throw new Error('Invalid handler');
        return this.next.calculatePrice(productQuantity, isTwice, hasDiscount);
    }
}
class Client {
    handler;
    isTwice;
    hasDiscount;
    constructor(handler, isTwice, hasDiscount) {
        this.handler = handler;
        this.isTwice = isTwice;
        this.hasDiscount = hasDiscount;
    }
    payProducts() {
        const value = this.handler.calculatePrice(2, this.isTwice, this.hasDiscount);
        return `Products quantity: 2, paid value: $${value}`;
    }
}
const twicePriceCalculatorHandler = new TwicePriceCalculatorHandler();
const discountPriceCalculatorHandler = new DiscountPriceCalculatorHandler(twicePriceCalculatorHandler);
const normalPriceCalculatorHandler = new NormalPriceCalculatorHandler(discountPriceCalculatorHandler);
const client = new Client(normalPriceCalculatorHandler, true, false); // "Improving strategy" and passing only one handler
console.log(client.payProducts()); // Products quantity: 2, paid value: $4
// In this way we have this chain:
// 1. normalPriceCalculatorHandler -> 2. discountPriceCalculatorHandler -> 3. twicePriceCalculatorHandler

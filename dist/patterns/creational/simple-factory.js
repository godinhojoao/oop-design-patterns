"use strict";
/*
## Problem
- We need to easily create objects without exposing the logic to do it.

## Solution
- create a simple factory class that based in the param will instantiate the required object.
*/
Object.defineProperty(exports, "__esModule", { value: true });
class Payment {
    createdAt;
    price;
    constructor(createdAt, price) {
        this.createdAt = createdAt;
        this.price = price;
    }
}
class DebitPayment extends Payment {
    getPrice() {
        const discount = 0.1; // 10%
        return this.price * (1 - discount);
    }
}
class CreditPayment extends Payment {
    getPrice() {
        return this.price; // no discount
    }
}
class PaymentFactory {
    static create(input) {
        switch (input.type) {
            case "debit":
                return new DebitPayment(input.createdAt, input.price);
            case "credit":
                return new CreditPayment(input.createdAt, input.price);
            default:
                throw new Error("invalid type");
        }
    }
}
const creditPayment = PaymentFactory.create({ createdAt: new Date(), type: "credit", price: 9.99 });
console.log('creditPayment', creditPayment.getPrice());
const debitPayment = PaymentFactory.create({ createdAt: new Date(), type: "debit", price: 9 });
console.log('debitPayment', debitPayment.getPrice());

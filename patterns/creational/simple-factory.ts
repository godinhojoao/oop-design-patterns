/*
Simple Factory = a function or class that centralizes object creation and returns different objects based on input type.

## Problem
- We need to create objects without exposing how they are built.

## Solution:
- Use a simple factory to centralize object creation.
- Implement it using a switch-case or a hashmap (registry) to map types to classes.
*/

interface PaymentInput {
  createdAt: Date;
  originalPrice: number;
}

abstract class Payment {
  constructor(
    protected createdAt: Date,
    protected originalPrice: number
  ) { }

  abstract getFinalPrice(): number;
}

class DebitPayment extends Payment {
  getFinalPrice() {
    const discount = 0.1; // 10%
    return this.originalPrice * (1 - discount);
  }
}

class CreditPayment extends Payment {
  getFinalPrice() {
    return this.originalPrice; // no discount
  }
}

class PaymentFactory {
  static create(input: PaymentInput, paymentType: "debit" | "credit"): Payment {
    switch (paymentType) {
      case "debit":
        // specific debit logic here, send mails, generate pdf, trigger events...
        return new DebitPayment(input.createdAt, input.originalPrice);
      case "credit":
        // specific credit logic here, trigger events...
        return new CreditPayment(input.createdAt, input.originalPrice);
      default:
        throw new Error("invalid type");
    }
  }
}

const creditPayment = PaymentFactory.create({ createdAt: new Date(), originalPrice: 9.99 }, "credit");
console.log('creditPayment', creditPayment.getFinalPrice());
const debitPayment = PaymentFactory.create({ createdAt: new Date(), originalPrice: 9.99 }, "debit");
console.log('debitPayment', debitPayment.getFinalPrice());
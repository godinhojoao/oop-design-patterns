/*
## Problem
- We need to easily create objects without exposing the logic to do it.

## Solution
- create a simple factory class that based in the param will instantiate the required object.
*/

interface PaymentInput {
  createdAt: Date;
  price: number;
}

abstract class Payment {
  constructor(
    protected createdAt: Date,
    protected price: number
  ) { }

  abstract getPrice(): number;
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
  static create(input: PaymentInput, paymentType: "debit" | "credit"): Payment {
    switch (paymentType) {
      case "debit":
        // specific debit logic here, send mails, generate pdf, trigger events...
        return new DebitPayment(input.createdAt, input.price);
      case "credit":
        // specific credit logic here, trigger events...
        return new CreditPayment(input.createdAt, input.price);
      default:
        throw new Error("invalid type");
    }
  }
}

const creditPayment = PaymentFactory.create({ createdAt: new Date(), price: 9.99 }, "credit");
console.log('creditPayment', creditPayment.getPrice());
const debitPayment = PaymentFactory.create({ createdAt: new Date(), price: 9.99 }, "debit");
console.log('debitPayment', debitPayment.getPrice());
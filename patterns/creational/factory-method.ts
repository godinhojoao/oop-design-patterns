/*
Factory Method = subclasses decide which object to create by overriding a creation method in a base class.

## Problem
- We want to create objects without exposing the creation logic.
- We also want to let subclasses decide which object to create.
- Avoid using switch-case in a factory that grows when new types are added.

## Solution
- Use a factory method pattern.
- Define an abstract class with a method for creating the object.
- Subclasses implement that method and decide which concrete object to create.
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

// This is our Factory Method (abstract class that delegates to subclasses to decide which object to create)
abstract class PaymentProcessor {
  abstract createPayment(paymentInput: PaymentInput): Payment;

  process(paymentInput: PaymentInput) {
    const currentPayment = this.createPayment(paymentInput);
    console.log('currentPayment', currentPayment)
    console.log(`removing value U$${currentPayment.getFinalPrice()} from account.`);
  }
}

class DebitPaymentProcessor extends PaymentProcessor {
  createPayment(paymentInput: PaymentInput): Payment {
    return new DebitPayment(paymentInput.createdAt, paymentInput.originalPrice);
  }
}

class CreditPaymentProcessor extends PaymentProcessor {
  createPayment(paymentInput: PaymentInput): Payment {
    return new CreditPayment(paymentInput.createdAt, paymentInput.originalPrice);
  }
}

new CreditPaymentProcessor().process({ createdAt: new Date(), originalPrice: 9.99 });
new DebitPaymentProcessor().process({ createdAt: new Date(), originalPrice: 9.99 });
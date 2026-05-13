/*
## Problem
- Beyond creating objects without exposing the logic, we also need to decouple creation from the class that uses it.
- We need the subclasses to decide what to create (delegate object creation to subclasses).
- Not a switch case, in this way we don't have to update switch cases if our code changes.

## Solution
- instead of a concrete class factory with a switch case (simple factory)
- An abstract superclass that delegates to subclasses the object creation.
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

// This is our Factory Method (abstract class that delegates to subclasses to decide which object to create)
abstract class PaymentProcessor {
  abstract createPayment(paymentInput: PaymentInput): Payment;

  process(paymentInput: PaymentInput) {
    const currentPayment = this.createPayment(paymentInput);
    console.log('currentPayment', currentPayment)
    console.log(`removing value U$${currentPayment.getPrice()} from account.`);
  }
}

class DebitPaymentProcessor extends PaymentProcessor {
  createPayment(paymentInput: PaymentInput): Payment {
    return new DebitPayment(paymentInput.createdAt, paymentInput.price);
  }
}

class CreditPaymentProcessor extends PaymentProcessor {
  createPayment(paymentInput: PaymentInput): Payment {
    return new CreditPayment(paymentInput.createdAt, paymentInput.price);
  }
}

new CreditPaymentProcessor().process({ createdAt: new Date(), price: 9.99 });
new DebitPaymentProcessor().process({ createdAt: new Date(), price: 9.99 });
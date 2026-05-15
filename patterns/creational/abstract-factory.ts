/*
Abstract Factory = an interface to create families of related objects without exposing concrete classes.

## Problem
- We have a family of related objects that must work together and be created together.
- We want to ensure consistency between these related objects (same family).
- We also want to avoid depending on concrete classes in the client code.

## Solution
- Define an abstract factory interface that declares creation methods for each product in the family.
- Create concrete factories for each family that implement this interface.
- The client uses only the abstract factory and product interfaces, without knowing concrete implementations.
*/

interface PaymentInput {
  createdAt: Date;
  originalPrice: number;
}

abstract class Payment {
  protected originalPrice: number;
  protected createdAt: Date;

  constructor({ createdAt, originalPrice }: PaymentInput) {
    this.createdAt = createdAt;
    this.originalPrice = originalPrice;
  }

  abstract getFinalPrice(): number;
}

class CreditPayment extends Payment {
  getFinalPrice() {
    return this.originalPrice;
  }
}

class DebitPayment extends Payment {
  getFinalPrice() {
    const discount = 0.1;
    return this.originalPrice * (1 - discount);
  }
}

interface Receipt {
  getInfo(): string;
}

class CreditReceipt implements Receipt {
  getInfo() {
    return "credit receipt";
  }
}

class DebitReceipt implements Receipt {
  getInfo() {
    return "debit receipt";
  }
}

// Abstract Factory that creates a family of related objects (Payment + Receipt)
interface BillingFactory {
  createPayment(input: PaymentInput): Payment;
  createReceipt(): Receipt;
}

// These are our "concrete factories", one for each specific billing type (Credit / Debit)
class CreditBillingFactory implements BillingFactory {
  createPayment(input: PaymentInput): Payment {
    return new CreditPayment(input);
  }

  createReceipt(): Receipt {
    return new CreditReceipt();
  }
}

class DebitBillingFactory implements BillingFactory {
  createPayment(input: PaymentInput): Payment {
    return new DebitPayment(input);
  }

  createReceipt(): Receipt {
    return new DebitReceipt();
  }
}

// now imagine that a checkout system will process a purchase
// it doesn't care which billing type it is handling,
// it only depends on the abstract factory and abstract products
class Checkout {
  private payment: Payment;
  private receipt: Receipt;

  constructor(factory: BillingFactory) {
    const input = { createdAt: new Date(), originalPrice: 100 }; // calulate based on checkout products

    this.payment = factory.createPayment(input);
    this.receipt = factory.createReceipt();

    console.log("payment price:", this.payment.getFinalPrice());
    console.log("receipt:", this.receipt.getInfo());
  }
}

const creditCheckout = new Checkout(new CreditBillingFactory());
const debitCheckout = new Checkout(new DebitBillingFactory());
/*
## Problem
- We have a family of related objects that must work together and be created together.
- We want to ensure these objects are consistent within the same family (e.g., Credit vs Debit).
- We also want to hide the creation logic so the client does not depend on concrete classes.

## Solution
- Create an interface that defines a factory for all related objects (Abstract Factory).
- For each family of objects, create a concrete factory that implements this interface.
- The client only depends on the abstract factory and abstract products, not concrete implementations.
*/

interface PaymentInput {
  createdAt: Date;
  price: number;
}

abstract class Payment {
  protected price: number;
  protected createdAt: Date;

  constructor({ createdAt, price }: PaymentInput) {
    this.createdAt = createdAt;
    this.price = price;
  }

  abstract getPrice(): number;
}

class CreditPayment extends Payment {
  getPrice() {
    return this.price;
  }
}

class DebitPayment extends Payment {
  getPrice() {
    const discount = 0.1;
    return this.price * (1 - discount);
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
    const input = { createdAt: new Date(), price: 100 }; // calulate based on checkout products

    this.payment = factory.createPayment(input);
    this.receipt = factory.createReceipt();

    console.log("payment price:", this.payment.getPrice());
    console.log("receipt:", this.receipt.getInfo());
  }
}

const creditCheckout = new Checkout(new CreditBillingFactory());
const debitCheckout = new Checkout(new DebitBillingFactory());
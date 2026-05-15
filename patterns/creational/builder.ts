/*
## Problem
- We have multiple types of the same object and we don't want to create a subclass for every possible different configuration.
- A house made of wood, a house made of stone, a house made of ... and each of those configurations requires a different build process.

## Solution
- Extract the object creation logic into multiple smaller objects called builders.
  - HouseBuilder() { buildWalls(); buildDoors(); ....}
  interface Builder {
    setA();
    setB();
    setC();
    ...
    reset(); // since builder is stateful, we have reset to build another object reusing the same builder
    build(); // finishes object creation returning the resulting product
  }

## Extra (optional):
- Optionally use a Director that will call the correct builder steps in a predefined order.
- Finally, the client can modify the construction or simply call builder.build() to finish the building process.
*/

interface PaymentInput {
  createdAt?: Date;
  originalPrice: number;
}

abstract class Payment {
  protected originalPrice: number;
  protected createdAt: Date;

  constructor({ createdAt, originalPrice }: PaymentInput) {
    this.createdAt = createdAt || new Date();
    this.originalPrice = originalPrice;
  }

  abstract getFinalPrice(): number;
}

class CreditPayment extends Payment {
  getFinalPrice() {
    return this.originalPrice;
  }

  onlyOnCredit() {
    console.log('method onlyOnCredit');
  }
}

class DebitPayment extends Payment {
  getFinalPrice() {
    const discount = 0.1;
    return this.originalPrice * (1 - discount);
  }

  onlyOnDebit() {
    console.log('method onlyOnDebit');
  }
}

interface Billing<P extends Payment> {
  payment: P;
  receipt: string;
}

interface BillingBuilder {
  setPayment(payment: Payment): this;
  setReceipt(receipt: string): this;
  reset(): void;
  build(): Billing<Payment>;
}

class BillingBuilderImpl implements BillingBuilder {
  #payment?: Payment;
  #receipt?: string;

  reset(): void {
    this.#payment = undefined;
    this.#receipt = undefined;
  }

  setPayment(payment: Payment) {
    this.#payment = payment;
    return this;
  }

  setReceipt(receipt: string) {
    this.#receipt = receipt;
    return this;
  }

  build() {
    if (!this.#payment) throw new Error("payment required");
    if (!this.#receipt) throw new Error("receipt required");

    const result = Object.freeze({
      payment: this.#payment,
      receipt: this.#receipt,
    });

    this.reset();

    return result;
  }
}

interface BillingDirector {
  makeCreditBilling(originalPrice: number, builder: BillingBuilder): void;
  makeDebitBilling(originalPrice: number, builder: BillingBuilder): void;
}

// The Director is optional, but it's good practice.
// The Director executes the builder steps in a predefined order.
// Since the builder is stateful, the client that calls the Director can modify something or simply call .build() to finish.
class BillingDirectorImpl implements BillingDirector {
  makeCreditBilling(originalPrice: number, builder: BillingBuilder): void {
    builder.reset();

    const payment = new CreditPayment({ originalPrice });

    builder.setPayment(payment);
    builder.setReceipt(`credit -> ${payment.getFinalPrice()}`);
  }

  makeDebitBilling(originalPrice: number, builder: BillingBuilder): void {
    builder.reset();

    const payment = new DebitPayment({ originalPrice });

    builder.setPayment(payment);
    builder.setReceipt(`debit -> ${payment.getFinalPrice()}`);
  }
}

const billingDirector = new BillingDirectorImpl();
const billingBuilder = new BillingBuilderImpl();

billingDirector.makeCreditBilling(100, billingBuilder);
const creditBilling = billingBuilder.build() as Billing<CreditPayment>;
console.log('creditBilling', creditBilling);
creditBilling.payment.onlyOnCredit();

console.log("---------------------------------------------")

billingDirector.makeDebitBilling(100, billingBuilder);
const debitBilling = billingBuilder.build() as Billing<DebitPayment>;
console.log('debitBilling', debitBilling);
debitBilling.payment.onlyOnDebit();
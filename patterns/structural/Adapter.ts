/*
Adapter = enables objects with incompatible interfaces to collaborate.

# Problem
- Our checkout works with dollars (e.g. 10.50) and our own Transaction type,
but the payment provider only accepts cents of dollar (1050) and returns its own format.

# Solution
- An adapter implementing our interface and translating the calls to the provider.

--> client = existing business logic of the program.
--> client interface = the protocol a class must follow to be able to collaborate with the client.
--> service = class that can't be used directly because it has an incompatible interface.
Usually third-party or legacy code we can't change.
--> adapter = implements the client interface and wraps the service, so it is able to work with both.
Receives client requests and translates them to the wrapped service object in a format it can understand,
then translates the response back to the client.
*/

// service third-party lib, works with cents and its own return
class GenericPaymentProcessor {
  pay(amountInCents: number): { transaction_id: number; ok: boolean } {
    console.log('charging cents:', amountInCents)
    return { transaction_id: 1, ok: amountInCents > 0 };
  }
}

type Transaction = { id: number; amountInDollars: number; status: "succeeded" | "failed"; };

// client interface our domain works with dollars
interface PaymentGateway {
  charge: (amountInDollars: number) => Transaction
}

// adapter
class GenericPaymentAdapter implements PaymentGateway {
  constructor(private readonly processor: GenericPaymentProcessor) { }

  charge(amountInDollars: number): Transaction {
    const amountInCents = amountInDollars * 100; // dollars -> cents
    const payment = this.processor.pay(amountInCents);
    return {
      id: payment.transaction_id,
      amountInDollars,
      status: payment.ok ? "succeeded" : "failed"
    };
  }
}

// client knows only PaymentGateway, always in dollars
class CheckoutService {
  constructor(private readonly gateway: PaymentGateway) { }

  buy(amountInDollars: number): void {
    const transaction = this.gateway.charge(amountInDollars);
    console.log(`order ${transaction.id}: $${transaction.amountInDollars} ${transaction.status}`);
  }
}

const checkout = new CheckoutService(new GenericPaymentAdapter(new GenericPaymentProcessor()));
checkout.buy(10.50) // succeeded
checkout.buy(0) // failed

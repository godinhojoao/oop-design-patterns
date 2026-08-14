/*
Mediator = Single object that restricts direct communication between objects.
And forces them communicate only via a mediator object.

# Problem
- Without a mediator the objects would need to place communication logic within themselves.
- For example, in a bank transfer the account sending money would have to store the other account
internally to be able to credit it.
- And it can be extended to a marketplace, where during a end of stock, the inventory service would need to call the
payment service to process a refund.
- The problem is this coupling between the objects.

# Solution
- Components = the classes which only notify the mediator, they never know each other.
  - the mediator can be in the constructor as composition (one shared mediator, the usual way)
  - or received per call like here (one mediator per transfer, so concurrent transfers don't share state)
- Mediator = declares notify(sender, event) and holds every rule between the components,
including the rollback. Components depend on the interface, never on the concrete mediator.
- The sender matters as much as the event: "credited" means done when it comes from the destination
and means rolled back when it comes from the source.
*/

interface Mediator<T, E> {
  notify: (sender: T, event: E) => void;
}

type TransferEvent = 'insufficient_funds' | 'credit_failed' | 'debited' | 'credited';

// one instance per transfer, so concurrent transfers never share state
class TransferMediator implements Mediator<Account, TransferEvent> {
  constructor(
    private readonly from: Account,
    private readonly to: Account,
    private readonly amount: number,
  ) { }

  transfer(): void {
    this.from.debit(this.amount, this) // rule -> debit occurs first
  }

  notify(sender: Account, event: TransferEvent): void {
    if (event === "insufficient_funds") return console.log(`rejected: ${sender.name} has no funds`);
    if (event === "credit_failed") {
      console.log(`credit failed, rolling back money from: ${sender.name} to ${this.from.name}`);
      return this.from.credit(this.amount, this)
    }

    if (event === "debited") return this.to.credit(this.amount, this)

    if (event === "credited" && sender === this.to) return console.log(`${this.amount} moved from ${this.from.name} to ${sender.name}`)
    if (event === "credited" && sender === this.from) return console.log(`rolled back to ${sender.name}`)
  }
}

// accounts live longer than a transfer, so they receive the mediator per call instead of holding it
class Account {
  constructor(
    public readonly name: string,
    private balance: number,
    private readonly frozen: boolean,
  ) { }

  debit(amount: number, mediator: Mediator<Account, TransferEvent>): void {
    if (amount > this.balance) return mediator.notify(this, "insufficient_funds");
    this.balance -= amount;
    mediator.notify(this, "debited");
  }

  credit(amount: number, mediator: Mediator<Account, TransferEvent>): void {
    if (this.frozen) return mediator.notify(this, "credit_failed");
    this.balance += amount;
    mediator.notify(this, "credited");
  }
}

const joao = new Account('joao', 100, false)
const bob = new Account('bob', 50, false)
const frozenBob = new Account('frozenBob', 0, true)

new TransferMediator(joao, bob, 30).transfer()
// 30 moved from joao to bob
console.log('----')

new TransferMediator(joao, bob, 500).transfer()
// rejected: joao has no funds (joao has 70)
console.log('----')

new TransferMediator(joao, frozenBob, 50).transfer()
// credit failed, rolling back money from: frozenBob to joao
// rolled back to joao
console.log('----')

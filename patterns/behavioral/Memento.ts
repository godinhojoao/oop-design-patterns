/*
Memento = Lets you save and restore the previous state of an object
without revealing the details of its implementation.

# Problem
- To undo something you need the object's state, but making all its fields public to copy them
breaks encapsulation.
- And if another class copies the fields itself, every change on the object breaks that copy code.

# Solution
- Originator = the object that owns the state, the only one that creates and reads a snapshot.
- Memento = the snapshot itself, immutable, it restores the originator by itself so nobody
needs to read its state. The caretaker can hold it but not open it.
- Caretaker = knows when to save and when to undo, it stores mementos without looking inside.
*/

// Memento -> the snapshots (history points). Immutable, nobody can read its state,
// it holds the originator and knows how to put the state back by itself.
class AccountSnapshot {
  constructor(
    private readonly account: Account,
    private readonly balance: number,
    private readonly version: number,
  ) { }

  restore(): void {
    this.account.setState(this.balance, this.version)
  }

  getVersion(): number { // metadata, the only thing the caretaker can read
    return this.version
  }
}

// Originator -> creates the snapshots
class Account {
  private balance = 0
  private version = 0

  apply(amount: number): void {
    this.balance += amount
    this.version += 1 // the version is the account's own bookkeeping, the caller doesn't set it
  }

  setState(balance: number, version: number): void {
    this.balance = balance
    this.version = version
  }

  createSnapshot(): AccountSnapshot {
    return new AccountSnapshot(this, this.balance, this.version)
  }

  get currentBalance(): number {
    return this.balance
  }
}

// Caretaker -> keeps and tracks history of an object's state. Never modifies the data they keep. (can only access metadata directly)
// --> Can be a Command (design pattern), it saves before executing and gives the snapshot back on undo.
class ApplyAmountCommand {
  private backup!: AccountSnapshot

  constructor(
    private readonly account: Account,
    private readonly amount: number,
  ) { }

  execute(): void {
    this.backup = this.account.createSnapshot()
    this.account.apply(this.amount)
  }

  undo(): void {
    console.log(`undo -> back to version ${this.backup.getVersion()}`) // metadata, never the state
    this.backup.restore() // the snapshot restores itself, the caretaker can't open it
  }
}

const account = new Account()

const deposit = new ApplyAmountCommand(account, 100)
deposit.execute()
console.log('balance', account.currentBalance) // 100

const withdraw = new ApplyAmountCommand(account, -30)
withdraw.execute()
console.log('balance', account.currentBalance) // 70

withdraw.undo() // undo -> back to version 1
console.log('balance', account.currentBalance) // 100

deposit.undo() // undo -> back to version 0
console.log('balance', account.currentBalance) // 0

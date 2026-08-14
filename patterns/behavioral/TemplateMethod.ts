/*
Template method pattern = defines the skeleton of an algorithm in a base class, letting subclasses replace specific steps without changing its structure.
--> the base class owns the order of the steps, subclasses only own the content of some of them.

# Problem
- When we have several classes with almost identical algorithm, differing only in some steps.
- We use lots of conditionals to pick behavior depending on class we are dealing with.

# Solution
- Template method = the method in the abstract base class with the algorithm skeleton, calling the steps in the right order.
- Steps = methods of the base class, they can be:
  - required = abstract method, must be implemented by every subclass.
  - optional = contains a default implementation and can be overriden.
  - hook = optional step with empty body, the algorithm works even if it isn't overriden.
- Subclasses = implement the required steps and override only what they need, never the template method.
*/

import { randomUUID } from "node:crypto";

type Item = { name: string; price: number; }
type Order = { id: string; items: Item[]; taxRate: number };

abstract class ReceiptExporter {
  export(order: Order): string { // template method = skeleton of the algorithm
    if (!order.items.length) throw new Error("empty order"); // invariant no subclass can skip
    let receiptResult = "";
    receiptResult += this.header(order);
    receiptResult += this.formatItems(order.items) + "\n";
    receiptResult += this.formatTotals(order) + "\n";
    receiptResult += this.footer(order);
    return receiptResult
  }

  protected abstract formatItems(items: Item[]): string; // abstract = required

  protected header(order: Order): string { return `RECEIPT #${order.id}\n`; } // optional

  protected footer(order: Order): string { return ""; } // hook - empty body

  // common code for everyone, private so no subclass can change how money is summed.
  private formatTotals(order: Order): string {
    const subtotal = order.items.reduce((sum, item) => sum + item.price, 0);
    const taxes = subtotal * order.taxRate;
    const total = subtotal + taxes;
    return `\nSubtotal: ${subtotal}\nTaxes: ${taxes}\nTotal: ${total}\n`;
  }
}

class PlainTextReceipt extends ReceiptExporter {
  protected formatItems(items: Item[]): string {
    return items.map(i => `name: ${i.name} | price: ${i.price}`).join("\n");
  }

  protected footer(order: Order) { // uses the hook
    return `Thank you for your purchase! (#${order.id})`;
  }
}
class TableReceipt extends ReceiptExporter {
  protected formatItems(items: Item[]): string {
    return items.map(i => `${i.name}, ${i.price}`).join("\n");
  }

  protected header() { // overrides the optional step, leaves the footer hook empty
    return `name, price\n`;
  }
}

const order: Order = {
  id: randomUUID(),
  taxRate: 0.1,
  items: [
    { name: "coffee", price: 8 },
    { name: "tea", price: 5 },
    { name: "cake", price: 12 },
  ],
};

const plainTextReceipt = new PlainTextReceipt();
const tableReceipt = new TableReceipt();
console.log('--- plainTextReceipt ---\n' + plainTextReceipt.export(order))
console.log('\n--- tableReceipt ---\n' + tableReceipt.export(order))

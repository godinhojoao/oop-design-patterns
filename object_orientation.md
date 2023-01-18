# Relationships and concepts in object orientation

## Association
- A class has a variable that references an instance of another class or interface.
- Occurs when they are completely independent of each other but are eventually related.
```ts
  // A contract uses a customer
  class Contract {
    customer: Customer;
  }
```

## Aggregation
- A one-to-many relationship.
- Where one object owns another, but there is no dependency. Both exist in isolation
```ts
  class Customer {
    notes: Note[];

    addNote (note: Note) {
      this.notes.push(note); // The Note always exists even if the Customer no longer exists
    }
  }
```

## Composition
- The composition is an aggregation that has dependency between the objects.
- `Death relation`: If the main object is destroyed, the objects that make it up can no longer exist.
```ts
  class Note {
    products: Product[];

    addProduct (productName: string) {
      this.notes.push(new Product(productName)); // This Product only exists in this Note
    }
  }
```

## Inheritance
- A class inherits features and/or behaviors from another class
```ts
  // A vehicle loan is a loan
  class CarLoan extends Loan { }
```

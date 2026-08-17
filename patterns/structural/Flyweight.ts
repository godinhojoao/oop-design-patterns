/*
Flyweight = share the common state between many objects to fit more of them in RAM,
instead of keeping a duplicated copy of that state inside every single object.
-> intrinsic state = the constant data shared and reused between objects (e.g. the product name and category).
-> extrinsic state = the data unique per object, passed from outside (e.g. the quantity and price of an order).

# Problem
- You need a huge amount of objects and they don't fit in RAM.
- Each object stores the same heavy data over and over (e.g. millions of order lines, each holding its own copy of the product data).

# Solution
- Flyweight = lightweight object that stores only the intrinsic (shared, immutable) state.
  - it can still contain behavior that uses the extrinsic state without storing it, by receiving it as a method parameter.
- Flyweight factory = keeps a pool of existing flyweights and returns an existing flyweight or creates a new one, so it is never duplicated.
- Context = small object that holds the extrinsic state plus a reference to its shared flyweight.
- Client = asks the factory for a flyweight and provides the extrinsic state when using it.
*/

// flyweight -> stores the intrinsic state and exposes the operation, receiving the extrinsic state as a parameter
class Product {
  constructor(readonly id: string, readonly name: string, readonly category: string) { }

  describe(quantity: number): void {
    console.log(`OrderLine description:\n${quantity}x ${this.name}`);
  }
}

// flyweight factory -> one product per id, reused across all orders
class ProductCatalog {
  private static productTypes = new Map<string, Product>();

  static get(id: string, name: string, category: string): Product {
    let product = this.productTypes.get(id);
    if (!product) {
      console.log(`adding ${name} to catalog (first use)`)
      product = new Product(id, name, category);
      this.productTypes.set(id, product);
    }
    return product;
  }
}

// context -> stores only the extrinsic state (quantity) + a reference to the shared product (flyweight)
class OrderLine {
  constructor(private readonly product: Product, private readonly quantity: number) { }

  describe(): void {
    this.product.describe(this.quantity); // delegates to the flyweight, passing the extrinsic state
  }
}

// client -> many order lines, but a single Product flyweight per id
new OrderLine(ProductCatalog.get("1", "crime and punishment", "books"), 2).describe();
new OrderLine(ProductCatalog.get("1", "crime and punishment", "books"), 1).describe(); // reuses the same product

/*
Visitor = Separate the algorithm of the objects they operate.

# Problem
- You need to run new algorithms over a set of objects, but you don't want to keep adding a new method
into every class each time a new operation appears (exportPdf, exportCsv, exportXml...), specially when
they are sensitive pieces of your software in production.

# Solution
- Add one single method (accept) into the elements (Form), now each new operation becomes a new visitor
(pdfexport, csvexport...) and the elements never change again.
--> visitor interface = contains a set of visit methods that can take concrete elements of an object structure as arguments.
--> concrete visitor = implement several versions of the same behaviors for different concrete element classes.
--> element interface = declares an accept method that receive as argument the visitor interface.
--> concrete element = implement the accept method and calls the proper visitor's method (double dispatch:
the executed code depends on both the element type and the visitor type).
--> client = other software who calls element.accept(new ConcreteVisitor())
*/

// element interface who needs to accept

interface Form {
  accept: (visitor: FormVisitor) => void;
}

// concrete elements
class OrderForm implements Form {
  constructor(private readonly productName: string, private readonly price: number) { }

  get name() { return this.productName }

  get value() { return this.price }

  accept(visitor: FormVisitor) {
    visitor.visitOrder(this);
  };
}
class RegistrationForm implements Form {
  constructor(
    private readonly userName: string,
    private readonly email: string,
    private readonly zipcode: string
  ) { }

  get name() { return this.userName }

  accept(visitor: FormVisitor) {
    visitor.visitRegistration(this);
  };
}

interface FormVisitor {
  visitOrder: (orderForm: OrderForm) => void;
  visitRegistration: (registrationForm: RegistrationForm) => void;
}

class PdfExportVisitor implements FormVisitor {
  visitOrder(orderForm: OrderForm) {
    console.log('exporting order form as pdf: ', orderForm.name, orderForm.value);
  };

  visitRegistration(registrationForm: RegistrationForm) {
    console.log('exporting registration form as pdf: ', registrationForm.name);
  };
}

class CsvExportVisitor implements FormVisitor {
  visitOrder(orderForm: OrderForm) {
    console.log('exporting order form as csv: ', `${orderForm.name},${orderForm.value}`);
  };

  visitRegistration(registrationForm: RegistrationForm) {
    console.log('exporting registration form as csv: ', registrationForm.name);
  };
}

// client
class App {
  private allForms: Form[] = [
    new OrderForm('computer', 100),
    new RegistrationForm('bob', 'bob@gmail.com', '123123')
  ];

  run() {
    this.allForms.forEach(form => form.accept(new PdfExportVisitor()));
    this.allForms.forEach(form => form.accept(new CsvExportVisitor()));
  }
}

const app = new App();
app.run();

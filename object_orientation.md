- I will not change this to english, sorry

# Relações e conceitos na orientação a objetos

## Associação
- Uma classe tem váriavel que faz referencia a instancia de outra classe ou interface.
- Ocorre quando eles são completamente independentes entre si mas eventualmente estão relacionados.
```ts
  // Um contrato tem um cliente
  class Contract {
    customer: Customer;
  }
```

## Agregação
- Uma relação um para muitos.
- Onde um objeto é proprietário de outro, mas não há dependencia. Ambos existem isoladamente.
```ts
  class Customer {
    notes: Note[];

    addNote (note: Note) {
      this.notes.push(note); // A Note existe sempre mesmo que o Customer não exista mais
    }
  }
```


## Composição
- A composição é uma agregação que possui dependência entre os objetos.
- `Relação de morte`: Se o objeto principal for destruído os objetos que o compõe não podem existir mais.
```ts
  class Note {
    products: Product[];

    addProduct (productName: string) {
      this.notes.push(new Product(productName)); // Este Product só existe nesta Note
    }
  }
```

## Herança
- Uma classe herda características e/ou comportamentos de outra classe
```ts
  // Um financiamento de veículo é um financiamento
  class CarLoan extends Loan { }
```

# Como melhorar código OOP

## Single responsability principle `S`OLID
- Manter na mesma classe coisas que mudam pelo mesmo motivo.
  - Desta forma mantemos regra de negócios separada de lógica de infra, por exemplo, chamadas http, queries no banco de dados, etc..

- Como identificar que nossa `classe de negócios` está com muitas responsabilidades ?
  - Por exemplo, quando a classe além de instanciar uma outra também realiza alguma lógica diferente como um cálculo.
  - Nesses casos podemos separar a `lógica de instanciação em uma classe Factory` e a lógica de cálculo em uma classe `Strategy`, separando em duas classes.
  - Assim a `Factory` instancia a classe `Strategy` e esta realiza o cálculo.
```ts
  export default class FareCalculatorFactory {
    static create (segment: Segment) {
      if (segment.isSpecialDay()) {
        return new SpecialDayFareCalculator();
      }
      if (segment.isOvernight() && !segment.isSunday()) {
        return new OvernightFareCalculator();
      }
      if (segment.isOvernight() && segment.isSunday()) {
        return new OvernightSundayFareCalculator();
      }
      if (!segment.isOvernight() && segment.isSunday()) {
        return new SundayFareCalculator();
      }
      if (!segment.isOvernight() && !segment.isSunday()) {
        return new NormalFareCalculator();
      }
      throw new Error();
    }
  }
```

## Dependency inversion of SOLI`D`
- Agora queremos persistir um pedido no banco de dados, mas vamos fazer isso na classe Order com a regra de negócio ?
  - E adicionar lógica de banco de dados juntamente de regras de negócio ? NÃO !!!

- Nesses casos podemos utilizar o pattern `Repository`, assim separamos regra de negócios de lógica de banco de dados.
- A classe que utiliza um repositório não deve saber como o repository foi implementado apenas respeitar o contrato.
```ts
  class Order {
    code =  4;
    number =  5;

    constructor(
      private readonly orderRepository: OrderRepository
    ) { }

    async save () {
      await orderRepository.save(this)
    }
  }

  class OrderRepository extends Db {
    async save (order: Order) {
      await connection.query("insert into order (code) values ($1)", [order.code]);
    }
  }
```

## Esconder e dividir complexidade

- Por exemplo, se uma classe estancia outra, ao invés de fazer assim:
  - `const user = new User('joao', new Car('hilux'))`
  - `const user1 = new User('claudio', new Car('hilux'))`
  - `const user2 = new User('john doe', new Car('hilux'))`
  - `const user3 = new User('fulano', new Car('hilux'))`

- Dessa forma se adicionamos uma nova flag em `Car` quebramos 4 lugares distintos, podemos corrigir escondendo essa implementação dentro de User:
```ts
class User {
  car: Car;

  constructor(car:  Car) {
    this.car = new Car(car)
  }
}
```
- Agora se adicionarmos uma nova propriedade em `Car` só precisamos arrumar dentro de `User`.

> [Initial readme](readme.md)

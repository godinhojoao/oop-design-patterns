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

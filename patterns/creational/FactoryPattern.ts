/*
## Description:
- When we want to simplify class instantiations putting in one function.

## Problem
- We need to mount a human with the parts of its body one by one.

## Solution
- Factory Pattern: A function or class that leads with classes instantiations simplifying the objects creation.
*/

// ARRANGE
interface IHands {
  quantity: number;
  punch: () => string;
}

interface IMouth {
  quantity: number;
  speak: () => string;
}

interface IFoots {
  quantity: number;
  move: () => string;
}


interface IHuman {
  hands?: IHands;
  mouth?: IMouth;
  foots?: IFoots;
}

class HumanHandsImp implements IHands {
  constructor(public quantity: number) { }

  punch() {
    return `quantity: ${this.quantity} punch(s)`
  };
}

class HumanMouthImp implements IMouth {
  constructor(public quantity: number) { }

  speak() {
    return `quantity: ${this.quantity} speak(s)`
  };
}

class HumanFootsImp implements IFoots {
  constructor(public quantity: number) { }

  move() {
    return `quantity: ${this.quantity} move(s)`
  };
}

// -----> WRONG: Instantiating a class by one using "new"
// So if we need to pass specific props to instantiate a class, we need to pass one by one
const wrongHuman: IHuman = {}
wrongHuman.hands = new HumanHandsImp(2)
wrongHuman.foots = new HumanFootsImp(2)

console.log(wrongHuman) // { hands: HumanHandsImp { quantity: 2 }, foots: HumanFootsImp { quantity: 2 } }
console.log(wrongHuman.hands?.punch()) // quantity: 2 punch(s)
console.log(wrongHuman.foots?.move()) // quantity: 2 move(s)

// -----> CORRECT: Using an factory pattern class to instantiate the specific human's part
// So if we need to pass specific props to instantiate a class, the factory method leads with it
class HumanPartFactory {
  static create(humanProps: { hands?: boolean, mouth?: boolean, foots?: boolean }): any {
    if (humanProps.hands) {
      return new HumanHandsImp(2);
    }
    if (humanProps.mouth) {
      return new HumanMouthImp(1);
    }
    if (humanProps.foots) {
      return new HumanFootsImp(2);
    }
  }
}

const human: IHuman = {}
human.hands = HumanPartFactory.create({ hands: true })
human.foots = HumanPartFactory.create({ foots: true })

console.log(human) // { hands: HumanHandsImp { quantity: 2 }, foots: HumanFootsImp { quantity: 2 } }
console.log(human.hands?.punch()) // quantity: 2 punch(s)
console.log(human.foots?.move()) // quantity: 2 move(s)
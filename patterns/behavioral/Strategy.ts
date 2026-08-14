/*
## Summary:
- Encapsulates an algorithm inside a class
- Capture the abstraction into an interface, and put implementation details in derived classes.

## Description:
- Strategy is a behavioral design pattern that lets you define a family of algorithms,
put each of them into a separate class, and make their objects interchangeable.
- Used to "modify" our classes and to deal with distinct situations.
- Decrease ifs using composition ( where a class don't exist without another ).

## Problem
- System with different types of subjects and each one has a calc to the price:
  - math: student's age * 4
  - geography: student's age  *  3

## Solution
- Strategy: A class that does a specific thing in many different ways
breaking these ways in another distinct classes.
*/

interface SubjectPricingStrategy {
  calculatePrice: (studentAge: number) => number;
}

class MathPricingStrategy implements SubjectPricingStrategy {
  calculatePrice(studentAge: number): number {
    return studentAge * 4
  };
}

class GeoPricingStrategy implements SubjectPricingStrategy {
  calculatePrice(studentAge: number): number {
    return studentAge * 3
  };
}

class Student {
  constructor(
    private readonly age: number,
    private readonly subjectPricing: SubjectPricingStrategy
  ) { }

  getSubjectPrice(): number {
    return this.subjectPricing.calculatePrice(this.age)
  }
}

const johnMath1 = new Student(10, new MathPricingStrategy())
console.log('john1Math.getSubjectPrice', johnMath1.getSubjectPrice()) // 40

const johnGeo1 = new Student(10, new GeoPricingStrategy())
console.log('johnGeo1.getSubjectPrice', johnGeo1.getSubjectPrice()) // 30


// or in modern languages such as TS using lambda functions
type CalculateFunc = (a: number, b: number) => number;
const sum = (a: number, b: number) => a + b;
const multiply = (a: number, b: number) => a * b;
const calculate = (a: number, b: number, func: CalculateFunc) => func(a, b);

const sumRes = calculate(10, 2, sum);
const multRes = calculate(10, 2, multiply);
console.log('sumRes', sumRes)
console.log('multRes', multRes)
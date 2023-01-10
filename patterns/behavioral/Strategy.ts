/*
## Summary:
- Encapsulates an algorithm inside a class
- Capture the abstraction in an interface, and put implementation details in derived classes.

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

interface Subject {
  calculatePrice: (studentAge: number) => number;
}

class MathSubject implements Subject {
  calculatePrice(studentAge: number): number {
    return studentAge * 4
  };
}

class GeoSubject implements Subject {
  calculatePrice(studentAge: number): number {
    return studentAge * 3
  };
}

class Student {
  constructor(
    private readonly age: number,
    private readonly subject: Subject // this is the "Strategy Class"
  ) { }

  getSubjectPrice(): number {
    return this.subject.calculatePrice(this.age)
  }
}

const johnMath1 = new Student(10, new MathSubject())
console.log('john1Math.getSubjectPrice', johnMath1.getSubjectPrice()) // 40

const johnGeo1 = new Student(10, new GeoSubject())
console.log('johnGeo1.getSubjectPrice', johnGeo1.getSubjectPrice()) // 30

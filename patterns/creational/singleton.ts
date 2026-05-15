/*
Singleton = a class has only one instance and provides a global access point to it.

## Problem
- There are objects such as database connection objects in which you don't want uncountable repetitions, you want a single object and reuse it.
  - Note: we want to control the amount of database connections.

## Solution description (2 requirements)
- 1. After creating an object, if you try to do so again, you will receive the already created one.
  - note: impossible to be done with real constructor, since constructor must always return a new object by design.
- 2. Provide a global access point to that single instance of the singleton.

## Solution:
- 1. Make the default class constructor private to prevent using the `new` operator.
- 2. Implement a static creation method that:
  - 1st call: calls the private constructor and saves object result as property.
  - Next calls: returns the existent object instance.
*/

class Database {
  static #instance: Database | null = null;

  private constructor() { }

  static get instance(): Database {
    if (!Database.#instance) {
      Database.#instance = new Database();
    }

    return Database.#instance;
  }

  query(collection: string): string {
    return `query implementation here ${collection}`;
  }
}

console.log(Database.instance.query("users"));

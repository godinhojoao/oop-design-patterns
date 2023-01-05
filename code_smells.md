# How to refactor ?
- Know the code smells and how to fix them.
- Testing, because the test give us a courage to change the code.

## Weird names and nosense:
- Rename variables, methods, classes, files.

## White lines inside methods
- Delete

## Comments
- Using explanatory variable's name
- Extract method
```ts
  // instead of this
  printOwing(): void {
    printBanner();

    // Print details.
    console.log("name: " + name);
    console.log("amount: " + getOutstanding());
  }

  // prefer this
  printOwing(): void {
    printBanner();
    printDetails(getOutstanding());
  }

  printDetails(outstanding: number): void {
    console.log("name: " + name);
    console.log("amount: " + outstanding);
  }
```

## Dead code -> disrespect to the project and to the team
- Delete

## Confusing conditions and nested
- Introduce guard clause ( invert if and not move on to the next ones, disappear with elses )
- Consolidate conditions, put conditions that was in two or more ifs and group in only one
- Introduce ternary command

## Magic numbers
- Add constants, for an example: SUNDAY_FARE, PI

## Inappropriate treatment of errors -> return a aleatory value instead of return an error
- Correct: throw new Error('Invalid distance')
- To test on jest: expect(result).toThrow(new Error('Invalid distance'))

## God object ( large classes with many responsibilities )
- Extract classes ( create new classes )
- Move methods

## Large list of parameters
- Introduce an object as parameter

> [Initial readme](readme.md)

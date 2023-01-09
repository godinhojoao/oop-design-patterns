// LISKOV SUBSTITUTION PRINCIPLE (LSP)
// Should be possible substitue an object "T" by another object "S" without changing any behavior.
// If it's true so "S" is a subtype of "T".

// INCORRECT: Because here Rectangle can't be substituted by Square
// The Square can't have different height and width but the Rectangle can
class Rectangle {
  setH() {
    return 'changing height'
  }

  setW() {
    return 'changing width'
  }
}

class Square extends Rectangle {
  setSides() {
    return 'set sides'
  }
}

// -----> CORRECT: It's possible to change License by BusinessLicense and PersonalLicense inside all our code
class License {
  calcFee(personAge) {
    return personAge * 1
  }
}

class BusinessLicense extends License {
  calcFee(personAge) {
    return personAge * 2
  }
}

class PersonalLicense extends License {
  calcFee(personAge) {
    return personAge * 1.5
  }
}

const license = new License()
const businessLicense = new BusinessLicense()
const personalLicense = new PersonalLicense()

const myAge = 19
console.log(license.calcFee(myAge)) // 19
console.log(businessLicense.calcFee(myAge)) // 38
console.log(personalLicense.calcFee(myAge)) // 28.5
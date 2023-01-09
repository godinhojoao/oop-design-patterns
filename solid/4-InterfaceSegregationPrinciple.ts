// INTERFACE SEGREGATION PRINCIPLE (ISP)
// Clients shouldn't depend of interfaces that they don't use
// So we shouldn't obligate classes to implement interfaces unnecessary methods

// -----> WRONG: It's bad to depend from an class that has more methods than needed
interface WrongDto {
  listCars: () => string[];
  listUsers: () => string[];
}

class WrongUser {
  list(): string[] {
    const genericDto = new GenericDto()
    return genericDto.listUsers()
  }
}

class WrongCar {
  list(): string[] {
    const genericDto = new GenericDto()
    return genericDto.listCars()
  }
}

class GenericDto implements WrongDto {
  listCars() { return ['fiat'] }
  listUsers() { return ['john'] }
}

const wrongUser = new WrongUser()
const wrongCar = new WrongCar()
console.log(wrongUser.list()) // [ 'john' ]
console.log(wrongCar.list()) // [ 'fiat' ]

// -----> CORRECT: Depending from classes that do just the necessary we avoid bugs
interface IUsersDto {
  listUsers: () => string[];
}

interface ICarsDto {
  listCars: () => string[];
}

class UserImp {
  list(): string[] {
    const genericDto = new GenericDto()
    return genericDto.listUsers()
  }
}

class Car {
  list(): string[] {
    const genericDto = new GenericDto()
    return genericDto.listCars()
  }
}

class UsersDtoImp implements IUsersDto {
  listUsers() { return ['john'] }
}

class CarsDtoImp implements ICarsDto {
  listCars() { return ['fiat'] }
}

const user = new UserImp()
const car = new Car()
console.log(user.list()) // [ 'john' ]
console.log(car.list()) // [ 'fiat' ]
"use strict";
// INTERFACE SEGREGATION PRINCIPLE (ISP)
// Clients shouldn't depend of interfaces that they don't use
// So we shouldn't obligate classes to implement interfaces unnecessary methods
class WrongUser {
    list() {
        const genericDto = new GenericDto();
        return genericDto.listUsers();
    }
}
class WrongCar {
    list() {
        const genericDto = new GenericDto();
        return genericDto.listCars();
    }
}
class GenericDto {
    listCars() { return ['fiat']; }
    listUsers() { return ['john']; }
}
const wrongUser = new WrongUser();
const wrongCar = new WrongCar();
console.log(wrongUser.list()); // [ 'john' ]
console.log(wrongCar.list()); // [ 'fiat' ]
class UserImp {
    list() {
        const genericDto = new GenericDto();
        return genericDto.listUsers();
    }
}
class Car {
    list() {
        const genericDto = new GenericDto();
        return genericDto.listCars();
    }
}
class UsersDtoImp {
    listUsers() { return ['john']; }
}
class CarsDtoImp {
    listCars() { return ['fiat']; }
}
const user = new UserImp();
const car = new Car();
console.log(user.list()); // [ 'john' ]
console.log(car.list()); // [ 'fiat' ]

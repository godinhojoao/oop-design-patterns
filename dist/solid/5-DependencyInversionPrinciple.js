"use strict";
/* DEPENDENDCY INVERSION PRINCIPLE (DIP)
 - Details should depend of abstractions.
 - Abstractions shouldn't depend of details.
*/
// detail
class User {
    name;
    userRepository;
    constructor(name, userRepository // depending from an abstraction
    ) {
        this.name = name;
        this.userRepository = userRepository;
    }
    create() {
        return this.userRepository.create(this.name);
    }
}
// detail
class UserRepositoryImp {
    users = [];
    create(userName) {
        if (userName === 'john')
            return 'invalid name';
        this.users.push(userName);
        return 'created';
    }
}
const userRepositoryImp = new UserRepositoryImp();
const john = new User('john', userRepositoryImp);
const doe = new User('doe', userRepositoryImp);
const johnCreation = john.create();
const doeCreation = doe.create();
console.log(johnCreation); // invalid name
console.log(doeCreation); // created

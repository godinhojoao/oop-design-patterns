/* DEPENDENDCY INVERSION PRINCIPLE (DIP)
 - Details should depend of abstractions.
 - Abstractions shouldn't depend of details.
*/

// SYSTEM
// Let's create a system to persist user's names on db.

// high-level --> abstraction

// abstraction
interface UserRepository {
  create: (userName: string) => string
}

// detail
class User {
  constructor(
    public readonly name: string,
    private readonly userRepository: UserRepository // depending from an abstraction
  ) { }

  public create(): string {
    return this.userRepository.create(this.name)
  }
}

// detail
class UserRepositoryImp implements UserRepository {
  users: string[] = []

  create(userName: string): string {
    if (userName === 'john') return 'invalid name'
    this.users.push(userName)
    return 'created'
  }
}

const userRepositoryImp = new UserRepositoryImp()
const john = new User('john', userRepositoryImp)
const doe = new User('doe', userRepositoryImp)

const johnCreation = john.create()
const doeCreation = doe.create()

console.log(johnCreation) // invalid name
console.log(doeCreation) // created

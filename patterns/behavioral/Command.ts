/*
Command = turn actions (requests) into an object that contains all info about the request and add new capabilities to it, such as undo action, adding a delay, processing into a queue, and more.

## Problem
- We have actions like "cancel order" or "send email" that we want to trigger from different places (HTTP, queue, CLI).
- We also want to log them, retry them, or undo them.
- Calling the method directly ties the caller to the receiver, and we lose the ability to store or replay the action.

## Solution
- Wrap each action in a Command object with an execute() method and optionally undo().
- Concrete Command holds a receiver + params, calls the right method on the receiver.
- Receiver is the class which does the work.
- The caller only knows the Command (abstract class), not the receiver, so this command can be triggered from anywhere, logged, queued, and reversed.
*/

interface DbRepository<T> {
  create: (input: Omit<T, "id">) => T;
  delete: (id: number) => void;
}
interface User {
  id: number;
  name: string;
}

class UserRepository implements DbRepository<User> {
  private users: User[] = [];
  private lastId = 0;

  create(input: Omit<User, "id">) {
    this.lastId++;
    const newUser = { id: this.lastId, ...input };
    this.users.push(newUser);
    return newUser;
  }

  delete(id: number) {
    this.users = this.users.filter(u => u.id !== id);
  }

  getAll() {
    return this.users;
  }
}

abstract class RepoCommand<T> {
  protected repo: DbRepository<T>;

  constructor(repo: DbRepository<T>) {
    this.repo = repo;
  }

  abstract undo(): void;

  public abstract execute(): T;
}

class CreateUserCommand extends RepoCommand<User> {
  private name: string;
  private createdId?: number;

  constructor(repo: DbRepository<User>, name: string) {
    super(repo);
    this.name = name;
  }

  public execute() {
    if (this.name === "force-error") {
      throw new Error('createUserCommand.execute(): forced error')
    }

    const newUser = this.repo.create({ name: this.name });
    this.createdId = newUser.id;
    return newUser;
  }

  public undo() {
    if (this.createdId !== undefined) {
      this.repo.delete(this.createdId);
    }
  }
}

class CommandHistory<T> {
  private stack: RepoCommand<T>[] = [];

  public push(command: RepoCommand<T>) {
    this.stack.push(command);
  }

  public pop() {
    return this.stack.pop();
  }
}

// Client consuming the commands
class Api {
  private readonly usersCommandHistory = new CommandHistory<User>();
  private readonly usersRepository = new UserRepository();

  postUsers(payload: Omit<User, "id">) {
    const cmd = new CreateUserCommand(this.usersRepository, payload.name);
    const createdUser = cmd.execute();
    this.usersCommandHistory.push(cmd); // if cmd.execute throws an error it is not added to history
    return createdUser;
  }

  undoLastUserAction() {
    const cmd = this.usersCommandHistory.pop();
    cmd?.undo();
  }

  // only for learning (unnecessary)
  logAllUsers() {
    console.log("all users: ", this.usersRepository.getAll());
  }

  logUsersHistory() {
    console.log("users history: ", this.usersCommandHistory);
  }
}

const api = new Api();
try {
  // success case
  api.postUsers({ name: "joao success" });
  // success case

  // testing undo
  api.postUsers({ name: "joao undo" });
  console.log('before undo:')
  api.logAllUsers();

  api.undoLastUserAction();

  console.log('after undo:')
  api.logAllUsers();
  api.logUsersHistory();
  // testing undo

  // testing force error to show it does not affect history and saved users
  api.postUsers({ name: "force-error" });
} catch (error) {
  console.log('error', error)

  console.log('same users (after force error):')
  api.logAllUsers();

  console.log("user who threw error not added to history:")
  api.logUsersHistory();
  // testing force error to show it does not affect history and saved users
}

// # On my example:
// - abstract command = RepoCommand
// - concrete command = CreateUserCommand
// - receiver = UserRepository
// - invoker1 = Api
// ----> history is not part of the Command class, it belongs to the invoker
// OBS: We could have more invokers, such as a worker with a queue, etc.
/*
Chain of Responsibility = a sequence of handlers linked in a specific order, where each handler decides
if it processes the request or passes it to the next handler in the chain.

## Problem
- We have multiple handlers that need to run in order to handle a request, and not all of them run every time.
- Any handler can stop the chain and return, or pass the request forward.

## Solution
- Create an abstract class that holds a reference to the next handler and forces subclasses to implement the handling logic.
- The base class has an "execute" method that runs the current handler and then either forwards the request to the next one or
short circuits and returns the response.
*/
type Context = { payload: { name: string }, response?: string; }
type HandleResult = { context: Context, hasStopped: boolean };

abstract class Middleware {
  protected next?: Middleware;

  protected abstract handle(context: Context): HandleResult

  public setNext(middleware: Middleware): Middleware {
    this.next = middleware;
    return this.next;
  }

  public execute(context: Omit<Context, 'response'>): Context {
    const res = this.handle(context);
    if (res.hasStopped) { return res.context; }
    return this.next?.execute(res.context) ?? res.context;
  }
}

class ValidationMiddleware extends Middleware {
  private readonly NAME_MAX_LENGTH = 10;

  protected handle(context: Context): HandleResult {
    if (context.payload.name.length > this.NAME_MAX_LENGTH) {
      context.response = `400 - name max length of ${this.NAME_MAX_LENGTH} exceeded`;
      return { context, hasStopped: true };
    }

    return { context, hasStopped: false };
  }
}

class AuthMiddleware extends Middleware {
  private readonly AUTHORIZED_USERS = ["admin", "admin2"];

  protected handle(context: Context): HandleResult {
    if (!this.AUTHORIZED_USERS.includes(context.payload.name)) {
      context.response = "401 - unauthorized user";
      return { context, hasStopped: true };
    }

    return { context, hasStopped: false };
  }
}

class OrdersRoute extends Middleware {
  protected handle(context: Context): HandleResult {
    context.response = "order successfully processed";
    return { context, hasStopped: true };
  }
}

const chain = new ValidationMiddleware();
chain
  .setNext(new AuthMiddleware())
  .setNext(new OrdersRoute());

const invalidPayloadSize = { payload: { name: "joao123456789" } };
const validSizeButUnauthorized = { payload: { name: "joao" } };
const validAndAuthorized = { payload: { name: "admin" } };

const invalidSizeRes = chain.execute(invalidPayloadSize);
console.log('invalidSizeRes', invalidSizeRes)

const unauthorizedRes = chain.execute(validSizeButUnauthorized);
console.log('unauthorizedRes', unauthorizedRes)

const authorizedRes = chain.execute(validAndAuthorized);
console.log('authorizedRes', authorizedRes)

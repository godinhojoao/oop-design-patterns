/*
State = lets an object change its behavior "automatically" when its internal state changes. Appears as if the object changed its class.
--> emulates a finite state machine, with state transitions and different behaviors based on current state.

## Problem
- We have a class that behaves differently based on its variants states;
- Generally we add multiple if/else or a switch case for it, checking object properties to see the current state and how each method will behave;
- But this makes code a mess, if we change the state transition logic we would require changing multiple conditionals in every method.

## Solution
- Context class = Stores a reference of one specific concrete state and delegates to it all specific work; provide a setState method to change state;
- State interface = an interface with the methods each state may implement.
- State concrete classes = the behavior during a specific state of the context; we have a backreference to the context.
*/

// Possible scenarios in our short example:
// 1. cold read (first access)
// missing -> fresh

// 2. TTL expires, next read serves stale + refetches, back to fresh
// fresh -> stale -> fresh

// 3. TTL expires twice without a read in between, value discarded
// fresh -> stale -> missing

// 4. explicit invalidation (e.g. admin action or write-through)
// fresh -> evicted -> fresh

class CacheEntry<T> {
  private state: CacheState<T> = new MissingState(this); // reference to the state

  constructor(readonly fetcher: () => T) { }

  public setState(newState: CacheState<T>) {
    console.log(`${this.state.constructor.name} to ${newState.constructor.name}`);
    this.state = newState;
  }

  public get(): T {
    return this.state.get();
  }

  public onExpire() { this.state.onExpire(); }

  public invalidate() { this.state.invalidate(); }
}

abstract class CacheState<T> {
  constructor(protected entry: CacheEntry<T>) { }
  abstract get(): T;
  abstract onExpire(): void;
  abstract invalidate(): void;
}

abstract class WithValueState<TValue> extends CacheState<TValue> {
  constructor(entry: CacheEntry<TValue>, protected value: TValue) {
    super(entry);
  }
}

class MissingState<T> extends CacheState<T> {
  get(): T {
    const value = this.entry.fetcher();
    this.entry.setState(new FreshState(this.entry, value));
    return value;
  }
  onExpire(): void {/* already missing do nothing*/ }
  invalidate(): void {/* already missing do nothing*/ }
}

class FreshState<T> extends WithValueState<T> {
  get(): T {
    return this.value;
  }

  onExpire(): void { // fresh window expires change to stale
    this.entry.setState(new StaleState(this.entry, this.value));
  }

  invalidate(): void {
    this.entry.setState(new EvictedState(this.entry));
  }
}

class StaleState<T> extends WithValueState<T> {
  get(): T {
    // if it was async here we would return the stale value and trigger a background cache entry refetch
    const value = this.entry.fetcher(); // since our small example is entirely sync, we just get most updated value
    this.entry.setState(new FreshState(this.entry, value));
    return value;
  }
  onExpire(): void { // stale window expires change to missing
    this.entry.setState(new MissingState(this.entry));
  }
  invalidate(): void {
    this.entry.setState(new EvictedState(this.entry));
  }
}

class EvictedState<T> extends CacheState<T> {
  get(): T {
    const value = this.entry.fetcher();
    this.entry.setState(new FreshState(this.entry, value));
    return value;
  }
  onExpire(): void {/* already evicted do nothing*/ }
  invalidate(): void {/* already evicted do nothing*/ }
}

type User = { id: number, name: string };

const userDb: Record<string, User> = {
  "user:1": { id: 1, name: "joao" },
  "user:2": { id: 2, name: "maria" },
};
function fetchUser(key: string) {
  return userDb[key];
}

const userEntry = new CacheEntry(() => fetchUser("user:1"));
console.log('--------- scenario 1 (missing -> fresh) ---------')
console.log("read 1:", userEntry.get()); // slow: missing -> fresh
console.log("read 2:", userEntry.get()); // fast: fresh
console.log('--------- scenario 1 --------- \n')

console.log('--------- scenario 2 (fresh -> stale -> fresh) ---------')
userEntry.onExpire();
console.log("read 3:", userEntry.get());
console.log('--------- scenario 2 (fresh -> stale -> fresh) --------- \n')

console.log('--------- scenario 3 (fresh -> stale -> missing) ---------')
userEntry.onExpire(); // fresh -> stale
userEntry.onExpire(); // stale -> missing
console.log("read 4:", userEntry.get()); // missing -> fresh
console.log('--------- scenario 3 (fresh -> stale -> missing) --------- \n')

console.log('--------- scenario 4 (fresh -> evicted -> fresh) ---------')
userEntry.invalidate();
console.log("read 5:", userEntry.get()); // evicted -> fresh
console.log('--------- scenario 4 (fresh -> evicted -> fresh) --------- \n')
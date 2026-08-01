/*
Observer = A subject maintains a list of subscribers and notifies them automatically when its state changes. 1:N dependency.
Examples: web DOM -> button.addEventListener; nodejs EventEmitter -> emitter.on('data', ..); react state, ...

## Problem
- Objects need to react when another object's state changes.
- Polling the source constantly wastes work; broadcasting to everyone spams objects that do not care.
- We want reactions without coupling the source to every possible reactor.

## Solution
- Subject: owns the state, exposes subscribe/unsubscribe, and calls notify() when state changes.
- Observer: implements a shared update() interface and reacts to notifications.
- Subject only knows the Observer interface, so new observers can be added without changing the Subject.
*/

interface Observer<T> {
  update: (data: T) => void;
}

abstract class Subject<EventType, DataType> {
  private observers = new Map<EventType, Set<Observer<DataType>>>();

  subscribe(eventType: EventType, listener: Observer<DataType>) {
    let bucket = this.observers.get(eventType);
    if (!bucket) {
      bucket = new Set();
      this.observers.set(eventType, bucket);
    }
    bucket.add(listener);
  }

  unsubscribe(eventType: EventType, listener: Observer<DataType>) {
    const bucket = this.observers.get(eventType);
    if (bucket) {
      bucket.delete(listener);
    }
  }

  notify(eventType: EventType, data: DataType) {
    const bucket = this.observers.get(eventType);
    if (bucket) {
      for (const observer of bucket) {
        observer.update(data);
      }
    }
  }
}

type BlogPost = { title: string; description: string; blogName: string; }
enum BlogEventsTypes { PostPublished = "post:published" };

class Blog extends Subject<BlogEventsTypes, BlogPost> {
  private _name = "";

  constructor(name: string) {
    super();
    this._name = name;
  }

  public publishPost(input: Omit<BlogPost, 'blogName'>): void {
    const newPost = { title: input.title, description: input.description, blogName: this._name };
    this.notify(BlogEventsTypes.PostPublished, newPost);
  }
}

class EmailSenderObserver implements Observer<BlogPost> {
  update(data: BlogPost) {
    console.log('sending email built using blog post: ', data);
  };
}

const emailSenderObserver = new EmailSenderObserver();
const typescriptBlog = new Blog("typescript");
typescriptBlog.subscribe(BlogEventsTypes.PostPublished, emailSenderObserver);

typescriptBlog.publishPost({ title: "what is ts", description: "abc" });


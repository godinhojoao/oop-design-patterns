/*
Decorator = Attach new behaviors to objects by placing them inside special wrappers with the behaviors.

# Problem
- We want to add features to an http client, but we can't change the existing class.
- Some features are: logging, cache, and in future we plan to add rate limit, and more.
- We need the flexibility of adding these features whenever we want without changing the classes internally.

# Solution
- component interface = common interface used for both concrete components and also wrappers
- concrete component = the class being wrapped, defines the basic behavior that decorators can alter.
- abstract base decorator = wraps the component using composition: it contains a field like "wrappee: ComponentInterface"
  -- it also implements the component interface, delegating all the work to the wrappee.
  -- why do we use this base decorator? so our concrete decorators don't need to implement methods they don't override.
- concrete decorators = define extra behaviors to the wrapped object, override methods of the base decorator,
calling the original components methods, but executing custom logic before or after its call.
- client = who uses the decorators to wrap components, it can wrap components in multiple layers of decorators (not limited to only one)
*/

// component interface
interface HttpClient {
  get: (url: string) => string
  post: (url: string, body: string) => string
}

// concrete component
class FetchHttpClient implements HttpClient {
  get(url: string) { return `body of ${url}` }
  post(url: string, body: string) { return `sent ${body} to ${url}` }
}

// base decorator -> delegates everything, so concrete decorators override only what they change
abstract class HttpClientDecorator implements HttpClient {
  constructor(protected readonly wrappee: HttpClient) { }

  get(url: string) { return this.wrappee.get(url) }
  post(url: string, body: string) { return this.wrappee.post(url, body) }
}

// concrete decorator -> only get is cacheable, post is inherited from the base
class CacheHttpClientDecorator extends HttpClientDecorator {
  private cache = new Map<string, string>();

  get(url: string) {
    console.log('went on cache')
    if (!this.cache.has(url)) this.cache.set(url, super.get(url));
    return this.cache.get(url)!;
  }
}

// concrete decorator -> logs both routes
class LogHttpClientDecorator extends HttpClientDecorator {
  get(url: string) {
    console.log('GET', url);
    return super.get(url);
  }

  post(url: string, body: string) {
    console.log('POST', url);
    return super.post(url, body);
  }
}

const client = new LogHttpClientDecorator(new CacheHttpClientDecorator(new FetchHttpClient()));
client.get('/users') // logs + fetches
client.get('/users') // logs + cache hit
client.post('/users', 'john') // logs + calls directly the component (cache doesn't touch post)

/*
Iterator = Let's you traverse elements of a collection without exposing its underlying representation (list, stack, vector, tree...)
--> the collection owns the data, the iterator owns the traversal (where we are currently and what comes next).

# Problem
- To traverse a collection the client needs to know how it stores the data (array index, linked nodes, tree depth), so its internals leak.
- The collection gets bloated when we add every traversal we need to it (forward, backward, ordered, filtered), and it stops being just a storage.
- Traversal state (current position) lives in the client, so we can't have two independent traversals at the same time, and the same loop is duplicated everywhere.

# Solution
- Iterator interface = declares the traversal operations (hasNext, getNext...), the only thing the client depends on.
- Concrete iterator = implements the traversal and holds its own position, so several iterators can walk the same collection independently.
- Iterable collection interface = declares createIterator(), so every collection returns an iterator without revealing how it stores the data.
- Concrete collection = implements createIterator() returning the iterator that knows how to walk it; new traversals = new iterator class, collection unchanged.
*/

interface Iterator<T> {
  hasNext: () => boolean;
  hasPrev: () => boolean;
  getNext: () => T;
  getPrev: () => T;
}

interface IterableCollection<T> {
  createIterator: () => Iterator<T>;
}

type Song = { name: string; duration: number; };

class Playlist implements IterableCollection<Song> {
  private songs: Song[] = [];

  add(song: Song) { this.songs.push(song); }
  count(): number { return this.songs.length; }
  songAt(index: number): Song { return this.songs[index]; }

  createIterator(): Iterator<Song> { return new SongIterator(this); }
}

class SongIterator implements Iterator<Song> {
  private position = -1; // no songs
  constructor(private playlist: Playlist) { } // holds the collection, not its data (songs are private)

  hasNext() { return this.position + 1 < this.playlist.count(); }

  hasPrev() { return this.position > 0; }

  getNext(): Song {
    if (!this.hasNext()) throw new Error("no next song");
    return this.playlist.songAt(++this.position);
  }

  getPrev(): Song {
    if (!this.hasPrev()) throw new Error("no previous song");
    return this.playlist.songAt(--this.position);
  }
}

const playlist = new Playlist();
playlist.add({ name: "one", duration: 180 });
playlist.add({ name: "two", duration: 240 });
playlist.add({ name: "three", duration: 200 });

// client only knows the iterator interface, never how Playlist stores the songs
const iterator = playlist.createIterator();
while (iterator.hasNext()) console.log("next:", iterator.getNext().name); // one, two, three
while (iterator.hasPrev()) console.log("prev:", iterator.getPrev().name); // two, one

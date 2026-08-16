/*
Facade = provides a simplified interface to a library, framework, or any complex set of classes.

# Problem
- To save a compressed file we need to read it as bytes, gzip these bytes, mount the new file name
and write it again (node:fs and node:zlib give us all these pieces).
- Every place that needs a compressed file would repeat these steps and their details.

# Solution
- facade = provides a simple method to the feature the client needs, knowing where to direct the client
request and how to operate all the subsystem parts.
- complex subsystem = many classes/functions of a library/framework.
- client = uses the facade instead of calling the subsystem parts directly.
--> the facade doesn't block the subsystem: a client that needs a specific feature can still use it directly.
*/

// complex subsystem -> node:fs + node:zlib
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { gzipSync, gunzipSync } from 'node:zlib';

// facade -> hiding complex logic and libraries
class FileCompressor {
  compress(filePath: string): string {
    const content = readFileSync(filePath);
    const compressedPath = `${filePath}.gz`;
    writeFileSync(compressedPath, gzipSync(content));
    return compressedPath;
  }

  read(compressedPath: string): string {
    return gunzipSync(readFileSync(compressedPath)).toString('utf8');
  }
}

// imagine this file already exists :P
const filePath = './tmp/notes.txt';
mkdirSync('./tmp', { recursive: true });
writeFileSync(filePath, 'hello facade');

// client: knows nothing about buffers, gzip or file paths details
const compressor = new FileCompressor();
const compressedPath = compressor.compress(filePath);

console.log(compressor.read(compressedPath)) // hello facade

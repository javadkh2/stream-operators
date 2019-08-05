# stream-operators [![npm][npm-image]][npm-url] [![GitHub license][license-image]][license-url]  [![type][typescript-image]][npm-url] [![PRs Welcome][pull-request-image]][pull-request-url]

A library for creating Readable, Writable and Transform stream which adopt two major tools in async world -  Stream and Promise - with declarative programming approach.

Node.js native stream is very powerfully tool for creating high performance application. This library designed for using the power of stream for read, transform and write streams in object mode. the API is very declarative and inspired by RxJs. another design decision is combining streams with promise for better async handling; Most of the helpers could return promise instead of absolute data.

[pull-request-image]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[pull-request-url]: #
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/javadkh2/stream-operators/blob/master/LICENSE
[npm-image]: https://img.shields.io/npm/v/stream-operators.svg?style=flat
[npm-url]: https://npmjs.org/package/stream-operators
[typescript-image]: https://img.shields.io/npm/types/typescript
[typescript-url]: https://www.typescriptlang.org/

## Installation
```sh
$ npm install stream-operators
```
## Read stream creators

### counter

```typescript
counter: (limit: number = Infinity) => Readable
```

Creates a read stream that start a counter from zero to limit - the limit default value is Infinity.

##### sample
```typescript
counter(5)
    .pipe(process.stdout)

// console 0 1 2 3 4 
```

### from

```typescript
from: (list: any[]) => Readable
```
Creates a read stream from a list and push items in sequence.
 
#### sample
```typescript
from([1,2,3,4])
    .pipe(process.stdout)

// console: 1 2 3 4 
```

### read

```typescript 
read: (readFn: (times: number, size: number) => any) => Readable
```

Creates a read stream from a read function, each time consumer send a read signal the reader function is called and the return value push to the stream. The return value could be a promise and in this case the resolved value push to the stream.

##### sample
```typescript
read((page) => fetchProducts(page).then(list => list.map(p => p.name).join("\n")))
    .pipe(process.stdout)

// console apple\n orange\n banana
```

## Write stream creators

### write

```typescript
write: (writeFn: (chunk: any) => any | Promise<any>) => Writable
```

Creates a write stream from a write function, each time a chunk is prepared this function is called and when the function execution finishes ( in case of promise if the promise resolved) the read signal send to top reader stream.

##### sample

```typescript
counter(5)
    .pipe(write(console.log))

// console 0 1 2 3 4

readFileLineStream
    .pipe(write((line) => writeToDb(mapToProduct(line))))    
```

### fork

```typescript
fork: (...branches: ((stream: Stream) => void | Writable)[]) => Writable
```

forks N read stream from a main read stream. if the callback function return a write stream the finish event fire after branches finish event.

##### sample

```typescript
req
   .pipe(fork(
       (stream) => stream.pipe(res), // echo request to response
       (stream) => stream.pipe(write(console.log)), // log request to console
   ))
```

## Transform stream creators

### map

```typescript
map: (map: (item: any) => any | Promise<any>) => Transform
```

Creates a transform stream from a map function. for each chunk the the result of map function ( the resolved value in case of promise) push to stream.

##### sample

```typescript
const logger = write(console.log);

counter(5)
    .pipe(map((item) => item * 2))
    .pipe(logger)

// console: 0 2 4 6 8

readProductCsvFile
    .pipe(map(mapToJson))
    .pipe(startWith("["))
    .pipe(endWith("]"))
    .pipe(res)

// response [ {id:1, name:"apple"}, {id:2, name:"orange"}, ... ]
```



### filter

```typescript
filter: (filter: (item: any) => boolean | Promise<boolean>) => Transform
```

Creates a transform stream from a map function. for each chunk if the result of filter be true (or it resolve to truthy value in case of promise) the chunk push to stream.

##### sample

```typescript
const logger = write(console.log);
const isEven = (item) => item % 2 === 0;

counter(5)
    .pipe(filter(isEven)
    .pipe(logger)

// console: 0 2 4
```

### delay

```typescript
delay: (time: number) => Transform
```

Creates a transform stream that made delay on the input stream. the time unit is `ms`.

##### sample

```typescript
const logger = write(console.log);
const isEven = (item) => item % 2 === 0;

counter(5)
    .pipe(delay(1000))
    .pipe(filter(isEven)
    .pipe(logger)

// console: 0 2 4
```

### buffer

```typescript
buffer: (bufferSize: number = Infinity) => Transform
```

Creates a transform stream that buffer N chunk and pushes this buffer to output stream. the bufferSize default value is Infinity - so the output stream push only one chunk when the input stream ends.

##### sample 
```typescript
const logger = write(console.log);

counter(5)
    .pipe(buffer(2))
    .pipe(logger)

// console: [0,1] [2,3] [4]

// writing a json stream data to db - each 1000 items insert in one bulk insert query for better performance
readEnormousJson
    .pipe(map(mapToStandardProduct))
    .pipe(buffer(1000))
    .pipe(writeProductListToDB)

```

### startWith

```typescript
startWith: (data: any) => Transform
```

Creates a transform stream that push a chunk with input value as first chunk.

##### sample

```typescript
const logger = write(console.log);

counter(5)
    .pipe(startWith("start"))
    .pipe(logger)

// console: start 0 1 2 3 4

// read product list from DB and convert it to CSV first csv line is "id,name,price" and send stream as response
readProductFromDb
    .pipe(map(productToCSVLine))
    .pipe(startWith("id,name,price\n"))
    .pipe(res)

```

### endWith

```typescript
endWith: (data: any) => Transform
```

Creates a transform stream that push a chunk with input value as last chunk.

##### sample

```typescript
const logger = write(console.log);

counter(5)
    .pipe(startWith("start"))
    .pipe(endWith("end"))
    .pipe(logger)

// console: start 0 1 2 3 4 end

readProductCsvFile
    .pipe(map(mapToJson))
    .pipe(startWith("["))
    .pipe(endWith("]"))
    .pipe(res)

// response [ {id:1, name:"apple"}, {id:2, name:"orange"}, ... ]
```

### extract

```typescript
extract: () => Transform
```

Create a transform stream that push item of a chunk (if chunk is am array or has forEach function) to output stream.

```typescript
const logger = write(console.log);

from([[1,2,3],[4,5,6]])
    .pipe(extract())
    .pipe(logger)

// console: 1 2 3 4 5 6 7

// read each 1000 records in one query from DB then push array to stream the extract function extract the list for normalizing data and the rest of stream chain work with simple data instead of a list.
read((page) => readProductFromDB({limit:1000, page})
    .pipe(extract())
    .pipe(toJsonStream)
    .pipe(res)
```

### reduce

```typescript
reduce: (reducer: (acc: any, item: any) => any, reset?: any | (times:number) => any, bufferSize = Infinity) => Transform
```

Create a transform stream that reduce N chunk to one chunk. the N - bufferSize - default value is Infinity, so it reduce all chunk to one chunk by default. the initial value is reset value (or the output of reset if the reset is a function - the reset function give a times (chunk index) and return reset value ).

##### sample
```typescript
const logger = write(console.log);

counter(5)
    .pipe(reduce((acc, sum)=>acc + sum , 0))
    .pipe(logger)

// console 10   

counter(5)
    .pipe(reduce((acc, sum)=>acc + sum , 0, 3))
    .pipe(logger)

// console 3 7

// implementing buffer transform stream with reduce helper.
const buffer = (size = Infinity) => reduce((list, chunk) => [...list, chunk], [])


```

### inspect

```typescript 
inspect: () => Transform
```

Create a transform stream that log each chunk to console without any change to stream. this function is useful in development and debug purpose.

```typescript
counter(5)
   .pipe(inspect())
   .pipe(write(() => void 0)) 

// console: 0\n 1\n 2\n 3\n 4\n   
```
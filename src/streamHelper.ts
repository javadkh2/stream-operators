import { Readable, Stream, Transform, TransformCallback, Writable } from "stream";

// a helper for creating readStream 
export const read = (readFn: (times: number, size: number) => Promise<any> | any) => {
    let times = -1;
    return new Readable({
        objectMode: true,
        read(size: number) {
            times++;
            Promise.resolve(readFn(times, size))
                .then(data => this.push(data))
        }
    })
}

// a helper for creating writeStream 
export const write = (writeFn: (list: any) => Promise<any> | any) => new Writable({
    objectMode: true,
    write(list, enc, done) {
        Promise.resolve()
            .then(() => writeFn(list))
            .then(() => done())
            .catch((e) => this.emit("error", e));
    },
});

// reduce stream data
export const reduce = (reduce: (old: any, item: any) => Promise<any> | any, reset?: any | ((times: number) => any), bufferSize = Infinity) => {
    const getInitial = () => typeof reset === "function" ? reset(times) : reset;
    let counter = 0;
    let times = 0;
    let result = getInitial();

    const flush = (cb: TransformCallback) => {
        counter > 0 ? cb(null, result) : cb();
        counter = 0;
        times++;
        result = getInitial();
    };

    const setResult = (newRes: any) => result = newRes;

    return new Transform({
        objectMode: true,
        flush,
        transform(item, enc, cb) {
            Promise.resolve(counter++)
                .then(() => reduce(result, item))
                .then(setResult)
                .then(() => counter < bufferSize ? cb() : flush(cb))
                .catch(cb);
        },
    });
};

//stream map helper
export const map = (map: (item: any) => any) => new Transform({
    objectMode: true,
    transform(item, enc, cb) {
        Promise.resolve(map(item))
            .then(result => cb(null, result))
            .catch(e => cb(e));
    },
});

//stream filter helper
export const filter = (filter: (item: any) => boolean) => new Transform({
    objectMode: true,
    transform(item, enc, cb) {
        Promise.resolve(filter(item))
            .then(result => result ? cb(null, item) : cb())
            .catch(e => cb(e));
    },
});

// return a promise that waiting for milliseconds and then resolve
export const wait = (time: number) => new Promise((resolve, reject) => setTimeout(resolve, time))

// log an argument an return it;
export const log = (arg: any) => { console.log(arg); return arg; };

// for debug purpose 
export const inspect = (): any => map(log);

// delay stream helper
export const delay = (time: number) => map((item) => wait(time).then(() => item));

// reduce stream chunk to a list with special size
export const list = (bufferSize: number = Infinity) => reduce((list, item) => list.push(item) && list, () => [], bufferSize);

// fork stream to multiple stream
export const fork = (...children: Array<(stream: Stream) => void>) => {
    let handlers = children.map((child) => {
        const stream = new Readable({ objectMode: true, read() { } });
        child(stream);
        return (chunk: any) => stream.push(chunk)
    })
    return write((chunk) => {
        handlers.forEach((handler) => handler(chunk))
    })
}

// create an stream from a list
export const from = (list: Array<any>) => read((times) => list.length > times ? list[times] : null)

// count from 0 to limit
export const count = (limit: number = Infinity) => read((times) => times < limit ? times : null)
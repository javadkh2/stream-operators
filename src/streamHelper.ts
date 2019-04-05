import { Transform, TransformCallback, Writable, Readable } from "stream";

export const read = (readFn: (size: number, times: number) => any) => {
    let times = 0;
    return new Readable({
        objectMode: true,
        read(size: number) {
            times++;
            Promise.resolve(readFn(size, times))
                .then(data => this.push(data))
        }
    })
}

export const write = (writeFn: (list: any) => any) => new Writable({
    objectMode: true,
    write(list, enc, done) {
        Promise.resolve()
            .then(() => writeFn(list))
            .then(() => done())
            .catch((e) => this.emit("error", e));
    },
});

export const reduce = (reduce: (old: any, item: any) => any, reset?: any | ((times: number) => any), bufferSize = Infinity) => {
    const getInitial = () => reset && typeof reset == "function" && reset(times)
    let counter = 0;
    let times = 1;
    let result = getInitial();

    const flush = (cb: TransformCallback) => {
        counter > 0 ? cb(null, result) : cb();
        counter = 0;
        times++;
        result = getInitial();
    };

    return new Transform({
        objectMode: true,
        flush,
        transform(item, enc, cb) {
            Promise.resolve(counter++)
                .then(() => reduce(result, item))
                .then(ans => result = ans)
                .then(() => counter < bufferSize ? cb() : flush(cb))
                .catch(e => cb(e));
        },
    });
};

export const map = (map: (item: any) => any) => new Transform({
    objectMode: true,
    transform(item, enc, cb) {
        Promise.resolve(map(item))
            .then(result => cb(null, result))
            .catch(e => cb(e));
    },
});

export const filter = (filter: (item: any) => boolean) => new Transform({
    objectMode: true,
    transform(item, enc, cb) {
        Promise.resolve(filter(item))
            .then(result => result ? cb(null, item) : cb())
            .catch(e => cb(e));
    },
});

export const after = (time: number) => new Promise((resolve, reject) => setTimeout(resolve, time))

export const log = (arg: any) => { console.log(arg); return arg; };

export const inspect = (): any => map(log);

export const delay = (time: number) => map((item) => after(time).then(() => item));

export const list = (bufferSize: number) => reduce((list, item) => list.push(item) && list, () => [], bufferSize);

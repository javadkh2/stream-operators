import { Transform, TransformCallback } from "stream";

// reduce stream data
export const reduce = (reducer: (acc: any, item: any) => Promise<any> | any, reset?: any | ((times: number) => any), bufferSize = Infinity) => {
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
                .then(() => reducer(result, item))
                .then(setResult)
                .then(() => counter < bufferSize ? cb() : flush(cb))
                .catch(cb);
        },
    });
};
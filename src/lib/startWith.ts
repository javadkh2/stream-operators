import { Transform } from "stream";

//stream startWith helper
export const startWith = (data: any) => {
    let firstTime = true;

    const doFirstTime = (stream: Transform) => {
        firstTime = false;
        return Promise.resolve(data)
            .then((result) => stream.push(result))
    }

    return new Transform({
        objectMode: true,
        transform(item, enc, cb) {
            let start = firstTime ? doFirstTime(this) : Promise.resolve(true);
            start.then(() => cb(null, item))
                .catch(cb)
        },
    })
};
import { Transform } from "stream";

//stream startWith helper
export const endWith = (data: any) => {
    return new Transform({
        objectMode: true,
        flush(cb) {
            cb(null, data);
        },
        transform(item, enc, cb) {
            cb(null, item)
        },
    })
};
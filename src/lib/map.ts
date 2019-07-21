import { Transform } from "stream";

//stream map helper
export const map = (map: (item: any) => any) => new Transform({
    objectMode: true,
    transform(item, enc, cb) {
        Promise.resolve(map(item))
            .then(result => cb(null, result))
            .catch(e => cb(e));
    },
});
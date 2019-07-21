import { Transform } from "stream";

//stream filter helper
export const filter = (filter: (item: any) => boolean) => new Transform({
    objectMode: true,
    transform(item, enc, cb) {
        Promise.resolve(filter(item))
            .then(result => result ? cb(null, item) : cb())
            .catch(e => cb(e));
    },
});
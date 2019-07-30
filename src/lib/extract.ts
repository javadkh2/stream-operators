import { Transform } from "stream";

export const extract = () => new Transform({
    objectMode: true,
    transform(list, enc, cb) {
        if (typeof list.forEach === "function") {
            list.forEach((item:any) => this.push(item));
            cb();
        } else {
            cb(null, list);
        }
    },
});

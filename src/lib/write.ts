import { Writable } from "stream";

// a helper for creating writeStream 
export const write = (writeFn: (chunk: any) => Promise<any> | any) => new Writable({
    objectMode: true,
    write(list, enc, done) {
        Promise.resolve()
            .then(() => writeFn(list))
            .then(() => done())
            .catch(done)
    },
});
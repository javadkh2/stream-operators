import { Readable, Stream, Writable } from "stream";

// fork stream to multiple stream
export const fork = (...branches: Array<(stream: Stream) => void | Writable>) => {
    let more: () => void;
    const push = (chunk: any) => readers.forEach((reader, i) => {
        reader.stream.push(chunk);
        reader.ready = false;
    });
    const finish = (total: number, cb: () => void) => {
        let finished = 0;
        return () => {
            finished++;
            if (finished === total) {
                cb();
            }
        }
    }
    const writeStream = new Writable({
        objectMode: true,
        final(cb) {
            const finishFn = finish(readers.length, cb);
            readers.forEach((reader) => {
                if (reader.wStream && reader.wStream instanceof Writable) {
                    reader.wStream.on("finish", finishFn)
                    reader.stream.push(null);
                } else {
                    reader.stream.push(null);
                    finishFn();
                }
            })
        },
        write(chunk, enc, cb) {
            push(chunk);
            more = () => cb();
        }
    })

    function checkReady() {
        if (readers.reduce((result, reader) => result && reader.ready, true)) {
            more && more();
        }
    }
    let readers = branches.map((child) => {
        const stream = new Readable({
            objectMode: true, read() {
                reader.ready = true;
                checkReady();
            }
        });
        const reader = {
            ready: false,
            stream,
            wStream: child(stream),
        }
        return reader;
    })
    return writeStream;

}
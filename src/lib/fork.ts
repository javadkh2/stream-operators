import { Readable, Stream, Writable } from "stream";

// fork stream to multiple stream
export const fork = (...children: Array<(stream: Stream) => void>) => {
    let more: () => void;
    let ready: boolean[] = new Array(children.length).fill(false);
    const push = (chunk: any) => readers.forEach((stream, i) => {
        stream.push(chunk);
        ready[i] = false;
    });
    const writeStream = new Writable({
        objectMode: true,
        write(chunk, enc, cb) {
            push(chunk);
            more = () => cb();
        }
    })
    writeStream
        .on("finish", () => {
            readers.forEach((stream) => {
                stream.push(null);
            })
        })
        .on("error", (err) => {
            readers.forEach((stream) => {
                stream.emit("error", err);
            })
        })

    function checkReady() {
        if (ready.reduce((result, current) => result && current)) {
            more && more();
        }
    }
    let readers = children.map((child, i) => {
        const stream = new Readable({
            objectMode: true, read() {
                ready[i] = true;
                checkReady();
            }
        });
        child(stream);
        return stream;
    })
    return writeStream;

}
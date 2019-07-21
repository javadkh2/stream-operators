import { Readable } from "stream";

// a helper for creating readStream 
export const read = (readFn: (times: number, size: number) => Promise<any> | any) => {
    let times = -1;
    return new Readable({
        objectMode: true,
        read(size: number) {
            times++;
            Promise.resolve(readFn(times, size))
                .then(data => this.push(data))
                .catch(error => { this.emit("error", error) })
        }
    })
}
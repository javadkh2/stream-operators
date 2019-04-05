import { Readable } from "stream";
import { map, filter, reduce, inspect, list, delay, write, after, log, read } from "./streamHelper";

const getRandom = (max: number) => () => Math.random() * max;
const getNumber = getRandom(1000);

const getTestStream = (count: number, delay: number = 1) => read((size, times) => {
    if (times > count) return null;
    return after(delay).then(() => ({ id: times, num: getNumber(), size }))
})

getTestStream(10)
    .pipe(map((item) => ({ ...item, normalMap: getNumber() })))
    .pipe(map((item) => Promise.resolve({ ...item, asyncMap: getNumber() })))
    // .pipe(filter((item) => item.id % 5 !== 0))
    .pipe(delay(1000))
    .pipe(reduce((res, item) => `${res}-${item.id}`, ""))
    .pipe(write((item) => console.log(item)));

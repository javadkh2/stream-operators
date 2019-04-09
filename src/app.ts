import { read, wait, map, filter, delay, inspect, fork, write, count, reduce, log } from "./streamHelper";

const getRandom = (max: number) => Math.floor(Math.random() * max);

const getTestStream = (count: number, delay: number = 1) => read((times) => {
    if (times > count) return null;
    return wait(delay).then(() => ({ id: times, num: getRandom(10) + 1 }))
})

// getTestStream(10)
//     .pipe(map((item) => ({ ...item, normalMap: getRandom(item.num * 10) })))
//     .pipe(filter((item) => item.id % 5 !== 0))
//     // .pipe(delay(1000))
//     .pipe(map((item) => Promise.resolve({ ...item, asyncMap: getRandom(item.normalMap * item.num * 10) })))
//     // .pipe(inspect())
//     .pipe(reduce((res, item) => `${res ? `${res}-` : ''}[${item.id},${item.num},${item.num},${item.normalMap},${item.asyncMap}]`, ""))
//     .pipe(write(console.log))
// .pipe(fork(
//     (stream) => stream
//         .pipe(map((item) => ({ child: 1, ...item })))
//         .pipe(write((chunk) => console.log(chunk))),

//     (stream) => stream
//         .pipe(delay(2000))
//         .pipe(map((item) => ({ child: 2, ...item })))
//         .pipe(write((chunk) => console.log(chunk))),

// ));

// count(10)
//     // .pipe(inspect())
//     .pipe(delay(100))
//     .pipe(fork(
//         (stream) => stream
//             .pipe(reduce((count) => count + 1, 0))
//             .pipe(write(console.log)),

//         (stream) => stream
//             .pipe(reduce((count) => count + 1, 0))
//             .pipe(write(console.log)),
//     ))


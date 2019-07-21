// return a promise that waiting for milliseconds and then resolve
export const wait = (time: number) => new Promise((resolve, reject) => setTimeout(resolve, time))

// log an argument an return it;
export const log = (arg: any) => { console.log(arg); return arg; };

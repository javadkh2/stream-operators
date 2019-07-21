import { read } from "./read";

// create an stream from a list
export const from = (list: Array<any>) => read((times) => list.length > times ? list[times] : null)
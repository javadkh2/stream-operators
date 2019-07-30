import { reduce } from "./reduce";

// reduce stream chunk to a list with special size
export const buffer = (bufferSize: number = Infinity) => reduce((list, item) => list.push(item) && list, () => [], bufferSize);
import { read } from "./read";

// count from 0 to limit
export const count = (limit: number = Infinity) => read((times) => times < limit ? times : null)
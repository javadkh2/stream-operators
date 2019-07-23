import { map } from "./map";
import { wait } from "./utils";

// delay stream helper
export const delay = (time: number) => map((item) => wait(time).then(() => item));
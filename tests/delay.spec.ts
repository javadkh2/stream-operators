import { counter, write, delay } from "../src";

describe("Test `delay` functionality", () => {
    it("should make delay in stream data without changing the data", (done) => {
        const start = Date.now()
        const times: number[] = []
        const wait = 100 //ms
        const writeMock = jest.fn(() => times.push(Date.now()));
        counter(5)
            .pipe(delay(wait))
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[0], [1], [2], [3], [4]]);
                const delays = times.map((time) => Math.round((time - start) / (wait)));
                expect(delays).toEqual([1, 2, 3, 4, 5])
                done()
            })
    }, 30000)
})
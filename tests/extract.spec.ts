import { counter, write, map, from } from "../src";
import { extract } from "../src/lib/extract";

describe("Test `extract` functionality", () => {
    it("should extract items if array chunk", (done) => {
        const writeMock = jest.fn();
        from([[1, 2], [3, 4, 5]])
            .pipe(extract())
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[1], [2], [3], [4], [5]]);
                done()
            })
    })

    it("should return same chunk if the chunk is not an array", (done) => {
        const writeMock = jest.fn();
        from([1,[2,3]])
            .pipe(extract())
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[1], [2], [3]]);
                done()
            })
    })
})
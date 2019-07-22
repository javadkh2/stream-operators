import { count, write, reduce } from "../src";

describe("Test `reduce` functionality", () => {
    it("should create a chunk with sum of all chunks", (done) => {
        const writeMock = jest.fn();
        count(5)
            .pipe(reduce((result, item) => result + item, 0))
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[0 + 1 + 2 + 3 + 4]]);
                done()
            })
    })

    it("should create two chunk with sum of chunks with size 3", (done) => {
        const writeMock = jest.fn();
        count(5)
            .pipe(reduce((result, item) => result + item, 0, 3))
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[0 + 1 + 2], [3 + 4]]);
                done()
            })
    })
})
import { count, write, filter } from "../src";

describe("Test `filter` functionality", () => {
    it("should filter odd numbers in the stream data", (done) => {
        const writeMock = jest.fn();
        count(5)
            .pipe(filter((item) => item % 2 === 0))
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[0], [2], [4]]);
                done()
            })
    })
})
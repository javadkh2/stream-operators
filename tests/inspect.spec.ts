import { count, write, inspect } from "../src";

describe("Test `inspect` functionality", () => {
    it("should log stream chunk to console and return the chunk", (done) => {
        const writeMock = jest.fn();
        const logMock = global.console.log = jest.fn();
        count(5)
            .pipe(inspect())
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[0], [1], [2], [3], [4]]);
                expect(logMock.mock.calls).toEqual([[0], [1], [2], [3], [4]]);
                done()
            })
    })
})
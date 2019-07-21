import { count, write, map } from "../src";

describe("Test `map` functionality", () => {
    it("should map numbers to duplicate in the stream data", (done) => {
        const writeMock = jest.fn();
        count(5)
            .pipe(map((item) => item * 2))
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[0], [2], [4], [6], [8]]);
                done()
            })
    })
})
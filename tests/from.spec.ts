import { from, write } from "../src";

describe("Test `from` functionality", () => {
    it("should create a readStream from input array", (done) => {
        const writeMock = jest.fn();
        from([0, 4, 1, 3, 2])
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[0], [4], [1], [3], [2]]);
                done()
            })
    })
})
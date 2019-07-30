import { counter, write } from "../src";

describe("Test `count` functionality", () => {
    it("should create a readStream with 5 items (0,1,2,3,4)", (done) => {
        const writeMock = jest.fn();
        counter(5)
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[0], [1], [2], [3], [4]]);
                done()
            })
    })
})
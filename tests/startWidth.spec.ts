import { counter, startWith, write, endWith } from "../src";

describe("Test `startWith` functionality", () => {
    it("should add -10 as first chunk", (done) => {
        const writeMock = jest.fn();
        counter(5)
            .pipe(startWith(-10))
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[-10], [0], [1], [2], [3], [4]]);
                done()
            })
    })

})
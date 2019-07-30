import { count, startWith, write, endWith } from "../src";

describe("Test `startWith` functionality", () => {
    it("should add -10 as last chunk", (done) => {
        const writeMock = jest.fn();
        count(5)
            .pipe(endWith(-10))
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[0], [1], [2], [3], [4], [-10]]);
                done()
            })
    })

})
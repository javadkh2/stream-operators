import { count, write, map, from } from "../src";
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
})
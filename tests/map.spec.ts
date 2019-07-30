import { counter, write, map } from "../src";

describe("Test `map` functionality", () => {
    it("should map numbers to duplicate in the stream data", (done) => {
        const writeMock = jest.fn();
        counter(5)
            .pipe(map((item) => item * 2))
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[0], [2], [4], [6], [8]]);
                done()
            })
    })
    it("should fire error event if the map return expectation or Promise.reject", (done) => {
        const writeMock = jest.fn();
        const mapMock = jest.fn(() => Promise.reject("error_message"));
        counter(5)
            .pipe(map(mapMock as any))
            .on("error", (error) => {
                expect(writeMock.mock.calls.length).toEqual(0);
                expect(mapMock.mock.calls.length).toEqual(1);
                expect(error).toBe("error_message");
                done()
            })
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(false).toBeTruthy();
                done()
            })

    })
})
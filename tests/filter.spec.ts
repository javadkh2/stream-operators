import { counter, write, filter } from "../src";

describe("Test `filter` functionality", () => {
    it("should filter odd numbers in the stream data", (done) => {
        const writeMock = jest.fn();
        counter(5)
            .pipe(filter((item) => item % 2 === 0))
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[0], [2], [4]]);
                done()
            })
    })

    it("should fire error event if the filter return expectation or Promise.reject", (done) => {
        const writeMock = jest.fn();
        const FilterMock = jest.fn(() => Promise.reject("error_message"));
        counter(5)
            .pipe(filter(FilterMock as any))
            .on("error", (error) => {
                expect(writeMock.mock.calls.length).toEqual(0);
                expect(FilterMock.mock.calls.length).toEqual(1);
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
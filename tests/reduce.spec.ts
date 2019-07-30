import { counter, write, reduce } from "../src";

describe("Test `reduce` functionality", () => {
    it("should create a chunk with sum of all chunks", (done) => {
        const writeMock = jest.fn();
        counter(5)
            .pipe(reduce((result, item) => result + item, 0))
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[0 + 1 + 2 + 3 + 4]]);
                done()
            })
    })

    it("should create two chunk with sum of chunks with size 3", (done) => {
        const writeMock = jest.fn();
        counter(6)
            .pipe(reduce((result, item) => result + item, () => 0, 3))
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[0 + 1 + 2], [3 + 4 + 5]]);
                done()
            })
    })

    it("should fire error event in case of error od exception", (done) => {
        const writeMock = jest.fn();
        const FilterMock = jest.fn(() => Promise.reject("error_message"));
        counter(5)
            .pipe(reduce(FilterMock as any))
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
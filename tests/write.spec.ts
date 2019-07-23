import { count, write } from "../src";

describe("Test `count` functionality", () => {

    it("should fire finish event id stream in finishing and callback must called 5 times", (done) => {
        const writeMock = jest.fn();
        count(5)
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls.length).toEqual(5);
                done()
            })
    })
    it("should call write callback for each chunk", (done) => {
        const writeMock = jest.fn();
        count(5)
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[0], [1], [2], [3], [4]]);
                done()
            })
    })

    it("should call write callback for each chunk", (done) => {
        const writeMock = jest.fn(() => Promise.reject("error_message"));
        count(5)
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(false).toBeTruthy(); // in case of error finish must not call
                done()
            })
            .on("error", (error) => {
                expect(writeMock.mock.calls.length).toEqual(1);
                expect(error).toBe("error_message");
                done()
            })
    })
})
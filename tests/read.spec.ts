import { counter, write, read, wait } from "../src";

describe("Test `read` functionality", () => {
    it("should create a readStream with 5 items (0,1,2,3,4)", (done) => {
        const writeMock = jest.fn();
        const reader = (size: number) => read((times, bufferSize) => size > times ? times * 2 : null);
        reader(5)
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[0], [2], [4], [6], [8]]);
                done()
            })
    })

    it("should create a readStream with 5 items (0,1,2,3,4) with promise rsult", (done) => {
        const writeMock = jest.fn();
        const reader = (size: number) => read((times, bufferSize) => wait(100).then(() => size > times ? times * 2 : null));
        reader(5)
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[0], [2], [4], [6], [8]]);
                done()
            })
    })

    it("should create a readStream with 5 items (0,1,2,3,4) with promise rsult", (done) => {
        const writeMock = jest.fn();
        const reader = (size: number) => read((times, bufferSize) => wait(100).then(() => size > times ? times * 2 : null));
        reader(5)
            .pipe(write(writeMock))
            .on("finish", () => {
                expect(writeMock.mock.calls).toEqual([[0], [2], [4], [6], [8]]);
                done()
            })
    })

    it("should emit error if the callback function return Promise.reject", (done) => {
        const writeMock = jest.fn();
        const reader = (size: number) => read((times, bufferSize) => Promise.reject("error_message"));
        reader(5)
            .on("error", (e) => {
                expect(writeMock.mock.calls.length).toEqual(0);
                expect(e).toBe("error_message");
                done()
            })
            .pipe(write(writeMock))
    })
})
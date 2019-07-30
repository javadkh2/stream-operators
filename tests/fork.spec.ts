import { counter, write, fork, filter, delay, reduce, inspect } from "../src";

describe("Test `count` functionality", () => {
    it("should fork stream and each fork handle different task", (done) => {
        const writeForkOneMock = jest.fn();
        const writeForkTwoMock = jest.fn();
        counter(5)
            .pipe(fork(
                (stream) => stream
                    .pipe(filter((item) => item % 2 === 0))
                    .pipe(write(writeForkOneMock)),

                (stream) => stream
                    .pipe(filter((item) => item % 2 !== 0))
                    .pipe(write(writeForkTwoMock)),
            ))
            .on("finish", () => {
                expect(writeForkOneMock.mock.calls).toEqual([[0], [2], [4]]);
                expect(writeForkTwoMock.mock.calls).toEqual([[1], [3]]);
                done()
            })
    })

    
})
import { counter, write, fork, filter, delay, reduce, inspect } from "../src";

describe("Test `count` functionality", () => {
    it("should fork stream and each fork handle different task finish event must fire in end of all branches (if branches return writable promise)", (done) => {
        const writeForkOneMock = jest.fn();
        const writeForkTwoMock = jest.fn();
        let finished = 0;
        const finish = () => {
            finished++
            if (finished === 3) {
                done();
            }
        }
        counter(5)
            .pipe(fork(
                (stream) => stream
                    .pipe(filter((item) => item % 2 === 0))
                    .pipe(delay(100))
                    .pipe(write(writeForkOneMock))
                    .on("finish", () => {
                        expect(writeForkOneMock.mock.calls).toEqual([[0], [2], [4]]);
                        finish()
                    }),
                (stream) => stream
                    .pipe(filter((item) => item % 2 !== 0))
                    .pipe(write(writeForkTwoMock))
                    .on("finish", () => {
                        expect(writeForkTwoMock.mock.calls).toEqual([[1], [3]]);
                        finish()
                    }),
            ))
            .on("finish", () => {
                expect(finished).toEqual(2);
                finish();
            })
    })

    it("finish event must call before branch finish event in the function do not return the writable stream", (done) => {
        const writeForkOneMock = jest.fn();
        const writeForkTwoMock = jest.fn();
        let finished = 0;
        const finish = () => {
            finished++
            if (finished === 3) {
                done();
            }
        }
        counter(5)
            .pipe(fork(
                (stream) => {
                    stream
                        .pipe(filter((item) => item % 2 === 0))
                    .pipe(delay(100))
                    .pipe(write(writeForkOneMock))
                    .on("finish", () => {
                        expect(writeForkOneMock.mock.calls).toEqual([[0], [2], [4]]);
                        finish()
                    })
                },
                (stream) => stream
                    .pipe(filter((item) => item % 2 !== 0))
                    .pipe(write(writeForkTwoMock))
                    .on("finish", () => {
                        expect(writeForkTwoMock.mock.calls).toEqual([[1], [3]]);
                        finish()
                    }),
            ))
            .on("finish", () => {
                expect(finished).toEqual(1);
                finish();
            })
    })


})
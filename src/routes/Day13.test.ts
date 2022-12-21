import { compareSides, parseLines } from "./Day13.util";

describe("Day13", () => {
    // it("compareSides simple", () => {
    //     expect(compareSides([1, 1, 3, 1, 1], [1, 1, 5, 1, 1]).correctOrder).toBeTruthy();
    // });

    // // [[1],[2,3,4]] vs [[1],4]

    it("compareSides nested", () => {
        expect(compareSides([1, 1, 3, 1, 1], [1, 1, 5, 1, 1]).correctOrder).toBeTruthy();
        expect(compareSides([[1], [2, 3, 4]], [[1], 4]).correctOrder).toBeTruthy();
        expect(compareSides([9], [[8, 7, 6]]).correctOrder).toBeFalsy();
        expect(compareSides([[4, 4], 4, 4], [[4, 4], 4, 4, 4]).correctOrder).toBeTruthy();
        expect(compareSides([7, 7, 7, 7], [7, 7, 7]).correctOrder).toBeFalsy();
        expect(compareSides([], [3]).correctOrder).toBeTruthy();
        expect(
            compareSides([1, [2, [3, [4, [5, 6, 7]]]], 8, 9], [1, [2, [3, [4, [5, 6, 0]]]], 8, 9]).correctOrder
        ).toBeFalsy();
        expect(compareSides([[[]]], [[]]).correctOrder).toBeFalsy();
    });

    it("compareSides weird", () => {
        expect(compareSides([[], [[], 5]], [[8], [7, 2, 10]]).correctOrder).toBeFalsy();
    });

    // it("parses correct", () => {
    //     const lines =
    //         "[1,1,3,1,1]\n[1,1,5,1,1]\n\n[[1],[2,3,4]]\n[[1],4]\n\n[9]\n[[8,7,6]]\n\n[[4,4],4,4]\n[[4,4],4,4,4]\n\n[7,7,7,7]\n[7,7,7]\n\n[]\n[3]\n\n[[[]]]\n[[]]\n\n[1,[2,[3,[4,[5,6,7]]]],8,9]\n[1,[2,[3,[4,[5,6,0]]]],8,9]";

    //     expect(parseLines(lines.split("\n"))).toStrictEqual({ sumOfIndex: 13, truthies: [1, 2, 4, 6] });
    // });
});

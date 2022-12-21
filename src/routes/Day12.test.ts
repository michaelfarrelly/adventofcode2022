import { findPath, findPaths, getNextCol, makeGrid, printDir } from "./Day12.util";

describe("Day12", () => {
    it("makeGrid", () => {
        expect(printDir(makeGrid(["Sa", "ab"]))).toBe("2v\n>.");
        expect(printDir(makeGrid(["Sabqponm", "abcryxxl", "accszExk", "acctuvwj", "abdefghi"]))).toBe(
            "22vv<<<<\n22vvv<2^\n223v>E^^\n223>>>^^\n2^>>>>>^"
        );

        expect(
            printDir(makeGrid(["Sab", "ccb", "cdd"]), {
                startChar: "S",
                startCharSwap: "`",
                endChar: "d",
                endCharSwap: "d"
            })
        ).toBe(">>v\n2v2\n2dd");
    });
    // it("findPaths", () => {
    //     expect(findPaths(makeGrid(["Sa", "ab"]))).toBe({});
    // });

    it("getNextCol", () => {
        const grid = makeGrid(["Sa", "cb"]);
        expect(getNextCol(grid, { x: 0, y: 0 }, "v")).toStrictEqual({
            dirs: ["."],
            position: { x: 0, y: 1 },
            value: "c"
        });
        expect(getNextCol(grid, { x: 0, y: 0 }, ">")).toStrictEqual({
            dirs: ["v"],
            position: { x: 1, y: 0 },
            value: "a"
        });
        expect(getNextCol(grid, { x: 1, y: 0 }, "v")).toStrictEqual({
            dirs: ["."],
            position: { x: 1, y: 1 },
            value: "b"
        });
        expect(getNextCol(grid, { x: 0, y: 1 }, ">")).toStrictEqual({
            dirs: ["."],
            position: { x: 1, y: 1 },
            value: "b"
        });
        expect(getNextCol(grid, { x: 1, y: 1 }, ".")).toBeUndefined();
    });

    it("findPath", () => {
        expect(
            findPath(
                makeGrid(["Sa", "cb"]),
                { items: [] },
                { x: 0, y: 0 },
                { startChar: "S", endChar: "b", startCharSwap: "`", endCharSwap: "b" }
            )
        ).toStrictEqual([
            {
                "items": [
                    { "dirs": [">"], "position": { "x": 0, "y": 0 }, "value": "S" },
                    { "dirs": ["v"], "position": { "x": 1, "y": 0 }, "value": "a" },
                    { "dirs": ["."], "position": { "x": 1, "y": 1 }, "value": "b" }
                ]
            }
        ]);
    });
    it("findPath bigger", () => {
        expect(
            findPath(
                makeGrid(["Sab", "ccb", "cdd"]),
                { items: [] },
                { x: 0, y: 0 },
                { startChar: "S", endChar: "d", startCharSwap: "`", endCharSwap: "d" }
            )
        ).toStrictEqual([
            {
                "items": [
                    { "dirs": [">"], "position": { "x": 0, "y": 0 }, "value": "S" },
                    { "dirs": [">"], "position": { "x": 1, "y": 0 }, "value": "a" },
                    { "dirs": ["v"], "position": { "x": 2, "y": 0 }, "value": "b" },
                    { "dirs": ["<", "^"], "position": { "x": 2, "y": 1 }, "value": "b" },
                    { "dirs": ["v"], "position": { "x": 1, "y": 1 }, "value": "c" },
                    { "dirs": [">"], "position": { "x": 1, "y": 2 }, "value": "d" }
                ]
            }
        ]);
    });

    // it("findPath shortest to E", () => {
    //     const paths = findPath(
    //         makeGrid(["Sabqponm", "abcryxxl", "accszExk", "acctuvwj", "abdefghi"]),
    //         { items: [] },
    //         { x: 0, y: 0 }
    //     );
    //     expect(paths.length).toStrictEqual(12);

    //     const completePaths = paths
    //         .filter(p => {
    //             return p.items.filter(i => i.value === "E").length === 1;
    //         })
    //         .sort((a, b) => {
    //             return a.items.length - b.items.length;
    //         });

    //     expect(completePaths.length).toStrictEqual(12);
    //     const shortest = completePaths.length > 0 ? completePaths[0].items.length - 1 : -1;
    //     expect(shortest).toStrictEqual(31);
    // });
});

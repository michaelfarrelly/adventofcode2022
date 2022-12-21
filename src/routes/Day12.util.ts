type Direction = "v" | "<" | ">" | "^" | ".";
interface Col {
    value: string;
    position: Position;
    dirs: Direction[];
}
interface Row {
    cols: Col[];
}
class Grid {
    constructor(rows: Row[]) {
        this.rows = rows;
    }

    charAtPosition(position: Position): Col {
        return this.rows[position.y].cols[position.x];
    }

    rows: Row[];
}

interface Position {
    x: number;
    y: number;
}

const defaultStartChar = "S";
const defaultEndChar = "E";

const defaultStartCharSwap = "`";
const defaultEndCharSwap = "{";

interface Options {
    startChar: string;
    endChar: string;
    startCharSwap: string;
    endCharSwap: string;
}

const defaultOptions: Options = {
    startChar: defaultStartChar,
    endChar: defaultEndChar,
    endCharSwap: defaultEndCharSwap,
    startCharSwap: defaultStartCharSwap
};

function charCodeAt(lines: string[], row: number, col: number, options = defaultOptions): number {
    const c =
        lines[row].charAt(col) === options.startChar
            ? options.startCharSwap.charCodeAt(0)
            : lines[row].charAt(col) === options.endChar
            ? options.endCharSwap.charCodeAt(0)
            : lines[row].charCodeAt(col);

    return c;
}

function findDirection(
    value: string,
    lines: string[],
    col: number,
    row: number,
    options = defaultOptions
): Direction[] {
    const dirs: Direction[] = [];
    const left = col - 1;
    const right = col + 1;
    const up = row - 1;
    const down = row + 1;

    const charValue =
        value === options.startChar
            ? options.startCharSwap.charCodeAt(0)
            : value === options.endChar
            ? options.endCharSwap.charCodeAt(0)
            : value.charCodeAt(0);

    const leftCharValue = left > 0 ? charCodeAt(lines, row, left, options) : -1;
    const rightCharValue = right < lines[0].length ? charCodeAt(lines, row, right, options) : -1;
    const upCharValue = up >= 0 ? charCodeAt(lines, up, col, options) : -1;
    const downCharValue = down < lines.length ? charCodeAt(lines, down, col, options) : -1;

    if (leftCharValue >= 0 && (leftCharValue == charValue + 1 || charValue === leftCharValue)) {
        dirs.push("<");
    } else if (rightCharValue >= 0 && (rightCharValue == charValue + 1 || charValue === rightCharValue)) {
        dirs.push(">");
    }
    if (upCharValue >= 0 && (upCharValue == charValue + 1 || charValue === upCharValue)) {
        dirs.push("^");
    }
    if (downCharValue >= 0 && (downCharValue == charValue + 1 || charValue === downCharValue)) {
        dirs.push("v");
    }
    // window.console.log(`value`, value, { charValue, leftCharValue, rightCharValue, upCharValue, downCharValue, dirs });
    if (dirs.length === 0) {
        dirs.push(".");
    }

    return dirs;
}

export function makeGrid(lines: string[], options = defaultOptions): Grid {
    // find the S (pre-a).
    // find the E (z).
    const rows = lines.map((m, rowIndex) => {
        const chars = [...m];
        // window.console.log(m);
        const dirs = chars.map((c, colIndex) => {
            return {
                dirs: findDirection(c, lines, colIndex, rowIndex, options),
                position: { x: colIndex, y: rowIndex },
                value: c
            } as Col;
        });
        return { cols: dirs } as Row;
    });

    return new Grid(rows);
}

export function findByValue(grid: Grid, value: string): Position {
    const foundRowIndex = grid.rows.findIndex(row => {
        const foundColIndex = row.cols.findIndex(col => {
            return col.value === value;
        });
        return foundColIndex >= 0;
    });
    if (foundRowIndex >= 0) {
        const row = grid.rows[foundRowIndex];
        const foundColIndex = row.cols.findIndex(col => {
            return col.value === value;
        });

        window.console.log(`findByValue`, { value, foundRowIndex, foundColIndex, row: grid.rows[foundRowIndex] });
        return { x: foundColIndex, y: foundRowIndex };
    }
    return { x: 0, y: 0 };
}
interface Path {
    items: Col[];
}
export function getNextCol(grid: Grid, position: Position, dir: Direction): Col | undefined {
    switch (dir) {
        case ".":
            return undefined;
        case ">":
            return grid.charAtPosition({ x: position.x + 1, y: position.y });
        case "<":
            return grid.charAtPosition({ x: position.x - 1, y: position.y });
        case "^":
            return grid.charAtPosition({ x: position.x, y: position.y - 1 });
        case "v":
            return grid.charAtPosition({ x: position.x, y: position.y + 1 });
    }
}

export function findPath(grid: Grid, currentPath: Path, currentPosition: Position, options = defaultOptions): Path[] {
    const current = grid.charAtPosition(currentPosition);
    if (currentPath.items.length == 0) {
        currentPath.items.push(current);
    }
    const paths: Path[] = [];

    if (current.value === options.endChar) {
        // end early
        window.console.log("finish");
        // currentPath.items.push(current);
        // window.console.log(`${prefixDebug} findPath`, `end`, defaultEndChar);
        paths.push(currentPath);
        return paths;
    }
    // from start:
    // const currentPosition = nextPosition;
    // const prefixDebug = ">".repeat(currentPath.items.length);

    for (let p = 0; p < current.dirs.length; p++) {
        const nextDir = current.dirs[p];
        // window.console.log(`${prefixDebug} findPath`, current.value, nextDir);

        if (current.value === options.endChar) {
            // end early
            // window.console.log("finish");
            // currentPath.items.push(current);
            // window.console.log(`${prefixDebug} findPath`, `end`, defaultEndChar);
            paths.push(currentPath);
            continue;
        }
        if (nextDir === ".") {
            // paths.push(currentPath);
            // currentPath.items.push(current);
            paths.push(currentPath);
            continue;
        }
        const nextCol = getNextCol(grid, currentPosition, nextDir);
        if (!nextCol) {
            // no more moves
            continue;
        }
        // window.console.log(`findPath`, `next`, { next, current });

        // detect if next.position in is currentPath.items already
        const uniquePosition =
            currentPath.items.filter(i => {
                return i.position.x === nextCol.position.x && i.position.y === nextCol.position.y;
            }).length === 0;

        if (uniquePosition && (nextCol.position.x != current.position.x || nextCol.position.y != current.position.y)) {
            //if (nextCol.dirs.length == 1 && nextCol.dirs[1] === ".") {
            //   // window.console.log(`${prefixDebug} findPath`, `return 1`);
            //  paths.push({ items: [...currentPath.items] });
            // continue;
            //} else {
            // window.console.log(`add `, currentPath.items, nextCol.value);
            const nextPath = findPath(grid, { items: [...currentPath.items, nextCol] }, nextCol.position, options);
            // window.console.log(`${prefixDebug} findPath`, `return 2`, nextPath, [...currentPath.items, nextCol]);
            paths.push(...nextPath);
            continue;
            //}
        }
    }
    // no dirs

    // window.console.log(`${prefixDebug} findPath`, `return 4`);
    return paths;
}

/**
 * Recurse until found E
 */
export function findPaths(grid: Grid, options = defaultOptions): Path[] {
    const start = findByValue(grid, options.startChar);
    return findPath(grid, { items: [grid.charAtPosition(start)] }, start);
}

export function printDir(grid: Grid, options = defaultOptions): string {
    return grid.rows
        .map(r =>
            r.cols
                .map(c =>
                    c.value === options.endChar
                        ? c.value
                        : c.dirs.length == 1
                        ? c.dirs[0].toString()
                        : c.dirs.length.toString()
                )
                .join("")
        )
        .join("\n");
}

export class Model {
    constructor() {
        //
    }
    process(lines: string[]): { result: number; grid: string; dirs: string } {
        const grid = makeGrid(lines);

        window.console.log(printDir(grid));
        // Quick result:        return { result: -1, grid: lines.join("\n"), dirs: printDir(grid) };

        const paths: Path[] = findPaths(grid);
        window.console.log(`paths`, { startPos: findByValue(grid, "S"), endPos: findByValue(grid, "E"), paths });

        // any found the E?
        const completePaths = paths
            .filter(p => {
                return p.items.filter(i => i.value === defaultEndChar).length === 1;
            })
            .sort((a, b) => {
                return a.items.length - b.items.length;
            });

        const shortest = completePaths.length > 0 ? completePaths[0].items.length : -1;
        window.console.log(`completes`, completePaths, shortest);

        return { result: shortest - 1, grid: lines.join("\n"), dirs: printDir(grid) };
    }
}

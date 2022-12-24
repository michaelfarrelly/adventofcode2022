import { useState } from "react";
import "./App.css";
import styles from "./App.module.css";
import React from "react";
import { flatten, sort } from "ramda";
/*

Details: https://adventofcode.com/2022/day/22

*/

type Position = [number, number];

function add(a: Position, b: Position): Position {
    const newA = [...a];

    window.console.log(`add`, a, b);
    newA[0] += b[0];
    newA[1] += b[1];
    return newA as Position;
}

function asVector(d: Direction): Position {
    if (d === "up") {
        return [0, -1];
    }
    if (d === "down") {
        return [0, 1];
    }
    if (d === "left") {
        return [-1, 0];
    }
    // right
    return [1, 0];
}

type ColState = "none" | "free" | "wall";

interface ColStateWithIndex {
    state: ColState;
    x: number;
    y: number;
}

class Map {
    states: ColStateWithIndex[];
    constructor(states: ColStateWithIndex[]) {
        //
        this.states = states;
    }

    getRowDims(pos: Position): { x: { min: number; max: number }; y: { min: number; max: number } } {
        // not quite right.
        const rowItems = this.states.filter(p => p.y == pos[1] && p.state != "none");
        const x_min = sort((a, b) => a.x - b.x, rowItems)[0].x;
        const x_max = sort((a, b) => b.x - a.x, rowItems)[0].x;

        const colItems = this.states.filter(p => p.x == pos[0] && p.state != "none");
        const y_min = sort((a, b) => a.y - b.y, colItems)[0].y;
        const y_max = sort((a, b) => b.y - a.y, colItems)[0].y;
        return {
            x: { min: x_min, max: x_max },
            y: { min: y_min, max: y_max }
        };
    }

    // getColDims(x: number): { min: number; max: number } {
    //     const colItems = this.states.map((r, rowIndex) => {
    //         return r[x];
    //     });
    //     const min = colItems.findIndex(v => v.state != "none");
    //     const max = sort(
    //         (a, b) => {
    //             return b.index - a.index;
    //         },
    //         colItems
    //             .map((v, i) => {
    //                 if (v.state == "none") {
    //                     return { index: i, value: v };
    //                 } else {
    //                     return undefined;
    //                 }
    //             })
    //             .filter(v => v != undefined) as { index: number; value: ColStateWithIndex }[]
    //     );
    //     return { min, max: max.length > 0 ? max[0].index ?? 0 : 0 };
    // }
}

function buildMap(lines: string[]): Map {
    const states = lines.map((row, rowIndex) => {
        const items: ColStateWithIndex[] = [...row].map((s, colIndex) => {
            if (s == "#") {
                return { state: "wall", x: colIndex, y: rowIndex };
            }
            if (s == ".") {
                return { state: "free", x: colIndex, y: rowIndex };
            } else {
                return { state: "none", x: colIndex, y: rowIndex };
            }
        });
        return items;
    });
    // flatten
    const flat = flatten(states);
    const map = new Map(flat);
    return map;
}

class Move {
    constructor(amount: number) {
        this.amount = amount;
    }
    amount: number;
}

type Direction = "right" | "left" | "up" | "down";

type TurnType = "L" | "R";
class Turn {
    constructor(turn: TurnType) {
        this.turn = turn;
    }

    rotate(currentDirection: Direction): Direction {
        if (this.turn === "L") {
            if (currentDirection == "right") {
                return "up";
            }
            if (currentDirection == "left") {
                return "down";
            }
            if (currentDirection == "up") {
                return "left";
            }
            if (currentDirection == "down") {
                return "right";
            }
        } else {
            // R
            if (currentDirection == "right") {
                return "down";
            }
            if (currentDirection == "left") {
                return "up";
            }
            if (currentDirection == "up") {
                return "right";
            }
            if (currentDirection == "down") {
                return "left";
            }
        }
        return currentDirection;
    }

    turn: TurnType;
}

type Instruction = Move | Turn;

function buildInstructions(line: string): Instruction[] {
    // The second half is a description of the path you must follow. It consists of alternating numbers and letters:

    // A number indicates the number of tiles to move in the direction you are facing. If you run into a wall, you stop moving forward and continue with the next instruction.
    // A letter indicates whether to turn 90 degrees clockwise (R) or counterclockwise (L). Turning happens in-place; it does not change your current tile.

    // eg. 10R5L5R10L4R5L5
    const parts =
        line.match(/([0-9]+)|([RL]+)/g)?.map(p => {
            if (p == "L" || p == "R") {
                return new Turn(p);
            } else {
                return new Move(parseInt(p));
            }
        }) ?? [];

    return parts;
}

class Model {
    process(lines: string[]): [number, number, number] {
        // first lines are map,
        // last line is instruction.

        const instructionSpec = lines[lines.length - 1];
        const mapLines = lines.slice(0, lines.length - 2);

        const map = buildMap(mapLines);
        const instructions = buildInstructions(instructionSpec);

        return this.run(map, instructions);
    }

    run(map: Map, instructions: Instruction[]): [number, number, number] {
        const startPositionX = map.states.findIndex(p => p.state == "free" && p.y == 0);
        const startPosition: [number, number] = [startPositionX, 0];
        let direction: Direction = "right";

        let currentPosition: [number, number] = startPosition;

        window.console.log(`instruct`, instructions, map);
        for (const instruction of instructions) {
            if (instruction instanceof Move) {
                // try to move

                window.console.log(`===================================`);
                window.console.log(`moving`, [...currentPosition]);
                const amt = instruction.amount;

                currentPosition = this.nextPosition(currentPosition, map, direction, amt);
                window.console.log(`now at`, [...currentPosition]);
            } else if (instruction instanceof Turn) {
                const oldDir = direction;
                direction = instruction.rotate(direction);
                window.console.log(`===================================`);
                window.console.log(`turn from ${oldDir} to ${direction}`);
            }
        }

        return [...currentPosition, direction == "right" ? 0 : direction == "left" ? 2 : direction == "up" ? 3 : 1];
    }

    nextPosition(startPosition: number[], map: Map, direction: Direction, amount: number): Position {
        const deltaDir = asVector(direction);

        let currPos = [...startPosition] as Position;

        for (let i = 0; i < amount; i++) {
            // check if "free"

            window.console.log(`move ${i}/${amount}`, deltaDir);
            const newPos = add(currPos, deltaDir);
            const dims = map.getRowDims(currPos);

            window.console.log(`[   ]  ->`, newPos, dims);
            if (newPos[1] < dims.y.min) {
                // wrap to same column.

                window.console.log(`[   ] b[y] min`, dims.y);
                newPos[1] = dims.y.max;
            } else if (newPos[1] > dims.y.max) {
                newPos[1] = dims.y.min;
                window.console.log(`[   ] b[y] min`, dims.y);
            }
            if (newPos[0] < dims.x.min) {
                // wrap to same row.
                newPos[0] = dims.x.max;
                window.console.log(`[   ] b[x] max`, dims.x);
            } else if (newPos[0] > dims.x.max) {
                newPos[0] = dims.x.min;
                window.console.log(`[   ] b[x] min`, dims.x);
            }
            const nextState = map.states.find(p => p.x == newPos[0] && p.y == newPos[1]);
            if (nextState?.state === "free") {
                window.console.log(`[   ] available`, newPos);
                currPos = newPos;
            } else if (nextState?.state === "wall") {
                window.console.log(`[   ] found wall`, newPos);
                return currPos;
            } else if (nextState?.state === "none") {
                // wrap to same vector.
                // should I end here?
                window.console.log(`[   ] void`, newPos);
            }
        }

        return currPos;
    }
}

const testData =
    "        ...#\n.#..\n#...\n....\n...#.......#\n........#...\n..#....#....\n..........#.\n...#....\n.....#..\n.#......\n......#.\n\n10R5L5R10L4R5L5";

export function Day22() {
    const [input, setInput] = useState<string>(testData);
    const [result, setResult] = useState<string>("");

    const onRunPart1 = React.useCallback(() => {
        const lines = input.split("\n");
        const result = new Model().process(lines);
        setResult(`Total Score: ${result}\n\n ${1000 * (result[1] + 1) + 4 * (result[0] + 1) + result[2]}`);
    }, [input]);

    const onRunPart2 = React.useCallback(() => {
        const lines = input.split("\n");

        setResult(`Total Score: ${lines}`);
    }, [input]);

    return (
        <>
            <div className="App">
                <h1>Day 22</h1>
            </div>

            <div className={styles.dayGrid}>
                <div className={styles.dayButtons}>
                    <button onClick={onRunPart1}>Run (Part 1)</button>
                    <button onClick={onRunPart2}>Run (Part 2)</button>
                </div>
                <div className={styles.dayInput}>
                    <textarea value={input} rows={10} onChange={e => setInput(e.currentTarget.value)}></textarea>
                </div>
                <div className={styles.dayResult}>
                    <textarea value={result} rows={10}></textarea>
                </div>
            </div>
        </>
    );
}

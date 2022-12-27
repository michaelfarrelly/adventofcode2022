import { useState } from "react";
import "./App.css";
import styles from "./App.module.css";
import React from "react";
import { flatten, sort } from "ramda";
/*

https://adventofcode.com/2022/day/14

*/

class Position {
    copy(next: Position) {
        this.position[0] = next.position[0];
        this.position[1] = next.position[1];
    }
    constructor(position: [number, number] | number[]) {
        this.position = position as [number, number];
    }
    position: [number, number];
}

function position(position: [number, number] | number[]): Position {
    return new Position(position);
}
function add(a: Position, b: Position): Position {
    const newA = position([a.position[0], a.position[1]]);

    // window.console.log(`add`, a.position, b.position);
    newA.position[0] += b.position[0];
    newA.position[1] += b.position[1];
    return newA;
}

function fillLine(a: Position, b: Position): Position[] {
    const items: Position[] = [];

    // "498,4 -> 498,6 -> 496,6\n503,4 -> 502,4 -> 502,9 -> 494,9"
    const deltaX = b.position[0] - a.position[0]; // 498 - 498 = 0,  502 - 494 = 8
    const deltaY = b.position[1] - a.position[1];
    const delta = position([deltaX > 0 ? 1 : deltaX < 0 ? -1 : 0, deltaY > 0 ? 1 : deltaY < 0 ? -1 : 0]);
    const itemCount = Math.abs(deltaX != 0 ? deltaX : deltaY);

    let current = a;
    items.push(current);
    for (let i = 0; i < itemCount; i++) {
        current = add(current, delta);
        items.push(current);
    }

    // window.console.log(`fillLine`, a, b, delta, itemCount, items);
    return items;
}

class Model {
    solidItems: Position[] = [];
    sandItems: Position[] = [];
    bottomY = 0;

    init({ lines, bottomOffset }: { lines: string[]; bottomOffset: number }): void {
        const parsedLines = lines.map(line => {
            // "498,4 -> 498,6 -> 496,6\n503,4 -> 502,4 -> 502,9 -> 494,9"
            return line.split(" -> ").map(p => position(p.split(",").map(p2 => parseInt(p2))));
        });
        // lineParts has array of array of positions.

        window.console.log(`line parts`, parsedLines);
        this.solidItems = flatten(
            parsedLines.map(line => {
                const solids: Position[] = [];
                for (let i = 0; i < line.length - 1; i++) {
                    solids.push(...fillLine(line[i], line[i + 1]));
                }
                return solids;
            })
        );

        this.bottomY =
            this.solidItems.reduce((p, c) => {
                if (c.position[1] > p) {
                    return c.position[1];
                } else {
                    return p;
                }
            }, 0) + bottomOffset; // +2 is for part2
        this.sandItems = [];
    }

    process(lines: string[]): number {
        const pourLocation: Position = position([500, 0]);
        this.init({ lines, bottomOffset: 0 });

        let activeItem: Position = position([500, 0]);
        let itemCount = 0;
        window.console.log(`init`, this.solidItems, this.bottomY);
        let finished = false;

        for (let i = 0; i < 1200; i++) {
            // start item at pourLocation
            window.console.log(`i`, i);
            activeItem = add(pourLocation, position([0, 0]));
            for (let n = 0; n < 200; n++) {
                const nextLocation = add(activeItem, position([0, 1]));
                window.console.log(`m`, n, nextLocation);
                if (this.isSolid(nextLocation)) {
                    // check left or right
                    const nextLocationLeft = add(nextLocation, position([-1, 0]));
                    const nextLocationRight = add(nextLocation, position([1, 0]));
                    if (!this.isSolid(nextLocationLeft)) {
                        activeItem = nextLocationLeft;
                    } else if (!this.isSolid(nextLocationRight)) {
                        activeItem = nextLocationRight;
                    } else {
                        itemCount++;
                        this.sandItems.push(position(activeItem.position));
                        // stop this activeItem.
                        break;
                    }
                } else if (nextLocation.position[1] > this.bottomY) {
                    // stop this activeItem.
                    window.console.log(`finished item `, n);
                    finished = true;
                    break;
                } else {
                    activeItem = nextLocation;
                }
            }

            if (finished) {
                break;
            }
        }

        return itemCount;
    }
    processPart2(lines: string[]): number {
        const pourLocation: Position = position([500, 0]);
        this.init({ lines, bottomOffset: 2 });

        let activeItem: Position = position([500, 0]);
        let itemCount = 0;
        window.console.log(`init`, this.solidItems, this.bottomY);
        let finished = false;

        // for (let i = 0; i < 5000; i++) {
        let i = 1;
        do {
            // start item at pourLocation
            if (i % 100 == 0) {
                window.console.log(`[${i}]`, i);
            }

            activeItem = add(pourLocation, position([0, 0]));
            if (this.isSolid(pourLocation)) {
                finished = true;
                break;
            } else {
                for (let n = 0; n < 200; n++) {
                    const nextLocation = add(activeItem, position([0, 1]));
                    if (this.isSolid(nextLocation)) {
                        // check left or right
                        const nextLocationLeft = add(nextLocation, position([-1, 0]));
                        const nextLocationRight = add(nextLocation, position([1, 0]));
                        if (!this.isSolid(nextLocationLeft)) {
                            activeItem.copy(nextLocationLeft);
                        } else if (!this.isSolid(nextLocationRight)) {
                            activeItem.copy(nextLocationRight);
                        } else {
                            itemCount++;
                            this.sandItems.push(position(activeItem.position));
                            // stop this activeItem.
                            break;
                        }
                    } else if (nextLocation.position[1] == this.bottomY) {
                        // stop this activeItem.
                        itemCount++;
                        this.sandItems.push(position(activeItem.position));

                        break;
                    } else {
                        activeItem.copy(nextLocation);
                    }
                }
            }
            i++;
        } while (!finished);

        return itemCount;
    }
    isSolid(pos: Position): boolean {
        return (
            this.solidItems.filter(p => p.position[0] == pos.position[0] && p.position[1] == pos.position[1]).length >
                0 ||
            this.sandItems.filter(p => p.position[0] == pos.position[0] && p.position[1] == pos.position[1]).length > 0
        );
    }
    isSand(pos: Position): boolean {
        return (
            this.sandItems.filter(p => p.position[0] == pos.position[0] && p.position[1] == pos.position[1]).length > 0
        );
    }
    drawMap(): string {
        let result = `Solid Item count: ${this.solidItems.length}, ${this.sandItems.length}\n\n`;

        const allItems = [...this.solidItems, ...this.sandItems];
        const sortedX = sort((a, b) => a.position[0] - b.position[0], allItems);
        const sortedY = sort((a, b) => a.position[1] - b.position[1], allItems);

        window.console.log(`sorted`, sortedX, sortedY);
        const minX = sortedX[0].position[0];
        const maxX = sortedX[sortedX.length - 1].position[0];
        const minY = sortedY[0].position[1];
        const maxY = sortedY[sortedY.length - 1].position[1];

        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                result += this.isSand(position([x, y])) ? "O" : this.isSolid(position([x, y])) ? "#" : ".";
            }
            result += "\n";
        }

        return result;
    }
}

const testData = "498,4 -> 498,6 -> 496,6\n503,4 -> 502,4 -> 502,9 -> 494,9";

export function Day14() {
    const [input, setInput] = useState<string>(testData);
    const [result, setResult] = useState<string>("");

    const onRunPart1 = React.useCallback(() => {
        const lines = input.split("\n");
        const model = new Model();
        const result = model.process(lines);
        setResult(`Total Score: ${result}\n\n${model.drawMap()}`);
    }, [input]);

    const onRunPart2 = React.useCallback(() => {
        const lines = input.split("\n");
        const model = new Model();
        const result = model.processPart2(lines);
        setResult(`Total Score: ${result}\n\n${model.drawMap()}`);
    }, [input]);

    return (
        <>
            <div className="App">
                <h1>Day 14</h1>
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

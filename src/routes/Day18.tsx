import { useState } from "react";
import "./App.css";
import styles from "./App.module.css";
import React from "react";

/*

Description goes here

*/

class Vertex3 {
    constructor(xs: number[]) {
        this.x = xs[0];
        this.y = xs[1];
        this.z = xs[2];
    }
    x: number;
    y: number;
    z: number;
}

class Box {
    constructor(id: string, vertex: Vertex3) {
        this.id = id;
        this.vertex = vertex;
        this.free = {
            up: true,
            down: true,
            left: true,
            right: true,
            back: true,
            front: true
        };
    }
    id: string;
    vertex: Vertex3;
    free: { up: boolean; down: boolean; left: boolean; right: boolean; back: boolean; front: boolean };
}

class Spatial3 {
    addBoxAtVertex3(vertex: Vertex3) {
        const id = `bbb${this.boxes.length}`;
        this.boxes.push(new Box(id, vertex));
    }
    computeFreeSides(): number {
        let totalFree = 0;
        for (const b of this.boxes) {
            let freeSides = 6;

            const up =
                this.boxes.filter(
                    other =>
                        other.id !== b.id &&
                        other.vertex.y == b.vertex.y + 1 &&
                        other.vertex.x == b.vertex.x &&
                        other.vertex.z == b.vertex.z
                ).length > 0;
            const down =
                this.boxes.filter(
                    other =>
                        other.id !== b.id &&
                        other.vertex.y == b.vertex.y - 1 &&
                        other.vertex.x == b.vertex.x &&
                        other.vertex.z == b.vertex.z
                ).length > 0;
            const left =
                this.boxes.filter(
                    other =>
                        other.id !== b.id &&
                        other.vertex.y == b.vertex.y &&
                        other.vertex.x == b.vertex.x + 1 &&
                        other.vertex.z == b.vertex.z
                ).length > 0;
            const right =
                this.boxes.filter(
                    other =>
                        other.id !== b.id &&
                        other.vertex.y == b.vertex.y &&
                        other.vertex.x == b.vertex.x - 1 &&
                        other.vertex.z == b.vertex.z
                ).length > 0;
            const back =
                this.boxes.filter(
                    other =>
                        other.id !== b.id &&
                        other.vertex.y == b.vertex.y &&
                        other.vertex.x == b.vertex.x &&
                        other.vertex.z == b.vertex.z + 1
                ).length > 0;
            const front =
                this.boxes.filter(
                    other =>
                        other.id !== b.id &&
                        other.vertex.y == b.vertex.y &&
                        other.vertex.x == b.vertex.x &&
                        other.vertex.z == b.vertex.z - 1
                ).length > 0;
            freeSides -= up ? 1 : 0;
            freeSides -= down ? 1 : 0;
            freeSides -= left ? 1 : 0;
            freeSides -= right ? 1 : 0;
            freeSides -= back ? 1 : 0;
            freeSides -= front ? 1 : 0;
            totalFree += freeSides;
        }
        return totalFree;
    }
    computeExteriorFreeSides(): number {
        let totalFree = 0;

        const minX = this.boxes.reduce((prev, curr) => {
            return Math.min(curr.vertex.x, prev);
        }, 1000);
        const maxX = this.boxes.reduce((prev, curr) => {
            return Math.max(curr.vertex.x, prev);
        }, 0);
        const minY = this.boxes.reduce((prev, curr) => {
            return Math.min(curr.vertex.y, prev);
        }, 1000);
        const maxY = this.boxes.reduce((prev, curr) => {
            return Math.max(curr.vertex.y, prev);
        }, 0);
        const minZ = this.boxes.reduce((prev, curr) => {
            return Math.min(curr.vertex.z, prev);
        }, 1000);
        const maxZ = this.boxes.reduce((prev, curr) => {
            return Math.max(curr.vertex.z, prev);
        }, 0);

        for (const b of this.boxes) {
            let freeSides = 6;
            const up =
                this.boxes.filter(
                    other =>
                        other.id !== b.id &&
                        other.vertex.y == b.vertex.y + 1 &&
                        other.vertex.x == b.vertex.x &&
                        other.vertex.z == b.vertex.z
                ).length > 0;
            const down =
                this.boxes.filter(
                    other =>
                        other.id !== b.id &&
                        other.vertex.y == b.vertex.y - 1 &&
                        other.vertex.x == b.vertex.x &&
                        other.vertex.z == b.vertex.z
                ).length > 0;
            const left =
                this.boxes.filter(
                    other =>
                        other.id !== b.id &&
                        other.vertex.y == b.vertex.y &&
                        other.vertex.x == b.vertex.x + 1 &&
                        other.vertex.z == b.vertex.z
                ).length > 0;
            const right =
                this.boxes.filter(
                    other =>
                        other.id !== b.id &&
                        other.vertex.y == b.vertex.y &&
                        other.vertex.x == b.vertex.x - 1 &&
                        other.vertex.z == b.vertex.z
                ).length > 0;
            const back =
                this.boxes.filter(
                    other =>
                        other.id !== b.id &&
                        other.vertex.y == b.vertex.y &&
                        other.vertex.x == b.vertex.x &&
                        other.vertex.z == b.vertex.z + 1
                ).length > 0;
            const front =
                this.boxes.filter(
                    other =>
                        other.id !== b.id &&
                        other.vertex.y == b.vertex.y &&
                        other.vertex.x == b.vertex.x &&
                        other.vertex.z == b.vertex.z - 1
                ).length > 0;
            freeSides -= up ? 1 : 0;
            freeSides -= down ? 1 : 0;
            freeSides -= left ? 1 : 0;
            freeSides -= right ? 1 : 0;
            freeSides -= back ? 1 : 0;
            freeSides -= front ? 1 : 0;
            b.free = { up, down, left, right, back, front };
            totalFree += freeSides;
        }
        window.console.log(`minmax`, { minX, maxX, minY, maxY, minZ, maxZ }, { bbb: this.boxes });
        // find internal holes.

        for (let x = minX; x < maxX; x++) {
            for (let y = minY; y < maxY; y++) {
                for (let z = minZ; z < maxZ; z++) {
                    // box at?
                    const isBoxAt =
                        this.boxes.filter(b => {
                            return b.vertex.x == x && b.vertex.y == y && b.vertex.z == z;
                        }).length === 1;
                    if (!isBoxAt) {
                        // is internal to other boxes?
                        const up =
                            this.boxes.filter(
                                other => other.vertex.y == y + 1 && other.vertex.x == x && other.vertex.z == z
                            ).length > 0;
                        const down =
                            this.boxes.filter(
                                other => other.vertex.y == y - 1 && other.vertex.x == x && other.vertex.z == z
                            ).length > 0;
                        const left =
                            this.boxes.filter(
                                other => other.vertex.y == y && other.vertex.x == x + 1 && other.vertex.z == z
                            ).length > 0;
                        const right =
                            this.boxes.filter(
                                other => other.vertex.y == y && other.vertex.x == x - 1 && other.vertex.z == z
                            ).length > 0;
                        const back =
                            this.boxes.filter(
                                other => other.vertex.y == y && other.vertex.x == x && other.vertex.z == z + 1
                            ).length > 0;
                        const front =
                            this.boxes.filter(
                                other => other.vertex.y == y && other.vertex.x == x && other.vertex.z == z - 1
                            ).length > 0;
                        if (front && back && up && down && left && right) {
                            totalFree -= 6;
                        }
                    }
                }
            }
        }

        return totalFree;
    }
    boxes: Box[] = [];
}

class Model {
    constructor() {
        //
    }
    process(lines: string[]): number {
        const vertex = lines.map(l => {
            return new Vertex3(l.split(",").map(p => parseInt(p)));
        });

        const spatial = new Spatial3();

        for (const v of vertex) {
            spatial.addBoxAtVertex3(v);
        }
        window.console.log(vertex);
        window.console.log(spatial);
        return spatial.computeFreeSides();
    }
    processPart2(lines: string[]): number {
        const vertex = lines.map(l => {
            return new Vertex3(l.split(",").map(p => parseInt(p)));
        });

        const spatial = new Spatial3();

        for (const v of vertex) {
            spatial.addBoxAtVertex3(v);
        }
        window.console.log(vertex);
        window.console.log(spatial);
        return spatial.computeExteriorFreeSides();
    }
}

const testData = "2,2,2\n1,2,2\n3,2,2\n2,1,2\n2,3,2\n2,2,1\n2,2,3\n2,2,4\n2,2,6\n1,2,5\n3,2,5\n2,1,5\n2,3,5";

export function Day18() {
    const [input, setInput] = useState<string>(testData);
    const [result, setResult] = useState<string>("");

    const onRunPart1 = React.useCallback(() => {
        const lines = input.split("\n");
        const result = new Model().process(lines);
        setResult(`Total Score: ${result}`);
    }, [input]);

    const onRunPart2 = React.useCallback(() => {
        const lines = input.split("\n");
        const result = new Model().processPart2(lines);

        setResult(`Total Score: ${result}`);
    }, [input]);

    return (
        <>
            <div className="App">
                <h1>Day 18</h1>
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

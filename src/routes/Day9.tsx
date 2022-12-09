import { useState } from "react";
import "./App.css";
import styles from "./App.module.css";
import React from "react";
/*

--- Day 9: Rope Bridge ---

This rope bridge creaks as you walk along it. You aren't sure how old it is, or whether it can even support your weight.

It seems to support the Elves just fine, though. The bridge spans a gorge which was carved out by the massive river far below you.

You step carefully; as you do, the ropes stretch and twist. You decide to distract yourself by modeling rope physics; maybe you can even figure out where not to step.

Consider a rope with a knot at each end; these knots mark the head and the tail of the rope. If the head moves far enough away from the tail, the tail is pulled toward the head.

Due to nebulous reasoning involving Planck lengths, you should be able to model the positions of the knots on a two-dimensional grid. Then, by following a hypothetical series of motions (your puzzle input) for the head, you can determine how the tail will move.

Due to the aforementioned Planck lengths, the rope must be quite short; in fact, the head (H) and tail (T) must always be touching (diagonally adjacent and even overlapping both count as touching):

....
.TH.
....

....
.H..
..T.
....

...
.H. (H covers T)
...

If the head is ever two steps directly up, down, left, or right from the tail, the tail must also move one step in that direction so it remains close enough:

.....    .....    .....
.TH.. -> .T.H. -> ..TH.
.....    .....    .....

...    ...    ...
.T.    .T.    ...
.H. -> ... -> .T.
...    .H.    .H.
...    ...    ...

Otherwise, if the head and tail aren't touching and aren't in the same row or column, the tail always moves one step diagonally to keep up:

.....    .....    .....
.....    ..H..    ..H..
..H.. -> ..... -> ..T..
.T...    .T...    .....
.....    .....    .....

.....    .....    .....
.....    .....    .....
..H.. -> ...H. -> ..TH.
.T...    .T...    .....
.....    .....    .....

You just need to work out where the tail goes as the head follows a series of motions. Assume the head and the tail both start at the same position, overlapping.

For example:

R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2

This series of motions moves the head right four steps, then up four steps, then left three steps, then down one step, and so on. After each step, you'll need to update the position of the tail if the step means the head is no longer adjacent to the tail. Visually, these motions occur as follows (s marks the starting position as a reference point):

== Initial State ==

......
......
......
......
H.....  (H covers T, s)

== R 4 ==

......
......
......
......
TH....  (T covers s)

......
......
......
......
sTH...

......
......
......
......
s.TH..

......
......
......
......
s..TH.

== U 4 ==

......
......
......
....H.
s..T..

......
......
....H.
....T.
s.....

......
....H.
....T.
......
s.....

....H.
....T.
......
......
s.....

== L 3 ==

...H..
....T.
......
......
s.....

..HT..
......
......
......
s.....

.HT...
......
......
......
s.....

== D 1 ==

..T...
.H....
......
......
s.....

== R 4 ==

..T...
..H...
......
......
s.....

..T...
...H..
......
......
s.....

......
...TH.
......
......
s.....

......
....TH
......
......
s.....

== D 1 ==

......
....T.
.....H
......
s.....

== L 5 ==

......
....T.
....H.
......
s.....

......
....T.
...H..
......
s.....

......
......
..HT..
......
s.....

......
......
.HT...
......
s.....

......
......
HT....
......
s.....

== R 2 ==

......
......
.H....  (H covers T)
......
s.....

......
......
.TH...
......
s.....

After simulating the rope, you can count up all of the positions the tail visited at least once. In this diagram, s again marks the starting position (which the tail also visited) and # marks other positions the tail visited:

..##..
...##.
.####.
....#.
s###..

So, there are 13 positions the tail visited at least once.

Simulate your complete hypothetical series of motions. How many positions does the tail of the rope visit at least once?


*/

class Position {
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    from(values: [number, number]) {
        this.x = values[0];
        this.y = values[1];
    }
    x: number;
    y: number;
}

function position(values: [number, number] | Position): Position {
    if (values instanceof Position) {
        return new Position(values.x, values.y);
    }
    return new Position(values[0], values[1]);
}

// function position(pos: Position): Position {
//     return new Position(pos.x, pos.y);
// }

class Rope {
    constructor() {
        this.head = position([0, 0]);
        this.tail = position([0, 0]);
    }
    move(next: string): { head: Position[]; tail: Position[] } {
        const [direction, stringQty] = next.split(" ");
        const qty = parseInt(stringQty);
        const tailDistance = 1;

        const nextPositions: { head: Position[]; tail: Position[] } = { head: [], tail: [] };

        if (direction === "R") {
            for (let i = 0; i < qty; i++) {
                this.head.x = this.head.x + 1;
                nextPositions.head.push(position(this.head));
                nextPositions.tail.push(position(this.updateTail(tailDistance)));
            }
        }
        if (direction === "L") {
            for (let i = 0; i < qty; i++) {
                this.head.x = this.head.x - 1;
                nextPositions.head.push(position(this.head));
                nextPositions.tail.push(position(this.updateTail(tailDistance)));
            }
        }
        if (direction === "U") {
            for (let i = 0; i < qty; i++) {
                this.head.y = this.head.y + 1;
                nextPositions.head.push(position(this.head));
                nextPositions.tail.push(position(this.updateTail(tailDistance)));
            }
        }
        if (direction === "D") {
            for (let i = 0; i < qty; i++) {
                this.head.y = this.head.y - 1;
                nextPositions.head.push(position(this.head));
                nextPositions.tail.push(position(this.updateTail(tailDistance)));
            }
        }

        return nextPositions;
    }
    updateTail(distanceAllowed: number): Position {
        // same line
        if (this.head.y === this.tail.y) {
            // same row
            const dirAmount = this.head.x - this.tail.x;
            if (Math.abs(dirAmount) > distanceAllowed) {
                // move
                this.tail.x = this.tail.x + (dirAmount > 0 ? 1 : -1);
                return position([this.tail.x, this.tail.y]);
            }
        } else if (this.head.x === this.tail.x) {
            // same column
            const dirAmount = this.head.y - this.tail.y;
            if (Math.abs(dirAmount) > distanceAllowed) {
                // move
                this.tail.y = this.tail.y + (dirAmount > 0 ? 1 : -1);
                return position([this.tail.x, this.tail.y]);
            }
        } else {
            // diagonal:
            const dirAmountY = this.head.y - this.tail.y;
            const dirAmountX = this.head.x - this.tail.x;
            if (Math.abs(dirAmountY) > distanceAllowed && Math.abs(dirAmountX) <= distanceAllowed) {
                // move
                this.tail.y = this.tail.y + (dirAmountY > 0 ? 1 : -1);
                this.tail.x = this.tail.x + (dirAmountX > 0 ? 1 : -1);
                return position([this.tail.x, this.tail.y]);
            } else if (Math.abs(dirAmountX) > distanceAllowed && Math.abs(dirAmountY) <= distanceAllowed) {
                // move
                this.tail.y = this.tail.y + (dirAmountY > 0 ? 1 : -1);
                this.tail.x = this.tail.x + (dirAmountX > 0 ? 1 : -1);
                return position([this.tail.x, this.tail.y]);
            }
        }
        return position([this.tail.x, this.tail.y]);
    }
    head: Position;
    tail: Position;
}

class RopePart2 {
    constructor(size: number) {
        this.knots = [];
        for (let i = 0; i < size; i++) {
            this.knots.push(position([9, 6]));
        }
    }
    move(next: string): { head: Position[]; tail: Position[]; drawModel: string } {
        const [direction, stringQty] = next.split(" ");
        const qty = parseInt(stringQty);
        const tailDistance = 1;
        const knotsLength = this.knots.length;

        const nextPositions: { head: Position[]; tail: Position[]; drawModel: string } = {
            head: [],
            tail: [],
            drawModel: ""
        };
        // window.console.log(`d `, direction, qty);
        if (direction === "R") {
            for (let i = 0; i < qty; i++) {
                this.knots[0] = position([this.knots[0].x + 1, this.knots[0].y]);
                nextPositions.head.push(position(this.knots[0]));
                this.updateAllTails(knotsLength, tailDistance);
                nextPositions.tail.push(position(this.knots[knotsLength - 1]));
            }
        }
        if (direction === "L") {
            for (let i = 0; i < qty; i++) {
                this.knots[0] = position([this.knots[0].x - 1, this.knots[0].y]);
                nextPositions.head.push(position(this.knots[0]));
                this.updateAllTails(knotsLength, tailDistance);
                nextPositions.tail.push(position(this.knots[knotsLength - 1]));
            }
        }
        if (direction === "U") {
            for (let i = 0; i < qty; i++) {
                this.knots[0] = position([this.knots[0].x, this.knots[0].y - 1]);
                nextPositions.head.push(position(this.knots[0]));
                this.updateAllTails(knotsLength, tailDistance);
                nextPositions.tail.push(position(this.knots[knotsLength - 1]));
            }
        }
        if (direction === "D") {
            for (let i = 0; i < qty; i++) {
                this.knots[0] = position([this.knots[0].x, this.knots[0].y + 1]);
                nextPositions.head.push(position(this.knots[0]));
                this.updateAllTails(knotsLength, tailDistance);
                nextPositions.tail.push(position(this.knots[knotsLength - 1]));
            }
        }

        nextPositions.drawModel = drawModel(this.knots);

        return nextPositions;
    }

    updateAllTails(knotsLength: number, tailDistance: number): void {
        // window.console.log(`updating ks`);
        for (let j = 1; j < knotsLength; j++) {
            const next = this.updateTail(tailDistance, this.knots[j - 1], this.knots[j]);
            // window.console.log(`updating k`, j, position(this.knots[j]), next);
            this.knots[j] = next;
        }
    }

    updateTail(distanceAllowed: number, head1: Position, curr1: Position): Position {
        const head = position(head1);
        const curr = position(curr1);
        if (head.y === curr.y) {
            // same row
            const dirAmount = head.x - curr.x;
            if (Math.abs(dirAmount) > distanceAllowed) {
                // move
                curr.x = curr.x + (dirAmount > 0 ? 1 : -1);
                return position([curr.x, curr.y]);
            }
        } else if (head.x === curr.x) {
            // same column
            const dirAmount = head.y - curr.y;
            if (Math.abs(dirAmount) > distanceAllowed) {
                // move
                curr.y = curr.y + (dirAmount > 0 ? 1 : -1);
                return position([curr.x, curr.y]);
            }
        } else {
            // diagonal:
            const dirAmountY = head.y - curr.y;
            const dirAmountX = head.x - curr.x;
            if (Math.abs(dirAmountY) > distanceAllowed || Math.abs(dirAmountX) > distanceAllowed) {
                // move
                curr.y = curr.y + (dirAmountY > 0 ? 1 : -1);
                curr.x = curr.x + (dirAmountX > 0 ? 1 : -1);
                return position([curr.x, curr.y]);
            }
        }
        return curr;
    }
    // updateTail2(distanceAllowed: number, knot: Position): Position {
    //     // window.console.log(`[   t] update tails`);
    //     for (let i = 1; i < this.knots.length; i++) {
    //         // knots 2 -> n
    //         const head = position(this.knots[i - 1]); // prev node
    //         const curr = position(this.knots[i]); // this node
    //         // if (i === this.knots.length - 1) {
    //         //     window.console.log(`[  e] at tail...`, head, curr);
    //         // }

    //         // window.console.log(`[   K]> ${i}`, head, curr);
    //         if (head.y === curr.y) {
    //             // same row
    //             const dirAmount = head.x - curr.x;
    //             if (Math.abs(dirAmount) > distanceAllowed) {
    //                 // move
    //                 curr.x = curr.x + (dirAmount > 0 ? 1 : -1);
    //                 this.knots[i] = position([curr.x, curr.y]);
    //             }
    //         } else if (head.x === curr.x) {
    //             // same column
    //             const dirAmount = head.y - curr.y;
    //             if (Math.abs(dirAmount) > distanceAllowed) {
    //                 // move
    //                 curr.y = curr.y + (dirAmount > 0 ? 1 : -1);
    //                 this.knots[i] = position([curr.x, curr.y]);
    //             }
    //         } else {
    //             // diagonal:
    //             const dirAmountY = head.y - curr.y;
    //             const dirAmountX = head.x - curr.x;
    //             if (Math.abs(dirAmountY) > distanceAllowed && Math.abs(dirAmountX) <= distanceAllowed) {
    //                 // move
    //                 curr.y = curr.y + (dirAmountY > 0 ? 1 : -1);
    //                 curr.x = curr.x + (dirAmountX > 0 ? 1 : -1);
    //                 this.knots[i] = position([curr.x, curr.y]);
    //             } else if (Math.abs(dirAmountX) > distanceAllowed && Math.abs(dirAmountY) <= distanceAllowed) {
    //                 // move
    //                 curr.y = curr.y + (dirAmountY > 0 ? 1 : -1);
    //                 curr.x = curr.x + (dirAmountX > 0 ? 1 : -1);
    //                 this.knots[i] = position([curr.x, curr.y]);
    //             }
    //         }

    //         // window.console.log(`[   k]> ${i}`, this.knots[i]);
    //     }

    //     const tailNode = this.knots[this.knots.length - 1];
    //     return position([tailNode.x, tailNode.y]);
    // }
    // head: Position;
    knots: Position[];
}

function uniqueValues(items: Position[]): Position[] {
    return items.reduce((prev: Position[], curr) => {
        if (prev.length === 0) {
            return [curr];
        } else if (prev.filter(p => p.x === curr.x && p.y === curr.y).length === 0) {
            return [...prev, curr];
        }
        return prev;
    }, []);
}

class Model {
    constructor() {}
    runMoves(lines: string[]): { heads: Position[]; tails: Position[] } {
        const rope = new Rope();
        const positions: { heads: Position[]; tails: Position[] } = { heads: [], tails: [] };
        lines.map(l => {
            //window.console.log(`move`, l);
            const { head, tail } = rope.move(l);
            positions.heads.push(...head);
            positions.tails.push(...tail);
            //window.console.log(`result step`, { ...positions });
        });

        return positions;
    }
    runMovesPart2(
        lines: string[],
        length: number = 10
    ): { heads: Position[]; tails: Position[]; drawStates: string[] } {
        const rope2 = new RopePart2(length);
        const positions: { heads: Position[]; tails: Position[]; drawStates: string[] } = {
            heads: [],
            tails: [],
            drawStates: []
        };
        lines.map(l => {
            const { head, tail, drawModel } = rope2.move(l);
            positions.heads.push(...head);
            positions.tails.push(...tail);
            positions.drawStates.push(drawModel);
        });
        const uniquePositions = uniqueValues(positions.tails);
        return { heads: positions.heads, tails: uniquePositions, drawStates: positions.drawStates };
    }
}

function explode(a: number, b: number): number[] {
    const items: number[] = [];
    for (let i = a; i <= b; i++) {
        items.push(i);
    }
    return items;
}

function drawModel(knots: Position[]): string {
    const mins = knots.reduce(
        (prev, curr) => {
            const x = Math.min(prev.x, curr.x);
            const y = Math.min(prev.y, curr.y);
            return { x: x, y: y };
        },
        { x: 1000, y: 1000 }
    );

    const maxs = knots.reduce(
        (prev, curr) => {
            const x = Math.max(prev.x, curr.x);
            const y = Math.max(prev.y, curr.y);
            return { x: x, y: y };
        },
        { x: -1000, y: -1000 }
    );

    const offset = 5;
    const gridSize = { x: Math.max(19, maxs.x - mins.x) + offset, y: Math.max(10, maxs.y - mins.y) + offset };

    const rows = explode(0, gridSize.y);
    const trail = rows.map(_r => {
        return explode(0, gridSize.x).map<string>(_e => ".");
    });

    for (let i = 0; i < knots.length; i++) {
        const p = knots[i];
        // edit trail at position
        const currentValue = trail[p.y - mins.y + offset][p.x - mins.x + offset];
        trail[p.y - mins.y + offset][p.x - mins.x + offset] = currentValue === "." ? `${i}` : "x";
    }
    // window.console.log(`knots`, knots);

    return trail.map(line => line.join("")).join("\n");
}
function drawTrail(tails: Position[]): string {
    const mins = tails.reduce(
        (prev, curr) => {
            const x = Math.min(prev.x, curr.x);
            const y = Math.min(prev.y, curr.y);
            return { x: x, y: y };
        },
        { x: 1000, y: 1000 }
    );

    const maxs = tails.reduce(
        (prev, curr) => {
            const x = Math.max(prev.x, curr.x);
            const y = Math.max(prev.y, curr.y);
            return { x: x, y: y };
        },
        { x: -1000, y: -1000 }
    );

    const offset = 5;
    const gridSize = { x: Math.max(19, maxs.x - mins.x) + offset, y: Math.max(10, maxs.y - mins.y) + offset };

    const rows = explode(0, gridSize.y);
    const trail = rows.map(_r => {
        return explode(0, gridSize.x).map(_e => ".");
    });

    for (const p of tails) {
        // edit trail at position
        trail[p.y - mins.y + offset][p.x - mins.x + offset] = "#";
    }

    return trail.map(line => line.join("")).join("\n");
}

const testData = "R 4\nU 4\nL 3\nD 1\nR 4\nD 1\nL 5\nR 2";

export function Day9() {
    const [input, setInput] = useState<string>(testData);
    const [result, setResult] = useState<string>("");

    const onRunPart1 = React.useCallback(() => {
        const lines = input.split("\n");
        const model = new Model();
        const result = model.runMoves(lines);
        window.console.log(result);
        const positions: Position[] = [];
        const uniquePositions = result.tails.reduce((prev, curr) => {
            if (prev.length === 0) {
                return [curr];
            } else if (prev.filter(p => p.x === curr.x && p.y === curr.y).length === 0) {
                return [...prev, curr];
            }
            return prev;
        }, positions);
        setResult(`Total Score: ${uniquePositions.length}`);
    }, [input]);

    const onRunPart2 = React.useCallback(() => {
        const lines = input.split("\n");
        const model = new Model();
        const result = model.runMovesPart2(lines);
        window.console.log(result);
        const positions: Position[] = [];
        const uniquePositions = result.tails;
        setResult(
            `Total Score: ${uniquePositions.length}\nTails:\n${drawTrail(result.tails)}\nHeads:\n${drawTrail(
                result.heads
            )}`
        );
        // \nDrawStates:\n${result.drawStates.map((d, i) => `State[${i}]:\n${d}\n`)}
    }, [input]);

    return (
        <>
            <div className="App">
                <h1>Day 9</h1>
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

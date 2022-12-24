import { useState } from "react";
import "./App.css";
import styles from "./App.module.css";
import React from "react";
import { sort } from "ramda";
/*

Description goes here

*/

class Valve {
    outputSpec: string[];
    name: string;
    rate: number;
    linkOutputs: Valve[];
    opened: boolean;
    constructor(name: string, rate: number, outputs: string[]) {
        this.name = name;
        this.rate = rate;
        this.outputSpec = outputs;
        this.linkOutputs = [];
        this.opened = false;
    }
}

class Model {
    valves: Valve[] = [];
    nextTarget: string | undefined;
    setNextTarget(): void {
        const nextTargets: Valve[] = sort(
            (a, b) => b.rate - a.rate,
            this.valves.filter(v => v.opened === false)
        );
        this.nextTarget = nextTargets[0].name;
    }
    run(): number {
        // const tree = new ValveTree();
        for (const v of this.valves) {
            for (const o of v.outputSpec) {
                const foundValve = this.valves.find(y => {
                    return y.name == o;
                });
                if (foundValve) {
                    v.linkOutputs.push(foundValve);
                }
            }
        }
        window.console.log(`tree`, this.valves);

        const results: { startValve: Valve; totalRate: number }[] = [];
        for (const startValve of this.valves) {
            let ticks = 30;
            window.console.log(`=====================`);
            window.console.log(startValve.name);
            window.console.log(`=====================`);
            let position: Valve | undefined = undefined;
            let totalRate = 0;
            const lastPosition: string[] = [];
            // let nextTarget: string | undefined = undefined;
            resetValves(this.valves);
            do {
                // window.console.log(`ticks`, ticks);

                // move or open
                // first move is not at a valve, must move.
                if (position == undefined) {
                    position = startValve;
                    window.console.log(`t`, ticks, `move to`, position);
                } else if (position.opened || position.name != this.nextTarget) {
                    // move to an unopend valve
                    if (this.nextTarget == undefined) {
                        this.setNextTarget();
                    }

                    // move towards nextTarget
                    // find shortest path. move 1 toward it.

                    const nextInShortest = findShortedPathTo(position, this.valves, this.nextTarget);

                    if (nextInShortest.next == undefined) {
                        window.console.log(`no path to `, this.nextTarget);
                    }
                    // const unopened: Valve[] = sort(
                    //     (a, b) => b.rate - a.rate,
                    //     position.linkOutputs.filter(v => v.opened === false && !lastPosition.includes(v.name))
                    // );
                    const unopened: Valve[] = position.linkOutputs.filter(o => o.name == nextInShortest.next);
                    if (unopened.length > 0) {
                        position = unopened[0];
                        window.console.log(`t`, ticks, `move to`, position);
                    } else {
                        window.console.log(`t`, ticks, `nothing to move to MNA`);
                    }
                } else if (position.name == this.nextTarget) {
                    window.console.log(`t`, ticks, `opened to`, position.name);
                    position.opened = true;
                } else {
                    // move
                    if (!position.opened) {
                        if (position.rate > 10 || this.valves.every(v => !v.opened && v.rate <= 10)) {
                            window.console.log(`t`, ticks, `opened to`, position.name);
                            position.opened = true;
                        } else {
                            // move to higher volume.
                            const unopened: Valve[] = sort(
                                (a, b) => b.rate - a.rate,
                                position.linkOutputs.filter(v => v.opened === false && !lastPosition.includes(v.name))
                            );
                            if (unopened.length > 0) {
                                position = unopened[0];
                                window.console.log(`t`, ticks, `move to`, position);
                            } else {
                                window.console.log(`t`, ticks, `nothing to move to XDA`);
                            }
                        }
                    } else {
                        window.console.log(`t`, ticks, `nothing`, position.name);
                    }
                }
                const opened = this.valves.filter(v => v.opened === true);
                const roundRate = opened
                    .map(f => f.rate)
                    .reduce((p, c) => {
                        return p + c;
                    }, 0);
                totalRate += roundRate;
                window.console.log(`  \\ `, opened, roundRate, totalRate);
                lastPosition.push(position.name);
                ticks--;
            } while (ticks > 0);
            results.push({ startValve, totalRate });
        }
        const sortedResult = sort((a, b) => b.totalRate - a.totalRate, results);
        window.console.log(sortedResult);
        return sortedResult[0].totalRate;
    }
    process(inputs: string[]): number {
        const valves = inputs.map(l => {
            const parts = l.split(" ");
            const name = parts[1];
            const rateTemp = parts[4].split("=")[1];
            const rate = parseInt(rateTemp.substring(0, rateTemp.length - 1));

            const indexOfValves = l.indexOf("valves");
            const outputs = l
                .substring(indexOfValves + 6)
                .split(",")
                .map(v => v.trim());

            return new Valve(name, rate, outputs);
        });

        this.valves = valves;
        return this.run();
    }
}

const testData =
    "Valve AA has flow rate=0; tunnels lead to valves DD, II, BB\nValve BB has flow rate=13; tunnels lead to valves CC, AA\nValve CC has flow rate=2; tunnels lead to valves DD, BB\nValve DD has flow rate=20; tunnels lead to valves CC, AA, EE\nValve EE has flow rate=3; tunnels lead to valves FF, DD\nValve FF has flow rate=0; tunnels lead to valves EE, GG\nValve GG has flow rate=0; tunnels lead to valves FF, HH\nValve HH has flow rate=22; tunnel leads to valve GG\nValve II has flow rate=0; tunnels lead to valves AA, JJ\nValve JJ has flow rate=21; tunnel leads to valve II";

export function Day16() {
    const [input, setInput] = useState<string>(testData);
    const [result, setResult] = useState<string>("");

    const onRunPart1 = React.useCallback(() => {
        const lines = input.split("\n");

        const result = new Model().process(lines);
        setResult(`Total Score: ${result}`);
    }, [input]);

    const onRunPart2 = React.useCallback(() => {
        const lines = input.split("\n");

        setResult(`Total Score: ${lines}`);
    }, [input]);

    return (
        <>
            <div className="App">
                <h1>Day 16</h1>
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

function resetValves(valves: Valve[]) {
    for (const v of valves) {
        v.opened = false;
    }
}

function findShortedPathTo(
    position: Valve,
    valves: Valve[],
    nextTarget: string | undefined,
    depth = 1
): { next: string | undefined; depth: number } {
    const isDirect = position.linkOutputs.filter(o => o.name === nextTarget);
    if (depth > 30) {
        return { next: undefined, depth: 30 };
    }
    if (isDirect.length > 0) {
        // this is the shortest path
        window.console.log(`shortestPath to ${nextTarget} [direct]`, isDirect[0].name);
        return { next: isDirect[0].name, depth: 1 };
    } else {
        const results: { next: string; depth: number }[] = [];
        for (const o of position.linkOutputs) {
            window.console.log(`shortestPath to ${nextTarget}`, o.name);
            const r = findShortedPathTo(o, valves, nextTarget, depth + 1);
            results.push({ next: o.name, depth: r.depth });
        }
        const sorted = sort((a, b) => a.depth - b.depth, results);
        return sorted.length > 0 ? sorted[0] : { next: undefined, depth: 30 };
    }
}

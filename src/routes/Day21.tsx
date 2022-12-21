import { useState } from "react";
import "./App.css";
import styles from "./App.module.css";
import React from "react";
/*

Description goes here

*/

class Monkey {
    name: string;
    valueOrEquation: string;
    equation: string | undefined;
    value: number | undefined;
    watchA: string | undefined;
    watchB: string | undefined;

    valueA: number | undefined;
    valueB: number | undefined;
    op: string | undefined;
    processed = false;

    constructor(line: string) {
        const parts = line.split(":").map(l => l.trim());
        this.name = parts[0];
        this.valueOrEquation = parts[1];
        if (this.valueOrEquation.includes(" ")) {
            this.equation = this.valueOrEquation;
            const eParts = this.equation.split(" ");
            this.watchA = eParts[0];
            this.watchB = eParts[2];
            this.op = eParts[1];
        } else {
            this.value = parseInt(this.valueOrEquation);
        }
    }
    isComplete(): boolean {
        if (this.equation) {
            return this.valueA != undefined && this.valueB != undefined;
        }
        return false;
    }
    evalOp(): number {
        if (!this.equation || !this.valueA || !this.valueB) {
            return -1;
        }

        if (this.op == "+") {
            return this.valueA + this.valueB;
        }
        if (this.op == "-") {
            return this.valueA - this.valueB;
        }
        if (this.op == "/") {
            return this.valueA / this.valueB;
        }
        if (this.op == "*") {
            return this.valueA * this.valueB;
        }

        return -1;
    }
    eval(): number {
        return this.value ?? -1;
    }
}

class Model {
    updateMonkies(monkeys: Monkey[], updatedMonkey: Monkey): void {
        for (let n = 0; n < monkeys.length; n++) {
            const monkeyN = monkeys[n];
            if (monkeyN.watchA === updatedMonkey.name) {
                monkeyN.valueA = updatedMonkey.value;
            }
            if (monkeyN.watchB === updatedMonkey.name) {
                monkeyN.valueB = updatedMonkey.value;
            }
            if (monkeyN.isComplete() && !monkeyN.processed) {
                window.console.log(`monkey is complete`, monkeyN);
                monkeyN.value = monkeyN.evalOp();
                monkeyN.processed = true;
                // now iterate other monkies.
                this.updateMonkies(monkeys, monkeyN);
            }
        }
    }

    process(lines: string[]): number {
        const monkeys = lines.map(l => new Monkey(l));

        const monkeysWithValue: Monkey[] = [];
        const seenMonkey: Monkey[] = [];
        for (let m = 0; m < monkeys.length; m++) {
            const monkey = monkeys[m];
            seenMonkey.push(monkey);
            if (monkey.value) {
                monkeysWithValue.push(monkey);
                // look at previous and fill in values.
                // for (let n = 0; n < m; n++) {
                //     const monkeyN = monkeys[n];
                //     if (monkeyN.watchA === monkey.name) {
                //         monkeyN.valueA = monkey.value;
                //     }
                //     if (monkeyN.watchB === monkey.name) {
                //         monkeyN.valueB = monkey.value;
                //     }
                //     if (monkeyN.isComplete()) {
                //         window.console.log(`monkey is complete`, monkeyN);
                //         monkeyN.value = monkeyN.evalOp();
                //         // now iterate other monkies.
                //     }
                // }
                this.updateMonkies(seenMonkey, monkey);
            } else {
                // not sure?
                // has seen monkeys have values yet?
                const maybeWatchA = seenMonkey.filter(x => x.name == monkey.watchA);
                const maybeWatchB = seenMonkey.filter(x => x.name == monkey.watchB);
                if (maybeWatchA.length > 0) {
                    if (maybeWatchA[0].value) {
                        monkey.valueA = maybeWatchA[0].value;
                    }
                    if (maybeWatchA[0].processed) {
                        monkey.valueA = maybeWatchA[0].evalOp();
                    }
                }
                if (maybeWatchB.length > 0) {
                    if (maybeWatchB[0].value) {
                        monkey.valueB = maybeWatchB[0].value;
                    }
                    if (maybeWatchB[0].processed) {
                        monkey.valueB = maybeWatchB[0].evalOp();
                    }
                }
            }
        }

        return monkeys.filter(x => x.name === "root")[0].evalOp();
    }
}

const testData =
    "root: pppw + sjmn\ndbpl: 5\ncczh: sllz + lgvd\nzczc: 2\nptdq: humn - dvpt\ndvpt: 3\nlfqf: 4\nhumn: 5\nljgn: 2\nsjmn: drzm * dbpl\nsllz: 4\npppw: cczh / lfqf\nlgvd: ljgn * ptdq\ndrzm: hmdt - zczc\nhmdt: 32";

export function Day21() {
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
                <h1>Day 21</h1>
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

import { useState } from "react";
import "./App.css";
import styles from "./App.module.css";
import React from "react";
import { insert, remove } from "ramda";
/*

Description goes here

*/

interface MappedValue {
    value: number;
    index: number;
}

function slicer(list: MappedValue[], fromIndex: number, toIndex: number): MappedValue[] {
    // remove item at fromIndex.
    // const intermStart = fromIndex > 0 ? list.slice(0, fromIndex) : [];
    // const intermEnd = list.slice(fromIndex + 1);
    // const interm = [...intermStart, ...intermEnd];

    let interm = [...list];

    const item = list[fromIndex];
    interm = remove(fromIndex, 1, interm);
    // const removed = interm.splice(fromIndex, 1);

    // return [...interm.slice(0, toIndex), ...removed, ...interm.slice(toIndex)];
    return insert(toIndex, item, interm);
}

class Model {
    process(lines: string[]): number {
        const keys: MappedValue[] = lines.map((l, i) => ({ value: parseInt(l), index: i }));
        let copy = [...keys];
        const toSort2 = [...keys].sort((a, b) => a.value - b.value);
        window.console.log(`===================`, toSort2, new Set(toSort2));

        window.console.log(`toSort`, copy);
        for (let k = 0; k < keys.length; k++) {
            const item = keys[k];
            // find item position in toSort
            const index = copy.findIndex(x => {
                return x.index == item.index;
            });

            // target = (idx + val)%(len(d)-1)
            let nextIndex = (index + item.value) % (copy.length - 1);
            if (nextIndex < 0) {
                nextIndex = keys.length - 1 + nextIndex;
            }
            // if (nextIndex > key.length - 1) {
            //     // window.console.log(`,,, key too big`, nextIndex, key.length);
            //     nextIndex = nextIndex - key.length + 1;
            // } else if (nextIndex < 0) {
            //     // window.console.log(`,,, key too small`, nextIndex, key.length);
            //     nextIndex = key.length - 1 + nextIndex;
            // } else if (nextIndex == 0) {
            //     nextIndex = key.length - 1;
            // }
            copy = slicer(copy, index, nextIndex);
            window.console.log(
                `${k}:`,
                item.value,
                index,
                nextIndex,
                copy.map(x => x.value)
            );
        }

        const zeroIndex = copy.findIndex(x => {
            return x.value === 0;
        });
        window.console.log(`toSort`, copy, zeroIndex);

        let sum = 0;
        for (let i = 1; i < 3001; i++) {
            const checkIndex = (zeroIndex + i) % keys.length;
            if (i % 1000 === 0 && i > 0) {
                window.console.log(`i ${i}:${copy[checkIndex].value}`, checkIndex);
                sum += copy[checkIndex].value;
            }
        }

        return sum;
    }

    processPart2(lines: string[], rounds = 10, encryptionKey = 1): number {
        const keys: MappedValue[] = lines.map((l, i) => ({ value: parseInt(l) * encryptionKey, index: i }));
        let copy = [...keys];
        const toSort2 = [...keys].sort((a, b) => a.value - b.value);
        window.console.log(`===================`, toSort2, new Set(toSort2));

        window.console.log(`toSort`, copy);
        for (let r = 0; r < rounds; r++) {
            for (let k = 0; k < keys.length; k++) {
                const item = keys[k];
                // find item position in toSort
                const index = copy.findIndex(x => {
                    return x.index == item.index;
                });

                // target = (idx + val)%(len(d)-1)
                let nextIndex = (index + item.value) % (copy.length - 1);
                if (nextIndex < 0) {
                    nextIndex = keys.length - 1 + nextIndex;
                }
                // if (nextIndex > key.length - 1) {
                //     // window.console.log(`,,, key too big`, nextIndex, key.length);
                //     nextIndex = nextIndex - key.length + 1;
                // } else if (nextIndex < 0) {
                //     // window.console.log(`,,, key too small`, nextIndex, key.length);
                //     nextIndex = key.length - 1 + nextIndex;
                // } else if (nextIndex == 0) {
                //     nextIndex = key.length - 1;
                // }
                copy = slicer(copy, index, nextIndex);
                window.console.log(
                    `${k}:`,
                    item.value,
                    index,
                    nextIndex,
                    copy.map(x => x.value)
                );
            }
        }

        const zeroIndex = copy.findIndex(x => {
            return x.value === 0;
        });
        window.console.log(`toSort`, copy, zeroIndex);

        let sum = 0;
        for (let i = 1; i < 3001; i++) {
            const checkIndex = (zeroIndex + i) % keys.length;
            if (i % 1000 === 0 && i > 0) {
                window.console.log(`i ${i}:${copy[checkIndex].value}`, checkIndex);
                sum += copy[checkIndex].value;
            }
        }

        return sum;
    }
}

const testData = "1\n2\n-3\n3\n-2\n0\n4";

export function Day20() {
    const [input, setInput] = useState<string>(testData);
    const [result, setResult] = useState<string>("");

    const onRunPart1 = React.useCallback(() => {
        const lines = input.split("\n");
        const result = new Model().process(lines);

        setResult(`Total Score: ${result}`);
    }, [input]);

    const onRunPart2 = React.useCallback(() => {
        const lines = input.split("\n");
        //811589153
        const result = new Model().processPart2(lines, 10, 811589153);
        setResult(`Total Score: ${result}`);
    }, [input]);

    return (
        <>
            <div className="App">
                <h1>Day 20</h1>
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

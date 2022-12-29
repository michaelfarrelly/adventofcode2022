import { useState } from "react";
import "./App.css";
import styles from "./App.module.css";
import React from "react";
/*

https://adventofcode.com/2022/day/25


"You know, I never did ask the engineers why they did that. Instead of using digits four through zero, the digits are 2, 1, 0, minus (written -), and double-minus (written =). Minus is worth -1, and double-minus is worth -2."

"So, because ten (in normal numbers) is two fives and no ones, in SNAFU it is written 20. Since eight (in normal numbers) is two fives minus two ones, it is written 2=."

  Decimal          SNAFU
        1              1
        2              2
        3             1=
        4             1-
        5             10
        6             11
        7             12
        8             2=
        9             2-
       10             20
       15            1=0
       20            1-0
     2022         1=11-2
    12345        1-0---0
314159265  1121-1110-1=0

 SNAFU  Decimal
1=-0-2     1747
 12111      906
  2=0=      198
    21       11
  2=01      201
   111       31
 20012     1257
   112       32
 1=-1=      353
  1-12      107
    12        7
    1=        3
   122       37

*/

function decToSnafu(n: number): string {
    // 2 * 625 = 1250            = +/- 1250  (1250, 625, 0, -625, -1250)
    // max N 2 * 125 to -2 * 125 = +/-  250  ( 250, 125, 0, -125,  -250)
    //                           = +/-   50  (  50,  25, 0,  -25,   -50)
    //                           = +/-   10  (  10,   5, 0,   -5,   -10)
    //                           = +/-    2  (   2,   1, 0,   -1,    -2)

    const SNAFUDigits = ["0", "1", "2", "=", "-"];
    if (n == 0) {
        return "";
    }
    const remainder = Math.floor(n % 5);
    const digit = SNAFUDigits[remainder];
    return `${decToSnafu(Math.floor((n + 2) / 5))}${digit}`;
}

function snafuToDec(s: string): number {
    if (s == "1") {
        return 1;
    }
    if (s == "2") {
        return 2;
    }

    // Say you have the SNAFU number 2=-01.
    // That's 2 in the 625s place,
    // = (double-minus) in the 125s place,
    // - (minus) in the 25s place,
    // 0 in the 5s place,
    // and 1 in the 1s place.
    // (2 times 625)
    // plus (-2 times 125)
    // plus (-1 times 25)
    // plus (0 times 5)
    // plus (1 times 1). That's 1250 plus -250 plus -25 plus 0 plus 1. 976!

    // 1,5,25,125,625
    // 5^0 = 1
    // 5^1 = 5
    // 5^2

    let total = 0;
    for (let i = 0; i < s.length; i++) {
        const rev_i = s.length - i - 1; // 5 - 0

        const s_i = s[i];

        let inc = 0;
        if (s_i == "2") {
            inc = 2 * Math.pow(5, rev_i);
        }
        if (s_i == "1") {
            inc = 1 * Math.pow(5, rev_i);
        }
        if (s_i == "0") {
            inc = 0 * Math.pow(5, rev_i);
        }
        if (s_i == "-") {
            inc = -1 * Math.pow(5, rev_i);
        }
        if (s_i == "=") {
            inc = -2 * Math.pow(5, rev_i);
        }
        total += inc;
        // window.console.log(`total is now ${s_i}/${rev_i}/${Math.pow(5, rev_i)}`, total, inc);
    }

    return total;
}

const testData = "1=-0-2\n12111\n2=0=\n21\n2=01\n111\n20012\n112\n1=-1=\n1-12\n12\n1=\n122";

export function Day25() {
    const [input, setInput] = useState<string>(testData);
    const [result, setResult] = useState<string>("");

    const onRunPart1 = React.useCallback(() => {
        const lines = input.split("\n");

        const result = lines.map(s => snafuToDec(s));
        const sumOfResult = result.reduce((p, v) => {
            return v + p;
        }, 0);

        const sumSnafu = decToSnafu(sumOfResult);

        setResult(`Total Score: ${result.join(",")}\nsum: ${sumOfResult}\n\nsumSnafu: ${sumSnafu}`);
    }, [input]);

    const onRunPart2 = React.useCallback(() => {
        const lines = input.split("\n");

        setResult(`Total Score: ${lines}`);
    }, [input]);

    return (
        <>
            <div className="App">
                <h1>Day 25</h1>
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

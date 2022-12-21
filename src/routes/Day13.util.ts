type ABC = (number | number[] | ABC)[]; // number[] | number[][] |

export function compareSides(a: ABC, b: ABC, lastState = "equal"): { correctOrder: boolean; lastState?: string } {
    window.console.log(`compareSides`, a, b);
    if (a.length == 0 && b.length > 0) {
        // window.console.log(`compareSides`, `a is short`, a, b);
        return { correctOrder: true };
    }
    // let lastState = "equal";
    for (let i = 0; i < a.length; i++) {
        if (i >= b.length) {
            // window.console.log(`compareSides`, `b is short`);
            // when b is short than a, and at position i, inputs are in correct order.
            return { correctOrder: lastState === "equal" ? false : true, lastState };
        }
        if (typeof a[i] === "number" && typeof b[i] === "number") {
            if (a[i] > b[i]) {
                // window.console.log(`compareSides`, `numeric`);
                return { correctOrder: false, lastState: "asc" };
            }
            if (a[i] === b[i]) {
                lastState = "equal";
            }
            if (a[i] < b[i]) {
                lastState = "desc";
            }
            if (a[i] > b[i]) {
                lastState = "asc";
            }
        }
        if (Array.isArray(a[i]) && Array.isArray(b[i])) {
            // window.console.log(`compareSides`, `both are array`);
            // conver the other to array
            // const a1 = a[i];
            // const b1 = b[i];
            // const a2 = Array.isArray(a1) ? a1 : [a1];
            // const b2: ABC = Array.isArray(b1) ? b1 : [b1];
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any
            const next = compareSides(a[i] as any, b[i] as any, lastState);
            if (next.correctOrder === false) {
                return next;
            }
        } else if (Array.isArray(a[i]) || Array.isArray(b[i])) {
            // window.console.log(`compareSides`, `one or both are array`);
            // conver the other to array
            const a1 = a[i];
            const b1 = b[i];
            const a2 = Array.isArray(a1) ? a1 : [a1];
            const b2: ABC = Array.isArray(b1) ? b1 : [b1];
            const next = compareSides(a2 as any, b2 as any, lastState);
            if (next.correctOrder === false) {
                return next;
            }
        }

        // both are numbers,  if a is larger than b, inputs arent in correct order.
        if (a[i] > b[i]) {
            lastState = "asc";
            // window.console.log(`compareSides`, `numeric`);
            return { correctOrder: false, lastState };
        }
    }

    // window.console.log(`compareSides`, `final`);
    return { correctOrder: true, lastState };
}

function lineToAbc(line: string): ABC {
    // window.console.log(`line----`, line);
    return JSON.parse(line);
}

export function parseLines(lines: string[]): { sumOfIndex: number; truthies: number[] } {
    let sum = 0;
    let groupIndex = 1;
    const truthies: number[] = [];
    // window.console.log(`line---s-`, lines, sum, groupIndex);
    for (let i = 0; i < lines.length; i += 3) {
        // window.console.log(
        //     `groupIndex`,
        //     groupIndex,
        //     lines[i],
        //     lines[i + 1],
        //     lineToAbc(lines[i]),
        //     lineToAbc(lines[i + 1])
        // );
        if (compareSides(lineToAbc(lines[i]), lineToAbc(lines[i + 1])).correctOrder) {
            window.console.log(`> T`, groupIndex, lines[i], lines[i + 1], lineToAbc(lines[i]), lineToAbc(lines[i + 1]));
            truthies.push(groupIndex);
            sum += groupIndex;
        }
        groupIndex++;
    }
    return { sumOfIndex: sum, truthies: truthies };
}

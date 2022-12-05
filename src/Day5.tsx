import { useState } from "react";
import "./App.css";
import styles from "./App.module.css";
import React from "react";
/*
--- Day 5: Supply Stacks ---

The expedition can depart as soon as the final supplies have been unloaded from the ships. Supplies are stored in stacks of marked crates, but because the needed supplies are buried under many other crates, the crates need to be rearranged.

The ship has a giant cargo crane capable of moving crates between stacks. To ensure none of the crates get crushed or fall over, the crane operator will rearrange them in a series of carefully-planned steps. After the crates are rearranged, the desired crates will be at the top of each stack.

The Elves don't want to interrupt the crane operator during this delicate procedure, but they forgot to ask her which crate will end up where, and they want to be ready to unload them as soon as possible so they can embark.

They do, however, have a drawing of the starting stacks of crates and the rearrangement procedure (your puzzle input). For example:

    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2

In this example, there are three stacks of crates. Stack 1 contains two crates: crate Z is on the bottom, and crate N is on top. Stack 2 contains three crates; from bottom to top, they are crates M, C, and D. Finally, stack 3 contains a single crate, P.

Then, the rearrangement procedure is given. In each step of the procedure, a quantity of crates is moved from one stack to a different stack. In the first step of the above rearrangement procedure, one crate is moved from stack 2 to stack 1, resulting in this configuration:

[D]        
[N] [C]    
[Z] [M] [P]
 1   2   3 

In the second step, three crates are moved from stack 1 to stack 3. Crates are moved one at a time, so the first crate to be moved (D) ends up below the second and third crates:

        [Z]
        [N]
    [C] [D]
    [M] [P]
 1   2   3

Then, both crates are moved from stack 2 to stack 1. Again, because crates are moved one at a time, crate C ends up below crate M:

        [Z]
        [N]
[M]     [D]
[C]     [P]
 1   2   3

Finally, one crate is moved from stack 1 to stack 2:

        [Z]
        [N]
        [D]
[C] [M] [P]
 1   2   3   4
01234567890123
 1   5   9  13 
 0 = 1 (j + 1 = 1 * 3)
 1 = 5 (j + 1 = 2 * 3 - 1)
 2 = 9 (j + 1 = 3 * 3 - 0)
 3 = 13 (j+ 1 = 4 * 3 + 1)


The Elves just need to know which crate will end up on top of each stack; in this example, the top crates are C in stack 1, M in stack 2, and Z in stack 3, so you should combine these together and give the Elves the message CMZ.

After the rearrangement procedure completes, what crate ends up on top of each stack?

--- Part Two ---

As you watch the crane operator expertly rearrange the crates, you notice the process isn't following your prediction.

Some mud was covering the writing on the side of the crane, and you quickly wipe it away. The crane isn't a CrateMover 9000 - it's a CrateMover 9001.

The CrateMover 9001 is notable for many new and exciting features: air conditioning, leather seats, an extra cup holder, and the ability to pick up and move multiple crates at once.

Again considering the example above, the crates begin in the same configuration:

    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

Moving a single crate from stack 2 to stack 1 behaves the same as before:

[D]        
[N] [C]    
[Z] [M] [P]
 1   2   3 

However, the action of moving three crates from stack 1 to stack 3 means that those three moved crates stay in the same order, resulting in this new configuration:

        [D]
        [N]
    [C] [Z]
    [M] [P]
 1   2   3

Next, as both crates are moved from stack 2 to stack 1, they retain their order as well:

        [D]
        [N]
[C]     [Z]
[M]     [P]
 1   2   3

Finally, a single crate is still moved from stack 1 to stack 2, but now it's crate C that gets moved:

        [D]
        [N]
        [Z]
[M] [C] [P]
 1   2   3

In this example, the CrateMover 9001 has put the crates in a totally different order: MCD.

Before the rearrangement process finishes, update your simulation so that the Elves know where they should stand to be ready to unload the final supplies. After the rearrangement procedure completes, what crate ends up on top of each stack?



*/

interface Item {
  value: string;
}

interface Stack {
  items: Item[];
}

interface Model {
  stacks: Stack[];
}

function buildModel(lines: string[]): Model {
  // last line tells how many stacks
  const stackLine = lines[lines.length - 1].trimEnd();
  const stackCount = parseInt(stackLine[stackLine.length - 1]);
  const stacks: Stack[] = [];
  for (let j = 0; j < stackCount; j++) {
    stacks.push({ items: [] });
  }
  for (let i = 0; i < lines.length - 1; i++) {
    for (let j = 0; j < stackCount; j++) {
      const ordinal = stackLine.indexOf(`${j + 1}`);

      if (lines[i].length > ordinal && lines[i][ordinal] !== " ") {
        stacks[j].items.push({ value: lines[i][ordinal] });
      }
    }
  }

  return { stacks: stacks };
}
function runMoves(model: Model, moveLines: string[]) {
  for (const move of moveLines) {
    const parts = move.split(" ");
    const qty = parseInt(parts[1]);
    const fromLoc = parseInt(parts[3]) - 1;
    const toLoc = parseInt(parts[5]) - 1;

    const hold = [];
    for (let i = 0; i < qty; i++) {
      const x = model.stacks[fromLoc].items.shift();
      console.log(`moving`, x, fromLoc, toLoc, qty);
      hold.push(x);
    }
    for (let i = 0; i < qty; i++) {
      if (hold.length > 0) {
        const x = hold.pop(); // part 2
        console.log(`dropping`, x, fromLoc, toLoc, qty);
        if (x) {
          model.stacks[toLoc].items.unshift(x);
        }
      }
    }
  }
  return model;
}

function topOfStack(model: Model): string {
  return model.stacks.map((s) => s.items[0].value).join("");
}

const testData =
  "    [D]    \n[N] [C]    \n[Z] [M] [P]\n 1   2   3 \n\nmove 1 from 2 to 1\nmove 3 from 1 to 3\nmove 2 from 2 to 1\nmove 1 from 1 to 2";

export function Day5() {
  const [input, setInput] = useState<string>(testData);
  const [result, setResult] = useState<string>("");

  const onRunPart1 = React.useCallback(() => {
    const lines = input.split("\n");
    // find first line with move
    const firstMoveLine = lines.findIndex((v) => v.startsWith("move"));
    const modelLines = lines.slice(0, firstMoveLine - 1);
    const moveLines = lines.slice(firstMoveLine);
    const model = buildModel(modelLines);
    console.log(`lines`, modelLines, moveLines, model);

    const result = runMoves(model, moveLines);
    const result1 = topOfStack(result);

    setResult(`Total Score: ${result1}`);
  }, [input]);

  return (
    <>
      <div className="App">
        <h1>Day 5</h1>
      </div>

      <div className={styles.dayGrid}>
        <div className={styles.dayButtons}>
          <button onClick={onRunPart1}>Run (Part 1)</button>
          <button onClick={onRunPart1}>Run (Part 2)</button>
        </div>
        <div className={styles.dayInput}>
          <textarea
            value={input}
            rows={10}
            onChange={(e) => setInput(e.currentTarget.value)}
          ></textarea>
        </div>
        <div className={styles.dayResult}>
          <textarea value={result} rows={10}></textarea>
        </div>
      </div>
    </>
  );
}

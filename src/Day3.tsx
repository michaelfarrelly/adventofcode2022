import { useState } from "react";
import "./App.css";
import styles from "./App.module.css";
import React from "react";
/*

--- Day 3: Rucksack Reorganization ---

One Elf has the important job of loading all of the rucksacks with supplies for the 
jungle journey. Unfortunately, that Elf didn't quite follow the packing instructions, 
and so a few items now need to be rearranged.

Each rucksack has two large compartments. All items of a given type are meant to go 
into exactly one of the two compartments. The Elf that did the packing failed to follow 
this rule for exactly one item type per rucksack.

The Elves have made a list of all of the items currently in each rucksack (your puzzle input), 
they need your help finding the errors. Every item type is identified by a single lowercase 
or uppercase letter (that is, a and A refer to different types of items).

The list of items for each rucksack is given as characters all on a single line. 
A given rucksack always has the same number of items in each of its two compartments, 
so the first half of the characters represent items in the first compartment, while the 
second half of the characters represent items in the second compartment.

For example, suppose you have the following list of contents from six rucksacks:

vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw

    The first rucksack contains the items vJrwpWtwJgWrhcsFMMfFFhFp, which means its first compartment 
       contains the items vJrwpWtwJgWr, while the second compartment contains the items hcsFMMfFFhFp. 
       The only item type that appears in both compartments is lowercase p.
    The second rucksack's compartments contain jqHRNqRjqzjGDLGL and rsFMfFZSrLrFZsSL. The only item 
       type that appears in both compartments is uppercase L.
    The third rucksack's compartments contain PmmdzqPrV and vPwwTWBwg; the only common item type 
       is uppercase P.
    The fourth rucksack's compartments only share item type v.
    The fifth rucksack's compartments only share item type t.
    The sixth rucksack's compartments only share item type s.

To help prioritize item rearrangement, every item type can be converted to a priority:

    Lowercase item types a through z have priorities 1 through 26.
    Uppercase item types A through Z have priorities 27 through 52.

In the above example, the priority of the item type that appears in both compartments of each rucksack 
is 16 (p), 38 (L), 42 (P), 22 (v), 20 (t), and 19 (s); the sum of these is 157.

Find the item type that appears in both compartments of each rucksack. What is the sum of the priorities 
of those item types?


--- Part Two ---

As you finish identifying the misplaced items, the Elves come to you with another issue.

For safety, the Elves are divided into groups of three. Every Elf carries a badge that 
identifies their group. For efficiency, within each group of three Elves, the badge is 
the only item type carried by all three Elves. That is, if a group's badge is item type B, 
then all three Elves will have item type B somewhere in their rucksack, and at most two 
of the Elves will be carrying any other item type.

The problem is that someone forgot to put this year's updated authenticity sticker on 
the badges. All of the badges need to be pulled out of the rucksacks so the new authenticity 
stickers can be attached.

Additionally, nobody wrote down which item type corresponds to each group's badges. The 
only way to tell which item type is the right one is by finding the one item type that 
is common between all three Elves in each group.

Every set of three lines in your list corresponds to a single group, but each group can 
have a different badge item type. So, in the above example, the first group's rucksacks 
are the first three lines:

vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg

And the second group's rucksacks are the next three lines:

wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw

In the first group, the only item type that appears in all three rucksacks is lowercase r; 
this must be their badges. In the second group, their badge item type must be Z.

Priorities for these items must still be found to organize the sticker attachment 
efforts: here, they are 18 (r) for the first group and 52 (Z) for the second group.
The sum of these is 70.

Find the item type that corresponds to the badges of each three-Elf group. 
What is the sum of the priorities of those item types?


*/

function commonChar(a: string, b: string): string[] {
    const commons = [...new Set([...a].filter(aItem => b.includes(aItem))).values()];
    return commons;
}

function commonChar3(a: string, b: string, c: string): string[] {
    const commons = [...new Set([...a].filter(aItem => b.includes(aItem) && c.includes(aItem))).values()];
    return commons;
}

function getPriority(a: string): number {
    const charCode = a.charCodeAt(0);
    window.console.log(`cc`, a, charCode);
    if (charCode >= 97) {
        // a
        return charCode - 96;
    }
    return charCode - 65 + 27;
}

function groupInto<T>(source: T[], items: number): T[][] {
    const groups: T[][] = [];
    let next: T[] = [];
    for (let i = 0; i < source.length; i++) {
        next.push(source[i]);
        if (next.length >= items) {
            groups.push(next);
            next = [];
        }
    }
    return groups;
}

const testData =
    "vJrwpWtwJgWrhcsFMMfFFhFp\njqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL\nPmmdzqPrVvPwwTWBwg\nwMqvLMZHhHMvwLHjbvcjnnSBnvTQFn\nttgJtRGJQctTZtZT\nCrZsJsPPZsGzwwsLwLmpwMDw";

export function Day3() {
    const [input, setInput] = useState<string>(testData);
    const [result, setResult] = useState<string>("");

    const onRunPart1 = React.useCallback(() => {
        const sacks = input.split("\n");
        const totals = sacks
            .map((sack, i) => {
                if (sack.length < 1) {
                    return 0;
                }

                const lenHalf = sack.length / 2;
                const part1 = sack.slice(0, lenHalf);
                const part2 = sack.slice(lenHalf);
                const commons = commonChar(part1, part2);
                const priority = commons.map(c => getPriority(c)).reduce((prev, curr) => prev + curr, 0);
                window.console.log(`commons`, commons, priority);
                return priority;
            })
            .reduce((prev, curr) => prev + curr, 0);

        setResult(`Total Score: ${totals}`);
    }, [input]);

    const onRunPart2 = React.useCallback(() => {
        const sacks = groupInto(input.split("\n"), 3);
        window.console.log(sacks);
        const totals = sacks
            .map((sack, i) => {
                if (sack.length !== 3) {
                    return 0;
                }

                const part1 = sack[0];
                const part2 = sack[1];
                const part3 = sack[2];
                const commons = commonChar3(part1, part2, part3);
                const priority = commons.map(c => getPriority(c)).reduce((prev, curr) => prev + curr, 0);
                window.console.log(`commons`, commons, priority);
                return priority;
            })
            .reduce((prev, curr) => prev + curr, 0);

        setResult(`Total Score: ${totals}`);
    }, [input]);

    return (
        <>
            <div className="App">
                <h1>Day 3</h1>
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

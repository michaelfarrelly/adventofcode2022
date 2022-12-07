import { useState } from "react";
import "./App.css";
import styles from "./App.module.css";
import React from "react";
/*

--- Day 7: No Space Left On Device ---

You can hear birds chirping and raindrops hitting leaves as the expedition proceeds. Occasionally, you can even hear much louder sounds in the distance; how big do the animals get out here, anyway?

The device the Elves gave you has problems with more than just its communication system. You try to run a system update:

$ system-update --please --pretty-please-with-sugar-on-top
Error: No space left on device

Perhaps you can delete some files to make space for the update?

You browse around the filesystem to assess the situation and save the resulting terminal output (your puzzle input). For example:

$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k

The filesystem consists of a tree of files (plain data) and directories (which can contain other directories or files). The outermost directory is called /. You can navigate around the filesystem, moving into or out of directories and listing the contents of the directory you're currently in.

Within the terminal output, lines that begin with $ are commands you executed, very much like some modern computers:

    cd means change directory. This changes which directory is the current directory, but the specific result depends on the argument:
        cd x moves in one level: it looks in the current directory for the directory named x and makes it the current directory.
        cd .. moves out one level: it finds the directory that contains the current directory, then makes that directory the current directory.
        cd / switches the current directory to the outermost directory, /.
    ls means list. It prints out all of the files and directories immediately contained by the current directory:
        123 abc means that the current directory contains a file named abc with size 123.
        dir xyz means that the current directory contains a directory named xyz.

Given the commands and output in the example above, you can determine that the filesystem looks visually like this:

- / (dir)
  - a (dir)
    - e (dir)
      - i (file, size=584)
    - f (file, size=29116)
    - g (file, size=2557)
    - h.lst (file, size=62596)
  - b.txt (file, size=14848514)
  - c.dat (file, size=8504156)
  - d (dir)
    - j (file, size=4060174)
    - d.log (file, size=8033020)
    - d.ext (file, size=5626152)
    - k (file, size=7214296)

Here, there are four directories: / (the outermost directory), a and d (which are in /), and e (which is in a). These directories also contain files of various sizes.

Since the disk is full, your first step should probably be to find directories that are good candidates for deletion. To do this, you need to determine the total size of each directory. The total size of a directory is the sum of the sizes of the files it contains, directly or indirectly. (Directories themselves do not count as having any intrinsic size.)

The total sizes of the directories above can be found as follows:

    The total size of directory e is 584 because it contains a single file i of size 584 and no other directories.
    The directory a has total size 94853 because it contains files f (size 29116), g (size 2557), and h.lst (size 62596), plus file i indirectly (a contains e which contains i).
    Directory d has total size 24933642.
    As the outermost directory, / contains every file. Its total size is 48381165, the sum of the size of every file.

To begin, find all of the directories with a total size of at most 100000, then calculate the sum of their total sizes. In the example above, these directories are a and e; the sum of their total sizes is 95437 (94853 + 584). (As in this example, this process can count files more than once!)

Find all of the directories with a total size of at most 100000. What is the sum of the total sizes of those directories?

--- Part Two ---

Now, you're ready to choose a directory to delete.

The total disk space available to the filesystem is 70000000. To run the update, you need unused space of at least 30000000. You need to find a directory you can delete that will free up enough space to run the update.

In the example above, the total size of the outermost directory (and thus the total amount of used space) is 48381165; this means that the size of the unused space must currently be 21618835, which isn't quite the 30000000 required by the update. Therefore, the update still requires a directory with total size of at least 8381165 to be deleted before it can run.

To achieve this, you have the following options:

    Delete directory e, which would increase unused space by 584.
    Delete directory a, which would increase unused space by 94853.
    Delete directory d, which would increase unused space by 24933642.
    Delete directory /, which would increase unused space by 48381165.

Directories e and a are both too small; deleting them would not free up enough space. However, directories d and / are both big enough! Between these, choose the smallest: d, increasing unused space by 24933642.

Find the smallest directory that, if deleted, would free up enough space on the filesystem to run the update. What is the total size of that directory?


*/

interface File {
    name: string;
    size: number;
}

interface Folder {
    name: string;
    files: File[];
    folders: Folder[];
    parent: Folder | null;
}

interface FolderWithSize {
    name: string;
    files: File[];
    folders: Folder[];
    parent: Folder | null;
    size: number;
}
function findSize(folder: Folder): number {
    const folders: Folder[] = [];
    let size = 0;
    for (const f of folder.files) {
        size += f.size;
    }
    for (const f of folder.folders) {
        size += findSize(f);
    }
    return size;
}
function findDirsUnder(folder: Folder, size: number): { f: Folder; s: number }[] {
    const folders: { f: Folder; s: number }[] = [];

    for (const f of folder.folders) {
        const s = findSize(f);
        if (s < size) {
            folders.push({ f, s });
        }
        folders.push(...findDirsUnder(f, size));
    }

    return folders;
}

function findDirsSizes(folder: Folder): FolderWithSize[] {
    const folders: FolderWithSize[] = [];

    folders.push({ ...folder, size: findSize(folder) });
    for (const f of folder.folders) {
        const s = findSize(f);
        folders.push({ ...f, size: s });
        folders.push(...findDirsSizes(f));
    }

    return folders;
}

function buildModel(lines: string[]): Folder {
    const tree: Folder = { name: "/", files: [], folders: [], parent: null };
    let current_node = tree;
    let start_ls = false;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        window.console.log(line);
        if (line.startsWith("$")) {
            // cmd
            start_ls = false;
            const parts = line.split(" ");
            if (parts[1] == "cd") {
                const folder = parts[2];
                if (folder === "/") {
                    current_node = tree;
                } else if (folder === ".." && current_node.parent !== null) {
                    window.console.log(`down to`, current_node.parent);
                    current_node = current_node.parent;
                } else {
                    const next = current_node.folders.find(f => f.name === folder);
                    if (next) {
                        window.console.log(`move to `, folder);
                        current_node = next;
                    } else {
                        window.console.log(`nothing`, folder, current_node);
                        // nothing
                    }
                }
            } else if (parts[1] === "ls") {
                start_ls = true;
            }
        } else {
            // file or folder;
            if (start_ls) {
                const parts = line.split(" ");
                if (parts[0] === "dir") {
                    window.console.log(`found folder `, parts[1], parts[0]);
                    current_node.folders.push({ name: parts[1], files: [], folders: [], parent: current_node });
                } else {
                    window.console.log(`found file `, parts[1], parts[0]);
                    current_node.files.push({ name: parts[1], size: parseInt(parts[0]) });
                }
            }
        }
    }

    return tree;
}

const testData =
    "$ cd /\n$ ls\ndir a\n14848514 b.txt\n8504156 c.dat\ndir d\n$ cd a\n$ ls\ndir e\n29116 f\n2557 g\n62596 h.lst\n$ cd e\n$ ls\n584 i\n$ cd ..\n$ cd ..\n$ cd d\n$ ls\n4060174 j\n8033020 d.log\n5626152 d.ext\n7214296 k";

export function Day7() {
    const [input, setInput] = useState<string>(testData);
    const [result, setResult] = useState<string>("");

    const onRunPart1 = React.useCallback(() => {
        const lines = input.split("\n");

        const tree = buildModel(lines);
        window.console.log(`tree`, tree);
        const smalls = findDirsUnder(tree, 100000);
        window.console.log(`tree2`, smalls);
        const result = smalls.reduce((prev, curr) => {
            return prev + curr.s;
        }, 0);
        setResult(`Total Score: ${result}`);
    }, [input]);

    const onRunPart2 = React.useCallback(() => {
        const lines = input.split("\n");

        const total_size = 70000000;
        const needed_free = 30000000;

        const tree = buildModel(lines);
        window.console.log(`tree`, tree);
        const current_size = findSize(tree);

        const sizes = findDirsSizes(tree).sort((a, b) => {
            return a.size - b.size;
        });
        let item;
        for (let i = 0; i < sizes.length; i++) {
            if (total_size - current_size + sizes[i].size >= needed_free) {
                window.console.log(`item`, sizes[i]);
                item = sizes[i];
                break;
            }
        }
        window.console.log(`tree2`, sizes);

        setResult(`Total Score: ${item?.size}`);
    }, [input]);

    return (
        <>
            <div className="App">
                <h1>Day 7</h1>
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

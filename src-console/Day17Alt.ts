const shapes = ["####", ".#.\n###\n.#.", "..#\n..#\n###", "#\n#\n#\n#", "##\n##"];

const testData = ">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>";

interface FieldOptions {
    width: number;
    height: number;
}

type Position = [number, number] | number[];

// interface Collision {
//     downward: boolean;
//     side: boolean;
// }

// function adjustDown(a: Piece): Piece {
//     const oldPos = [...a.location];
//     const newPos = [oldPos[0], oldPos[1]];
//     return new Piece(a.itemSpec, newPos);
// }

class Piece {
    itemSpec: string;
    constructor(item: string, location: Position) {
        this.item = item.split("\n");
        this.itemSpec = item;
        this.itemHeight = this.item.length;
        const itemLengths = this.item.map(i => i.length).sort(); // asc
        this.itemLength = itemLengths[0];

        this.location = location;
    }
    getPositions(): Position[] {
        const poses: Position[] = [];
        if (this.itemSpec === "####") {
            return [
                this.location,
                [this.location[0] + 1, this.location[1]],
                [this.location[0] + 2, this.location[1]],
                [this.location[0] + 3, this.location[1]]
            ];
        } else if (this.itemSpec === ".#.\n###\n.#.") {
            return [
                [this.location[0] + 1, this.location[1]],
                [this.location[0], this.location[1] - 1],
                [this.location[0] + 1, this.location[1] - 1],
                [this.location[0] + 2, this.location[1] - 1],
                [this.location[0] + 1, this.location[1] - 2]
            ];
        } else if (this.itemSpec === "..#\n..#\n###") {
            return [
                [this.location[0] + 2, this.location[1]],
                [this.location[0] + 2, this.location[1] - 1],
                [this.location[0] + 2, this.location[1] - 2],
                [this.location[0] + 1, this.location[1] - 2],
                [this.location[0], this.location[1] - 2]
            ];
        } else if (this.itemSpec === "#\n#\n#\n#") {
            return [
                this.location,
                [this.location[0], this.location[1] - 1],
                [this.location[0], this.location[1] - 2],
                [this.location[0], this.location[1] - 3]
            ];
        } else if (this.itemSpec === "##\n##") {
            return [
                this.location,
                [this.location[0] + 1, this.location[1]],
                [this.location[0], this.location[1] - 1],
                [this.location[0] + 1, this.location[1] - 1]
            ];
        }

        return poses;
    }

    collide(a: Piece): boolean {
        const aPos = a.getPositions();
        const nextPos = this.getPositions();

        if (nextPos.filter(p => aPos.filter(a => a[0] === p[0] && a[1] === p[1]).length > 0).length > 0) {
            return true;
        }
        return false;
    }
    isTouchingPiece(a: Piece): boolean {
        // when this is 1 away

        //  b
        // bbb
        //  b
        // aaaa
        const aPos = a.getPositions();
        const nextPos = this.getPositions();

        if (nextPos.filter(b => aPos.filter(a => a[0] === b[0] && a[1] === b[1] - 1).length > 0).length > 0) {
            return true;
        }
        return false;
    }
    collides(frozen: Piece[]): boolean {
        // const end = frozen.length - 1;
        // const start = frozen.length > 25 ? frozen.length - 25 : 0;
        return frozen.filter(f => this.collide(f)).length > 0;
    }

    isTouching(frozen: Piece[]): boolean {
        // if frozenPiece is adjcent to this.
        return frozen.filter(f => this.isTouchingPiece(f)).length > 0;
    }
    item: string[];
    itemHeight = 1;
    itemLength = 1;
    location: Position;
}
class Field {
    tallestPiece: number;
    constructor(options: FieldOptions) {
        // this.rows = [];
        // this.buildRows(options);
    }

    buildRows(options: FieldOptions) {
        // const rounds = Array.from(Array(options.height).keys());
        // this.rows = rounds.map(() => "     ");
    }

    getTallestPiece(): number | undefined {
        return this.tallestPiece;
    }

    addPiece(activePiece: string): boolean {
        if (this.activePiece) {
            // wait..
            return false;
        }
        const nextPiece = new Piece(activePiece, [2, this.currentHeight]);
        // adjust currentHeight to lastPiece + 3
        if (this.frozenPiecesLast25.length > 0) {
            const lastPiece = this.getTallestPiece() ?? 0;
            this.currentHeight = lastPiece + 4 + nextPiece.itemHeight;
        } else {
            this.currentHeight = Math.max(4 + nextPiece.itemHeight, this.currentHeight);
        }

        nextPiece.location = [2, this.currentHeight - 1];

        this.activePiece = nextPiece;
        return true;
    }

    collideDetect(): boolean {
        if (!this.activePiece) {
            return false;
        }
        return this.activePiece.collides(this.frozenPiecesLast25);
    }

    movePiece(input: string): { activePiece: Piece | undefined } {
        if (!this.activePiece) {
            return { activePiece: undefined };
        }
        const maxRight = 7 - this.activePiece.itemLength;

        // move horizontally
        const prevLocation = [...this.activePiece.location];
        this.activePiece.location[0] =
            input === ">"
                ? Math.min(this.activePiece?.location[0] + 1, maxRight)
                : Math.max(0, this.activePiece?.location[0] - 1);

        if (this.collideDetect()) {
            // stops horizontal movement.
            // reset to previous location
            this.activePiece.location = [prevLocation[0], prevLocation[1]];
        }

        this.activePiece.location[1] -= 1;

        // check spaces below it before moving
        if (this.collideDetect()) {
            // reset vertical to previous.
            this.activePiece.location = [this.activePiece.location[0], prevLocation[1]];
            // this.frozenPieces.push(this.activePiece);
            this.frozenPiecesLast25.push(this.activePiece);
            if (this.frozenPiecesLast25.length > 25) {
                this.frozenPiecesLast25.shift();
            }

            if (!this.tallestPiece) {
                this.tallestPiece = this.activePiece.location[1];
            } else {
                if (this.tallestPiece < this.activePiece.location[1]) {
                    this.tallestPiece = this.activePiece.location[1];
                }
            }
            this.activePiece = undefined;
            return { activePiece: undefined };
        }

        // if activePiece hits another piece or zero, freeze it.
        if (this.activePiece.location[1] <= 0) {
            this.activePiece.location[1] = 0;
            // this.frozenPieces.push(this.activePiece);
            this.frozenPiecesLast25.push(this.activePiece);
            if (this.frozenPiecesLast25.length > 50) {
                this.frozenPiecesLast25 = this.frozenPiecesLast25.slice(
                    this.frozenPiecesLast25.length - 50,
                    this.frozenPiecesLast25.length - 1
                );
            }
            if (!this.tallestPiece) {
                this.tallestPiece = this.activePiece.location[1];
            } else {
                if (this.tallestPiece < this.activePiece.location[1]) {
                    this.tallestPiece = this.activePiece.location[1];
                }
            }
            this.activePiece = undefined;
            return { activePiece: undefined };
        }
        return { activePiece: this.activePiece };
    }
    drawField(): string {
        const totalHeight = this.currentHeight;
        // 7
        // pp[1] = 0; 7-0 = 7
        // pp[1] = 6; 7-6 = 1;
        const grid = Array.from(Array(totalHeight).keys()).map(() => "|" + ".".repeat(7) + "|");

        for (const p of this.frozenPieces) {
            const poses = p.getPositions();
            for (const pp of poses) {
                const row = grid[totalHeight - 1 - pp[1]];
                if (row) {
                    grid[totalHeight - 1 - pp[1]] = row.slice(0, pp[0] + 1) + "#" + row.slice(pp[0] + 2);
                }
            }
        }

        if (this.activePiece) {
            const poses = this.activePiece?.getPositions();
            for (const pp of poses) {
                const row = grid[totalHeight - 1 - pp[1]];
                if (row) {
                    grid[totalHeight - 1 - pp[1]] = row.slice(0, pp[0] + 1) + "@" + row.slice(pp[0] + 2);
                }
            }
        }

        return `AP:\n${this.activePiece?.itemSpec}\n\n` + grid.join("\n") + `\n+-------+\n\nCH: ${this.currentHeight}`;
    }
    activePiece: Piece | undefined;
    // rows: string[];
    frozenPieces: Piece[] = [];
    frozenPiecesLast25: Piece[] = [];
    currentHeight = 4;
}

class Model {
    constructor() {
        //
    }
    nextPiece(): string {
        const nextPiece = this._lastPiece;
        this._lastPiece++;
        if (this._lastPiece > shapes.length - 1) {
            this._lastPiece = 0;
        }
        return shapes[nextPiece];
    }

    nextInput(): string {
        const nextInput = this._lastInput;
        this._lastInput++;
        if (this._lastInput >= this.inputs.length) {
            this._lastInput = 0;
        }
        return this.inputs[nextInput];
    }
    runGame(
        inputs: string,
        fieldOptions: FieldOptions,
        blockCount = 10
    ): { height: number; lastField: string; lastMove: string } {
        //
        // const rounds = Array.from(Array(blockCount * 4).keys());
        this.inputs = inputs;
        this.field = new Field(fieldOptions);

        let activePiece: string | undefined = undefined;
        let lastMove: string | undefined = undefined;

        // for (let r = 0; r < rounds.length; r++) {
        let r = 0;
        let p = 0;
        do {
            // console.log(`=----`, p, r);
            if (activePiece === undefined) {
                // window.console.log(`adding piece`, p);
                p++;
                if (p % 100000 === 0) {
                    console.log(`added piece x10000`, p, r);
                }
                activePiece = this.nextPiece();
                // add activePiece to board.
                this.field.addPiece(activePiece);
            }
            const nextMove = this.nextInput();
            lastMove = nextMove;
            //window.console.log(`moving piece ${r} ${nextMove} ${this.field.activePiece}`);
            const ap = this.field.movePiece(nextMove);
            // window.console.log(
            //     `> moved piece ${r} ${ap.activePiece?.item} ${ap.activePiece?.location[0]}, ${ap.activePiece?.location[1]}`
            // );

            if (!ap.activePiece) {
                activePiece = undefined;
                if (activePiece === undefined) {
                    p++;
                    if (p % 100000 === 0) {
                        console.log(`added piece x10000`, p, r, new Date().getTime() / 1000 / 60);
                    }
                    // window.console.log(`adding piece`);
                    activePiece = this.nextPiece();
                    // add activePiece to board.
                    this.field.addPiece(activePiece);
                }
            }
            r++;
        } while (p < blockCount);

        const tallestPiece = this.field.getTallestPiece() ?? 0;
        return {
            height: tallestPiece + 1,
            lastField: "", // this.field.drawField(),
            lastMove: lastMove ?? "i"
        };
    }
    _lastPiece = 0;

    field: Field | undefined;
    inputs = "";
    _lastInput = 0;
}

const model = new Model();
const input =
    "><<<>>><<<><<<>>><<>>>><<<>>>><>>>><<<>>><<<<>>><<>>>><<<>>><<<<>>><<<<>>><<<<>>>><<<<>>>><<<<>><<<<><<<<><<<>>>><<<>><<>>><<<>><<>>><<>>><>><<<>><<<<>>><<>><>>><<<<>>><>><>>><<<<>>>><<<>>><<<><<<<>>><><>>>><<<><<<<>><<<>><<<>>>><><<<><<>>>><<>>>><<<><<>>>><<>><<><<<>><>>>><<<>>>><<<>><>><<<>>>><<<<><<><<<>><<>>>><<<<>><<<<><<<<><<<<><>><<><<>>><>><<<<>>><>>><>>>><<<<>>><><<>><<<<><<<>>><>>><<<><<<<><<<<><<<<>><>>><><><<<<>><>>>><<<<><>><<<<>>><<<>>><<>>>><<<<><>>>><<>><<<<>>>><<>>><<<>>><><<>>>><<<<>><<>>><<<>><><<<<>>>><<<<>>><>>>><<>>>><<<>>><>>>><<<>>>><<><<>>><>>><<<>>><<<>><>>><<<<>><<<><<>>><>>>><<<<>>><<<>>><<<<>>><<<<>><<>><><<<<>><<<>>><<<<><<<<>>>><<<>><<<><>>><<>>>><<<>>>><<>>><<<<>>><<<>>>><<<>><<<<>>><<<<>>><<>>>><<<>>>><>>><<<>>>><<>><>>>><<>>>><<<>>>><<<<><<<><<>><<<>><<<>>>><<>>>><<<<>><>>>><<<<><<<<>><<>><<>><<<<>>><<>><<><>>>><<<>><>><<>><<>><>><<<>><<<<><<<>>>><<<>>>><<<<>><>><<<<><<<>><<<<>>><>>><<<<><<<>><<<<>><<>>>><<<>>>><<<<>><<<>><><<<<>>><>><<><<<<>><<<><<<><<<<>>>><<<<>>>><><>><<<>>>><<<<>><>>><<<<><<>>><<<>>>><<>><<<>>><>>><<><<<>>><<<><<<>>><<<<><<<<>><<><<>><><<<<>><<<<>>>><><<<>>>><<<>><>>>><<>>>><<<<>>>><<<>>><<<<><<>>>><<<><<<>>>><<><<<>>>><><<<><>>>><>>>><<<>>><>><>>>><>><<>>><>>>><<<>>><<>>>><<>>>><<><<<<>>>><<>>><>><<<<>>><<<>>>><<<>>>><<>>><>><>><<<<>>>><<><<><>>>><<>>>><>>><<<<>>>><<<<>>><<><<<><<>>>><<>>><>>><>>><<<><<<>>>><<<>><<>>><><<<<>>><<<<>><<<>>>><<>><<<<><<<><<<<>><<<<>>>><<><<<><<<<>>>><<<<><<<<>>><<<>>>><<<>>><><<<<>>>><<<>><<<<><>><<<><<>>><>>>><<<><<<<>><<<<><<<<>><<>>>><>><<<>>>><<<<><<<>><<<>>>><><<<>><<<><<<<>>>><><<>><<>>><<<<><<<<><<<<><<>>>><<>>>><<><<<<>><<<<>><<<><>><<<<><<<>>>><<<>><>>>><<<<><<<<><<>><<>><<<<>><<<<>><><><<>><<<<>>>><<<>>>><>>><<<>>>><<>>><><><<><>>><<<<>>>><<>>><<<>>>><<<>>>><>><<<<>>>><<<<>>><<>>>><>>><<<<>>>><<<>>>><<<<>><><>><<<>>>><<>><<<>>><>>>><<<>>>><>><<<>>><<<<>><<<>><<<<>>>><>>>><><><<>><<<<>><<<>><<><<<<>><<>>><>><<><<>><<<<>>><>>>><<<>>>><<>>><>>>><<<><<<<>>>><<<><<<><<<>><<>>>><<<><<<<><<<<>>>><<<<>>>><<<><<<<>>><<>>>><<<>><<<>><<>>>><<>><<<>>>><><<<<>><><<<<>><<<>>><<<>>>><<<>>>><<>>><<<>><<<><>><><<<><>>>><<><<<<>>>><>>><<>>><>>>><<<<>>>><<>><<<<>><<<>><><<<<>><<>>>><<>>>><<<>><<<<>>><<><<<<>>><<>>>><<>><<<<>><<><<<><>><>>><>><<<>>><<<<>>><<>>>><<<><<<<><<<<>><<<<>>>><<<<>>><<>><<<><>>>><<<><<>>>><<<>><>>>><<<<>><<<<>><<>>>><<><<<><>>><<<>>><<>>><<>><<<<>>>><<<<>><<<<>><<<>>>><<<<>>><<>>><<<<><<<>>><<<><<>><<<<>><>>><<><<>>><<<<>>>><<<>>><<<>><<<<>>>><<>><<<<>><><<>>>><>><<<>><<<>><<<<>><>><>><<<>>>><<>><<><<>>><<>>>><<<<>>><<>>>><><<<>>><<>><<<<><<<<>><<>>>><<<<>>>><>>><>>><<<>><><<<>>><<<<>>><>>>><<<>><<<<><<<>>><<<<>>>><<<>>>><<<<>>><<<>><<<<>>><<<>>>><<<<>>>><>>><<<<><><<><<><<>>>><>>>><<<>>><<><><><<<<><<<<>>><<<>>>><<<<>>>><>>><<>>><<>><<<>>>><<><<>><<>>><<<><<<><<<>>>><>><>>><>>>><<<<>>><>><<<><>>>><<<>>>><<<><<<<>>><<<<><<>>><>>>><><<><<<<>>><>>><>><<>>><<<>>>><<<>>>><<<<><<<>>><<<<><<<>>>><<<>>>><>>><<>>>><<>>><<<<><>>><<<><<>><>>><>><<>><<>><<<>>>><<<<>><<<>>><<<<>>>><<>><>>><>>><<<>><<<><<>><>><><<<>>>><<<><<>><<<>>><<<<>><<<>>>><<<<>><>>>><>><<<><>>>><<<<><<<><>>>><<<>>>><><>>><><>>><<<>>>><<>>><<>><<>><>><>>>><<<>>>><><>>><<<<>>><<<>><<><>><<<<>>><<>>>><<<>>><<<>>><<<><<<>><<<<>>><><>>>><<>><<<>>><<<<>><<<>><><<<>>><<<><>>>><><<>><<<><<<>>><<<>>><<>>>><<<>>><<<<>>>><<>>>><<>>><<<<>><>>>><<>>>><><<>><><<<<>><<>>><<>>><<<><<>>><<<>><<<>>>><<>>><>>>><<<><<<><<>>>><><<<<>>><<>>><<<<>>>><<<>>><<<<>>>><<<<>><<>><<>>><<<>>><<<><<<<>>>><<>><<<><<<<>><<<<>>>><<><<<<><>><><<<>><<><<<>>>><<><<<><>>>><<<>>>><<<<><<>>><<<>>><<>>><<><<<<><>>><<>><<<<><<<>><<><><<<><<<><><>>><<><>>>><<><<<><<<<>>>><><<>>>><<><<><<<>>><<<<>><<<><<<>>><<<>>>><<<<>>><<>>>><<<><<<<>><<<<><<<>>>><<<>>>><<<>>>><<<>><<>>>><>><<<><<>>><<<<>>>><><<<<>>><<>><<>><<<<>><<<<><<<<>><<<<>><<<<>>><<>>>><<<<>>>><<<<>>><<<><><<<<>>><<<>>><<>><<><<<>>>><<>><<<><>><<<<>>><<<<><<<<><<><>><<>>><<<><<><<<<>>><<<>>><<<<>><<<<>>>><>>>><><<>><<>><>><<<><<>>>><<<>><<<><<>><<><<<<>>><<>>><<<<>>>><>><<>>>><<<>>><>><<<<>>><<<<>>>><<<>>><<>>><<<<><<<><>>><>><<<>>>><><<<>><<><>><<<><<<>><<>>>><<>>>><<<>><<<>>>><>>><><>>><<<>>>><<<>>><<<><<<<>><<<<><><<<><<><<<<>><><<<<>>><<<>><<<<>>>><<<>>>><<<>>><<<>>><<>>>><<>>>><<<>>>><<<>>><<<>><>>><>>><<<>>>><<>>>><<><>>>><<<><<<>>>><<><<<>><<>><<<<><<<<>>>><<<<><>>><<<<>>>><<<>>>><><<><<<>>>><<<><<>><<>>>><>>><>>>><<>>><<>><<>>><>>><<<>>>><<<>>><<<<>>><<<>>>><<<<>><><<>>>><<<<><>>><<><<<>>>><>>>><<>>>><<<><<><<<<>>>><>>><<<>>>><<<>><><<>>><<<><<>><><<<>>><<<<><<><<<>>><<>>><>>>><>>><<>>><>><><<<<>>>><<<<>>>><><<<<><<<<><<<<>>>><<<<>>><<<<><<<>><<>>>><<><<<>>><<><<<>><>>><<<<>>><<><<>>><<<><<><<<>><<<<><<>>><><<>><><><<<><<>>><<>>>><<<<>>><<<>><<<<><<>>>><>>>><<<<><<<<>>>><<>>><<<<>>><<>>><<<>>><>>><<<>>>><<<>><<><<<<><>>>><<>><<>>>><<<>>><<<>>><>>><<<<>><<<<>><<><<<<>>><<>>>><>>>><>>><<<<>>>><><<<>>>><<<<>>>><<<>>>><<<>>>><<<<><<<>>>><<<>>><<<<>>>><<<><>>><><>>>><<<<>><<>>><<<><<<<><<>><<<<>><><<><<<>>><<<<>><<<>>>><<<>>>><<><>>><<>>><<<>>><<<<><<<<>>><<<<>><>>>><<<<>>>><<<><<<<>>><<>>>><<<>>>><<><>>>><<>>>><<>><<<>><<>>><<<<>>>><<><>>><<><<<>>>><<<<>><>>><><>>>><<<>><<<<>>>><<<<><<>>>><<<<>><<<>>><><<<<>>><<>>>><<>>>><<<><<><<<<>>><<<<>>>><<<><<<<><><<<<>>>><<<<>>><<<<><<<><<<>><><<<<><<>>><<<>><<<>>>><<>>>><<>>>><<>>>><<><<<<>><<<<><<<<>>><<><>>>><>>><><>><<><<>>>><<<<><>><<<<><<>><<>>><>><<<>><>><>><<<>>><<>>>><<<>>>><<>>><<>>>><<>>><<<<>>><<<<>>><<<<><<>>>><<<<>>>><<<>>><>>><<>>>><<<>>>><>>>><>><<<<>>>><<<<><<>>>><<<<><>>>><<<>><<<<>>>><>>><<<<>>>><<>>><<<<>><<<<><<<>><<<>><<>><>>>><>><<<<>>>><<<>><<>><<>>><<<>>>><>>>><<>>><>>><<><<>><<<<>><<<>>><<<><<<>>><<<<>>><<<><<<>>>><<<<><<>>><<<>>>><>>>><<<<><><<<<>>>><<>>><>>><<<<>>>><<<<>><<>><<<>>>><<<>><>>>><>>>><><<<>>>><<<<><<<>>><<>>><><<<<>><<<<>><>>><>><<<>>>><<<>>>><<<<>><<>>><<<><<<>><<<>><<<>><<>>><<<<>><<<>>>><<>>>><<<>><>>><>>>><<<<>>>><<<>><>>><<>><><<<>>>><>><<<<>>>><<<<><>>>><<<<><<><<<<>>>><<>><<<>>>><<<><<>>><<<<><<<<>><<>>><<<<>>><<><<<<>>><<><<>>><<>><<<<><>>><<<<>>><<>><<<<>>><<<><>>>><><<><><<<>><>>><>><>>><<<>>>><>><<<<>><<<>><<<<>>><<<>>><<<>>>><><<><<<>><<<<>><<><<<<>><<<<>>>><<<<>><<<>>><<<<>>>><<>>>><<<><<<>>>><<>>><<>>>><<<<>>><<>>>><>>>><<<<>>>><<<>>><<<>>><<<><>>>><>>>><<<<>>><<<>>>><>>>><<>>><<>>><><<<<>><<>><<>><<<<>>><<<<>>>><<<>>>><<<>><>><<<<><>><>>>><<<<>>>><<<>>>><<<>>>><<>>>><>>>><<<<>>><>>>><<<<>><<><<<>><<<<>><<<>><<<<><<<>>>><<>><>><>><<<>>>><>><<<><<><<<<>>><<<<><>>>><<><>><<<>><>><<<>>>><<<><<<<>>>><<<<><>>>><<<<>><<<<>><<<<><>>>><>>><<<<>>>><<<><<<>>><<<>><<>><<<<>>>><<<>><<<<>>><<>>>><<>><<>>>><<><<><<<<>>>><<<>>><<<><>>>><<>>>><><<<>><>><<><<>>>><><>>>><<<>>>><<<<>><<>><<<>>>><>>><<>>><>>><><<><<<<>><>><<<>>><<<>><><<<<>><<<>>><><<<<><>>><<<><><<<<>>><<>>><>>><>>>><<<>><<<<>>>><>>><<>>>><<>>><<<>>>><>>><<<>>>><<<<>>><<<<>>><<><<><<>>><<<<>>>><<<><>><>>>><<>>>><<<>>>><>>><<<><<><>>>><<>>><<<>>>><<>>>><<<><<<<>>>><>><<<>>><<<><<<>>><><<<<>>>><>><>>>><<<<><<<<>>>><<>>>><><<<>><>>><<<<>><<<<>>><<<<>>>><<<>><<<<>>>><<><>><<<>>><><<<<>>>><<<<><<<>><>><<>>><<<><<<<>><<>>>><<<>>>><<>>>><<<<>><<>><>>><<<<>>><<<>>>><<<<>>>><<>><<><<>><<<<>>><<<<>>><<<<>>>><><<<>>><<<<>>><<<<><><<<<><>><<<<>>><<<>>><<<<>>>><<<<>>><>>><<>>><<<<>><<<>><>><<>>>><>>>><>><<<>>>><<<<>>>><<<>>>><<<><<<><<<>><>>><<<<>>>><<<>>>><<<<>>><<<<>><<>><<<<><<<><>><>>><><<<><<<>>>><<<>>><<<<>>>><<<<><<>>>><<<<><<<>>><<>><<<<>><>>><<>>>><<<><<>>><>>><<>>><<<>>>><>><><<<<>>><><<<<>>><<<>>>><<><><<><<>>><>><<<<>>><<<>>>><<<><<<>><<<<>>><><>><<>>>><<<><<<<><>>><>><<<<>>>><<>>><<<<>>>><<<<>>><<>>><<<<><<>>>><<<>>>><<>>><>>><<>>><<<><<<>><<<<>>>><<<<>>><<>><>>>><<<<>>>><<<><>>>><<<<><<<<>><<>>><<<<>>>><><<>><<<<><>>>><<<<>><>>><><>>><<>>>><<<><><<<<>><<<><<<<>>>><><>>><<>>><<<>>><<<<>>><<<<>><<>>>><<<>>><>>><<<<>>>><<><>>><<<><<<>>>><<<>>>><<<><>>>><<<<>>><>>>><<<>>><<<><<<<>>><<<<><<<<>>><<>>>><<<>>><<<<><<><<<<>>>><<<>><<<<>><>>><<<<><<>>>><<>><>>>><<<<><<<>><<>>>><<>>>><<<<>><<<<>>>><<>>>><<<>>>><<>>><><<<>>><<><<>>>><<<>>>><<>>>><>><<<<>>>><<<<>>>><<><<><<<<><<>>><<>>><<<<>>>><<<>><<<<><<<<>>><<<<>>><<<>>><<<<><<>>>><<<<>>>><<<>><<<>><>>>><<<><><<<<><><<<>>><<<<>>>><<<><<<<>>>><<<>>>><>><<<<>>>><<>>>><<<>>>><<<<><<<>>>><>>>><><<<><<<>><>>>><<<>><<<<><<<<>><<>>><>>>><<>><>><>><<<>>><<<>>><<<>>><<>>><<>><<<>>>><<<<>>><<<>><>>>><<<<><<><>>>><<>>><<><<<<>><<<<>>>><<>><<<><<>>><<<<>><<<>><<><<<<>>>><<<>>>><<<<>>><>><<<<>><<<><>><<>>><<<<><<<<>>>><<<>><<<>>>><<<<>>>><<<>>><<>><>>><>>><<<>>><><<<<>>><>>><>>>><>>><<<<>>>><<<><<><><<<>>>><<<><<<>><<<<>>><<<><<><<<<>>>><<><<<<>>><>>>><>>>><>><<<<>>>><<<<>>><>>><<<>><>>>><<<<>><<<<>>>><>>><>>><<<<>><<<>>>><<<><<<<><>>><<<<>>><<<>>>><><<<><>><<<<>><<<><<<<>>>><>><><<<<><<<<>>>><<<>>>><<>><<<<><<>>><<<<><<<><<<<>><<<><<>>>><<<<>><>>>><<<>>><<>><<<>><><<<<>>>><<<>><<>><>>>><<<>>><<>>><<<>>><<>>><<<><<<<>>><>><<<>>>><<<<>>>><<<>><<<<>>>><>><<<><><<<<>><<<>>>><>>>><<<<>>>><<>>><<>>><><>>><<<><>><<>>>><>>><<<>>>><><>><>>>><<>>><>><<<<>><<>>><<>>>><><<><<<>><<>>>><<<>>><<><<<>>>><<<><><<>><<<>><<<><<<>>>><<<>>><>><<<>>><>>><>>><<>>><<<<><<<<>><<<>>><<<><>>><<<<>><>><<<>>><<>><>><<><>>><<<<>><>>><<<<><<<><<<><<<>>><<>>>><<<<>><<>><<>>><<>><<>><<<<>>><<><<<><>>><>><<><<>>>><<>>><<<<>>><<<>>>><>>><>>><<>>><><<<><<><<>>><>>>><>>>><<<<>>><>><<<>>>><>><<<>><<>>><>><<><<<><<<>>><<>>><<<<>>><><<<<>>><<<>><>>>><<<>>>><<<<><<<<>>>><<>><><<>>><<<><<>>><<>>>><<>><<<><<<><<<>>><<>><<<>>>><><<<<>>>><<>>><<>><<>>><<>>><<>>>><<<><<<<>><<>>>><<<>>><><<><<><<>>><<<<><<<><<><<>>>><<>>><><<<<>><<>><><<><>>><>>><<>>><<<<>>><<<<><>><<>>>><<<<>>>><>><<<<>><<><<<>>>><>><<<<>>>><<<><<<>><><<<<>>>><><<<<>><<<><<>>>><<><<<>><<<>><<<>><<<>>><<><<<>>>><>><<>>>><<>>><>>>><>>><><>><<<>>><<<><><<>><<<>>><<<<>>><<<>>>><><>>><<><>><<<>><<>><<>>><<<<>>><<<><<<<><>><<<>>><<<>>><<>>>><<<<>>><<>>><<<><<>>><<<>><<<>>><>>>><<<<>>>><<<<>><<<<>>><<>><<<<>><<<>>><<<>><><<<>>>><<>>>><<<<>>>><<>><>>>><<<<>>><>>>><>><<<<>>><>>><<>>>><<<<><<<><<<>><<>>><<><>>><<<<>>><>>>><<>>><<<<>>><>><<<>><<><<<><<<<>>><><<<<>>><<<<>>><<><<<<>><<>>>><>>>><<><><<<>>><>><>><>>>><><<<<>>><<<<>>>><<>><<>";
const result = model.runGame(input ?? testData, { width: 7, height: 3 }, 1_000_000_000_000); // 1_000_000_000_000
console.log(result.height);

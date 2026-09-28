export interface Cell {
    mine: boolean;
    revealed: boolean;
    flagged: boolean;
    adjacent: number;
}

export type Board = Cell[][];

export const ROWS = 9;
export const COLS = 9;
export const MINES = 10;

export function createBoard(rows = ROWS, cols = COLS): Board {
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
            mine: false,
            revealed: false,
            flagged: false,
            adjacent: 0,
        }))
    );
}

function neighbours(board: Board, r: number, c: number): [number, number][] {
    const out: [number, number][] = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length)
                out.push([nr, nc]);
        }
    }
    return out;
}

function clone(board: Board): Board {
    return board.map((row) => row.map((cell) => ({ ...cell })));
}

/** Place mines after the first click so that click (and its neighbours) is always safe. */
export function placeMines(
    board: Board,
    mines: number,
    safeR: number,
    safeC: number
): Board {
    const next = clone(board);
    const rows = next.length;
    const cols = next[0].length;
    const forbidden = new Set<string>([`${safeR},${safeC}`]);
    neighbours(next, safeR, safeC).forEach(([r, c]) => forbidden.add(`${r},${c}`));
    let placed = 0;
    while (placed < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (next[r][c].mine || forbidden.has(`${r},${c}`)) continue;
        next[r][c].mine = true;
        placed++;
    }
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            next[r][c].adjacent = neighbours(next, r, c).filter(
                ([nr, nc]) => next[nr][nc].mine
            ).length;
        }
    }
    return next;
}

/** Reveal a cell, flood-filling through zeros. Returns whether a mine was hit. */
export function reveal(
    board: Board,
    r: number,
    c: number
): { board: Board; exploded: boolean } {
    const next = clone(board);
    const cell = next[r][c];
    if (cell.revealed || cell.flagged) return { board: next, exploded: false };
    if (cell.mine) {
        cell.revealed = true;
        return { board: next, exploded: true };
    }
    const stack: [number, number][] = [[r, c]];
    while (stack.length) {
        const [cr, cc] = stack.pop() as [number, number];
        const cur = next[cr][cc];
        if (cur.revealed || cur.flagged) continue;
        cur.revealed = true;
        if (cur.adjacent === 0) {
            neighbours(next, cr, cc).forEach(([nr, nc]) => {
                if (!next[nr][nc].revealed && !next[nr][nc].mine)
                    stack.push([nr, nc]);
            });
        }
    }
    return { board: next, exploded: false };
}

export function toggleFlag(board: Board, r: number, c: number): Board {
    const next = clone(board);
    const cell = next[r][c];
    if (!cell.revealed) cell.flagged = !cell.flagged;
    return next;
}

export function isWon(board: Board): boolean {
    return board.every((row) =>
        row.every((cell) => cell.mine || cell.revealed)
    );
}

export function revealMines(board: Board): Board {
    const next = clone(board);
    next.forEach((row) =>
        row.forEach((cell) => {
            if (cell.mine) cell.revealed = true;
        })
    );
    return next;
}

export function countFlags(board: Board): number {
    return board.reduce(
        (n, row) => n + row.filter((cell) => cell.flagged).length,
        0
    );
}

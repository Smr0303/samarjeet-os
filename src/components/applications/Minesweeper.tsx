import React, { useCallback, useEffect, useState } from 'react';
import Window from '../os/Window';
import {
    Board,
    COLS,
    MINES,
    ROWS,
    countFlags,
    createBoard,
    isWon,
    placeMines,
    reveal,
    revealMines,
    toggleFlag,
} from '../minesweeper/board';

export interface MinesweeperProps extends WindowAppProps {}

type Status = 'ready' | 'playing' | 'won' | 'lost';

const CELL = 26;
const GAP = 3; // space between tiles
const NUMBER_COLORS = [
    '',
    '#0000ff',
    '#008000',
    '#ff0000',
    '#000080',
    '#800000',
    '#008080',
    '#000000',
    '#808080',
];

const Minesweeper: React.FC<MinesweeperProps> = (props) => {
    const [board, setBoard] = useState<Board>(() => createBoard());
    const [status, setStatus] = useState<Status>('ready');
    const [seconds, setSeconds] = useState(0);
    const [pressing, setPressing] = useState(false);

    useEffect(() => {
        if (status !== 'playing') return;
        const t = setInterval(() => setSeconds((s) => Math.min(999, s + 1)), 1000);
        return () => clearInterval(t);
    }, [status]);

    const reset = useCallback(() => {
        setBoard(createBoard());
        setStatus('ready');
        setSeconds(0);
    }, []);

    const onReveal = (r: number, c: number) => {
        if (status === 'won' || status === 'lost') return;
        let current = board;
        if (status === 'ready') {
            current = placeMines(current, MINES, r, c);
            setStatus('playing');
        }
        const result = reveal(current, r, c);
        if (result.exploded) {
            setBoard(revealMines(result.board));
            setStatus('lost');
            return;
        }
        if (isWon(result.board)) {
            setBoard(result.board);
            setStatus('won');
            return;
        }
        setBoard(result.board);
    };

    const onFlag = (e: React.MouseEvent, r: number, c: number) => {
        e.preventDefault();
        if (status === 'won' || status === 'lost') return;
        setBoard((b) => toggleFlag(b, r, c));
    };

    const face =
        status === 'lost' ? ':(' : status === 'won' ? 'B)' : pressing ? ':O' : ':)';
    const minesLeft = Math.max(0, MINES - countFlags(board));

    return (
        <Window
            top={120}
            left={480}
            width={COLS * (CELL + GAP) + 70}
            height={ROWS * (CELL + GAP) + 220}
            windowTitle="Minesweeper"
            windowBarIcon="mineIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
        >
            <div className="site-page" style={styles.wrap}>
                <div style={styles.menu}>
                    <p style={styles.menuItem}>
                        <u>G</u>ame
                    </p>
                    <p style={styles.menuItem}>
                        <u>H</u>elp
                    </p>
                </div>
                <div style={styles.panel} onContextMenu={(e) => e.preventDefault()}>
                    <div style={styles.header}>
                        <div style={styles.counter}>{String(minesLeft).padStart(3, '0')}</div>
                        <button
                            type="button"
                            style={styles.smiley}
                            className="site-button"
                            onMouseDown={() => setPressing(true)}
                            onMouseUp={() => setPressing(false)}
                            onMouseLeave={() => setPressing(false)}
                            onClick={reset}
                            aria-label="New game"
                        >
                            {face}
                        </button>
                        <div style={styles.counter}>{String(seconds).padStart(3, '0')}</div>
                    </div>
                    <div
                        style={styles.grid}
                        onMouseDown={(e) => {
                            if (e.button === 0 && status !== 'won' && status !== 'lost')
                                setPressing(true);
                        }}
                        onMouseUp={() => setPressing(false)}
                        onMouseLeave={() => setPressing(false)}
                    >
                        {board.map((row, r) => (
                            <div key={r} style={styles.row}>
                                {row.map((cell, c) => {
                                    const revealed = cell.revealed;
                                    let content: React.ReactNode = '';
                                    if (revealed && cell.mine) content = '✹';
                                    else if (revealed && cell.adjacent > 0)
                                        content = cell.adjacent;
                                    else if (!revealed && cell.flagged) content = '⚑';
                                    const exploded =
                                        revealed && cell.mine && status === 'lost';
                                    return (
                                        <div
                                            key={c}
                                            role="button"
                                            aria-label={`cell ${r + 1},${c + 1}`}
                                            className={revealed ? 'mine-cell-open' : 'mine-cell'}
                                            style={Object.assign(
                                                {},
                                                styles.cell,
                                                revealed && styles.cellOpen,
                                                exploded && { background: '#e2614c' },
                                                {
                                                    color:
                                                        revealed && !cell.mine
                                                            ? NUMBER_COLORS[cell.adjacent]
                                                            : cell.flagged
                                                            ? '#e2614c'
                                                            : '#1f1b2e',
                                                }
                                            )}
                                            onClick={() => onReveal(r, c)}
                                            onContextMenu={(e) => onFlag(e, r, c)}
                                        >
                                            {content}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    wrap: {
        flexDirection: 'column',
        background: '#fdf6ee',
        userSelect: 'none',
    },
    menu: {
        height: 32,
        alignItems: 'center',
        padding: '0 10px',
        flexShrink: 0,
        borderBottom: '1px solid rgba(31, 27, 46, 0.12)',
    },
    menuItem: {
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 500,
        fontSize: 13,
        color: '#3a3346',
        marginRight: 14,
    },
    panel: {
        flexDirection: 'column',
        margin: 12,
        padding: 12,
        borderRadius: 14,
        border: '1.5px solid #1f1b2e',
        background: '#fffaf4',
        alignSelf: 'flex-start',
    },
    header: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    counter: {
        background: '#1b1726',
        color: '#f2b46d',
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 600,
        fontSize: 18,
        lineHeight: '30px',
        padding: '0 10px',
        borderRadius: 8,
        minWidth: 40,
        justifyContent: 'center',
        letterSpacing: 2,
    },
    smiley: {
        width: 36,
        height: 32,
        padding: 0,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 14,
        lineHeight: '28px',
        cursor: 'pointer',
    },
    grid: {
        flexDirection: 'column',
        gap: GAP,
    },
    row: {
        flexDirection: 'row',
        gap: GAP,
    },
    // raised warm tile; see .mine-cell in index.css for hover and press
    cell: {
        width: CELL,
        height: CELL,
        boxSizing: 'border-box',
        borderRadius: 6,
        background: '#f6d3b0',
        boxShadow: 'inset 0 -3px 0 rgba(31, 27, 46, 0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 15,
        fontWeight: 700,
        cursor: 'pointer',
    },
    cellOpen: {
        background: '#f1e8df',
        boxShadow: 'none',
        cursor: 'default',
    },
};

export default Minesweeper;

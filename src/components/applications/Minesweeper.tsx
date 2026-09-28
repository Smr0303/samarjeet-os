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
            width={COLS * CELL + 46}
            height={ROWS * CELL + 196}
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
                                                exploded && { background: '#ff0000' },
                                                {
                                                    color:
                                                        revealed && !cell.mine
                                                            ? NUMBER_COLORS[cell.adjacent]
                                                            : cell.flagged
                                                            ? '#ff0000'
                                                            : '#000',
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
        background: '#c0c0c0',
        userSelect: 'none',
    },
    menu: {
        height: 20,
        alignItems: 'center',
        paddingLeft: 4,
        flexShrink: 0,
    },
    menuItem: {
        fontFamily: 'MSSerif',
        fontSize: 13,
        marginRight: 14,
    },
    panel: {
        flexDirection: 'column',
        margin: 6,
        padding: 6,
        boxShadow: 'var(--border-raised-outer), var(--border-raised-inner)',
        alignSelf: 'flex-start',
    },
    header: {
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 4,
        marginBottom: 6,
        boxShadow: 'var(--border-field)',
    },
    counter: {
        background: '#000',
        color: '#ff0000',
        fontFamily: 'Terminal, monospace',
        fontSize: 22,
        lineHeight: '26px',
        padding: '0 3px',
        minWidth: 40,
        textAlign: 'center',
        letterSpacing: 2,
    },
    smiley: {
        width: 30,
        height: 30,
        padding: 0,
        fontFamily: 'Terminal, monospace',
        fontSize: 15,
        lineHeight: '28px',
        cursor: 'pointer',
    },
    grid: {
        flexDirection: 'column',
        boxShadow: 'var(--border-field)',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: CELL,
        height: CELL,
        boxSizing: 'border-box',
        boxShadow: 'var(--border-raised-outer), var(--border-raised-inner)',
        background: '#c0c0c0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'MillenniumBold, monospace',
        fontSize: 15,
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    cellOpen: {
        boxShadow: 'none',
        border: '1px solid #808080',
        borderRightColor: '#c0c0c0',
        borderBottomColor: '#c0c0c0',
        cursor: 'default',
    },
};

export default Minesweeper;

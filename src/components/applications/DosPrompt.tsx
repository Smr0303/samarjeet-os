import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import Window from '../os/Window';
import DesktopContext from '../os/DesktopContext';
import { BANNER, runCommand } from '../dos/commands';

export interface DosPromptProps extends WindowAppProps {}

const PROMPT = 'sam@samos ~ $ ';
const MAX_LINES = 400;

const DosPrompt: React.FC<DosPromptProps> = (props) => {
    const desktop = useContext(DesktopContext);
    const [lines, setLines] = useState<string[]>(BANNER);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [histIdx, setHistIdx] = useState(-1);
    const [matrix, setMatrix] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const screenRef = useRef<HTMLDivElement>(null);

    const focus = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const t = setTimeout(focus, 50);
        return () => clearTimeout(t);
    }, [focus]);

    useEffect(() => {
        if (screenRef.current)
            screenRef.current.scrollTop = screenRef.current.scrollHeight;
    }, [lines, input]);

    const submit = useCallback(() => {
        const cmd = input;
        const result = runCommand(cmd, {
            openApp: desktop.openApp,
            openShowcaseAt: desktop.openShowcaseAt,
        });
        if (cmd.trim()) {
            setHistory((h) => [...h, cmd]);
        }
        setHistIdx(-1);
        setInput('');
        if (result.exit) {
            props.onClose();
            return;
        }
        if (result.matrix) setMatrix(true);
        setLines((prev) => {
            const next = result.clear
                ? [...result.output]
                : [...prev, PROMPT + cmd, ...result.output];
            return next.length > MAX_LINES
                ? next.slice(next.length - MAX_LINES)
                : next;
        });
    }, [input, desktop, props]);

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            submit();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!history.length) return;
            const idx = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
            setHistIdx(idx);
            setInput(history[idx]);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (histIdx < 0) return;
            const idx = histIdx + 1;
            if (idx >= history.length) {
                setHistIdx(-1);
                setInput('');
            } else {
                setHistIdx(idx);
                setInput(history[idx]);
            }
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            setLines([]);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setInput('');
            setHistIdx(-1);
        }
    };

    return (
        <Window
            top={90}
            left={300}
            width={680}
            height={430}
            windowTitle="Terminal: sam@samos"
            windowBarIcon="dosIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
        >
            <div
                className="site-page"
                style={styles.screen}
                onMouseDown={(e) => {
                    // keep focus on the hidden input without stealing window drag
                    if (e.button === 0) setTimeout(focus, 0);
                }}
                ref={screenRef}
            >
                <div style={styles.output}>
                    {lines.map((line, i) => (
                        <div key={i} style={styles.line}>
                            {line.startsWith(PROMPT) ? (
                                <>
                                    <span style={styles.prompt}>{PROMPT}</span>
                                    {line.slice(PROMPT.length)}
                                </>
                            ) : line === '' ? (
                                '\u00a0'
                            ) : (
                                line
                            )}
                        </div>
                    ))}
                    <div style={styles.line}>
                        <span style={styles.prompt}>{PROMPT}</span>
                        {input}
                        <span className="dos-cursor" style={styles.cursor} />
                    </div>
                </div>
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    style={styles.hiddenInput}
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-label="Terminal command line"
                />
                {matrix && <MatrixRain onDone={() => setMatrix(false)} />}
            </div>
        </Window>
    );
};

/** Five seconds of green rain, then back to the prompt. */
const MatrixRain: React.FC<{ onDone: () => void }> = ({ onDone }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const parent = canvas.parentElement;
        canvas.width = parent ? parent.clientWidth : 640;
        canvas.height = parent ? parent.clientHeight : 380;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const size = 14;
        const cols = Math.floor(canvas.width / size);
        const drops = new Array(cols).fill(1).map(() => Math.random() * 30);
        const chars = 'アイウエオカキクケコサシスセソ0123456789ABCDEF';
        let raf = 0;
        let last = 0;
        const draw = (t: number) => {
            if (t - last > 50) {
                last = t;
                ctx.fillStyle = 'rgba(27, 23, 38, 0.14)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#4af626';
                ctx.font = `${size}px 'JetBrains Mono', monospace`;
                for (let i = 0; i < cols; i++) {
                    const ch = chars[Math.floor(Math.random() * chars.length)];
                    ctx.fillText(ch, i * size, drops[i] * size);
                    if (drops[i] * size > canvas.height && Math.random() > 0.975)
                        drops[i] = 0;
                    drops[i]++;
                }
            }
            raf = requestAnimationFrame(draw);
        };
        raf = requestAnimationFrame(draw);
        const stop = setTimeout(onDone, 5000);
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(stop);
        };
    }, [onDone]);
    return <canvas ref={canvasRef} style={styles.matrix} />;
};

const styles: StyleSheetCSS = {
    // warm-ink terminal with an amber prompt
    screen: {
        flexDirection: 'column',
        background: '#1b1726',
        color: '#e9e1f0',
        fontFamily: "'JetBrains Mono', Menlo, Consolas, monospace",
        fontSize: 13,
        lineHeight: 1.6,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '12px 16px',
        cursor: 'text',
        position: 'absolute',
    },
    prompt: {
        color: '#f2b46d',
        fontWeight: 600,
    },
    cursor: {
        display: 'inline-block',
        width: 8,
        height: 16,
        marginLeft: 1,
        verticalAlign: 'text-bottom',
        background: '#f2b46d',
        borderRadius: 2,
        boxShadow: '0 0 8px rgba(242, 180, 109, 0.7)',
    },
    output: {
        display: 'flex',
        flexDirection: 'column',
        whiteSpace: 'pre',
    },
    line: {
        minHeight: 20,
        display: 'block',
    },
    hiddenInput: {
        position: 'absolute',
        opacity: 0,
        width: 1,
        height: 1,
        left: 0,
        bottom: 0,
        border: 'none',
        padding: 0,
        margin: 0,
        outline: 'none',
    },
    matrix: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
    },
};

export default DosPrompt;

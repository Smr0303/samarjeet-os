import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import theme from '../../constants/theme';

/**
 * SamOS boot: a short BIOS check listing my stack, then the SamOS logo with
 * a sun rising behind it, then it fades into the desktop. A click or a key
 * skips it.
 *
 * Inside the 3D room the OS loads long before the monitor is switched on,
 * so there it waits for the room's "power-on" message (the room answers
 * "os-ready" with it if the screen is already on). Opened on its own, it
 * boots straight away.
 */
const BIOS: [string, string][] = [
    ['CPU: Python 3 / TypeScript', 'OK'],
    ['Storage: PostgreSQL, MySQL, Redis', 'OK'],
    ['Queues: Celery, SQS, BullMQ', 'OK'],
    ['Voice: LiveKit SIP trunks', 'OK'],
    ['AI: Gemini, LiteLLM, MCP', 'OK'],
    ['Cloud: AWS, Terraform, Grafana', 'OK'],
];
const LINE_MS = 230;
const BIOS_MS = 600 + BIOS.length * LINE_MS + 400;
const LOGO_MS = 2000;

type Phase = 'off' | 'bios' | 'logo' | 'done';

const inRoom = window.parent !== window;

const BootScreen: React.FC = () => {
    const [phase, setPhase] = useState<Phase>(inRoom ? 'off' : 'bios');
    const [shown, setShown] = useState(0);

    // In the room, wait for the monitor to be switched on
    useEffect(() => {
        if (!inRoom) return;
        const onMessage = (e: MessageEvent) => {
            if (e.data && e.data.type === 'power-on') setPhase((p) => (p === 'off' ? 'bios' : p));
        };
        window.addEventListener('message', onMessage);
        window.parent.postMessage({ type: 'os-ready' }, '*');
        return () => window.removeEventListener('message', onMessage);
    }, []);

    // BIOS lines tick in, then the logo, then done
    useEffect(() => {
        if (phase === 'bios') {
            const timers = BIOS.map((_, i) => setTimeout(() => setShown(i + 1), 600 + i * LINE_MS));
            timers.push(setTimeout(() => setPhase('logo'), BIOS_MS));
            return () => timers.forEach(clearTimeout);
        }
        if (phase === 'logo') {
            const t = setTimeout(() => setPhase('done'), LOGO_MS);
            return () => clearTimeout(t);
        }
    }, [phase]);

    // any click or key skips the boot once it has started
    useEffect(() => {
        if (phase !== 'bios' && phase !== 'logo') return;
        const skip = () => setPhase('done');
        window.addEventListener('mousedown', skip);
        window.addEventListener('keydown', skip);
        return () => {
            window.removeEventListener('mousedown', skip);
            window.removeEventListener('keydown', skip);
        };
    }, [phase]);

    return (
        <AnimatePresence>
            {phase !== 'done' && (
                <motion.div
                    key="boot"
                    style={styles.screen}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    {phase === 'bios' && (
                        <div style={styles.bios}>
                            <p style={styles.biosTitle}>SamOS BIOS v2026.11</p>
                            <p style={styles.biosLine}>(C) Samarjeet Mohite, Bangalore</p>
                            <div style={{ height: 20 }} />
                            {BIOS.slice(0, shown).map(([label, ok]) => (
                                <p key={label} style={styles.biosLine}>
                                    {label.padEnd(38, '.')}
                                    <span style={styles.ok}> {ok}</span>
                                </p>
                            ))}
                            {shown === BIOS.length && (
                                <p style={styles.biosLine}>
                                    Booting SamOS<span className="loading" />
                                </p>
                            )}
                        </div>
                    )}
                    {phase === 'logo' && (
                        <motion.div
                            style={styles.logoScreen}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <motion.div
                                style={styles.sun}
                                initial={{ y: 140, scale: 0.8 }}
                                animate={{ y: 0, scale: 1 }}
                                transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
                            />
                            <motion.p
                                style={styles.logo}
                                initial={{ opacity: 0, y: 16, letterSpacing: '0.3em' }}
                                animate={{ opacity: 1, y: 0, letterSpacing: '0.04em' }}
                                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                            >
                                SamOS
                            </motion.p>
                            <div style={styles.bar}>
                                <motion.div
                                    style={styles.barFill}
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: LOGO_MS / 1000 - 0.2, ease: 'easeInOut' }}
                                />
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const styles: StyleSheetCSS = {
    screen: {
        position: 'absolute',
        inset: 0,
        zIndex: 1000000,
        background: '#14111d',
        flexDirection: 'column',
    },
    bios: {
        flexDirection: 'column',
        padding: '48px 56px',
    },
    biosTitle: {
        fontFamily: theme.pixelFont,
        fontSize: 26,
        color: theme.amber,
        marginBottom: 4,
    },
    biosLine: {
        fontFamily: "'JetBrains Mono', Menlo, monospace",
        fontSize: 15,
        lineHeight: 1.8,
        color: '#e9e1f0',
        whiteSpace: 'pre',
    },
    ok: {
        color: theme.teal,
        fontWeight: 600,
    },
    logoScreen: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        background: 'linear-gradient(180deg, #2a2547 0%, #43386a 38%, #a8698a 72%, #e99a7e 90%, #f6c08a 100%)',
    },
    sun: {
        position: 'absolute',
        width: 260,
        height: 260,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #ffe2b0 0%, #ffbf7a 45%, rgba(255, 170, 110, 0) 70%)',
        top: '50%',
        left: '50%',
        marginLeft: -130,
        marginTop: -110,
    },
    logo: {
        position: 'relative',
        fontFamily: theme.pixelFont,
        fontWeight: 600,
        fontSize: 104,
        color: theme.cream,
        textShadow: '0 4px 0 rgba(31, 27, 46, 0.35)',
    },
    bar: {
        position: 'relative',
        marginTop: 28,
        width: 260,
        height: 12,
        borderRadius: 999,
        border: `1.5px solid ${theme.cream}`,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        background: theme.amber,
    },
};

export default BootScreen;

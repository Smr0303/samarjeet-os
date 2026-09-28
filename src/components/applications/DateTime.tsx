import React, { useEffect, useState } from 'react';
import Window from '../os/Window';

export interface DateTimeProps extends WindowAppProps {}

const BANGALORE = 'Asia/Kolkata';

function formatClock(date: Date, timeZone?: string) {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone,
    }).format(date);
}

function formatDate(date: Date, timeZone?: string) {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone,
    }).format(date);
}

function zoneLabel(): string {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'your time zone';
    } catch (e) {
        return 'your time zone';
    }
}

/** Tray clock -> Date/Time Properties: my clock in Bangalore next to yours. */
const DateTime: React.FC<DateTimeProps> = (props) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    return (
        <Window
            top={130}
            left={400}
            width={500}
            height={330}
            windowTitle="Date/Time Properties"
            windowBarIcon="clockIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
        >
            <div className="site-page" style={styles.wrap}>
                <div style={styles.tabRow}>
                    <div style={styles.tab}>
                        <p style={styles.tabText}>Date &amp; Time</p>
                    </div>
                </div>
                <div style={styles.sheet}>
                    <div style={styles.columns}>
                        <div style={styles.column}>
                            <p style={styles.caption}>Bangalore (my desk)</p>
                            <div style={styles.clock}>{formatClock(now, BANGALORE)}</div>
                            <p style={styles.date}>{formatDate(now, BANGALORE)}</p>
                        </div>
                        <div style={styles.column}>
                            <p style={styles.caption}>You ({zoneLabel()})</p>
                            <div style={styles.clock}>{formatClock(now)}</div>
                            <p style={styles.date}>{formatDate(now)}</p>
                        </div>
                    </div>
                    <p style={styles.zone}>
                        Current time zone: (GMT+05:30) Chennai, Kolkata, Mumbai,
                        New Delhi
                    </p>
                </div>
                <div style={styles.buttons}>
                    <button
                        type="button"
                        className="site-button"
                        style={styles.button}
                        onClick={props.onClose}
                    >
                        OK
                    </button>
                </div>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    wrap: {
        flexDirection: 'column',
        background: '#c0c0c0',
        padding: 8,
        boxSizing: 'border-box',
    },
    tabRow: {
        flexDirection: 'row',
        paddingLeft: 2,
    },
    tab: {
        boxShadow: 'var(--border-raised-outer), var(--border-raised-inner)',
        background: '#c0c0c0',
        padding: '3px 10px 0 10px',
        height: 22,
        marginBottom: -2,
        zIndex: 1,
    },
    tabText: {
        fontFamily: 'MSSerif',
        fontSize: 13,
    },
    sheet: {
        flex: 1,
        flexDirection: 'column',
        boxShadow: 'var(--border-raised-outer), var(--border-raised-inner)',
        padding: 14,
        background: '#c0c0c0',
        justifyContent: 'space-between',
    },
    columns: {
        justifyContent: 'space-between',
    },
    column: {
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
    },
    caption: {
        fontFamily: 'MSSerif',
        fontSize: 13,
        marginBottom: 8,
    },
    clock: {
        background: '#000',
        color: '#4af626',
        fontFamily: 'Terminal, monospace',
        fontSize: 26,
        lineHeight: '38px',
        padding: '0 10px',
        boxShadow: 'var(--border-field)',
        letterSpacing: 1,
        minWidth: 150,
        textAlign: 'center',
    },
    date: {
        fontFamily: 'MSSerif',
        fontSize: 12,
        marginTop: 8,
        textAlign: 'center',
    },
    zone: {
        fontFamily: 'MSSerif',
        fontSize: 12,
        marginTop: 12,
    },
    buttons: {
        justifyContent: 'flex-end',
        paddingTop: 8,
    },
    button: {
        minWidth: 76,
        fontSize: 13,
        fontFamily: 'MSSerif',
    },
};

export default DateTime;

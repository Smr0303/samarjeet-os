import React, { useContext, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import theme from '../../constants/theme';
import { Icon } from '../general';
import { IconName } from '../../assets/icons';
import DesktopContext from './DesktopContext';

export interface ToolbarProps {
    windows: DesktopWindows;
    toggleMinimize: (key: string) => void;
    shutdown: () => void;
}

interface MenuItem {
    label: React.ReactNode;
    icon: IconName;
    action?: () => void;
    children?: MenuItem[];
}

const BANGALORE = 'Asia/Kolkata';

/** The tray clock shows my time: it is my desk. */
const getTime = () => {
    try {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: BANGALORE,
        }).format(new Date());
    } catch (e) {
        const date = new Date();
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const amPm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const mins = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + mins + ' ' + amPm;
    }
};

const Toolbar: React.FC<ToolbarProps> = ({
    windows,
    toggleMinimize,
    shutdown,
}) => {
    const desktop = useContext(DesktopContext);

    const [startWindowOpen, setStartWindowOpen] = useState(false);
    const [openSub, setOpenSub] = useState<string | null>(null);
    const lastClickInside = useRef(false);

    const [lastActive, setLastActive] = useState('');

    useEffect(() => {
        let max = 0;
        let k = '';
        Object.keys(windows).forEach((key) => {
            if (windows[key].zIndex >= max) {
                max = windows[key].zIndex;
                k = key;
            }
        });
        setLastActive(k);
    }, [windows]);

    const [time, setTime] = useState(getTime());

    useEffect(() => {
        const t = setInterval(() => setTime(getTime()), 5000);
        return () => clearInterval(t);
    }, []);

    const onCheckClick = () => {
        if (lastClickInside.current) {
            setStartWindowOpen(true);
        } else {
            setStartWindowOpen(false);
            setOpenSub(null);
        }
        lastClickInside.current = false;
    };

    useEffect(() => {
        window.addEventListener('mousedown', onCheckClick, false);
        return () => {
            window.removeEventListener('mousedown', onCheckClick, false);
        };
    }, []);

    const onStartWindowClicked = () => {
        setStartWindowOpen(true);
        lastClickInside.current = true;
    };

    const toggleStartWindow = () => {
        if (!startWindowOpen) {
            lastClickInside.current = true;
        } else {
            lastClickInside.current = false;
            setOpenSub(null);
        }
    };

    const closeMenu = () => {
        setStartWindowOpen(false);
        setOpenSub(null);
        lastClickInside.current = false;
    };

    const menu: MenuItem[] = [
        {
            label: (
                <>
                    <u>P</u>rograms
                </>
            ),
            icon: 'windowExplorerIcon',
            children: desktop.apps.map((app) => ({
                label: app.name,
                icon: app.icon,
                action: () => desktop.openApp(app.key),
            })),
        },
        {
            label: (
                <>
                    <u>D</u>ocuments
                </>
            ),
            icon: 'notepadIcon',
            children: [
                {
                    label: 'README.TXT',
                    icon: 'notepadIcon',
                    action: () => desktop.openApp('notepad'),
                },
                {
                    label: 'Resume.pdf',
                    icon: 'pdfIcon',
                    action: () => desktop.openApp('resume'),
                },
            ],
        },
        {
            label: (
                <>
                    <u>S</u>ettings
                </>
            ),
            icon: 'displayIcon',
            children: [
                {
                    label: 'Display...',
                    icon: 'displayIcon',
                    action: () => desktop.openApp('display'),
                },
                {
                    label: 'Date/Time...',
                    icon: 'clockIcon',
                    action: () => desktop.openApp('datetime'),
                },
            ],
        },
        {
            label: (
                <>
                    <u>F</u>ind
                </>
            ),
            icon: 'showcaseIcon',
            children: [
                { label: 'About', icon: 'showcaseIcon', action: () => desktop.openShowcaseAt('/about') },
                { label: 'Experience', icon: 'showcaseIcon', action: () => desktop.openShowcaseAt('/experience') },
                { label: 'Projects', icon: 'showcaseIcon', action: () => desktop.openShowcaseAt('/projects') },
                { label: 'Software', icon: 'showcaseIcon', action: () => desktop.openShowcaseAt('/projects/software') },
                { label: 'Older projects', icon: 'showcaseIcon', action: () => desktop.openShowcaseAt('/projects/older') },
                { label: 'Contact', icon: 'showcaseIcon', action: () => desktop.openShowcaseAt('/contact') },
            ],
        },
    ];

    const renderItem = (item: MenuItem, id: string, inSub: boolean) => {
        const hasChildren = !!item.children && item.children.length > 0;
        const open = openSub === id;
        return (
            <div
                key={id}
                className="start-menu-option"
                style={Object.assign(
                    {},
                    styles.startMenuOption,
                    inSub && styles.subMenuOption,
                    open && styles.startMenuOptionOpen
                )}
                onMouseEnter={() => {
                    if (!inSub) setOpenSub(hasChildren ? id : null);
                }}
                onMouseDown={(e) => {
                    if (hasChildren) {
                        e.stopPropagation();
                        lastClickInside.current = true;
                        setOpenSub(id);
                        return;
                    }
                    if (item.action) {
                        e.stopPropagation();
                        closeMenu();
                        item.action();
                    }
                }}
            >
                <Icon
                    style={inSub ? styles.subMenuIcon : styles.startMenuIcon}
                    icon={item.icon}
                />
                <p style={styles.startMenuText}>{item.label}</p>
                {hasChildren && <span style={styles.arrow}>▶</span>}
                {hasChildren && open && (
                    <div style={styles.subMenu} onMouseDown={onStartWindowClicked}>
                        <div style={styles.subMenuInner}>
                            {item.children!.map((child, i) =>
                                renderItem(child, `${id}-${i}`, true)
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={styles.toolbarOuter}>
            {startWindowOpen && (
                <motion.div
                    onMouseDown={onStartWindowClicked}
                    style={styles.startWindow}
                    // slides up out of the dock
                    initial={{ opacity: 0, y: 16, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                >
                    <div style={styles.startWindowInner}>
                        <div style={styles.verticalStartContainer}>
                            <p style={styles.verticalText}>SamOS</p>
                        </div>
                        <div style={styles.startWindowContent}>
                            <div style={styles.startMenuSpace} />
                            {menu.map((item, i) => renderItem(item, `m${i}`, false))}
                            <div style={styles.startMenuLine} />
                            <div
                                className="start-menu-option"
                                style={styles.startMenuOption}
                                onMouseEnter={() => setOpenSub(null)}
                                onMouseDown={shutdown}
                            >
                                <Icon
                                    style={styles.startMenuIcon}
                                    icon="computerBig"
                                />
                                <p style={styles.startMenuText}>
                                    Sh<u>u</u>t down...
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
            <div style={styles.toolbarInner}>
                <div style={styles.toolbar}>
                    <div
                        style={Object.assign(
                            {},
                            styles.startContainerOuter,
                            startWindowOpen && styles.activeTabOuter
                        )}
                        onMouseDown={toggleStartWindow}
                    >
                        <div
                            style={Object.assign(
                                {},
                                styles.startContainer,
                                startWindowOpen && styles.activeTabInner
                            )}
                        >
                            <Icon
                                size={18}
                                icon="windowsStartIcon"
                                style={styles.startIcon}
                            />
                            <p style={styles.startText}>Start</p>
                        </div>
                    </div>
                    <div style={styles.toolbarTabsContainer}>
                        {Object.keys(windows).map((key) => {
                            return (
                                <div
                                    key={key}
                                    style={Object.assign(
                                        {},
                                        styles.tabContainerOuter,
                                        lastActive === key &&
                                            !windows[key].minimized &&
                                            styles.activeTabOuter
                                    )}
                                    onMouseDown={() => toggleMinimize(key)}
                                >
                                    <div
                                        style={Object.assign(
                                            {},
                                            styles.tabContainer,
                                            lastActive === key &&
                                                !windows[key].minimized &&
                                                styles.activeTabInner
                                        )}
                                    >
                                        <Icon
                                            size={18}
                                            icon={windows[key].icon}
                                            style={styles.tabIcon}
                                        />
                                        <p style={styles.tabText}>
                                            {windows[key].name}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div
                    style={styles.time}
                    onMouseDown={() => desktop.openApp('datetime')}
                    title="Bangalore time. Click for Date/Time."
                    className="tray-clock"
                >
                    <Icon style={styles.volumeIcon} icon="volumeOn" />
                    <p style={styles.timeText}>{time}</p>
                </div>
            </div>
        </div>
    );
};

const ink = `1.5px solid ${theme.ink}`;

const styles: StyleSheetCSS = {
    // a floating dock, centred above the bottom edge
    toolbarOuter: {
        boxSizing: 'border-box',
        position: 'absolute',
        bottom: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(920px, calc(100% - 24px))',
        height: 50,
        padding: '0 8px',
        background: theme.cream,
        border: ink,
        borderRadius: 16,
        boxShadow: theme.shadow,
        zIndex: 100000,
    },
    verticalStartContainer: {
        height: '100%',
        background: theme.amber,
        borderRight: ink,
    },
    verticalText: {
        fontFamily: theme.pixelFont,
        fontWeight: 600,
        fontSize: 28,
        padding: 6,
        paddingBottom: 64,
        paddingTop: 10,
        letterSpacing: 1,
        color: theme.amberInk,
        transform: 'scale(-1)',
        // @ts-ignore
        writingMode: 'tb-rl',
    },
    startWindowContent: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 6,
    },
    startWindow: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        display: 'flex',
        width: 280,
        boxSizing: 'border-box',
        border: ink,
        borderRadius: 14,
        overflow: 'visible',
        background: theme.cream,
        boxShadow: theme.shadow,
        transformOrigin: 'bottom left',
    },
    startWindowInner: {
        flex: 1,
        borderRadius: 13,
        overflow: 'hidden',
    },
    startMenuIcon: {
        width: 32,
        height: 32,
    },
    subMenuIcon: {
        width: 20,
        height: 20,
    },
    startMenuText: {
        fontSize: 14,
        fontFamily: theme.uiFont,
        fontWeight: 500,
        color: theme.ink,
        marginLeft: 10,
        flex: 1,
    },
    startMenuOption: {
        alignItems: 'center',
        height: 24,
        padding: 10,
        borderRadius: 10,
        position: 'relative',
        cursor: 'pointer',
    },
    startMenuOptionOpen: {
        backgroundColor: theme.amberSoft,
    },
    subMenuOption: {
        height: 18,
        padding: '7px 10px',
    },
    arrow: {
        fontSize: 9,
        marginLeft: 8,
        color: theme.muted,
    },
    subMenu: {
        position: 'absolute',
        left: '100%',
        top: -6,
        marginLeft: 6,
        minWidth: 200,
        boxSizing: 'border-box',
        border: ink,
        borderRadius: 12,
        background: theme.cream,
        boxShadow: theme.shadow,
        zIndex: 10,
        cursor: 'default',
    },
    subMenuInner: {
        flexDirection: 'column',
        padding: 6,
        flex: 1,
    },
    startMenuSpace: {
        flex: 1,
    },
    startMenuLine: {
        height: 1,
        margin: '6px 8px',
        background: 'rgba(31, 27, 46, 0.15)',
    },
    activeTabOuter: {
        background: theme.amberSoft,
        border: ink,
    },
    activeTabInner: {
        pointerEvents: 'none',
    },
    tabContainerOuter: {
        display: 'flex',
        flex: 1,
        maxWidth: 210,
        height: 36,
        marginRight: 6,
        boxSizing: 'border-box',
        cursor: 'pointer',
        borderRadius: 10,
        border: '1.5px solid transparent',
        transition: 'background 0.15s ease',
    },
    tabContainer: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        flex: 1,
        minWidth: 0,
    },
    tabIcon: {
        marginRight: 8,
    },
    startContainer: {
        alignItems: 'center',
        padding: '0 12px',
        height: '100%',
    },
    startContainerOuter: {
        height: 36,
        boxSizing: 'border-box',
        cursor: 'pointer',
        background: theme.amber,
        border: ink,
        borderRadius: 11,
    },
    startText: {
        fontFamily: theme.pixelFont,
        fontWeight: 600,
        fontSize: 17,
        color: theme.amberInk,
    },
    toolbarTabsContainer: {
        flex: 1,
        alignItems: 'center',
        marginLeft: 8,
        marginRight: 8,
        minWidth: 0,
    },
    startIcon: {
        marginRight: 6,
    },
    toolbarInner: {
        alignItems: 'center',
        flex: 1,
    },
    toolbar: {
        flexGrow: 1,
        alignItems: 'center',
        minWidth: 0,
    },
    time: {
        flexShrink: 0,
        height: 36,
        boxSizing: 'border-box',
        padding: '0 10px',
        borderRadius: 10,
        cursor: 'pointer',
        alignItems: 'center',
        gap: 8,
    },
    volumeIcon: {
        cursor: 'pointer',
        height: 18,
    },
    tabText: {
        fontSize: 13,
        fontFamily: theme.uiFont,
        fontWeight: 500,
        color: theme.ink,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    timeText: {
        fontSize: 13,
        fontFamily: theme.uiFont,
        fontWeight: 500,
        color: theme.muted,
    },
};

export default Toolbar;

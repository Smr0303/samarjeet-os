import React, { useContext, useEffect, useRef, useState } from 'react';
import Colors from '../../constants/colors';
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
                <div
                    onMouseDown={onStartWindowClicked}
                    style={styles.startWindow}
                >
                    <div style={styles.startWindowInner}>
                        <div style={styles.verticalStartContainer}>
                            <p style={styles.verticalText}>MohiteOS</p>
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
                </div>
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
                            <p className="toolbar-text ">Start</p>
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

const styles: StyleSheetCSS = {
    toolbarOuter: {
        boxSizing: 'border-box',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 32,
        background: Colors.lightGray,
        borderTop: `1px solid ${Colors.lightGray}`,
        zIndex: 100000,
    },
    verticalStartContainer: {
        // width: 30,
        height: '100%',
        background: Colors.darkGray,
    },
    verticalText: {
        fontFamily: 'Terminal',
        textOrientation: 'sideways',
        fontSize: 32,
        padding: 4,
        paddingBottom: 64,
        paddingTop: 8,
        letterSpacing: 1,
        color: Colors.lightGray,
        transform: 'scale(-1)',
        WebkitTransform: 'scale(-1)',
        MozTransform: 'scale(-1)',
        msTransform: 'scale(-1)',
        OTransform: 'scale(-1)',
        // @ts-ignore
        writingMode: 'tb-rl',
    },
    startWindowContent: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        // alignItems: 'flex-end',
    },
    startWindow: {
        position: 'absolute',
        bottom: 28,
        display: 'flex',
        flex: 1,
        width: 256,
        // height: 400,
        left: 4,
        boxSizing: 'border-box',
        border: `1px solid ${Colors.white}`,
        borderBottomColor: Colors.black,
        borderRightColor: Colors.black,
        background: Colors.lightGray,
    },
    activeTabOuter: {
        border: `1px solid ${Colors.black}`,
        borderBottomColor: Colors.white,
        borderRightColor: Colors.white,
    },
    startWindowInner: {
        border: `1px solid ${Colors.lightGray}`,
        borderBottomColor: Colors.darkGray,
        borderRightColor: Colors.darkGray,
        flex: 1,
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
        fontFamily: 'MSSerif',
        marginLeft: 8,
        flex: 1,
    },
    startMenuOption: {
        alignItems: 'center',
        // flex: 1,
        height: 24,
        padding: 12,
        position: 'relative',
    },
    startMenuOptionOpen: {
        backgroundColor: Colors.darkBlue,
        color: Colors.white,
    },
    subMenuOption: {
        height: 18,
        padding: '6px 12px',
    },
    arrow: {
        fontSize: 9,
        marginLeft: 8,
    },
    subMenu: {
        position: 'absolute',
        left: '100%',
        top: -3,
        marginLeft: -3,
        minWidth: 190,
        boxSizing: 'border-box',
        border: `1px solid ${Colors.white}`,
        borderBottomColor: Colors.black,
        borderRightColor: Colors.black,
        background: Colors.lightGray,
        color: Colors.black,
        zIndex: 10,
        cursor: 'default',
    },
    subMenuInner: {
        flexDirection: 'column',
        border: `1px solid ${Colors.lightGray}`,
        borderBottomColor: Colors.darkGray,
        borderRightColor: Colors.darkGray,
        padding: 2,
    },
    startMenuSpace: {
        flex: 1,
    },
    startMenuLine: {
        height: 1,
        background: Colors.white,
        borderTop: `1px solid ${Colors.darkGray}`,
    },
    activeTabInner: {
        border: `1px solid ${Colors.darkGray}`,
        borderBottomColor: Colors.lightGray,
        borderRightColor: Colors.lightGray,
        backgroundImage: `linear-gradient(45deg, white 25%, transparent 25%),
        linear-gradient(-45deg,  white 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%,  white 75%),
        linear-gradient(-45deg, transparent 75%,  white 75%)`,
        backgroundSize: `4px 4px`,
        backgroundPosition: `0 0, 0 2px, 2px -2px, -2px 0px`,
        pointerEvents: 'none',
    },
    tabContainerOuter: {
        display: 'flex',
        flex: 1,
        maxWidth: 300,
        marginRight: 4,
        boxSizing: 'border-box',
        cursor: 'pointer',
        border: `1px solid ${Colors.white}`,
        borderBottomColor: Colors.black,
        borderRightColor: Colors.black,
    },
    tabContainer: {
        display: 'flex',
        border: `1px solid ${Colors.lightGray}`,
        borderBottomColor: Colors.darkGray,
        borderRightColor: Colors.darkGray,
        alignItems: 'center',
        paddingLeft: 4,
        flex: 1,
    },
    tabIcon: {
        marginRight: 6,
    },
    startContainer: {
        alignItems: 'center',
        flexShrink: 1,
        // background: 'red',
        border: `1px solid ${Colors.lightGray}`,
        borderBottomColor: Colors.darkGray,
        borderRightColor: Colors.darkGray,
        padding: 1,
        paddingLeft: 5,
        paddingRight: 5,
    },
    startContainerOuter: {
        marginLeft: 3,
        boxSizing: 'border-box',
        cursor: 'pointer',
        border: `1px solid ${Colors.white}`,
        borderBottomColor: Colors.black,
        borderRightColor: Colors.black,
    },
    toolbarTabsContainer: {
        // background: 'blue',
        flex: 1,
        marginLeft: 4,
        marginRight: 4,
    },
    startIcon: {
        marginRight: 4,
    },
    toolbarInner: {
        borderTop: `1px solid ${Colors.white}`,

        alignItems: 'center',
        flex: 1,
    },
    toolbar: {
        flexGrow: 1,
        width: '100%',
    },
    time: {
        flexShrink: 1,
        width: 86,
        height: 24,
        boxSizing: 'border-box',
        marginRight: 4,
        paddingLeft: 4,
        paddingRight: 4,
        border: `1px solid ${Colors.white}`,
        borderTopColor: Colors.darkGray,
        cursor: 'pointer',

        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftColor: Colors.darkGray,
    },
    volumeIcon: {
        cursor: 'pointer',
        height: 18,
    },
    tabText: {
        fontSize: 14,
        fontFamily: 'MSSerif',
    },
    timeText: {
        fontSize: 12,
        fontFamily: 'MSSerif',
    },
};

export default Toolbar;

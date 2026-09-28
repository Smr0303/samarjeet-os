import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Colors from '../../constants/colors';
import ShowcaseExplorer from '../applications/ShowcaseExplorer';
import Doom from '../applications/Doom';
import OregonTrail from '../applications/OregonTrail';
import ShutdownSequence from './ShutdownSequence';
import Samordle from '../applications/Samordle';
import Toolbar from './Toolbar';
import DesktopShortcut, { DesktopShortcutProps } from './DesktopShortcut';
import Scrabble from '../applications/Scrabble';
import { IconName } from '../../assets/icons';
import Credits from '../applications/Credits';
import Notepad from '../applications/Notepad';
import DosPrompt from '../applications/DosPrompt';
import Minesweeper from '../applications/Minesweeper';
import DisplayProperties from '../applications/DisplayProperties';
import DateTime from '../applications/DateTime';
import ResumeViewer from '../applications/ResumeViewer';
import DesktopContext, { AppEntry, RoomTheme } from './DesktopContext';
import {
    announceWallpaper,
    getWallpaper,
    storeWallpaper,
    storedWallpaper,
} from '../../constants/wallpapers';

export interface DesktopProps {}

type ExtendedWindowAppProps<T> = T & WindowAppProps;

const README_SEEN_KEY = 'readme-seen';

const APPLICATIONS: {
    [key in string]: {
        key: string;
        name: string;
        shortcutIcon: IconName;
        component: React.FC<ExtendedWindowAppProps<any>>;
        /** Dialogs that live in the Start menu only, no desktop shortcut. */
        hidden?: boolean;
    };
} = {
    showcase: {
        key: 'showcase',
        name: 'My Showcase',
        shortcutIcon: 'showcaseIcon',
        component: ShowcaseExplorer,
    },
    notepad: {
        key: 'notepad',
        name: 'README.TXT',
        shortcutIcon: 'notepadIcon',
        component: Notepad,
    },
    dos: {
        key: 'dos',
        name: 'MS-DOS Prompt',
        shortcutIcon: 'dosIcon',
        component: DosPrompt,
    },
    trail: {
        key: 'trail',
        name: 'The Oregon Trail',
        shortcutIcon: 'trailIcon',
        component: OregonTrail,
    },
    doom: {
        key: 'doom',
        name: 'Doom',
        shortcutIcon: 'doomIcon',
        component: Doom,
    },
    scrabble: {
        key: 'scrabble',
        name: 'Scrabble',
        shortcutIcon: 'scrabbleIcon',
        component: Scrabble,
    },
    samordle: {
        key: 'samordle',
        name: 'Samordle',
        shortcutIcon: 'samordleIcon',
        component: Samordle,
    },
    minesweeper: {
        key: 'minesweeper',
        name: 'Minesweeper',
        shortcutIcon: 'mineIcon',
        component: Minesweeper,
    },
    credits: {
        key: 'credits',
        name: 'Credits',
        shortcutIcon: 'credits',
        component: Credits,
    },
    display: {
        key: 'display',
        name: 'Display Properties',
        shortcutIcon: 'displayIcon',
        component: DisplayProperties,
        hidden: true,
    },
    datetime: {
        key: 'datetime',
        name: 'Date/Time Properties',
        shortcutIcon: 'clockIcon',
        component: DateTime,
        hidden: true,
    },
    resume: {
        key: 'resume',
        name: 'Resume.pdf',
        shortcutIcon: 'pdfIcon',
        component: ResumeViewer,
        hidden: true,
    },
};

const APP_ENTRIES: AppEntry[] = Object.keys(APPLICATIONS)
    .filter((key) => !APPLICATIONS[key].hidden)
    .map((key) => ({
        key,
        name: APPLICATIONS[key].name,
        icon: APPLICATIONS[key].shortcutIcon,
    }));

const Desktop: React.FC<DesktopProps> = (props) => {
    const [windows, setWindows] = useState<DesktopWindows>({});

    const [shortcuts, setShortcuts] = useState<DesktopShortcutProps[]>([]);

    const [shutdown, setShutdown] = useState(false);
    const [numShutdowns, setNumShutdowns] = useState(1);

    const [wallpaper, setWallpaperState] = useState<string>(storedWallpaper);
    const [roomTheme, setRoomTheme] = useState<RoomTheme>('night');

    useEffect(() => {
        if (shutdown === true) {
            rebootDesktop();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shutdown]);

    const rebootDesktop = useCallback(() => {
        setWindows({});
    }, []);

    const removeWindow = useCallback((key: string) => {
        // Absolute hack and a half
        setTimeout(() => {
            setWindows((prevWindows) => {
                const newWindows = { ...prevWindows };
                delete newWindows[key];
                return newWindows;
            });
        }, 100);
    }, []);

    const minimizeWindow = useCallback((key: string) => {
        setWindows((prevWindows) => {
            const newWindows = { ...prevWindows };
            newWindows[key].minimized = true;
            return newWindows;
        });
    }, []);

    const getHighestZIndex = useCallback((): number => {
        let highestZIndex = 0;
        Object.keys(windows).forEach((key) => {
            const window = windows[key];
            if (window) {
                if (window.zIndex > highestZIndex)
                    highestZIndex = window.zIndex;
            }
        });
        return highestZIndex;
    }, [windows]);

    const toggleMinimize = useCallback(
        (key: string) => {
            const newWindows = { ...windows };
            const highestIndex = getHighestZIndex();
            if (
                newWindows[key].minimized ||
                newWindows[key].zIndex === highestIndex
            ) {
                newWindows[key].minimized = !newWindows[key].minimized;
            }
            newWindows[key].zIndex = getHighestZIndex() + 1;
            setWindows(newWindows);
        },
        [windows, getHighestZIndex]
    );

    const onWindowInteract = useCallback(
        (key: string) => {
            setWindows((prevWindows) => ({
                ...prevWindows,
                [key]: {
                    ...prevWindows[key],
                    zIndex: 1 + getHighestZIndex(),
                },
            }));
        },
        [setWindows, getHighestZIndex]
    );

    const startShutdown = useCallback(() => {
        setTimeout(() => {
            setShutdown(true);
            setNumShutdowns(numShutdowns + 1);
        }, 600);
    }, [numShutdowns]);

    /** Open an application, or raise it if it is already open. */
    const openApp = useCallback(
        (key: string) => {
            const app = APPLICATIONS[key];
            if (!app) return;
            setWindows((prev) => {
                const highest = Object.keys(prev).reduce(
                    (max, k) => Math.max(max, prev[k].zIndex),
                    0
                );
                if (prev[key]) {
                    return {
                        ...prev,
                        [key]: {
                            ...prev[key],
                            minimized: false,
                            zIndex: highest + 1,
                        },
                    };
                }
                return {
                    ...prev,
                    [key]: {
                        zIndex: highest + 1,
                        minimized: false,
                        component: (
                            <app.component
                                onInteract={() => onWindowInteract(key)}
                                onMinimize={() => minimizeWindow(key)}
                                onClose={() => removeWindow(key)}
                                key={key}
                            />
                        ),
                        name: app.name,
                        icon: app.shortcutIcon,
                    },
                };
            });
        },
        [onWindowInteract, minimizeWindow, removeWindow]
    );

    // Latest openApp for callbacks created once (shortcuts, first boot).
    const openAppRef = useRef(openApp);
    openAppRef.current = openApp;

    /** Open the showcase on a route: the BrowserRouter reads the URL on mount. */
    const openShowcaseAt = useCallback((path: string) => {
        try {
            window.history.replaceState({}, '', path);
        } catch (e) {}
        setWindows((prev) => {
            const next = { ...prev };
            delete next.showcase;
            return next;
        });
        setTimeout(() => openAppRef.current('showcase'), 0);
    }, []);

    const setWallpaper = useCallback((id: string) => {
        setWallpaperState(id);
        storeWallpaper(id);
        announceWallpaper(id);
    }, []);

    useEffect(() => {
        const newShortcuts: DesktopShortcutProps[] = [];
        Object.keys(APPLICATIONS).forEach((key) => {
            const app = APPLICATIONS[key];
            if (app.hidden) return;
            newShortcuts.push({
                shortcutName: app.name,
                icon: app.shortcutIcon,
                onOpen: () => openAppRef.current(app.key),
            });
        });
        setShortcuts(newShortcuts);

        openAppRef.current('showcase');

        // First visit: the README opens beside the showcase, once.
        let seen = true;
        try {
            seen = window.localStorage.getItem(README_SEEN_KEY) === '1';
        } catch (e) {}
        if (!seen) {
            setTimeout(() => {
                openAppRef.current('notepad');
                try {
                    window.localStorage.setItem(README_SEEN_KEY, '1');
                } catch (e) {}
            }, 700);
        }

        // Tell the room which wallpaper is up, and hear what the room is doing.
        announceWallpaper(storedWallpaper());
        const onMessage = (event: MessageEvent) => {
            const data = event.data;
            if (data && data.type === 'room-theme') {
                setRoomTheme(data.theme === 'day' ? 'day' : 'night');
            }
        };
        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const api = useMemo(
        () => ({
            openApp,
            closeApp: removeWindow,
            openShowcaseAt,
            apps: APP_ENTRIES,
            wallpaper,
            setWallpaper,
            roomTheme,
        }),
        [openApp, removeWindow, openShowcaseAt, wallpaper, setWallpaper, roomTheme]
    );

    const desktopStyle = Object.assign(
        {},
        styles.desktop,
        getWallpaper(wallpaper).style
    );

    return !shutdown ? (
        <DesktopContext.Provider value={api}>
            <div style={desktopStyle}>
                {/* For each window in windows, loop over and render  */}
                {Object.keys(windows).map((key) => {
                    const element = windows[key].component;
                    if (!element) return <div key={`win-${key}`}></div>;
                    return (
                        <div
                            key={`win-${key}`}
                            style={Object.assign(
                                {},
                                { zIndex: windows[key].zIndex },
                                windows[key].minimized && styles.minimized
                            )}
                        >
                            {React.cloneElement(element, {
                                key,
                                onInteract: () => onWindowInteract(key),
                                onClose: () => removeWindow(key),
                            })}
                        </div>
                    );
                })}
                <div style={styles.shortcuts}>
                    {shortcuts.map((shortcut, i) => {
                        return (
                            <div
                                style={Object.assign(
                                    {},
                                    styles.shortcutContainer,
                                    {
                                        top: i * 104,
                                    }
                                )}
                                key={shortcut.shortcutName}
                            >
                                <DesktopShortcut
                                    icon={shortcut.icon}
                                    shortcutName={shortcut.shortcutName}
                                    onOpen={shortcut.onOpen}
                                />
                            </div>
                        );
                    })}
                </div>
                <Toolbar
                    windows={windows}
                    toggleMinimize={toggleMinimize}
                    shutdown={startShutdown}
                />
            </div>
        </DesktopContext.Provider>
    ) : (
        <ShutdownSequence
            setShutdown={setShutdown}
            numShutdowns={numShutdowns}
        />
    );
};

const styles: StyleSheetCSS = {
    desktop: {
        minHeight: '100%',
        flex: 1,
        backgroundColor: Colors.turquoise,
    },
    shutdown: {
        minHeight: '100%',
        flex: 1,
        backgroundColor: '#1d2e2f',
    },
    shortcutContainer: {
        position: 'absolute',
    },
    shortcuts: {
        position: 'absolute',
        top: 16,
        left: 6,
    },
    minimized: {
        pointerEvents: 'none',
        opacity: 0,
    },
};

export default Desktop;

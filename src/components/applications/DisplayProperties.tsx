import React, { useContext, useState } from 'react';
import Window from '../os/Window';
import DesktopContext from '../os/DesktopContext';
import { WALLPAPERS, getWallpaper } from '../../constants/wallpapers';

export interface DisplayPropertiesProps extends WindowAppProps {}

/**
 * Start > Settings > Display... A Win95 Display Properties sheet with one
 * tab, Background. Picking a wallpaper changes the desktop and, through the
 * DesktopContext, tells the 3D room to take that colour for its screen light.
 */
const DisplayProperties: React.FC<DisplayPropertiesProps> = (props) => {
    const { wallpaper, setWallpaper } = useContext(DesktopContext);
    const [selected, setSelected] = useState(wallpaper);
    const preview = getWallpaper(selected);

    const apply = () => setWallpaper(selected);
    const ok = () => {
        apply();
        props.onClose();
    };

    return (
        <Window
            top={110}
            left={420}
            width={440}
            height={580}
            windowTitle="Display Properties"
            windowBarIcon="displayIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
        >
            <div className="site-page" style={styles.wrap}>
                <div style={styles.tabRow}>
                    <div style={styles.tab}>
                        <p style={styles.tabText}>Background</p>
                    </div>
                </div>
                <div style={styles.sheet}>
                    <div style={styles.previewRow}>
                        <div style={styles.monitor}>
                            <div style={styles.bezel}>
                                <div
                                    style={Object.assign(
                                        {},
                                        styles.screen,
                                        preview.style,
                                        preview.style.backgroundSize && {
                                            backgroundSize: '130px 90px',
                                        }
                                    )}
                                />
                            </div>
                            <div style={styles.neck} />
                            <div style={styles.foot} />
                        </div>
                    </div>
                    <p style={styles.label}>
                        <u>W</u>allpaper
                    </p>
                    <div style={styles.list} role="listbox" aria-label="Wallpaper">
                        {WALLPAPERS.map((w) => {
                            const active = w.id === selected;
                            return (
                                <div
                                    key={w.id}
                                    role="option"
                                    aria-selected={active}
                                    style={Object.assign(
                                        {},
                                        styles.item,
                                        active && styles.itemActive
                                    )}
                                    onMouseDown={() => setSelected(w.id)}
                                    onDoubleClick={ok}
                                >
                                    <div
                                        style={Object.assign(
                                            {},
                                            styles.swatch,
                                            w.style,
                                            w.style.backgroundSize && {
                                                backgroundSize: '80px 56px',
                                            }
                                        )}
                                    />
                                    <p style={styles.itemText}>{w.name}</p>
                                </div>
                            );
                        })}
                    </div>
                    <p style={styles.hint}>
                        The room outside this screen takes the colour of the
                        wallpaper.
                    </p>
                </div>
                <div style={styles.buttons}>
                    <button type="button" className="site-button" style={styles.button} onClick={ok}>
                        OK
                    </button>
                    <button
                        type="button"
                        className="site-button"
                        style={styles.button}
                        onClick={props.onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="site-button"
                        style={styles.button}
                        onClick={apply}
                        disabled={selected === wallpaper}
                    >
                        <u>A</u>pply
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
        padding: 12,
        background: '#c0c0c0',
    },
    previewRow: {
        justifyContent: 'center',
        marginBottom: 10,
    },
    monitor: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    bezel: {
        width: 176,
        height: 132,
        background: '#c0c0c0',
        boxShadow: 'var(--border-raised-outer), var(--border-raised-inner)',
        padding: 10,
        boxSizing: 'border-box',
    },
    screen: {
        width: '100%',
        height: '100%',
        boxShadow: 'var(--border-field)',
    },
    neck: {
        width: 40,
        height: 10,
        background: '#808080',
    },
    foot: {
        width: 110,
        height: 8,
        background: '#c0c0c0',
        boxShadow: 'var(--border-raised-outer), var(--border-raised-inner)',
    },
    label: {
        fontFamily: 'MSSerif',
        fontSize: 13,
        marginBottom: 4,
    },
    list: {
        flexDirection: 'column',
        background: '#fff',
        boxShadow: 'var(--border-field)',
        padding: 2,
        maxHeight: 180,
        overflowY: 'auto',
    },
    item: {
        alignItems: 'center',
        padding: '2px 4px',
        cursor: 'pointer',
    },
    itemActive: {
        background: '#0000aa',
        color: '#fff',
    },
    swatch: {
        width: 40,
        height: 28,
        marginRight: 8,
        border: '1px solid #000',
        flexShrink: 0,
    },
    itemText: {
        fontFamily: 'MSSerif',
        fontSize: 13,
        color: 'inherit',
    },
    hint: {
        fontFamily: 'MSSerif',
        fontSize: 12,
        marginTop: 8,
        color: '#333',
    },
    buttons: {
        justifyContent: 'flex-end',
        paddingTop: 8,
    },
    button: {
        minWidth: 76,
        marginLeft: 6,
        fontSize: 13,
        fontFamily: 'MSSerif',
    },
};

export default DisplayProperties;

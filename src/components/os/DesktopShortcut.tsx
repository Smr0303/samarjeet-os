import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IconName } from '../../assets/icons';
import theme from '../../constants/theme';
import { Icon } from '../general';

export interface DesktopShortcutProps {
    icon: IconName;
    shortcutName: string;
    invertText?: boolean;
    onOpen: () => void;
}

const DesktopShortcut: React.FC<DesktopShortcutProps> = ({
    icon,
    shortcutName,
    invertText,
    onOpen,
}) => {
    const [isSelected, setIsSelected] = useState(false);
    const [shortcutId, setShortcutId] = useState('');
    const [lastSelected, setLastSelected] = useState(false);
    const containerRef = useRef<any>();

    const [scaledStyle, setScaledStyle] = useState({});

    const [doubleClickTimerActive, setDoubleClickTimerActive] = useState(false);

    const getShortcutId = useCallback(() => {
        const shortcutId = shortcutName.replace(/\s/g, '');
        return `desktop-shortcut-${shortcutId}`;
    }, [shortcutName]);

    useEffect(() => {
        setShortcutId(getShortcutId());
    }, [shortcutName, getShortcutId]);

    useEffect(() => {
        if (containerRef.current && Object.keys(scaledStyle).length === 0) {
            //@ts-ignore
            const boundingBox = containerRef.current.getBoundingClientRect();
            setScaledStyle({
                transformOrigin: 'center',
                transform: 'scale(1.5)',
                left: boundingBox.width / 4,
                top: boundingBox.height / 4,
                // transform: 'scale(1.5)',
                // left: boundingBox.width / 4,
                // top: boundingBox.height / 4,
            });
        }
    }, [scaledStyle]);

    const handleClickOutside = useCallback(
        (event: MouseEvent) => {
            // @ts-ignore
            const targetId = event.target.id;
            if (targetId !== shortcutId) {
                setIsSelected(false);
            }
            if (!isSelected && lastSelected) {
                setLastSelected(false);
            }
        },
        [isSelected, setIsSelected, setLastSelected, lastSelected, shortcutId]
    );

    const handleClickShortcut = useCallback(() => {
        if (doubleClickTimerActive) {
            onOpen && onOpen();
            setIsSelected(false);
            setDoubleClickTimerActive(false);
            return;
        }
        setIsSelected(true);
        setLastSelected(true);
        setDoubleClickTimerActive(true);
        // set double click timer
        setTimeout(() => {
            setDoubleClickTimerActive(false);
        }, 300);
    }, [doubleClickTimerActive, setIsSelected, onOpen]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSelected, handleClickOutside]);

    return (
        <div
            id={`${shortcutId}`}
            style={Object.assign({}, styles.appShortcut, scaledStyle)}
            onMouseDown={handleClickShortcut}
            ref={containerRef}
        >
            <div
                id={`${shortcutId}`}
                className="desktop-icon-lift"
                style={Object.assign(
                    {},
                    styles.iconContainer,
                    isSelected && styles.iconSelected
                )}
            >
                <div
                    id={`${shortcutId}`}
                    className="desktop-shortcut-icon"
                    style={styles.iconOverlay}
                />
                <Icon icon={icon} style={styles.icon} />
            </div>
            <div
                id={`${shortcutId}`}
                style={Object.assign(
                    {},
                    styles.label,
                    isSelected && { backgroundColor: theme.amber }
                )}
            >
                <p
                    id={`${shortcutId}`}
                    style={Object.assign(
                        {},
                        styles.shortcutText,
                        (isSelected || invertText) && {
                            color: theme.amberInk,
                            textShadow: 'none',
                        }
                    )}
                >
                    {shortcutName}
                </p>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    appShortcut: {
        position: 'absolute',
        width: 56,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
    },
    shortcutText: {
        cursor: 'pointer',
        fontFamily: theme.uiFont,
        fontWeight: 500,
        color: 'white',
        fontSize: 8,
        lineHeight: '10px',
        textShadow: '0 1px 2px rgba(31, 27, 46, 0.8)',
    },
    label: {
        borderRadius: 5,
        padding: '1px 3px',
        transition: 'background-color 0.15s ease',
    },
    iconContainer: {
        cursor: 'pointer',
        padding: 3,
        marginBottom: 2,
        borderRadius: 8,
        transition: 'background-color 0.15s ease',
    },
    iconSelected: {
        backgroundColor: 'rgba(255, 250, 244, 0.28)',
    },
    iconOverlay: {
        position: 'absolute',
        top: 0,
        width: 32,
        height: 32,
    },
};

export default DesktopShortcut;

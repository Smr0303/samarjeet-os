import React from 'react';
import Window from '../os/Window';

export interface NotepadProps extends WindowAppProps {}

export const README_TEXT = `README.TXT
==========

Hi, I'm Samarjeet. Welcome to my desk.

This is a Windows 95 style portfolio. Everything on it works:

 - My Showcase: who I am, where I've worked, what I've built
 - MS-DOS Prompt: type "help" if you like terminals
 - Doom: yes, the real one
 - Samordle: Wordle, but the word is always the same
 - Minesweeper: you know this one

The room outside this screen is lit by this screen.
Try the sun/moon switch in the top-left of the room, or
change the wallpaper (Start > Settings > Display...) and
watch the light in the room change colour.

Email: samarmohite7@gmail.com
GitHub: github.com/Smr0303
`;

const MENU = ['File', 'Edit', 'Search', 'Help'];

const Notepad: React.FC<NotepadProps> = (props) => {
    return (
        <Window
            top={140}
            left={420}
            width={540}
            height={430}
            windowTitle="README.TXT - Notepad"
            windowBarIcon="notepadIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
        >
            <div className="site-page" style={styles.wrap}>
                <div style={styles.menu}>
                    {MENU.map((item) => (
                        <p key={item} style={styles.menuItem}>
                            <u>{item[0]}</u>
                            {item.slice(1)}
                        </p>
                    ))}
                </div>
                <textarea
                    readOnly
                    value={README_TEXT}
                    spellCheck={false}
                    style={styles.text}
                    aria-label="README.TXT"
                />
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    wrap: {
        flexDirection: 'column',
        background: '#c0c0c0',
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
    text: {
        flex: 1,
        width: '100%',
        height: '100%',
        margin: 0,
        padding: '6px 8px',
        border: 'none',
        boxShadow: 'var(--border-field)',
        background: '#fff',
        color: '#000',
        fontFamily: 'Terminal, monospace',
        fontSize: 15,
        lineHeight: 1.35,
        resize: 'none',
        outline: 'none',
        whiteSpace: 'pre',
        overflow: 'auto',
    },
};

export default Notepad;

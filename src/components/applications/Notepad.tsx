import React from 'react';
import Window from '../os/Window';

export interface NotepadProps extends WindowAppProps {}

export const README_TEXT = `README.TXT
==========

Hi, I'm Samarjeet. Welcome to my desk.

This is SamOS, my Windows 95 style portfolio. Everything on it works:

 - My Showcase: who I am, where I've worked, what I've built
 - Terminal: type "help" if you like terminals
 - Doom: yes, the real one
 - Samordle: Wordle, but the word is always the same
 - Minesweeper: you know this one

The room outside this screen is lit by this screen.
Change the wallpaper (Start > Settings > Display...) and
watch the light in the room change colour. Out there you
can also call my AI on the phone, strum the guitar, and
click the frames on the wall.

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
                            {item}
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
        background: '#fdf6ee',
    },
    menu: {
        height: 32,
        alignItems: 'center',
        padding: '0 10px',
        flexShrink: 0,
        borderBottom: '1px solid rgba(31, 27, 46, 0.12)',
    },
    menuItem: {
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 500,
        fontSize: 13,
        color: '#3a3346',
        padding: '2px 8px',
        borderRadius: 6,
        marginRight: 4,
    },
    text: {
        flex: 1,
        width: '100%',
        height: '100%',
        margin: 0,
        padding: '14px 18px',
        border: 'none',
        borderRadius: 0,
        boxShadow: 'none',
        background: '#fffaf4',
        color: '#1f1b2e',
        fontFamily: "'JetBrains Mono', Menlo, Consolas, monospace",
        fontSize: 13,
        lineHeight: 1.6,
        resize: 'none',
        outline: 'none',
        whiteSpace: 'pre',
        overflow: 'auto',
    },
};

export default Notepad;

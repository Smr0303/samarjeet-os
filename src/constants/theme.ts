/**
 * SamOS: Windows 95's layout redrawn in the room's dawn colours. Windows,
 * the taskbar dock, the Start menu and the desktop icons read from here.
 */
const theme = {
    ink: '#1f1b2e', // outlines and strong text
    cream: '#fdf6ee', // window and dock surfaces
    paper: '#fffaf4', // window content
    amber: '#f2b46d', // active title bars, Start
    amberSoft: '#fbe1c6', // hover and active tabs
    amberInk: '#3a1d08', // text on amber
    coral: '#e2614c', // close
    teal: '#7fc3b0',
    lavender: '#b9a8e8',
    muted: '#7a5a6e', // secondary text
    inactive: '#efe3e6', // inactive title bars
    shadow: '0 18px 40px rgba(31, 27, 46, 0.32), 0 3px 8px rgba(31, 27, 46, 0.18)',
    radius: 12,
    pixelFont: "'Pixelify Sans', 'Courier New', monospace",
    uiFont: "'DM Sans', -apple-system, 'Segoe UI', sans-serif",
} as const;

export default theme;

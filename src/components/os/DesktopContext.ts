import React from 'react';
import { IconName } from '../../assets/icons';

export type RoomTheme = 'night' | 'day';

export interface AppEntry {
    key: string;
    name: string;
    icon: IconName;
}

export interface DesktopApi {
    /** Open (or raise) an application by its APPLICATIONS key. */
    openApp: (key: string) => void;
    closeApp: (key: string) => void;
    /** Open the showcase on a given route, e.g. "/experience". */
    openShowcaseAt: (path: string) => void;
    /** Applications that belong in Start > Programs (not the hidden dialogs). */
    apps: AppEntry[];
    wallpaper: string;
    setWallpaper: (id: string) => void;
    /** What the 3D room around this screen is currently doing. */
    roomTheme: RoomTheme;
}

const DesktopContext = React.createContext<DesktopApi>({
    openApp: () => {},
    closeApp: () => {},
    openShowcaseAt: () => {},
    apps: [],
    wallpaper: 'teal',
    setWallpaper: () => {},
    roomTheme: 'night',
});

export default DesktopContext;

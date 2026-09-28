import { CSSProperties } from 'react';

export interface Wallpaper {
    id: string;
    name: string;
    style: CSSProperties;
    /** Colour the 3D room's screen light takes when this wallpaper is showing. */
    lightColor: string;
    /** Optional multiplier on the room light's intensity (black is bright paper, not bright teal). */
    intensityScale?: number;
}

export const DEFAULT_WALLPAPER = 'teal';
const STORAGE_KEY = 'os-wallpaper';

export const WALLPAPERS: Wallpaper[] = [
    {
        id: 'teal',
        name: 'Classic teal',
        style: { backgroundColor: '#3e9697' },
        lightColor: '#8fd9d3',
    },
    {
        id: 'clouds',
        name: 'Clouds',
        style: {
            backgroundColor: '#7fb2e5',
            backgroundImage: [
                'radial-gradient(ellipse 120px 60px at 18% 32%, #ffffff 0%, #ffffff 55%, rgba(255,255,255,0) 100%)',
                'radial-gradient(ellipse 160px 70px at 62% 22%, #ffffff 0%, #ffffff 50%, rgba(255,255,255,0) 100%)',
                'radial-gradient(ellipse 140px 60px at 80% 70%, #f4f9ff 0%, #f4f9ff 50%, rgba(255,255,255,0) 100%)',
                'radial-gradient(ellipse 110px 50px at 35% 78%, #ffffff 0%, #ffffff 55%, rgba(255,255,255,0) 100%)',
            ].join(', '),
            backgroundSize: '520px 360px',
        },
        lightColor: '#cfe3ee',
    },
    {
        id: 'night',
        name: 'Bangalore at night',
        style: {
            backgroundColor: '#0e1633',
            backgroundImage: [
                'radial-gradient(1.5px 1.5px at 23px 31px, #ffffff 50%, rgba(255,255,255,0) 52%)',
                'radial-gradient(1px 1px at 97px 12px, #ffffff 50%, rgba(255,255,255,0) 52%)',
                'radial-gradient(1px 1px at 141px 78px, #cfd8ff 50%, rgba(255,255,255,0) 52%)',
                'radial-gradient(1.5px 1.5px at 62px 104px, #ffffff 50%, rgba(255,255,255,0) 52%)',
                'radial-gradient(1px 1px at 118px 133px, #ffd27f 50%, rgba(255,255,255,0) 52%)',
                'linear-gradient(to top, #1a2247 0%, #1a2247 18%, rgba(26,34,71,0) 19%)',
            ].join(', '),
            backgroundSize: '160px 150px',
        },
        lightColor: '#6f7fd6',
    },
    {
        id: 'fermi',
        name: 'Fermi green',
        style: {
            backgroundColor: '#1f6b46',
            backgroundImage:
                'linear-gradient(45deg, rgba(255,255,255,0.08) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.08) 75%), linear-gradient(45deg, rgba(255,255,255,0.08) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.08) 75%)',
            backgroundSize: '4px 4px',
            backgroundPosition: '0 0, 2px 2px',
        },
        lightColor: '#7fd6a0',
    },
    {
        id: 'black',
        name: 'Black',
        style: { backgroundColor: '#000000' },
        lightColor: '#ffffff',
        intensityScale: 0.55,
    },
];

export function getWallpaper(id: string): Wallpaper {
    return WALLPAPERS.find((w) => w.id === id) || WALLPAPERS[0];
}

export function storedWallpaper(): string {
    try {
        const v = window.localStorage.getItem(STORAGE_KEY);
        if (v && WALLPAPERS.some((w) => w.id === v)) return v;
    } catch (e) {}
    return DEFAULT_WALLPAPER;
}

export function storeWallpaper(id: string) {
    try {
        window.localStorage.setItem(STORAGE_KEY, id);
    } catch (e) {}
}

/** Tell the 3D room (parent frame) what colour its screen light should be. */
export function announceWallpaper(id: string) {
    const w = getWallpaper(id);
    try {
        window.parent.postMessage(
            {
                type: 'os-wallpaper',
                id: w.id,
                lightColor: w.lightColor,
                intensityScale: w.intensityScale ?? 1,
            },
            '*'
        );
    } catch (e) {}
}

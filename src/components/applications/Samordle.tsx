import React from 'react';
import Window from '../os/Window';
import Wordle from '../wordle/Wordle';

export interface SamordleAppProps extends WindowAppProps {}

const SamordleApp: React.FC<SamordleAppProps> = (props) => {
    return (
        <Window
            top={16}
            left={300}
            width={600}
            // stay clear of the dock on shorter screens
            height={Math.min(860, window.innerHeight - 96)}
            windowBarIcon="windowGameIcon"
            windowTitle="Samordle"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={'© Copyright 2026 Samarjeet Mohite'}
        >
            <div className="site-page">
                <Wordle />
            </div>
        </Window>
    );
};

export default SamordleApp;

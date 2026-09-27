import React from 'react';
import Window from '../os/Window';
import Wordle from '../wordle/Wordle';

export interface SamordleAppProps extends WindowAppProps {}

const SamordleApp: React.FC<SamordleAppProps> = (props) => {
    return (
        <Window
            top={20}
            left={300}
            width={600}
            height={860}
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

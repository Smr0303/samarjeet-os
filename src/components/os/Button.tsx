import React, { useState } from 'react';
import { IconName } from '../../assets/icons';
import theme from '../../constants/theme';
import { Icon } from '../general';

export interface ButtonProps {
    icon?: IconName;
    text?: string;
    /** "close" is coral, like a window's close button */
    variant?: 'default' | 'close';
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ icon, text, variant = 'default', onClick }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const click = (e: any) => {
        e.preventDefault();
        setIsPressed(true);
        onClick && onClick();
    };

    const close = variant === 'close';
    const style = Object.assign(
        {},
        styles.button,
        icon && styles.iconButton,
        text && styles.textButton,
        close && { background: theme.coral },
        isHovering && { background: close ? '#c94a37' : theme.amberSoft },
        isPressed && { transform: 'scale(0.9)' }
    );

    return (
        <div
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
                setIsHovering(false);
                setIsPressed(false);
            }}
            onMouseUp={() => setIsPressed(false)}
            onMouseDown={click}
            style={style}
        >
            {icon && (
                <Icon
                    icon={icon}
                    style={Object.assign({}, styles.icon, close && { filter: 'invert(1)' })}
                />
            )}
            {text && <p style={styles.text}>{text}</p>}
        </div>
    );
};

const styles: StyleSheetCSS = {
    button: {
        background: theme.cream,
        border: `1.5px solid ${theme.ink}`,
        borderRadius: 7,
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.15s ease, transform 0.12s ease',
        boxSizing: 'border-box',
    },
    iconButton: {
        width: 22,
        height: 22,
    },
    textButton: {
        padding: '4px 12px',
    },
    icon: {
        width: 10,
        height: 10,
    },
    text: {
        fontFamily: theme.uiFont,
        fontSize: 13,
        color: theme.ink,
    },
};

export default Button;

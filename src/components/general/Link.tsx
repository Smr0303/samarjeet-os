import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

export interface LinkProps {
    text: string;
    to: string;
    containerStyle?: React.CSSProperties;
    outsideTo?: string;
}

const Link: React.FC<LinkProps> = (props) => {
    const navigate = useNavigate();

    // get current location of react router
    const location = useLocation();
    const [isHere, setIsHere] = useState(false);

    // if current path is the same as the link path
    useEffect(() => {
        if (location.pathname === `/${props.to}`) {
            setIsHere(true);
        } else {
            setIsHere(false);
        }
        return () => {};
    }, [location, props.to]);

    const [active, setActive] = useState(false);

    const handleClick = (e: any) => {
        let isMounted = true;
        e.preventDefault();
        setActive(true);
        if (location.pathname !== `/${props.to}`) {
            setTimeout(() => {
                if (isMounted) navigate(`/${props.to}`);
            }, 100);
        }
        let t = setTimeout(() => {
            if (isMounted) setActive(false);
        }, 100);

        return () => {
            isMounted = false;
            clearTimeout(t);
        };
    };

    return (
        <RouterLink
            to={`/${props.to}`}
            onMouseDown={handleClick}
            style={Object.assign({}, { display: 'flex' }, props.containerStyle)}
        >
            {isHere && <div style={styles.hereIndicator} />}
            <h4
                className="router-link"
                style={Object.assign(
                    {},
                    styles.link,
                    isHere && styles.here,
                    active && { transform: 'scale(0.95)' }
                )}
            >
                {props.text}
            </h4>
        </RouterLink>
    );
};

const styles: StyleSheetCSS = {
    link: {
        cursor: 'pointer',
        textDecoration: 'none',
        padding: '4px 10px',
        borderRadius: 8,
        transition: 'background-color 0.15s ease, transform 0.1s ease',
    },
    here: {
        background: '#fbe1c6',
        color: '#c2571f',
    },
    // a small amber dot beside the page you're on
    hereIndicator: {
        width: 6,
        height: 6,
        background: '#f2b46d',
        border: '1.5px solid #1f1b2e',
        alignSelf: 'center',
        borderRadius: '50%',
        marginRight: 4,
    },
};

export default Link;

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { IconName } from '../../assets/icons';
import theme from '../../constants/theme';
import Icon from '../general/Icon';
import Button from './Button';
import DragIndicator from './DragIndicator';
import ResizeIndicator from './ResizeIndicator';

export interface WindowProps {
    closeWindow: () => void;
    minimizeWindow: () => void;
    onInteract: () => void;
    width: number;
    height: number;
    top: number;
    left: number;
    windowTitle?: string;
    bottomLeftText?: string;
    rainbow?: boolean;
    windowBarColor?: string;
    windowBarIcon?: IconName;
    onWidthChange?: (width: number) => void;
    onHeightChange?: (height: number) => void;
}

const Window: React.FC<WindowProps> = (props) => {
    const windowRef = useRef<any>(null);
    const dragRef = useRef<any>(null);
    const contentRef = useRef<any>(null);

    const dragProps = useRef<{
        dragStartX: any;
        dragStartY: any;
    }>();

    const resizeRef = useRef<any>(null);

    const [top, setTop] = useState(props.top);
    const [left, setLeft] = useState(props.left);

    const lastClickInside = useRef(false);

    const [width, setWidth] = useState(props.width);
    const [height, setHeight] = useState(props.height);

    const [contentWidth, setContentWidth] = useState(props.width);
    const [contentHeight, setContentHeight] = useState(props.height);

    const [windowActive, setWindowActive] = useState(true);

    const [isMaximized, setIsMaximized] = useState(false);
    const [preMaxSize, setPreMaxSize] = useState({
        width,
        height,
        top,
        left,
    });

    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const startResize = (event: any) => {
        event.preventDefault();
        setIsResizing(true);
        window.addEventListener('mousemove', onResize, false);
        window.addEventListener('mouseup', stopResize, false);
    };

    const onResize = ({ clientX, clientY }: any) => {
        const curWidth = clientX - left;
        const curHeight = clientY - top;
        if (curWidth > 520) resizeRef.current.style.width = `${curWidth}px`;
        if (curHeight > 220) resizeRef.current.style.height = `${curHeight}px`;
        resizeRef.current.style.opacity = 1;
    };

    const stopResize = () => {
        setIsResizing(false);
        setWidth(resizeRef.current.style.width);
        setHeight(resizeRef.current.style.height);
        resizeRef.current.style.opacity = 0;
        window.removeEventListener('mousemove', onResize, false);
        window.removeEventListener('mouseup', stopResize, false);
    };

    const startDrag = (event: any) => {
        const { clientX, clientY } = event;
        setIsDragging(true);
        event.preventDefault();
        dragProps.current = {
            dragStartX: clientX,
            dragStartY: clientY,
        };
        window.addEventListener('mousemove', onDrag, false);
        window.addEventListener('mouseup', stopDrag, false);
    };

    const onDrag = ({ clientX, clientY }: any) => {
        let { x, y } = getXYFromDragProps(clientX, clientY);
        dragRef.current.style.transform = `translate(${x}px, ${y}px)`;
        dragRef.current.style.opacity = 1;
    };

    const stopDrag = ({ clientX, clientY }: any) => {
        setIsDragging(false);
        // dragRef.current.style.opacity = 0;
        const { x, y } = getXYFromDragProps(clientX, clientY);
        setTop(y);
        setLeft(x);
        window.removeEventListener('mousemove', onDrag, false);
        window.removeEventListener('mouseup', stopDrag, false);
    };

    const getXYFromDragProps = (
        clientX: number,
        clientY: number
    ): { x: number; y: number } => {
        if (!dragProps.current) return { x: 0, y: 0 };
        const { dragStartX, dragStartY } = dragProps.current;

        const x = clientX - dragStartX + left;
        const y = clientY - dragStartY + top;

        return { x, y };
    };

    useEffect(() => {
        dragRef.current.style.transform = `translate(${left}px, ${top}px)`;
    });

    useEffect(() => {
        props.onWidthChange && props.onWidthChange(contentWidth);
    }, [props.onWidthChange, contentWidth]); // eslint-disable-line

    useEffect(() => {
        props.onHeightChange && props.onHeightChange(contentHeight);
    }, [props.onHeightChange, contentHeight]); // eslint-disable-line

    useEffect(() => {
        setContentWidth(contentRef.current.getBoundingClientRect().width);
    }, [width]);

    useEffect(() => {
        setContentHeight(contentRef.current.getBoundingClientRect().height);
    }, [height]);

    const maximize = () => {
        if (isMaximized) {
            setWidth(preMaxSize.width);
            setHeight(preMaxSize.height);
            setTop(preMaxSize.top);
            setLeft(preMaxSize.left);
            setIsMaximized(false);
        } else {
            setPreMaxSize({
                width,
                height,
                top,
                left,
            });
            // leave the floating dock clear
            setWidth(window.innerWidth - 16);
            setHeight(window.innerHeight - 78);
            setTop(8);
            setLeft(8);
            setIsMaximized(true);
        }
    };

    const onCheckClick = () => {
        if (lastClickInside.current) {
            setWindowActive(true);
        } else {
            setWindowActive(false);
        }
        lastClickInside.current = false;
    };

    useEffect(() => {
        window.addEventListener('mousedown', onCheckClick, false);
        return () => {
            window.removeEventListener('mousedown', onCheckClick, false);
        };
    }, []);

    const onWindowInteract = () => {
        props.onInteract();
        setWindowActive(true);
        lastClickInside.current = true;
    };

    return (
        <div onMouseDown={onWindowInteract} style={styles.container}>
            <div
                style={Object.assign({}, styles.window, {
                    width,
                    height,
                    top,
                    left,
                })}
                ref={windowRef}
            >
                <motion.div
                    style={styles.windowBorderOuter}
                    // springs open from a little below and smaller
                    initial={{ opacity: 0, scale: 0.92, y: 18 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                >
                    <div style={styles.windowBorderInner}>
                        <div
                            style={styles.dragHitbox}
                            onMouseDown={startDrag}
                        ></div>
                        <div
                            className={props.rainbow ? 'rainbow-wrapper' : ''}
                            style={Object.assign(
                                {},
                                styles.topBar,
                                props.windowBarColor && {
                                    backgroundColor: props.windowBarColor,
                                },
                                !windowActive && {
                                    backgroundColor: theme.inactive,
                                }
                            )}
                        >
                            <div style={styles.windowHeader}>
                                {props.windowBarIcon ? (
                                    <Icon
                                        icon={props.windowBarIcon}
                                        style={Object.assign(
                                            {},
                                            styles.windowBarIcon,
                                            !windowActive && { opacity: 0.5 }
                                        )}
                                        size={16}
                                    />
                                ) : (
                                    <div style={{ width: 16 }} />
                                )}
                                <p
                                    style={Object.assign(
                                        {},
                                        styles.title,
                                        !windowActive && { color: theme.muted }
                                    )}
                                >
                                    {props.windowTitle}
                                </p>
                            </div>
                            <div style={styles.windowTopButtons}>
                                <Button
                                    icon="minimize"
                                    onClick={props.minimizeWindow}
                                />
                                <Button icon="maximize" onClick={maximize} />
                                <Button
                                    icon="close"
                                    variant="close"
                                    onClick={props.closeWindow}
                                />
                            </div>
                        </div>
                        <div
                            style={Object.assign({}, styles.contentOuter, {
                                // zIndex: isDragging || isResizing ? 0 : 100,
                            })}
                        >
                            <div style={styles.contentInner}>
                                <div style={styles.content} ref={contentRef}>
                                    {props.children}
                                </div>
                            </div>
                        </div>
                        <div
                            onMouseDown={startResize}
                            style={styles.resizeHitbox}
                        ></div>
                        <div style={styles.bottomBar}>
                            <div
                                style={Object.assign({}, styles.insetBorder, {
                                    flex: 5 / 7,
                                    alignItems: 'center',
                                })}
                            >
                                <p style={styles.statusText}>
                                    {props.bottomLeftText}
                                </p>
                            </div>
                            <div
                                style={Object.assign(
                                    {},
                                    styles.insetBorder,
                                    styles.bottomResizeContainer
                                )}
                            >
                                <div
                                    style={{
                                        alignItems: 'flex-end',
                                    }}
                                >
                                    <Icon size={12} icon="windowResize" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div
                style={
                    !isResizing
                        ? {
                              zIndex: -10000,
                              pointerEvents: 'none',
                          }
                        : {
                              zIndex: 1000,
                              cursor: 'nwse-resize',
                              mixBlendMode: 'difference',
                          }
                }
            >
                <ResizeIndicator
                    top={top}
                    left={left}
                    width={width}
                    height={height}
                    resizeRef={resizeRef}
                />
            </div>
            <div
                style={
                    !isDragging
                        ? {
                              zIndex: -10000,
                              pointerEvents: 'none',
                          }
                        : {
                              zIndex: 1000,
                              cursor: 'move',
                              mixBlendMode: 'difference',
                          }
                }
            >
                <DragIndicator
                    width={width}
                    height={height}
                    dragRef={dragRef}
                />
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    window: {
        position: 'absolute',
    },
    dragHitbox: {
        position: 'absolute',
        width: 'calc(100% - 90px)',
        height: 40,
        zIndex: 10000,
        top: 0,
        left: 0,
        cursor: 'move',
    },
    windowBorderOuter: {
        flex: 1,
        display: 'flex',
        border: `1.5px solid ${theme.ink}`,
        borderRadius: theme.radius,
        overflow: 'hidden',
        background: theme.cream,
        boxShadow: theme.shadow,
    },
    windowBorderInner: {
        flex: 1,
        flexDirection: 'column',
        position: 'relative',
        minWidth: 0,
    },
    resizeHitbox: {
        position: 'absolute',
        width: 40,
        height: 40,
        bottom: -10,
        right: -10,
        cursor: 'nwse-resize',
    },
    topBar: {
        backgroundColor: theme.amber,
        width: '100%',
        height: 36,
        flexShrink: 0,
        alignItems: 'center',
        padding: '0 10px',
        boxSizing: 'border-box',
        borderBottom: `1.5px solid ${theme.ink}`,
        transition: 'background-color 0.2s ease',
    },
    title: {
        fontFamily: theme.pixelFont,
        fontSize: 16,
        fontWeight: 500,
        color: theme.amberInk,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    contentOuter: {
        flexGrow: 1,
        overflow: 'hidden',
    },
    contentInner: {
        flex: 1,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        position: 'relative',
        overflowX: 'hidden',
        backgroundColor: theme.paper,
    },
    bottomBar: {
        flexShrink: 0,
        width: '100%',
        height: 26,
        alignItems: 'center',
        background: theme.cream,
        borderTop: '1px solid rgba(31, 27, 46, 0.12)',
        boxSizing: 'border-box',
        padding: '0 10px',
    },
    statusText: {
        fontFamily: theme.uiFont,
        fontSize: 12,
        color: theme.muted,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    insetBorder: {
        padding: 0,
    },
    bottomResizeContainer: {
        flex: 2 / 7,
        justifyContent: 'flex-end',
        opacity: 0.5,
    },
    windowTopButtons: {
        alignItems: 'center',
        gap: 6,
    },
    windowHeader: {
        flex: 1,
        alignItems: 'center',
        minWidth: 0,
    },
    windowBarIcon: {
        paddingRight: 8,
    },
};

export default Window;

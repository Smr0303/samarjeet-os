import React from 'react';
import Window from '../os/Window';
import Resume from '../../assets/resume/Samarjeet_Mohite_Resume_Sep_2026.pdf';

export interface ResumeViewerProps extends WindowAppProps {}

/** Start > Documents > Resume.pdf */
const ResumeViewer: React.FC<ResumeViewerProps> = (props) => {
    return (
        <Window
            top={40}
            left={280}
            width={760}
            height={900}
            windowTitle="Resume.pdf"
            windowBarIcon="pdfIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={'Samarjeet_Mohite_Resume_Sep_2026.pdf'}
        >
            <div className="site-page" style={styles.wrap}>
                <iframe
                    src={Resume}
                    title="Resume"
                    style={styles.frame}
                />
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    wrap: {
        background: '#808080',
    },
    frame: {
        width: '100%',
        height: '100%',
        border: 'none',
    },
};

export default ResumeViewer;

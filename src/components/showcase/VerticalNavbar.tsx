import React, { useEffect, useState } from 'react';
import { Link } from '../general';
import { useLocation, useNavigate } from 'react-router';
import theme from '../../constants/theme';

export interface VerticalNavbarProps {}

const VerticalNavbar: React.FC<VerticalNavbarProps> = (props) => {
    const location = useLocation();
    const [projectsExpanded, setProjectsExpanded] = useState(false);
    const [isHome, setIsHome] = useState(false);

    const navigate = useNavigate();
    const goToContact = () => {
        navigate('/contact');
    };

    useEffect(() => {
        if (location.pathname.includes('/projects')) {
            setProjectsExpanded(true);
        } else {
            setProjectsExpanded(false);
        }
        if (location.pathname === '/') {
            setIsHome(true);
        } else {
            setIsHome(false);
        }
        return () => {};
    }, [location.pathname]);

    return !isHome ? (
        <div style={styles.navbar}>
            <div style={styles.header}>
                <h1 style={styles.headerText}>Samarjeet</h1>
                <h1 style={styles.headerText}>Mohite</h1>
                <p style={styles.headerShowcase}>Showcase '26</p>
            </div>
            <div style={styles.links}>
                <Link containerStyle={styles.link} to="" text="HOME" />
                <Link containerStyle={styles.link} to="about" text="ABOUT" />
                <Link
                    containerStyle={styles.link}
                    to="experience"
                    text="EXPERIENCE"
                />
                <Link
                    containerStyle={Object.assign(
                        {},
                        styles.link,
                        projectsExpanded && styles.expandedLink
                    )}
                    to="projects"
                    text="PROJECTS"
                />
                {
                    // if current path contains projects
                    projectsExpanded && (
                        <div style={styles.insetLinks}>
                            <Link
                                containerStyle={styles.insetLink}
                                to="projects/software"
                                text="SOFTWARE"
                            />
                            <Link
                                containerStyle={styles.insetLink}
                                to="projects/older"
                                text="OLDER"
                            />
                            {/* MUSIC and ART links hidden for now; pages remain in ./projects/ */}
                        </div>
                    )
                }
                <Link
                    containerStyle={styles.link}
                    to="contact"
                    text="CONTACT"
                />
            </div>
            <div style={styles.spacer} />
            <div style={styles.forHireContainer} onMouseDown={goToContact}>
                {/* <img src={forHire} style={styles.image} alt="" /> */}
            </div>
        </div>
    ) : (
        <></>
    );
};

const styles: StyleSheetCSS = {
    navbar: {
        width: 300,
        height: '100%',
        flexDirection: 'column',
        padding: 40,
        boxSizing: 'border-box',
        position: 'fixed',
        overflow: 'hidden',
        background: theme.cream,
        borderRight: '1px solid rgba(31, 27, 46, 0.12)',
    },
    header: {
        flexDirection: 'column',
        marginBottom: 56,
    },
    headerText: {
        fontSize: 40,
        lineHeight: 1,
    },
    headerShowcase: {
        marginTop: 12,
        alignSelf: 'flex-start',
        padding: '2px 10px',
        borderRadius: 999,
        border: `1.5px solid ${theme.ink}`,
        background: theme.amber,
        color: theme.amberInk,
        fontWeight: 700,
        fontSize: 13,
    },
    logo: {
        width: '100%',
        marginBottom: 8,
    },
    link: {
        marginBottom: 20,
    },
    expandedLink: {
        marginBottom: 12,
    },
    insetLinks: {
        flexDirection: 'column',
        marginLeft: 32,
        marginBottom: 16,
    },
    insetLink: {
        marginBottom: 8,
    },
    links: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
    },
    image: {
        width: '80%',
    },
    spacer: {
        flex: 1,
    },
    forHireContainer: {
        cursor: 'pointer',

        width: '100%',
    },
};

export default VerticalNavbar;

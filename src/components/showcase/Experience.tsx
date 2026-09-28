import React from 'react';
import ResumeDownload from './ResumeDownload';

export interface ExperienceProps {}

const Experience: React.FC<ExperienceProps> = (props) => {
    return (
        <div className="site-page-content">
            <ResumeDownload />
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>Fermi AI</h1>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href={'https://fermi.ai/'}
                        >
                            <h4>www.fermi.ai</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>Software Engineer</h3>
                        <b>
                            <p>May 2026 - Present</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>
                    Fermi AI is a Meraki Labs venture building an AI-powered
                    STEM learning platform: AI tutors, study tools and a
                    problem-solving workbench. Bangalore, onsite. Written in
                    Python and TypeScript using FastAPI, Postgres, Celery,
                    React and AWS ECS.
                </p>
                <br />
                <ul>
                    <li>
                        <p>
                            Built usage-based billing and a credit ledger for AI
                            tutors using FastAPI, Postgres and Celery.
                        </p>
                    </li>
                    <li>
                        <p>
                            Launched Scan &amp; Ask, a photo-to-AI-tutor
                            pipeline built on Gemini, live with India's National
                            Digital Library.
                        </p>
                    </li>
                    <li>
                        <p>
                            Reduced Postgres connection setups by 92% (64 to 5)
                            and set up Grafana monitoring via Terraform on AWS
                            ECS.
                        </p>
                    </li>
                    <li>
                        <p>
                            Optimized the home-page payload 3,900x (3.9MB to
                            1KB) and library queries 4.5x (9 scans to 2).
                        </p>
                    </li>
                </ul>
            </div>
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>Nurix AI</h1>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={'https://nurix.ai/'}
                        >
                            <h4>www.nurix.ai</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>Software Engineer</h3>
                        <b>
                            <p>Oct 2025 - Apr 2026</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>
                    Nurix AI is a Meraki Labs venture building AI voice and chat
                    agents for enterprises. Bangalore, onsite. Written in
                    Python and TypeScript using FastAPI, AWS SQS, MySQL, Redis
                    and Next.js.
                </p>
                <br />
                <ul>
                    <li>
                        <p>
                            Designed and developed a Campaign Manager system for
                            bulk lead ingestion and automated outbound calling
                            with configurable logic, using FastAPI, AWS SQS and
                            MySQL.
                        </p>
                    </li>
                    <li>
                        <p>
                            Performed load testing and system optimization that
                            reduced database load by 70%, implemented Weighted
                            Fair Scheduling and improved session handling to
                            scale the system.
                        </p>
                    </li>
                    <li>
                        <p>
                            Built a queue orchestrator with Redis-backed
                            agent-level rate limiting using Lua scripts for
                            triggering outbound calls.
                        </p>
                    </li>
                </ul>
            </div>
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>Nurix AI</h1>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={'https://nurix.ai/'}
                        >
                            <h4>www.nurix.ai</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>Software Engineer Intern</h3>
                        <b>
                            <p>Mar 2025 - Sep 2025</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>
                    Joined Nurix as an intern during the final semester of my
                    integrated degree and converted to a full-time engineer
                    afterwards.
                </p>
                <br />
                <ul>
                    <li>
                        <p>
                            Integrated LiteLLM as a unified LLM interface to
                            orchestrate LLM and tool calls across multiple
                            providers.
                        </p>
                    </li>
                    <li>
                        <p>
                            Built the end-to-end frontend in Next.js for an AI
                            Agent QA Platform, enabling testing and debugging
                            of AI agents.
                        </p>
                    </li>
                    <li>
                        <p>
                            Engineered a channel integration that embeds
                            customizable chat agents into any website, using
                            Service Workers for WebSocket management and
                            multi-tab synchronization.
                        </p>
                    </li>
                </ul>
            </div>
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>Flagright</h1>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={'https://www.flagright.com/'}
                        >
                            <h4>www.flagright.com</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>Software Engineer Intern</h3>
                        <b>
                            <p>Dec 2024 - Mar 2025</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>
                    Flagright (YC W22) builds real-time transaction monitoring
                    and AML compliance tooling for fintechs. Bangalore, onsite.
                </p>
                <br />
                <ul>
                    <li>
                        <p>
                            Improved the rules execution engine by implementing
                            asynchronous processing, reducing latency by 15%.
                        </p>
                    </li>
                    <li>
                        <p>
                            Designed APIs and created a Nango-based pipeline to
                            sync CRM tickets into backend databases, reducing
                            latency by 20%.
                        </p>
                    </li>
                    <li>
                        <p>
                            Built the dashboard that shows users their CRM
                            tickets and handled the end-to-end integration with
                            the APIs.
                        </p>
                    </li>
                </ul>
            </div>
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>Earlier internships</h1>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>During college</h3>
                        <b>
                            <p>2022 - 2024</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <ul>
                    <li>
                        <p>
                            <b>Sarvatech Labs</b>, Blockchain Developer Intern.
                            Built web3 applications with Solidity and the
                            surrounding tooling; this is where most of the
                            DApps on the Older Projects page come from.
                        </p>
                    </li>
                    <li>
                        <p>
                            <b>Inovocare Healthsoft Solutions</b>, SDE Intern
                            (Full Stack). Shipped features across a React and
                            Node.js healthcare product.
                        </p>
                    </li>
                </ul>
            </div>
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>Education</h1>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>IIIT Gwalior</h3>
                        <b>
                            <p>Jul 2020 - May 2025</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>
                    Integrated Bachelors and Masters in Information Technology,
                    Indian Institute of Information Technology, Gwalior. CGPA
                    7.9.
                </p>
                <br />
                <h3 style={styles.indent}>Competitive Programming:</h3>
                <ul>
                    <li style={styles.row}>
                        <p>• Codeforces, Specialist, peak 1562</p>
                        <p>
                            [{' '}
                            <a
                                href="https://codeforces.com/profile/zyab"
                                target="_blank"
                                rel="noreferrer"
                            >
                                PROFILE
                            </a>{' '}
                            ]
                        </p>
                    </li>
                    <li style={styles.row}>
                        <p>• LeetCode, Knight, peak 1860</p>
                        <p>
                            [{' '}
                            <a
                                href="https://leetcode.com/u/Smohite3"
                                target="_blank"
                                rel="noreferrer"
                            >
                                PROFILE
                            </a>{' '}
                            ]
                        </p>
                    </li>
                    <li style={styles.row}>
                        <p>• CodeChef, 4 Star, peak 1884</p>
                        <p>
                            [{' '}
                            <a
                                href="https://www.codechef.com/users/zyab_officials"
                                target="_blank"
                                rel="noreferrer"
                            >
                                PROFILE
                            </a>{' '}
                            ]
                        </p>
                    </li>
                    <li style={styles.row}>
                        <p>• Global rank 38, Codeforces Round 760 Div 3</p>
                    </li>
                    <li style={styles.row}>
                        <p>• Top 1600 of 400k+ teams, Flipkart Grid 5.0</p>
                    </li>
                </ul>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    header: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
    },
    headerContainer: {
        alignItems: 'flex-end',
        width: '100%',
        justifyContent: 'center',
    },
    indent: {
        marginLeft: 24,
    },
    headerRow: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};

export default Experience;

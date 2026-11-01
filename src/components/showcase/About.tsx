import React from 'react';
import { Link } from 'react-router-dom';
import ResumeDownload from './ResumeDownload';

export interface AboutProps {}

const About: React.FC<AboutProps> = (props) => {
    return (
        <div className="site-page-content">
            <h1 style={{ marginLeft: -16 }}>Welcome</h1>
            <h3>I'm Samarjeet Mohite</h3>
            <br />
            <div className="text-block">
                <p>
                    I'm a software engineer with 2+ years of experience,
                    currently at Fermi AI (a Meraki Labs venture) in Bangalore,
                    where I work on the backend and frontend of an AI-powered
                    STEM learning platform. In May 2025 I graduated from the Indian
                    Institute of Information Technology, Gwalior with an
                    integrated Bachelors and Masters in Information Technology.
                </p>
                <br />
                <p>
                    Thank you for taking the time to check out my portfolio. If
                    you have any questions or comments, feel free to reach me
                    through the <Link to="/contact">contact page</Link> or shoot
                    me an email at{' '}
                    <a href="mailto:samarmohite7@gmail.com">
                        samarmohite7@gmail.com
                    </a>
                </p>
            </div>
            <ResumeDownload />
            <div className="text-block">
                <h3>About Me</h3>
                <br />
                <p>
                    I like building the unglamorous parts of a product that
                    have to be right: billing ledgers, queue orchestrators,
                    rate limiters, and the observability that tells you when
                    they are not. Most of my work is in Python and TypeScript
                    with FastAPI, Postgres, Redis, Celery, React and AWS.
                </p>
                <br />
                <p>
                    I started my career at Nurix AI, another Meraki Labs
                    venture, as a full-stack and delivery engineer. I built the
                    frontend for an AI agent QA platform and a channel
                    integration that embeds chat agents into any website, and
                    worked as a forward-deployed engineer, integrating our
                    agents with the systems of edtech and retail clients, worth
                    $200K+ ARR combined. On the backend I built a campaign
                    manager for bulk outbound calling that grew to ~40 clients
                    and 5 lakh+ calls a day (700 concurrent), a
                    Redis-backed queue orchestrator, and the load testing that
                    cut database load by 40%. In 2026 I joined Fermi AI, a
                    sister venture, where I built usage-based billing for AI
                    tutors and an A/B experiment platform, and launched Scan
                    &amp; Ask with India's National Digital Library. You can read more on the{' '}
                    <Link to="/experience">Experience</Link> page.
                </p>
                <br />
                <p>
                    Outside work I ship side projects, including GroupMailBox,
                    a lead-capture and email SaaS with a published Chrome
                    extension, and Relay, a Postgres-backed durable workflow
                    engine. I also do competitive programming: Specialist on
                    Codeforces, Knight on LeetCode, 4 Star on CodeChef.
                </p>
                <br />
                <p>
                    If you have any questions or comments I would love to hear
                    them. You can reach me through the{' '}
                    <Link to="/contact">contact page</Link> or shoot me an email
                    at{' '}
                    <a href="mailto:samarmohite7@gmail.com">
                        samarmohite7@gmail.com
                    </a>
                </p>
            </div>
        </div>
    );
};

export default About;

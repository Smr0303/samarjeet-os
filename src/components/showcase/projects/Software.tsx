import React from 'react';
import ResumeDownload from '../ResumeDownload';

export interface SoftwareProjectsProps {}

const SoftwareProjects: React.FC<SoftwareProjectsProps> = (props) => {
    return (
        <div className="site-page-content">
            <h1>Software</h1>
            <h3>Projects</h3>
            <br />
            <p>
                Below are some of the software projects I have built outside
                of work. Each one has links to the code or the live product.
            </p>
            <br />
            <ResumeDownload />
            <br />
            <div className="text-block">
                <h2>GroupMailBox</h2>
                <br />
                <p>
                    GroupMailBox is a lead-capture and email SaaS for people
                    who run Facebook Groups. A Chrome extension syncs new group
                    members and their answers to the join questions straight
                    into Google Sheets, and a campaign engine lets you email
                    those leads from your own Gmail account. I built and
                    shipped the whole thing solo: extension, backend, billing
                    and the marketing site.
                </p>
                <br />
                <ul>
                    <li>
                        <p>
                            Published the Chrome extension on the Chrome Web
                            Store; it syncs Facebook Group leads to Google
                            Sheets.
                        </p>
                    </li>
                    <li>
                        <p>
                            Built the Gmail campaign engine on BullMQ and Redis
                            with per-account rate limits, retries and signed
                            unsubscribe links.
                        </p>
                    </li>
                    <li>
                        <p>
                            Shipped Google OAuth, JWT auth, paid plans and the
                            groupmailbox.com site. Written in TypeScript with
                            Express, BullMQ, Redis and Next.js.
                        </p>
                    </li>
                </ul>
                <br />
                <h3>Links:</h3>
                <ul>
                    <li>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href="https://chromewebstore.google.com/detail/groupmailbox/nbiakohglicfbphghphgjijckccnknbp"
                        >
                            <p>
                                <b>[Chrome Web Store]</b> - GroupMailBox
                            </p>
                        </a>
                    </li>
                    <li>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href="https://groupmailbox.com"
                        >
                            <p>
                                <b>[Live Site]</b> - groupmailbox.com
                            </p>
                        </a>
                    </li>
                    <li>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href="https://github.com/Smr0303/GroupConvert-Extension"
                        >
                            <p>
                                <b>[GitHub]</b> - Chrome extension
                            </p>
                        </a>
                    </li>
                    <li>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href="https://github.com/Smr0303/GroupConvert-Service"
                        >
                            <p>
                                <b>[GitHub]</b> - Backend service
                            </p>
                        </a>
                    </li>
                    <li>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href="https://github.com/Smr0303/GroupBoxWebsite"
                        >
                            <p>
                                <b>[GitHub]</b> - Marketing site (Next.js +
                                React Three Fiber)
                            </p>
                        </a>
                    </li>
                </ul>
            </div>
            <div className="text-block">
                <h2>Relay</h2>
                <br />
                <p>
                    Relay is a durable workflow engine I am building in Python.
                    You write ordinary async code with steps, sleeps and
                    signals, and the engine guarantees that if the process,
                    the machine or the whole cluster dies, the workflow resumes
                    exactly where it was. It is a Postgres-backed journal plus
                    stateless workers: no Kafka, no Cassandra, one binary and a
                    database.
                </p>
                <br />
                <ul>
                    <li>
                        <p>
                            Journal and replay design: every step's result is
                            written to Postgres before the workflow moves on,
                            so a restart replays the journal instead of
                            re-running side effects.
                        </p>
                    </li>
                    <li>
                        <p>
                            Effectively-once side effects via idempotency keys
                            the engine supplies. The chaos test target is 1,000
                            workflows producing exactly 1,000 charges under
                            random worker kills.
                        </p>
                    </li>
                    <li>
                        <p>
                            Stateless workers lease tasks with Postgres SKIP
                            LOCKED, with durable timers, signals and
                            OpenTelemetry tracing. Built with FastAPI, Postgres
                            and OpenTelemetry.
                        </p>
                    </li>
                </ul>
                <br />
                <p>
                    Status: in progress. The design is done and the engine is
                    being built; the repo will be linked here when it is
                    public.
                </p>
            </div>
            <div className="text-block">
                <h2>This website</h2>
                <br />
                <p>
                    The site you are looking at is two apps. A Three.js scene
                    renders the desk and the CRT monitor, and the monitor
                    shows this Windows-95 style OS through an iframe. The 3D
                    scene, the OS shell and the games were designed and built
                    by Henry Heffernan and released under the MIT license; I
                    forked both repos, replaced the content with my own, fixed
                    a few build and dependency issues, and deployed them to
                    Vercel. Full credit for the original work is in the
                    Credits app on the desktop.
                </p>
                <br />
                <h3>Links:</h3>
                <ul>
                    <li>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href="https://github.com/Smr0303/samarjeet-portfolio-3d"
                        >
                            <p>
                                <b>[GitHub]</b> - 3D site (my fork)
                            </p>
                        </a>
                    </li>
                    <li>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href="https://github.com/Smr0303/samarjeet-os"
                        >
                            <p>
                                <b>[GitHub]</b> - OS site (my fork)
                            </p>
                        </a>
                    </li>
                    <li>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href="https://github.com/henryjeff/portfolio-website"
                        >
                            <p>
                                <b>[GitHub]</b> - Original by Henry Heffernan
                            </p>
                        </a>
                    </li>
                </ul>
            </div>
            <ResumeDownload />
        </div>
    );
};

export default SoftwareProjects;

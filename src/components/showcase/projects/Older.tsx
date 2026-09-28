import React from 'react';
import ResumeDownload from '../ResumeDownload';
import multiwallet from '../../../assets/pictures/projects/older/multiwallet.jpg';
import smartkart from '../../../assets/pictures/projects/older/smartkart.jpg';
import mercado from '../../../assets/pictures/projects/older/mercado.jpg';
import trillow from '../../../assets/pictures/projects/older/trillow.jpg';
import krypt from '../../../assets/pictures/projects/older/krypt.jpg';
import shopvivo from '../../../assets/pictures/projects/older/shopvivo.jpg';
import movie from '../../../assets/pictures/projects/older/movie.jpg';

export interface OlderProjectsProps {}

interface OldProject {
    title: string;
    period: string;
    description: string;
    stack: string[];
    image?: string;
    github?: string;
    demo?: string;
    demoLabel?: string;
}

const PROJECTS: OldProject[] = [
    {
        title: 'Video Transcoder',
        period: 'April 2024',
        description:
            'A video transcoding pipeline. Uploads are picked up by a Node.js server that schedules FFmpeg jobs in Docker containers on AWS ECS and produces 360p, 480p and 720p renditions.',
        stack: ['Node.js', 'FFmpeg', 'Docker', 'AWS ECS', 'React'],
        github: 'https://github.com/Smr0303/VideoTranscoder',
    },
    {
        title: 'MultiWallet',
        period: '2024',
        description:
            'A digital multi-signature wallet built on account abstraction. Users create and manage multiple smart-contract accounts from one interface.',
        stack: ['Next.js', 'Foundry', 'Prisma', 'Wagmi', 'Tailwind CSS'],
        image: multiwallet,
        github: 'https://github.com/Smr0303/MultiWallet',
        demo: 'https://multi-wallet-beta.vercel.app/',
    },
    {
        title: 'SmartKart',
        period: 'July to August 2023, Flipkart Grid 5.0',
        description:
            'An e-commerce platform with a decentralised loyalty system: customers earn ERC-20 tokens for targeted interactions and brands get a dashboard to watch transactions and reward loyal users. Placed in the top 1600 of 400k+ teams.',
        stack: ['React', 'Next.js', 'Solidity', 'Hardhat', 'Ethers', 'Supabase'],
        image: smartkart,
        github: 'https://github.com/Flipkart-Grid5-0-Blockchain/grid-frontend',
        demo: 'https://youtu.be/QQskLAJ6yng',
        demoLabel: 'Demo video',
    },
    {
        title: 'MercadoNFT',
        period: '2023',
        description:
            'A decentralised NFT marketplace where users buy and sell NFTs with transparent, on-chain ownership.',
        stack: ['Next.js', 'Moralis', 'Hardhat', 'Ethers', 'GraphQL'],
        image: mercado,
        github: 'https://github.com/Smr0303/MercadoNFT',
    },
    {
        title: 'Trillow4907',
        period: '2023',
        description:
            'A real-estate DApp built on rentable NFTs (ERC-4907), so properties can be traded and rented digitally.',
        stack: ['React', 'Hardhat', 'Ethers', 'IPFS'],
        image: trillow,
        github: 'https://github.com/Smr0303/Trillow',
        demo: 'https://trillow.vercel.app/',
    },
    {
        title: 'Krypt',
        period: '2022',
        description:
            'A web app for transferring Ethereum and storing the transaction records on-chain.',
        stack: ['Vite', 'React', 'Hardhat', 'Ethers'],
        image: krypt,
        github: 'https://github.com/Smr0303/Transaction-App',
        demo: 'https://chic-peony-f0115b.netlify.app/',
    },
    {
        title: 'Shopvivo',
        period: '2022',
        description:
            'An e-commerce web app I built to learn the MERN stack end to end: catalogue, cart, image uploads and orders.',
        stack: ['React', 'Node.js', 'MongoDB', 'Cloudinary'],
        image: shopvivo,
        github: 'https://github.com/Smr0303/Shopvivo',
        demo: 'https://shopvivo.onrender.com/',
    },
    {
        title: 'KinoTicket',
        period: '2022',
        description:
            'A movie ticket booking site where users pick a show and seat and pay online through Razorpay.',
        stack: ['HTML', 'CSS', 'Node.js', 'PostgreSQL', 'Razorpay'],
        image: movie,
        github: 'https://github.com/Smr0303/Movie-Frontend',
        demo: 'https://kinoticket.netlify.app/',
    },
];

const OlderProjects: React.FC<OlderProjectsProps> = (props) => {
    return (
        <div className="site-page-content">
            <h1>Older</h1>
            <h3>Projects</h3>
            <br />
            <p>
                Projects from college, 2022 to 2024. Most of them are from the
                stretch when I was deep into web3 and building DApps with
                Solidity; the last one is the video pipeline that pulled me
                towards backend and infrastructure work. Demo links may have
                gone stale since some of these ran on free hosting.
            </p>
            <br />
            <ResumeDownload />
            <br />
            {PROJECTS.map((project) => (
                <div className="text-block" key={project.title}>
                    <h2>{project.title}</h2>
                    <p>
                        <b>{project.period}</b>
                    </p>
                    <br />
                    <p>{project.description}</p>
                    <br />
                    <p>
                        <b>Stack:</b> {project.stack.join(', ')}
                    </p>
                    <br />
                    {project.image && (
                        <div className="captioned-image">
                            <img src={project.image} alt="" />
                        </div>
                    )}
                    <h3>Links:</h3>
                    <ul>
                        {project.github && (
                            <li>
                                <a
                                    rel="noreferrer"
                                    target="_blank"
                                    href={project.github}
                                >
                                    <p>
                                        <b>[GitHub]</b> - {project.title}
                                    </p>
                                </a>
                            </li>
                        )}
                        {project.demo && (
                            <li>
                                <a
                                    rel="noreferrer"
                                    target="_blank"
                                    href={project.demo}
                                >
                                    <p>
                                        <b>[{project.demoLabel || 'Live'}]</b>{' '}
                                        - {project.title}
                                    </p>
                                </a>
                            </li>
                        )}
                    </ul>
                </div>
            ))}
            <ResumeDownload />
        </div>
    );
};

export default OlderProjects;

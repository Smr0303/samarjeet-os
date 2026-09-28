import { README_TEXT } from '../applications/Notepad';

export interface CommandContext {
    openApp: (key: string) => void;
    openShowcaseAt: (path: string) => void;
}

export interface CommandResult {
    output: string[];
    clear?: boolean;
    exit?: boolean;
    matrix?: boolean;
}

export const BANNER = [
    'MohiteOS [Version 2026.09.28]',
    '(C) Samarjeet Mohite. Forked from HeffernanOS.',
    '',
    'Type "help" to see what this thing can do.',
    '',
];

const APPS: { [name: string]: string } = {
    showcase: 'showcase',
    notepad: 'notepad',
    readme: 'notepad',
    doom: 'doom',
    trail: 'trail',
    oregon: 'trail',
    scrabble: 'scrabble',
    samordle: 'samordle',
    wordle: 'samordle',
    minesweeper: 'minesweeper',
    mines: 'minesweeper',
    credits: 'credits',
    display: 'display',
    clock: 'datetime',
    resume: 'resume',
};

const PAGES: { [name: string]: string } = {
    about: '/about',
    experience: '/experience',
    projects: '/projects',
    software: '/projects/software',
    older: '/projects/older',
    contact: '/contact',
};

const HELP = [
    'Commands:',
    '  help              this list',
    '  dir               what is on this disk',
    '  type <file>       print a file (readme.txt, resume.txt)',
    '  whoami            who owns this desk',
    '  experience        where I have worked',
    '  projects          what I have built',
    '  contact           how to reach me',
    '  start <app>       showcase, notepad, doom, trail, scrabble,',
    '                    samordle, minesweeper, credits, display, clock',
    '  open <page>       about, experience, projects, software, older, contact',
    '  ver, date, time, cls, exit',
    '',
];

const DIR = [
    ' Volume in drive C is MOHITEOS',
    ' Directory of C:\\',
    '',
    'README   TXT         ' + README_TEXT.length.toString().padStart(6) + '  09-28-26   9:41p',
    'RESUME   TXT           1,392  09-28-26   9:41p',
    'RESUME   PDF          37,504  09-28-26   9:41p',
    'PROJECTS     <DIR>           09-28-26   9:41p',
    'GAMES        <DIR>           09-28-26   9:41p',
    '        3 file(s)         38,896 bytes',
    '        2 dir(s)   640,000 bytes free',
    '',
];

const RESUME = [
    'SAMARJEET MOHITE',
    'Software Engineer, Bangalore',
    'samarmohite7@gmail.com | github.com/Smr0303 | linkedin.com/in/smr0x03',
    '',
    'FERMI AI (Meraki Labs)          Software Engineer        May 2026 - now',
    '  Usage-based billing + credit ledger for AI tutors (FastAPI/Postgres/Celery).',
    '  Launched Scan & Ask with India\'s National Digital Library.',
    '  Postgres connection setups -92%; Grafana on AWS ECS via Terraform.',
    'NURIX AI (Meraki Labs)          Software Engineer        Oct 2025 - Apr 2026',
    '  Campaign Manager for bulk outbound calling (FastAPI/SQS/MySQL).',
    '  Load testing: DB load -70%; Redis + Lua rate-limited queue orchestrator.',
    'NURIX AI                        SWE Intern               Mar 2025 - Sep 2025',
    'FLAGRIGHT (YC W22)              SWE Intern               Dec 2024 - Mar 2025',
    'SARVATECH LABS                  Blockchain Dev Intern    May 2023 - Jul 2023',
    'INOVOCARE HEALTHSOFT            SDE Intern               Jun 2022 - Jan 2023',
    '',
    'IIIT Gwalior, Integrated B.Tech + M.Tech IT, 2020-2025, CGPA 7.9',
    'Codeforces Specialist 1562 | LeetCode Knight 1860 | CodeChef 4* 1884',
    '',
    'Full PDF: start resume',
    '',
];

const EXPERIENCE = [
    'Fermi AI ....... Software Engineer ........ May 2026 - now',
    'Nurix AI ....... Software Engineer ........ Oct 2025 - Apr 2026',
    'Nurix AI ....... SWE Intern ............... Mar 2025 - Sep 2025',
    'Flagright ...... SWE Intern ............... Dec 2024 - Mar 2025',
    'Sarvatech Labs . Blockchain Dev Intern .... May 2023 - Jul 2023',
    'Inovocare ...... SDE Intern ............... Jun 2022 - Jan 2023',
    '',
    'Details: open experience',
    '',
];

const PROJECTS = [
    'GroupMailBox ... lead-capture + email SaaS, Chrome extension (live)',
    'Relay .......... durable workflow engine on Postgres (in progress)',
    'This site ...... 3D room + this OS, forked from Henry Heffernan (MIT)',
    'Older .......... MultiWallet, SmartKart, MercadoNFT, Trillow, Krypt,',
    '                 Shopvivo, KinoTicket, Video Transcoder',
    '',
    'Details: open projects',
    '',
];

const CONTACT = [
    'Email ..... samarmohite7@gmail.com',
    'GitHub .... github.com/Smr0303',
    'LinkedIn .. linkedin.com/in/smr0x03',
    'LeetCode .. leetcode.com/u/Smohite3',
    '',
    'Form: open contact',
    '',
];

function pad(n: number) {
    return n < 10 ? '0' + n : String(n);
}

export function runCommand(raw: string, ctx: CommandContext): CommandResult {
    const input = raw.trim();
    if (!input) return { output: [] };
    const [cmdRaw, ...rest] = input.split(/\s+/);
    const cmd = cmdRaw.toLowerCase();
    const arg = rest.join(' ').toLowerCase();

    switch (cmd) {
        case 'help':
        case '?':
            return { output: HELP };
        case 'dir':
        case 'ls':
            return { output: DIR };
        case 'cls':
        case 'clear':
            return { output: [], clear: true };
        case 'ver':
            return { output: ['MohiteOS [Version 2026.09.28]', ''] };
        case 'date': {
            const d = new Date();
            return {
                output: [
                    `Current date is ${pad(d.getMonth() + 1)}-${pad(
                        d.getDate()
                    )}-${d.getFullYear()}`,
                    '',
                ],
            };
        }
        case 'time': {
            const d = new Date();
            return {
                output: [
                    `Current time is ${pad(d.getHours())}:${pad(
                        d.getMinutes()
                    )}:${pad(d.getSeconds())}`,
                    '',
                ],
            };
        }
        case 'whoami':
            return {
                output: [
                    'samarjeet',
                    'Software engineer at Fermi AI, Bangalore. IIIT Gwalior 2025.',
                    'Python, TypeScript, Postgres, Redis, AWS. Ships side projects.',
                    '',
                ],
            };
        case 'type':
        case 'cat': {
            if (arg === 'readme.txt' || arg === 'readme')
                return { output: README_TEXT.split('\n') };
            if (arg === 'resume.txt' || arg === 'resume')
                return { output: RESUME };
            if (arg === 'resume.pdf') {
                ctx.openApp('resume');
                return { output: ['Opening RESUME.PDF...', ''] };
            }
            if (!arg) return { output: ['Required parameter missing', ''] };
            return { output: ['File not found - ' + arg.toUpperCase(), ''] };
        }
        case 'experience':
            return { output: EXPERIENCE };
        case 'projects':
            return { output: PROJECTS };
        case 'contact':
            return { output: CONTACT };
        case 'start':
        case 'run': {
            if (!arg)
                return {
                    output: ['Usage: start <app>. Try "help".', ''],
                };
            const key = APPS[arg];
            if (!key)
                return {
                    output: [`Bad command or file name - ${arg}`, ''],
                };
            ctx.openApp(key);
            return { output: [`Starting ${arg}...`, ''] };
        }
        case 'open':
        case 'cd': {
            const path = PAGES[arg];
            if (!path)
                return {
                    output: [
                        'Pages: about, experience, projects, software, older, contact',
                        '',
                    ],
                };
            ctx.openShowcaseAt(path);
            return { output: [`Opening ${arg}...`, ''] };
        }
        case 'exit':
        case 'quit':
            return { output: [], exit: true };
        case 'matrix':
            return { output: ['Wake up...'], matrix: true };
        case 'sudo':
            return { output: ['Nice try.', ''] };
        case 'rm':
        case 'del':
        case 'format':
            return {
                output: ['Access denied. This is my desk, not yours.', ''],
            };
        case 'echo':
            return { output: [rest.join(' '), ''] };
        case 'hello':
        case 'hi':
            return { output: ['Hello. Type "help".', ''] };
        default:
            return {
                output: [`Bad command or file name - ${cmdRaw}`, ''],
            };
    }
}

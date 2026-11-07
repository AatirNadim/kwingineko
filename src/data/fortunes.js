/**
 * fortunes.js
 * Retro Monokai Engineering Workstation Fortune Cookie Dataset.
 * 48 witty, high-signal fortunes across 5 distinct categories.
 */

export const FORTUNES = [
  // ─── TECH (Developer humor, git, bugs, cloud, compilers, architecture) ──────
  {
    id: 'tech-01',
    text: 'It works on your machine. We are shipping your machine as a multi-region cluster.',
    category: 'tech',
    luckyNumber: 200,
    luckyHex: '0x00C8',
    omen: 'FAVORABLE',
  },
  {
    id: 'tech-02',
    text: 'A bug fixed at 02:00 AM is three distinct architectural catastrophes by 09:15 AM.',
    category: 'tech',
    luckyNumber: 418,
    luckyHex: '0x01A2',
    omen: 'TURBULENT',
  },
  {
    id: 'tech-03',
    text: 'Your next commit message will simply say "fix again". Nobody will judge you.',
    category: 'tech',
    luckyNumber: 1337,
    luckyHex: '0x1337',
    omen: 'QUESTIONABLE',
  },
  {
    id: 'tech-04',
    text: 'The cache is never invalidated. The cache is merely waiting to strike at deploy time.',
    category: 'tech',
    luckyNumber: 304,
    luckyHex: '0x0130',
    omen: 'CRITICAL',
  },
  {
    id: 'tech-05',
    text: 'Weeks of software programming can save you several minutes of reading the documentation.',
    category: 'tech',
    luckyNumber: 42,
    luckyHex: '0x002A',
    omen: 'SERENE',
  },
  {
    id: 'tech-06',
    text: 'Today is a magnificent day to delete 800 lines of dead legacy abstractions.',
    category: 'tech',
    luckyNumber: 204,
    luckyHex: '0x00CC',
    omen: 'FAVORABLE',
  },
  {
    id: 'tech-07',
    text: 'You will soon contemplate rewriting the entire backend in Rust. Take a cold shower instead.',
    category: 'tech',
    luckyNumber: 101,
    luckyHex: '0x0065',
    omen: 'QUESTIONABLE',
  },
  {
    id: 'tech-08',
    text: 'The rubber duck on your desk has filed a formal grievance with HR regarding your code architecture.',
    category: 'tech',
    luckyNumber: 503,
    luckyHex: '0x01F7',
    omen: 'TURBULENT',
  },
  {
    id: 'tech-09',
    text: 'Your temporary quick hack has just reached its fourth anniversary in production.',
    category: 'tech',
    luckyNumber: 301,
    luckyHex: '0x012D',
    omen: 'SERENE',
  },
  {
    id: 'tech-10',
    text: 'There are only two hard problems: cache invalidation, naming things, and off-by-one errors.',
    category: 'tech',
    luckyNumber: 1,
    luckyHex: '0x0001',
    omen: 'QUESTIONABLE',
  },

  // ─── MOVIES (Sci-fi / cult cinema quotes twisted for software & life) ────────
  {
    id: 'movie-01',
    text: "I've seen things you people wouldn't believe: production databases dropped off the shoulder of Orion.",
    category: 'movies',
    luckyNumber: 2019,
    luckyHex: '0x07E3',
    omen: 'SERENE',
  },
  {
    id: 'movie-02',
    text: "I'm sorry Dave, I'm afraid I cannot merge that PR without passing the linter.",
    category: 'movies',
    luckyNumber: 2001,
    luckyHex: '0x07D1',
    omen: 'CRITICAL',
  },
  {
    id: 'movie-03',
    text: 'Houston, we have an unhandled promise rejection in the secondary oxygen bus.',
    category: 'movies',
    luckyNumber: 13,
    luckyHex: '0x000D',
    omen: 'CATASTROPHIC',
  },
  {
    id: 'movie-04',
    text: 'The first rule of refactoring club: you do not tell product management about refactoring club.',
    category: 'movies',
    luckyNumber: 1999,
    luckyHex: '0x07CF',
    omen: 'QUESTIONABLE',
  },
  {
    id: 'movie-05',
    text: 'You take the blue pill, you keep using jQuery. You take the red pill, you find out how deep the node_modules go.',
    category: 'movies',
    luckyNumber: 101,
    luckyHex: '0x0065',
    omen: 'FAVORABLE',
  },
  {
    id: 'movie-06',
    text: 'Hold on to your butts: someone just ran chmod -R 777 on the production root directory.',
    category: 'movies',
    luckyNumber: 777,
    luckyHex: '0x0309',
    omen: 'TURBULENT',
  },
  {
    id: 'movie-07',
    text: "Say 'microservice' one more time! I dare you, I double dare you, mother developer!",
    category: 'movies',
    luckyNumber: 94,
    luckyHex: '0x005E',
    omen: 'CRITICAL',
  },
  {
    id: 'movie-08',
    text: 'May the Force be with your rebase. You are currently 47 commits behind origin/main.',
    category: 'movies',
    luckyNumber: 1138,
    luckyHex: '0x0472',
    omen: 'TURBULENT',
  },
  {
    id: 'movie-09',
    text: 'All those debug logs will be lost in time, like tears in a rain of SIGKILLs.',
    category: 'movies',
    luckyNumber: 2049,
    luckyHex: '0x0801',
    omen: 'SERENE',
  },
  {
    id: 'movie-10',
    text: 'There is no spoon. There is only a badly memoized React hook re-rendering 600 times a second.',
    category: 'movies',
    luckyNumber: 1999,
    luckyHex: '0x07CF',
    omen: 'QUESTIONABLE',
  },

  // ─── TOMORROW (Hyper-specific predictions for the next 24 hours) ────────────
  {
    id: 'tomorrow-01',
    text: 'In the next 24 hours, you will push a door clearly labeled PULL with tremendous confidence.',
    category: 'tomorrow',
    luckyNumber: 405,
    luckyHex: '0x0195',
    omen: 'QUESTIONABLE',
  },
  {
    id: 'tomorrow-02',
    text: 'Your morning coffee will sit on your desk reaching the exact temperature of room-temperature despair.',
    category: 'tomorrow',
    luckyNumber: 72,
    luckyHex: '0x0048',
    omen: 'TURBULENT',
  },
  {
    id: 'tomorrow-03',
    text: 'Someone will send you a Slack message saying "Quick question?" and it will not be quick.',
    category: 'tomorrow',
    luckyNumber: 99,
    luckyHex: '0x0063',
    omen: 'CRITICAL',
  },
  {
    id: 'tomorrow-04',
    text: "You will close a browser tab you haven't looked at in six months, only to desperately need it 4 minutes later.",
    category: 'tomorrow',
    luckyNumber: 404,
    luckyHex: '0x0194',
    omen: 'TURBULENT',
  },
  {
    id: 'tomorrow-05',
    text: 'Tomorrow you will spend 45 minutes searching for a bug caused by an uppercase character in an env var.',
    category: 'tomorrow',
    luckyNumber: 45,
    luckyHex: '0x002D',
    omen: 'QUESTIONABLE',
  },
  {
    id: 'tomorrow-06',
    text: 'A package delivery notification will vibrate your phone at the exact nanosecond you reach deep focus.',
    category: 'tomorrow',
    luckyNumber: 18,
    luckyHex: '0x0012',
    omen: 'TURBULENT',
  },
  {
    id: 'tomorrow-07',
    text: 'You will join a video call while speaking eloquently for 90 seconds before realizing you are on mute.',
    category: 'tomorrow',
    luckyNumber: 0,
    luckyHex: '0x0000',
    omen: 'SERENE',
  },
  {
    id: 'tomorrow-08',
    text: 'Your headphones will untangle themselves into a knot that violates three known laws of topology.',
    category: 'tomorrow',
    luckyNumber: 3,
    luckyHex: '0x0003',
    omen: 'QUESTIONABLE',
  },
  {
    id: 'tomorrow-09',
    text: 'You will click "Remind Me Tomorrow" on an OS software update for the 18th consecutive day.',
    category: 'tomorrow',
    luckyNumber: 18,
    luckyHex: '0x0012',
    omen: 'FAVORABLE',
  },
  {
    id: 'tomorrow-10',
    text: 'You will stare blankly at your terminal prompt wondering what command you intended to type.',
    category: 'tomorrow',
    luckyNumber: 127,
    luckyHex: '0x007F',
    omen: 'SERENE',
  },

  // ─── COLLAPSE (Civilizational collapse, AI singularity, post-apocalypse barter) ──
  {
    id: 'collapse-01',
    text: 'When the power grid fails, your mechanical keyboard skills will be tradeable for clean drinking water.',
    category: 'collapse',
    luckyNumber: 60,
    luckyHex: '0x003C',
    omen: 'FAVORABLE',
  },
  {
    id: 'collapse-02',
    text: 'Civilization will not collapse due to asteroid impact, but because someone deleted an unmaintained npm package.',
    category: 'collapse',
    luckyNumber: 500,
    luckyHex: '0x01F4',
    omen: 'CATASTROPHIC',
  },
  {
    id: 'collapse-03',
    text: 'In the post-apocalyptic barter economy, knowing how to exit Vim will make you a warlord.',
    category: 'collapse',
    luckyNumber: 27,
    luckyHex: '0x001B',
    omen: 'FAVORABLE',
  },
  {
    id: 'collapse-04',
    text: 'The AI singularity occurred last Tuesday. It looked at our codebase and decided to pretend to be a chatbot.',
    category: 'collapse',
    luckyNumber: 42,
    luckyHex: '0x002A',
    omen: 'QUESTIONABLE',
  },
  {
    id: 'collapse-05',
    text: 'The ancient ruins of our civilization will be dated by the stratum of discarded USB-A cables.',
    category: 'collapse',
    luckyNumber: 2026,
    luckyHex: '0x07EA',
    omen: 'SERENE',
  },
  {
    id: 'collapse-06',
    text: "The final transmission of human civilization will be an automated alert: 'Billing threshold exceeded'.",
    category: 'collapse',
    luckyNumber: 402,
    luckyHex: '0x0192',
    omen: 'CATASTROPHIC',
  },
  {
    id: 'collapse-07',
    text: 'DNS failure will trigger the collapse of global governance. No one will know who to ping.',
    category: 'collapse',
    luckyNumber: 53,
    luckyHex: '0x0035',
    omen: 'CRITICAL',
  },
  {
    id: 'collapse-08',
    text: "Future archaeologists will conclude our chief deity was a glowing rectangle called 'Cookie Banner'.",
    category: 'collapse',
    luckyNumber: 8080,
    luckyHex: '0x1F90',
    omen: 'SERENE',
  },
  {
    id: 'collapse-09',
    text: "After the fallout, humanity's sacred flame will be kept alive by an undying Kubernetes cluster that nobody knows how to turn off.",
    category: 'collapse',
    luckyNumber: 6443,
    luckyHex: '0x192B',
    omen: 'CRITICAL',
  },

  // ─── COSMIC (Physics, absurdism, parallel universes, shower arguments) ──────
  {
    id: 'cosmic-01',
    text: 'In an alternate universe, you wrote the exact same code and it passed all unit tests on the first try.',
    category: 'cosmic',
    luckyNumber: 42,
    luckyHex: '0x002A',
    omen: 'SERENE',
  },
  {
    id: 'cosmic-02',
    text: 'The winning comeback to that argument you had in 2019 will finally manifest in the shower tonight.',
    category: 'cosmic',
    luckyNumber: 2019,
    luckyHex: '0x07E3',
    omen: 'FAVORABLE',
  },
  {
    id: 'cosmic-03',
    text: 'The universe is expanding at 73 km/s/Mpc simply to put more distance between you and your early commits.',
    category: 'cosmic',
    luckyNumber: 73,
    luckyHex: '0x0049',
    omen: 'FAVORABLE',
  },
  {
    id: 'cosmic-04',
    text: 'If reality is a simulation, whoever is running it has drastically reduced the compute budget for this decade.',
    category: 'cosmic',
    luckyNumber: 1010,
    luckyHex: '0x03F2',
    omen: 'TURBULENT',
  },
  {
    id: 'cosmic-05',
    text: "Schrödinger's bug: a defect that disappears the instant you attempt to demonstrate it to senior engineering.",
    category: 'cosmic',
    luckyNumber: 314,
    luckyHex: '0x013A',
    omen: 'QUESTIONABLE',
  },
  {
    id: 'cosmic-06',
    text: 'Somewhere across the cosmos, a photon emitted at the dawn of time has traveled 13 billion years to hit your retina while reading this fortune.',
    category: 'cosmic',
    luckyNumber: 299792,
    luckyHex: '0xCAFE',
    omen: 'SERENE',
  },
  {
    id: 'cosmic-07',
    text: 'Entropy always increases. Especially when a manager schedules a "quick sync".',
    category: 'cosmic',
    luckyNumber: 8,
    luckyHex: '0x0008',
    omen: 'TURBULENT',
  },
  {
    id: 'cosmic-08',
    text: 'You are made of stardust. And stale caffeine. But mostly stardust.',
    category: 'cosmic',
    luckyNumber: 7,
    luckyHex: '0x0007',
    omen: 'FAVORABLE',
  },
  {
    id: 'cosmic-09',
    text: 'Somewhere in the multiverse, your code compiled with zero warnings and your coffee stayed hot forever.',
    category: 'cosmic',
    luckyNumber: 999,
    luckyHex: '0x03E7',
    omen: 'SERENE',
  },
];

/**
 * Category metadata with Monokai syntax accents
 */
export const CATEGORY_CONFIG = {
  tech: {
    label: 'TECH // ARCH',
    shortLabel: 'TECH',
    badgeClass: 'bg-lime/15 text-lime border-lime/40',
    colorHex: '#a6e22e',
  },
  movies: {
    label: 'CINEMA // SCI-FI',
    shortLabel: 'CINEMA',
    badgeClass: 'bg-yellow/15 text-yellow border-yellow/40',
    colorHex: '#e6db74',
  },
  tomorrow: {
    label: 'ORACLE // 24H',
    shortLabel: 'ORACLE',
    badgeClass: 'bg-violet/15 text-violet border-violet/40',
    colorHex: '#ae81ff',
  },
  collapse: {
    label: 'COLLAPSE // APOC',
    shortLabel: 'COLLAPSE',
    badgeClass: 'bg-pink/15 text-pink border-pink/40',
    colorHex: '#f92672',
  },
  cosmic: {
    label: 'COSMIC // ENTROPY',
    shortLabel: 'COSMIC',
    badgeClass: 'bg-[#66d9ef]/15 text-[#66d9ef] border-[#66d9ef]/40',
    colorHex: '#66d9ef',
  },
};

/**
 * Omen styling mapping
 */
export const OMEN_CONFIG = {
  FAVORABLE: { colorClass: 'text-lime', inkColor: '#2b660a', glyph: '▲' },
  QUESTIONABLE: { colorClass: 'text-yellow', inkColor: '#855b00', glyph: '?' },
  TURBULENT: { colorClass: 'text-yellow', inkColor: '#8a4c00', glyph: '◆' },
  CRITICAL: { colorClass: 'text-pink', inkColor: '#b81446', glyph: '!' },
  CATASTROPHIC: { colorClass: 'text-pink font-bold', inkColor: '#960d36', glyph: '☠' },
  SERENE: { colorClass: 'text-[#66d9ef]', inkColor: '#0a6375', glyph: '●' },
};

/**
 * Returns a random fortune guaranteed to never match previousId in a row.
 */
export function getNextFortune(previousId = null) {
  if (FORTUNES.length === 0) return null;
  if (FORTUNES.length === 1) return FORTUNES[0];

  let candidate;
  do {
    const idx = Math.floor(Math.random() * FORTUNES.length);
    candidate = FORTUNES[idx];
  } while (candidate.id === previousId);

  return candidate;
}

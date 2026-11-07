import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, RefreshCw } from 'lucide-react';
import PanelFrame from './PanelFrame.jsx';
import {
  FORTUNES,
  getNextFortune,
  CATEGORY_CONFIG,
  OMEN_CONFIG,
} from '../data/fortunes.js';

/**
 * Pixel art character matrix for the fortune cookie.
 * Left half is 12 columns x 16 rows. Right half is mirrored horizontally.
 */
const COOKIE_LEFT_GRID = [
  '............',
  '..........wp',
  '........kkww',
  '......kkYYYY',
  '....kkYYYyyy',
  '..kkYYYYyycc',
  '.kYYYYYyccbk',
  '.kYYYYyyccbk',
  'kYYYYYyccbkk',
  'kYYYYyccbkk.',
  'kYYYyccbkk..',
  'kYYyccbkk...',
  '.kYYccbk....',
  '..kYcbk.....',
  '...kcb......',
  '....kk......',
];

const COOKIE_RIGHT_GRID = COOKIE_LEFT_GRID.map((row) =>
  row.split('').reverse().join('')
);

const COOKIE_PALETTE = {
  k: '#42260e', // deep toasted crust outline
  b: '#82501a', // dark toasted brown
  c: '#b87e28', // rich golden crust
  y: '#e5b73b', // golden cookie dough (Monokai warm gold)
  Y: '#fae57e', // bright highlight
  w: '#fdfbf7', // white paper slip
  p: '#f92672', // slip text dot (pink accent)
};

/**
 * Procedural retro crumb coordinates for burst effect
 */
const CRUMB_PARTICLES = [
  { id: 1, x: 64, y: 34, size: 3, color: '#e5b73b', animClass: 'animate-crumb-1' },
  { id: 2, x: 74, y: 32, size: 2.5, color: '#fae57e', animClass: 'animate-crumb-2' },
  { id: 3, x: 62, y: 44, size: 2, color: '#82501a', animClass: 'animate-crumb-3' },
  { id: 4, x: 76, y: 42, size: 3, color: '#e5b73b', animClass: 'animate-crumb-4' },
  { id: 5, x: 68, y: 28, size: 2.5, color: '#b87e28', animClass: 'animate-crumb-5' },
  { id: 6, x: 70, y: 48, size: 2, color: '#fae57e', animClass: 'animate-crumb-6' },
];

/**
 * Web Audio API retro 8-bit crunchy snap sound synthesizer.
 * Completely self-contained: zero external network assets.
 */
let audioCtxInstance = null;

function playCrackSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioCtxInstance) {
      audioCtxInstance = new AudioCtx();
    }
    if (audioCtxInstance.state === 'suspended') {
      audioCtxInstance.resume();
    }

    const now = audioCtxInstance.currentTime;

    // 1. Noise burst (crunch / crumble)
    const bufferSize = audioCtxInstance.sampleRate * 0.085; // 85ms
    const buffer = audioCtxInstance.createBuffer(1, bufferSize, audioCtxInstance.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.65;
    }
    const noise = audioCtxInstance.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtxInstance.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1300, now);
    filter.frequency.exponentialRampToValueAtTime(320, now + 0.085);
    filter.Q.setValueAtTime(2.8, now);

    const noiseGain = audioCtxInstance.createGain();
    noiseGain.gain.setValueAtTime(0.28, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(audioCtxInstance.destination);

    // 2. High snap chirp (crisp snap)
    const osc = audioCtxInstance.createOscillator();
    const oscGain = audioCtxInstance.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(760, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.055);

    oscGain.gain.setValueAtTime(0.22, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

    osc.connect(oscGain);
    oscGain.connect(audioCtxInstance.destination);

    noise.start(now);
    osc.start(now);
    noise.stop(now + 0.085);
    osc.stop(now + 0.055);
  } catch {
    /* AudioContext failure is gracefully tolerated (e.g. strict autoplay policy) */
  }
}

/**
 * CookiePixelArt: Crisp SVG pixel grid renderer
 */
function CookiePixelArt({ isCracked, isCracking, showCrumbs }) {
  const pixelSize = 3;
  const leftOriginX = 34;
  const rightOriginX = 70;
  const originY = 14;

  return (
    <svg
      viewBox="0 0 140 76"
      width="140"
      height="76"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className="shrink-0 select-none [image-rendering:pixelated]"
    >
      {/* Visual Crumb Burst when cracked */}
      {showCrumbs &&
        CRUMB_PARTICLES.map((c) => (
          <rect
            key={c.id}
            x={c.x}
            y={c.y}
            width={c.size}
            height={c.size}
            fill={c.color}
            className={c.animClass}
          />
        ))}

      {/* Left Cookie Half */}
      <g
        style={{
          transformOrigin: '52px 38px',
          transform: isCracked
            ? 'translate(-14px, 3px) rotate(-12deg)'
            : 'translate(0px, 0px) rotate(0deg)',
          transition: 'transform 0.25s steps(3)',
        }}
      >
        {COOKIE_LEFT_GRID.flatMap((row, y) =>
          [...row].map((pixel, x) => {
            // When cracked, paper tip has been dispensed so remove paper pixels
            if (isCracked && (pixel === 'w' || pixel === 'p')) return null;
            const fill = COOKIE_PALETTE[pixel];
            if (!fill) return null;
            return (
              <rect
                key={`left-${x}-${y}`}
                x={leftOriginX + x * pixelSize}
                y={originY + y * pixelSize}
                width={pixelSize}
                height={pixelSize}
                fill={fill}
              />
            );
          })
        )}
      </g>

      {/* Right Cookie Half */}
      <g
        style={{
          transformOrigin: '88px 38px',
          transform: isCracked
            ? 'translate(14px, 3px) rotate(12deg)'
            : 'translate(0px, 0px) rotate(0deg)',
          transition: 'transform 0.25s steps(3)',
        }}
      >
        {COOKIE_RIGHT_GRID.flatMap((row, y) =>
          [...row].map((pixel, x) => {
            if (isCracked && (pixel === 'w' || pixel === 'p')) return null;
            const fill = COOKIE_PALETTE[pixel];
            if (!fill) return null;
            return (
              <rect
                key={`right-${x}-${y}`}
                x={rightOriginX + x * pixelSize}
                y={originY + y * pixelSize}
                width={pixelSize}
                height={pixelSize}
                fill={fill}
              />
            );
          })
        )}
      </g>
    </svg>
  );
}

export default function FortuneWidget() {
  const [fortune, setFortune] = useState(null);
  const [slipId, setSlipId] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [isCracking, setIsCracking] = useState(false);
  const [crackCount, setCrackCount] = useState(0);
  const [showCrumbs, setShowCrumbs] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const stored = window.localStorage.getItem('fortune_cookie_sfx');
      return stored !== 'false';
    } catch {
      return true;
    }
  });

  const crackingTimeout = useRef(null);
  const crumbsTimeout = useRef(null);

  // Check user system preference for reduced motion
  const isReducedMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      window.localStorage.setItem('fortune_cookie_sfx', String(next));
    } catch {
      /* Handled */
    }
  };

  const crack = () => {
    if (isCracking) return;

    if (soundEnabled) {
      playCrackSound();
    }

    const reduced = isReducedMotion();

    // Generate slip identifiers
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const newSlipId = `#CRK-${randomSeq}`;
    const now = new Date();
    const timeStr = `${String(now.getUTCHours()).padStart(2, '0')}:${String(
      now.getUTCMinutes()
    ).padStart(2, '0')} UTC`;

    if (reduced) {
      const nextFortune = getNextFortune(fortune?.id);
      setFortune(nextFortune);
      setSlipId(newSlipId);
      setTimestamp(timeStr);
      setCrackCount((c) => c + 1);
      return;
    }

    // Stepped animated sequence
    setIsCracking(true);
    setShowCrumbs(true);

    window.clearTimeout(crackingTimeout.current);
    window.clearTimeout(crumbsTimeout.current);

    crackingTimeout.current = window.setTimeout(() => {
      const nextFortune = getNextFortune(fortune?.id);
      setFortune(nextFortune);
      setSlipId(newSlipId);
      setTimestamp(timeStr);
      setCrackCount((c) => c + 1);
      setIsCracking(false);
    }, 260);

    // Fade out crumb burst after 400ms
    crumbsTimeout.current = window.setTimeout(() => {
      setShowCrumbs(false);
    }, 450);
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      crack();
    }
  };

  useEffect(() => {
    return () => {
      window.clearTimeout(crackingTimeout.current);
      window.clearTimeout(crumbsTimeout.current);
    };
  }, []);

  const isCracked = fortune !== null;
  const categoryInfo = fortune ? CATEGORY_CONFIG[fortune.category] || CATEGORY_CONFIG.tech : null;
  const omenInfo = fortune ? OMEN_CONFIG[fortune.omen] || OMEN_CONFIG.FAVORABLE : null;

  return (
    <PanelFrame title="FORTUNE_COOKIE" symbol="CRACK" className="relative">
      {/* Workstation Header / Control Bar */}
      <div className="flex items-center justify-between border-b border-line-subtle bg-surface px-2.5 py-1.5 font-mono text-[9px]">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              isCracking
                ? 'animate-ping bg-pink'
                : isCracked
                ? 'bg-lime'
                : 'bg-yellow'
            }`}
          />
          <span className="text-muted tracking-wider">
            {isCracking
              ? 'CRACKING...'
              : isCracked
              ? `DISPENSED (${crackCount})`
              : 'READY TO CRACK'}
          </span>
        </div>

        {/* SFX Audio Toggle */}
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={soundEnabled}
          aria-label={soundEnabled ? 'Mute fortune cookie audio' : 'Enable fortune cookie audio'}
          className="flex min-h-[26px] touch-manipulation items-center gap-1 border border-line-subtle bg-surface-card px-2 py-0.5 text-[9px] text-muted hover:border-yellow hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow transition-colors"
        >
          {soundEnabled ? (
            <>
              <Volume2 size={11} className="text-lime" />
              <span>SFX: ON</span>
            </>
          ) : (
            <>
              <VolumeX size={11} className="text-muted-dim" />
              <span>SFX: OFF</span>
            </>
          )}
        </button>
      </div>

      {/* Cookie Stage Display */}
      <div className="relative flex flex-col items-center justify-center bg-surface-well px-3 py-3 overflow-hidden">
        {/* Subtle retro concentric guide lines */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-15"
        >
          <span className="h-[90px] w-[90px] rounded-full border border-line" />
          <span className="absolute h-[130px] w-[130px] rounded-full border border-line" />
        </div>

        {/* Clickable Cookie Button */}
        <button
          type="button"
          onClick={crack}
          onKeyDown={handleKeyDown}
          aria-label={isCracked ? 'Crack another fortune cookie' : 'Crack fortune cookie'}
          className="group relative flex flex-col items-center justify-center border-0 bg-transparent p-1 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
        >
          <div
            className={`transition-transform duration-200 group-hover:-rotate-3 ${
              isCracking
                ? 'animate-cookie-shudder'
                : !isCracked
                ? 'animate-cookie-breathe'
                : ''
            }`}
          >
            <CookiePixelArt
              isCracked={isCracked}
              isCracking={isCracking}
              showCrumbs={showCrumbs}
            />
          </div>

          {/* Initial Uncracked CTA Prompt */}
          {!isCracked && (
            <div className="mt-2.5 flex flex-col items-center gap-1 font-mono">
              <div className="flex min-h-[42px] items-center justify-center border border-dashed border-line bg-surface px-3 py-1.5 text-[10px] font-bold tracking-wider text-yellow transition-colors group-hover:border-yellow group-hover:bg-yellow/10">
                <span>CLICK OR PRESS [SPACE] TO CRACK</span>
                <span className="ml-1 inline-block animate-pulse text-pink">_</span>
              </div>
            </div>
          )}
        </button>
      </div>

      {/* The Fortune Slip (Dispensed State) */}
      {isCracked && fortune && (
        <div
          role="region"
          aria-label="Dispensed fortune slip"
          aria-live="polite"
          className="animate-slip-dispense relative mx-2.5 my-2 border border-dashed border-[#c2b292] bg-[#fbf8f1] p-3 text-[#1a1b17] shadow-[2px_2px_0_#141512]"
        >
          {/* Slip Header: Clean, balanced single row */}
          <div className="flex items-center justify-between border-b border-dashed border-[#c2b292]/70 pb-2 font-mono text-[9px]">
            <span className="shrink-0 flex items-center gap-1.5 font-semibold tracking-wider text-[#36342c] whitespace-nowrap">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: categoryInfo.colorHex }}
              />
              <span>{categoryInfo.shortLabel || categoryInfo.label}</span>
            </span>
            <span className="shrink-0 tracking-wide text-[#736e60] whitespace-nowrap text-[8.5px]">{slipId} · {timestamp}</span>
          </div>

          {/* The Fortune Quote */}
          <blockquote className="my-2.5 font-mono text-[12px] font-semibold leading-relaxed text-[#1a1b17] sm:text-[12.5px]">
            “{fortune.text}”
          </blockquote>

          {/* Lucky Metadata: Reduced Lucky No. footprint, giving OMEN expanded breathing space */}
          <div className="flex items-start border-t border-dashed border-[#c2b292]/70 pt-2 font-mono text-[9.5px]">
            <div className="shrink-0 w-[52px]">
              <span className="block text-[8px] uppercase tracking-wider text-[#736e60] whitespace-nowrap">
                LUCKY NO.
              </span>
              <span className="mt-0.5 block font-bold text-[11px] text-[#1a1b17]">
                {fortune.luckyNumber}
              </span>
            </div>
            <div className="shrink-0 w-[58px] pl-1">
              <span className="block text-[8px] uppercase tracking-wider text-[#736e60] whitespace-nowrap">
                LUCKY HEX
              </span>
              <span className="mt-0.5 block font-bold text-[11px] text-[#3d3b33]">
                {fortune.luckyHex}
              </span>
            </div>
            <div className="min-w-0 flex-1 pl-2">
              <span className="block text-[8px] uppercase tracking-wider text-[#736e60] whitespace-nowrap">
                OMEN
              </span>
              <span className="mt-0.5 inline-flex items-center gap-1 font-bold text-[11px] whitespace-nowrap">
                <span style={{ color: omenInfo.inkColor }}>{omenInfo.glyph}</span>
                <span style={{ color: omenInfo.inkColor }}>{fortune.omen}</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* "CRACK AGAIN" Button when Cracked */}
      {isCracked && (
        <div className="px-2.5 pb-2.5 pt-0.5">
          <button
            type="button"
            onClick={crack}
            onKeyDown={handleKeyDown}
            aria-label="Crack another fortune cookie"
            className="group flex min-h-[42px] w-full items-center justify-center gap-2 border border-line bg-surface px-3 py-2 font-mono text-xs font-bold tracking-wider text-ink transition-colors hover:border-yellow hover:bg-surface-well hover:text-yellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow active:translate-y-[1px] shadow-[2px_2px_0_#000000]"
          >
            <RefreshCw
              size={12}
              className="text-yellow transition-transform duration-300 group-hover:rotate-180"
            />
            <span>CRACK AGAIN</span>
            <span className="font-mono text-[9.5px] font-normal text-muted-dim">
              [SPACE]
            </span>
          </button>
        </div>
      )}
    </PanelFrame>
  );
}

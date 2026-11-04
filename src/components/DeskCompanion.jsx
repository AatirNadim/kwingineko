import { useEffect, useRef, useState } from 'react';
import { Crosshair, Heart } from 'lucide-react';
import PanelFrame from './PanelFrame.jsx';

const LINES = [
  'meow!',
  'have you tried turning it off and on again?',
  'aatir wrote this site. i supervised.',
  'purr... TypeScript > JavaScript',
  'i sat on the keyboard and fixed a bug',
  'psst... check the very last question in the FAQ',
  'curiosity never killed nietzsche\'s cat',
  'psst... try the konami code',
  'nap time is sacred',
  'no mice were harmed making this site',
];

function RefinedCat({ blinking }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="h-[84px] w-[84px] select-none transition-transform duration-200"
    >
      {/* Soft ground contact */}
      <ellipse cx="24" cy="44" rx="14" ry="2.5" fill="#141512" opacity="0.6" />

      {/* Tail with ambient idle swish */}
      <path
        d="M32 38 C38 38 41 33 40 27 C39 25 36 26 37 28 C38 31 36 34 31 35"
        fill="none"
        stroke="#3c3e34"
        strokeWidth="3"
        strokeLinecap="round"
        className="animate-tail-swish"
      />

      {/* Body */}
      <path
        d="M17 26 C15 31 14 39 16 42 C18 43 30 43 32 42 C34 39 33 31 31 26 Z"
        fill="#2b2d24"
        stroke="#3e4034"
        strokeWidth="1.2"
      />

      {/* Chest bib */}
      <path
        d="M20 28 C22 28 26 28 28 28 C29 33 27 38 24 39 C21 38 19 33 20 28 Z"
        fill="#f8f8f2"
        opacity="0.9"
      />

      {/* Front Paws */}
      <ellipse cx="20" cy="42" rx="3.2" ry="2" fill="#f8f8f2" stroke="#3e4034" strokeWidth="0.8" />
      <ellipse cx="28" cy="42" rx="3.2" ry="2" fill="#f8f8f2" stroke="#3e4034" strokeWidth="0.8" />

      {/* Collar with Bell */}
      <path d="M18 27 Q24 30 30 27" fill="none" stroke="#f92672" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="24" cy="29" r="1.8" fill="#e6db74" stroke="#2b2d24" strokeWidth="0.6" />

      {/* Head */}
      <path
        d="M14 17 C13 24 16 27 24 27 C32 27 35 24 34 17 C34 11 31 11 24 11 C17 11 14 11 14 17 Z"
        fill="#2b2d24"
        stroke="#3e4034"
        strokeWidth="1.2"
      />

      {/* Left Ear */}
      <path d="M15 14 L12 5 L20 11 Z" fill="#2b2d24" stroke="#3e4034" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M15 13 L13.5 7 L18.5 11 Z" fill="#f92672" opacity="0.85" />

      {/* Right Ear */}
      <path d="M33 14 L36 5 L28 11 Z" fill="#2b2d24" stroke="#3e4034" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M33 13 L34.5 7 L29.5 11 Z" fill="#f92672" opacity="0.85" />

      {/* Whiskers */}
      <g stroke="#b4b19e" strokeWidth="0.8" opacity="0.75" strokeLinecap="round">
        <line x1="11" y1="20" x2="6" y2="19" />
        <line x1="11" y1="22" x2="6" y2="23" />
        <line x1="37" y1="20" x2="42" y2="19" />
        <line x1="37" y1="22" x2="42" y2="23" />
      </g>

      {/* Eyes */}
      {blinking ? (
        <g stroke="#f8f8f2" strokeWidth="1.6" strokeLinecap="round" fill="none">
          <path d="M17 19 Q19.5 16.5 22 19" />
          <path d="M26 19 Q28.5 16.5 31 19" />
        </g>
      ) : (
        <g>
          {/* Irises */}
          <ellipse cx="19.5" cy="18" rx="2.8" ry="3.2" fill="#a6e22e" />
          <ellipse cx="28.5" cy="18" rx="2.8" ry="3.2" fill="#a6e22e" />
          {/* Pupils */}
          <ellipse cx="19.5" cy="18" rx="1.3" ry="2.6" fill="#141512" />
          <ellipse cx="28.5" cy="18" rx="1.3" ry="2.6" fill="#141512" />
          {/* Catchlight */}
          <circle cx="18.8" cy="16.8" r="0.9" fill="#f8f8f2" />
          <circle cx="27.8" cy="16.8" r="0.9" fill="#f8f8f2" />
        </g>
      )}

      {/* Nose */}
      <polygon points="23,21 25,21 24,22.2" fill="#f92672" />

      {/* Mouth */}
      <path
        d="M22 22.8 Q23 24 24 23 Q25 24 26 22.8"
        fill="none"
        stroke="#f8f8f2"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function DeskCompanion({ followEnabled = false, onToggleFollow, catStatus = 'idle' }) {
  const [pets, setPets] = useState(0);
  const [line, setLine] = useState('');
  const [blinking, setBlinking] = useState(false);
  const [hopping, setHopping] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const lineTimer = useRef();
  const hopTimer = useRef();
  const blinkTimeout = useRef();
  const hopFrame = useRef();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const coarseMedia = window.matchMedia('(pointer: coarse)');
      setIsTouchDevice(coarseMedia.matches);
      const handleMedia = (e) => setIsTouchDevice(e.matches);
      coarseMedia.addEventListener?.('change', handleMedia);
      return () => coarseMedia.removeEventListener?.('change', handleMedia);
    }
  }, []);

  useEffect(() => {
    const blinkTimer = window.setInterval(() => {
      window.clearTimeout(blinkTimeout.current);
      setBlinking(true);
      blinkTimeout.current = window.setTimeout(() => setBlinking(false), 160);
    }, 3500);
    return () => {
      window.clearInterval(blinkTimer);
      window.clearTimeout(lineTimer.current);
      window.clearTimeout(hopTimer.current);
      window.clearTimeout(blinkTimeout.current);
      window.cancelAnimationFrame(hopFrame.current);
    };
  }, []);

  const pet = () => {
    const next = pets + 1;
    setPets(next);
    setLine(next === 10 ? 'ok you are my favorite human now' : LINES[Math.floor(Math.random() * LINES.length)]);
    setHopping(false);
    window.cancelAnimationFrame(hopFrame.current);
    hopFrame.current = window.requestAnimationFrame(() => setHopping(true));
    window.clearTimeout(hopTimer.current);
    hopTimer.current = window.setTimeout(() => setHopping(false), 300);
    window.clearTimeout(lineTimer.current);
    lineTimer.current = window.setTimeout(() => setLine(''), 3500);
  };

  return (
    <PanelFrame title="DESK_COMPANION" symbol="CAT">
      <button
        onClick={pet}
        aria-label="Pet the desk companion cat"
        className="group relative grid h-[116px] w-full place-items-center overflow-hidden bg-surface-well text-yellow transition-colors hover:bg-focus focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
      >
        <span className="absolute right-3 top-2 font-mono text-xs text-pink" aria-hidden="true">✦</span>
        <span className={`block ${hopping ? 'animate-cat-hop' : ''}`}>
          <RefinedCat blinking={blinking} />
        </span>
      </button>

      {line && (
        <p
          aria-live="polite"
          className="mx-[10px] mt-2 border border-line bg-surface px-[9px] py-[6px] text-center font-mono text-xs leading-[1.4] text-ink shadow-[2px_2px_0_#f92672]"
        >
          {line}
        </p>
      )}

      <div className="flex items-center justify-between px-[10px] pb-[3px] pt-2">
        <b className="font-display text-xs text-ink">tiny coworker</b>
        <span className="font-mono text-[9px] text-muted">
          {pets ? `pets: ${pets}${pets >= 10 ? ' ♥' : ''}` : 'A LITTLE ENCOURAGEMENT'}
        </span>
      </div>

      <div className="flex items-center gap-[5px] px-[10px] py-[2px] font-mono text-[9.5px] text-muted">
        <Heart size={11} className="text-pink" />
        <span>{isTouchDevice ? 'touch screen: tap to pet' : 'click to pet the cat'}</span>
      </div>

      <div className="mt-2 border-t border-line-subtle px-[10px] pb-2 pt-2 font-mono">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-ink">
            <Crosshair size={12} className="text-lime" />
            <span>CURSOR CHASE</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-label="Toggle cursor chasing cat"
            aria-checked={followEnabled}
            onClick={onToggleFollow}
            className={`flex min-h-[44px] items-center justify-center gap-1.5 border px-3 py-2 text-[9.5px] font-bold tracking-wider transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow ${
              followEnabled
                ? 'border-lime bg-lime/10 text-lime shadow-[2px_2px_0_#a6e22e]'
                : 'border-line bg-surface text-muted hover:border-line hover:text-ink'
            }`}
          >
            <span className={followEnabled ? 'text-lime' : 'text-muted-dim'}>
              {followEnabled ? '●' : '○'}
            </span>
            <span>{followEnabled ? 'ACTIVE' : 'OFF'}</span>
          </button>
        </div>
        <div className="mt-1.5 flex items-center gap-1 text-[9.5px] leading-tight">
          <span className="text-muted-dim">SYS.STALKER //</span>
          {!followEnabled ? (
            <span className="text-muted">{isTouchDevice ? 'TOUCH SCREEN · TAP TO STALK' : 'STANDBY · CLICK TO DEPLOY'}</span>
          ) : catStatus === 'observing' ? (
            <span className="font-semibold text-yellow tracking-wide">◐ CURIOUS · OBSERVING PORTRAIT</span>
          ) : catStatus === 'caught' ? (
            <span className="font-semibold text-pink">♥ TARGET CAUGHT! [PURR]</span>
          ) : catStatus === 'stalking' ? (
            <span className="text-lime">▶ STALKING SPEED: 160PX/S</span>
          ) : (
            <span className="text-muted">❚❚ TARGET OUT OF REACH</span>
          )}
        </div>
      </div>
    </PanelFrame>
  );
}

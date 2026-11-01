import { useEffect, useRef, useState } from 'react';
import { Crosshair, Heart, Sparkles } from 'lucide-react';
import PanelFrame from './PanelFrame.jsx';

const CAT = [
  '..kk........kk..', '.kgrk......krgk.', '.kgggk....kgggk.', '.kggggkkkkggggk.',
  'kggggggggggggggk', 'kgggkkggggkkgggk', 'kgggkrggggkrgggk', 'kggggggppggggggk',
  '.kggggkkkkggggk.', '..kkggggggggkk..', '..kggwwwwwwggk..', '.kggwwwwwwwwggk.',
  '.kggwwwwwwwwggkk', '.kgggwwwwwwgggkg', '.kggkgggggkggkgk', '..kkkkkkkkkkkkk.',
];
const BLINK_CAT = [...CAT.slice(0, 5), 'kggggggggggggggk', ...CAT.slice(6)];
const PIXELS = { k: '#0b0b0b', g: '#9a9a9a', r: '#e53935', p: '#ff8a80', w: '#f0f0f0' };
const LINES = [
  'meow!',
  'have you tried turning it off and on again?',
  'aatir wrote this site. i supervised.',
  'purr... TypeScript > JavaScript',
  'i sat on the keyboard and fixed a bug',
  'psst... try the konami code',
  'nap time is sacred',
  'no mice were harmed making this site',
];

function PixelCat({ blinking }) {
  const rows = blinking ? BLINK_CAT : CAT;
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-[80px] w-[80px] [image-rendering:pixelated]">
      {rows.flatMap((row, y) => [...row].map((pixel, x) => pixel === '.' ? null : (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={PIXELS[pixel]}/>
      )))}
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
      blinkTimeout.current = window.setTimeout(() => setBlinking(false), 150);
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
    <PanelFrame title="DESK_COMPANION" icon={<Sparkles size={13}/> }>
      <button onClick={pet} aria-label="Pet the pixel cat" className="group relative grid h-[112px] w-full place-items-center overflow-hidden bg-[#242520] text-yellow transition-colors hover:bg-[#2a2b25] focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow">
        <span className="absolute right-3 top-2 text-pink" aria-hidden="true">✦</span>
        <span className={`block ${hopping ? 'animate-cat-hop' : ''}`}><PixelCat blinking={blinking}/></span>
      </button>
      {line && <p aria-live="polite" className="mx-[10px] mt-2 border border-[#0b0b0b] bg-[#f0f0f0] px-[7px] py-[5px] text-center text-xs leading-[1.4] text-[#0b0b0b] shadow-[2px_2px_0_#f92672]">{line}</p>}
      <div className="flex items-center justify-between px-[10px] pb-[3px] pt-2"><b className="font-display text-xs">tiny coworker</b><span className="font-mono text-[9px] text-[#aaa897]">{pets ? `pets: ${pets}${pets >= 10 ? ' ♥' : ''}` : 'A LITTLE ENCOURAGEMENT'}</span></div>
      <div className="flex items-center gap-[5px] px-[10px] py-[2px] font-mono text-[9.5px] text-[#aaa897]"><Heart size={11} className="text-pink"/> {isTouchDevice ? 'touch screen: tap to pet' : 'click to pet the cat'}</div>
      <div className="mt-2 border-t border-[#35362e] px-[10px] pb-2 pt-2 font-mono">
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
                ? 'border-lime bg-[#243319] text-lime shadow-[1px_1px_0_#a6e22e]'
                : 'border-[#45463e] bg-[#242520] text-muted hover:border-[#5d5e50] hover:text-ink'
            }`}
          >
            <span className={followEnabled ? 'text-lime' : 'text-[#656658]'}>
              {followEnabled ? '●' : '○'}
            </span>
            <span>{followEnabled ? 'ACTIVE' : 'OFF'}</span>
          </button>
        </div>
        <div className="mt-1.5 flex items-center gap-1 text-[9.5px] leading-tight">
          <span className="text-[#aaa897]">SYS.STALKER //</span>
          {!followEnabled ? (
            <span className="text-muted">{isTouchDevice ? 'TOUCH SCREEN · TAP TO STALK' : 'STANDBY · CLICK TO DEPLOY'}</span>
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

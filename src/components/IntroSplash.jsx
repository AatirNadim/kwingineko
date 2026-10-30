import { useEffect, useState } from 'react';

const GREETINGS = [
  { word: 'hello', language: 'ENGLISH', color: 'text-lime' },
  { word: 'नमस्ते', language: 'HINDI', color: 'text-yellow' },
  { word: 'こんにちは', language: 'JAPANESE', color: 'text-violet' },
  { word: 'hola', language: 'SPANISH', color: 'text-pink' },
  { word: 'bonjour', language: 'FRENCH', color: 'text-yellow' },
  { word: 'jambo', language: 'SWAHILI', color: 'text-violet' },
  { word: 'hello', language: 'ENGLISH', color: 'text-lime' },
];

const STEP_MS = 430;
const EXIT_MS = 520;

export default function IntroSplash() {
  const [visible, setVisible] = useState(() => {
    try {
      return !window.sessionStorage.getItem('portfolio-intro-seen');
    } catch {
      return true;
    }
  });
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!visible) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setVisible(false);
      try { window.sessionStorage.setItem('portfolio-intro-seen', '1'); } catch { /* storage may be unavailable */ }
      return undefined;
    }

    const timer = window.setTimeout(() => {
      if (index < GREETINGS.length - 1) {
        setIndex(index + 1);
        return;
      }

      setLeaving(true);
      try { window.sessionStorage.setItem('portfolio-intro-seen', '1'); } catch { /* storage may be unavailable */ }
      window.setTimeout(() => setVisible(false), EXIT_MS);
    }, STEP_MS);

    return () => window.clearTimeout(timer);
  }, [index, visible]);

  if (!visible) return null;

  const greeting = GREETINGS[index];

  return (
    <div
      aria-label="Welcome"
      className={`intro-splash fixed inset-0 z-[100] grid place-items-center bg-canvas px-5 ${leaving ? 'intro-splash-leave' : ''}`}
    >
      <div className="relative flex w-full max-w-[520px] flex-col items-center border border-line bg-surface px-6 py-10 shadow-[6px_6px_0_rgb(0_0_0_/_22%)] sm:px-12 sm:py-14">
        <div className="absolute left-0 right-0 top-0 flex h-[30px] items-center justify-between border-b border-line bg-[#292a25] px-3 font-mono text-[8px] tracking-[.5px] text-muted">
          <span>NEW CONNECTION</span>
          <span className="flex items-center gap-2"><i className="h-[6px] w-[6px] rounded-full bg-lime shadow-[0_0_8px_#a6e22e77]"/> READY</span>
        </div>

        <p className="mb-3 mt-2 font-mono text-[9px] tracking-[1.4px] text-muted">AATIR’S PORTFOLIO <span className="text-pink">//</span> 001</p>
        <div className="grid h-[100px] min-w-[220px] place-items-center sm:h-[124px]" aria-live="off">
          <span key={index} className={`intro-greeting font-display text-[clamp(3rem,12vw,5.75rem)] font-semibold leading-none tracking-[-.07em] ${greeting.color}`}>
            {greeting.word}
          </span>
        </div>
        <p className="mb-0 mt-3 font-mono text-[9px] tracking-[1.6px] text-muted">{greeting.language}</p>
        <div className="mt-8 flex items-center gap-[5px]" aria-hidden="true">
          {GREETINGS.map((item, itemIndex) => (
            <span key={`${item.language}-${itemIndex}`} className={`h-[3px] w-[18px] transition-colors duration-200 ${itemIndex <= index ? 'bg-pink' : 'bg-focus'}`}/>
          ))}
        </div>
        <span className="mt-2 font-mono text-[7px] tracking-[.8px] text-[#858372]">ESTABLISHING CONNECTION</span>
      </div>
    </div>
  );
}

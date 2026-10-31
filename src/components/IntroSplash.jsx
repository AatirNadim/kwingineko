import { useEffect, useState, useCallback } from 'react';

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

  const dismiss = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    try { window.sessionStorage.setItem('portfolio-intro-seen', '1'); } catch { /* storage may be unavailable */ }
    window.setTimeout(() => setVisible(false), EXIT_MS);
  }, [leaving]);

  useEffect(() => {
    if (!visible) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setVisible(false);
      try { window.sessionStorage.setItem('portfolio-intro-seen', '1'); } catch { /* storage may be unavailable */ }
      return undefined;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        dismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const timer = window.setTimeout(() => {
      if (index < GREETINGS.length - 1) {
        setIndex(index + 1);
        return;
      }

      dismiss();
    }, STEP_MS);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [index, visible, dismiss]);

  if (!visible) return null;

  const greeting = GREETINGS[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome splash screen"
      onClick={dismiss}
      className={`intro-splash fixed inset-0 z-[100] grid place-items-center bg-canvas/95 backdrop-blur-[2px] p-3 sm:p-5 ${leaving ? 'intro-splash-leave' : ''}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] w-full max-w-[520px] flex-col items-center overflow-y-auto border border-line bg-surface px-4 pb-8 pt-14 shadow-[6px_6px_0_rgb(0_0_0_/_22%)] sm:px-10 sm:pb-12 sm:pt-14 md:pb-12 md:pt-14"
      >
        {/* Title Bar */}
        <div className="absolute left-0 right-0 top-0 flex min-h-[44px] items-center justify-between border-b border-line bg-[#292a25] px-2.5 font-mono text-[8px] tracking-[.5px] text-muted sm:px-3">
          <span className="truncate">NEW CONNECTION</span>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex items-center gap-1.5"><i className="h-[6px] w-[6px] rounded-full bg-lime shadow-[0_0_8px_#a6e22e77]"/> <span className="hidden min-[360px]:inline">READY</span></span>
            <button
              onClick={dismiss}
              type="button"
              aria-label="Skip introduction"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-[#4e5043] bg-[#1e1f1c] px-2.5 py-1.5 font-mono text-[8px] sm:text-[7.5px] text-yellow transition-colors hover:border-pink hover:text-pink focus-visible:outline focus-visible:outline-1 focus-visible:outline-yellow"
            >
              SKIP [ESC]
            </button>
          </div>
        </div>

        <p className="mb-2 mt-4 font-mono text-[8.5px] tracking-[1.4px] text-muted sm:mb-3 sm:mt-2 sm:text-[9px]">AATIR’S PORTFOLIO <span className="text-pink">//</span> 001</p>
        <div className="grid h-[90px] w-full min-w-[200px] place-items-center sm:h-[124px]" aria-live="off">
          <span key={index} className={`intro-greeting select-none text-center font-display text-[clamp(2.5rem,11vw,5rem)] font-semibold leading-none tracking-[-.06em] ${greeting.color}`}>
            {greeting.word}
          </span>
        </div>
        <p className="mb-0 mt-3 font-mono text-[8.5px] tracking-[1.6px] text-muted sm:text-[9px]">{greeting.language}</p>
        <div className="mt-6 flex items-center gap-[4px] sm:mt-8 sm:gap-[5px]" aria-hidden="true">
          {GREETINGS.map((item, itemIndex) => (
            <span key={`${item.language}-${itemIndex}`} className={`h-[3px] w-[14px] transition-colors duration-200 sm:w-[18px] ${itemIndex <= index ? 'bg-pink' : 'bg-focus'}`}/>
          ))}
        </div>
        <div className="mt-4 flex flex-col items-center gap-1.5 text-center sm:mt-5">
          <span className="font-mono text-[7px] tracking-[.8px] text-[#858372]">ESTABLISHING CONNECTION</span>
          <button
            onClick={dismiss}
            type="button"
            className="font-mono text-[8px] text-muted underline decoration-line decoration-dashed underline-offset-2 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-yellow"
          >
            tap anywhere or press Esc to enter
          </button>
        </div>
      </div>
    </div>
  );
}

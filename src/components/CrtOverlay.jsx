import { useEffect, useState, useCallback, useRef } from 'react';
import { Monitor, X, Sparkles } from 'lucide-react';

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

function playRetroChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'square';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(330, now);
    osc1.frequency.setValueAtTime(440, now + 0.08);
    osc1.frequency.setValueAtTime(659, now + 0.16);
    osc1.frequency.setValueAtTime(880, now + 0.24);

    osc2.frequency.setValueAtTime(165, now);
    osc2.frequency.setValueAtTime(220, now + 0.08);
    osc2.frequency.setValueAtTime(330, now + 0.16);
    osc2.frequency.setValueAtTime(440, now + 0.24);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.45);

    setTimeout(() => {
      try {
        ctx.close();
      } catch {
        // Safe disposal
      }
    }, 1000);
  } catch {
    // Audio contexts may be blocked before first user gesture
  }
}

export default function CrtOverlay({ active, onToggle }) {
  const [toastMessage, setToastMessage] = useState('');
  const keySequenceRef = useRef([]);

  // Accessibility: detect prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setPrefersReducedMotion(e.matches);
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, []);

  // Konami code keyboard listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing into input or textarea
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) {
        return;
      }

      // Allow Esc key to deactivate CRT mode if active AND no modal dialog is currently open
      if (e.key === 'Escape' && active) {
        const hasOpenDialog = typeof document !== 'undefined' && Boolean(document.querySelector('[role="dialog"]'));
        if (!hasOpenDialog) {
          onToggle(false);
          setToastMessage('RETRO CRT MODE DEACTIVATED');
          return;
        }
      }

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expectedKey = KONAMI_SEQUENCE[keySequenceRef.current.length];

      if (key === expectedKey) {
        keySequenceRef.current.push(key);
        if (keySequenceRef.current.length === KONAMI_SEQUENCE.length) {
          // Success!
          keySequenceRef.current = [];
          playRetroChime();
          onToggle(!active);
          setToastMessage(
            !active
              ? prefersReducedMotion
                ? 'KONAMI CODE ACCEPTED // CRT MODE (SCANLINES SUPPRESSED FOR ACCESSIBILITY)'
                : 'KONAMI CODE ACCEPTED // RETRO CRT PHOSPHOR MODE ACTIVATED'
              : 'RETRO CRT MODE DEACTIVATED'
          );
        }
      } else {
        // Reset sequence or check if it matches the first key
        keySequenceRef.current = key === KONAMI_SEQUENCE[0] ? [key] : [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, onToggle, prefersReducedMotion]);

  // Clear toast after 4 seconds
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  return (
    <>
      {/* Toast Notification when Konami Code or CRT toggles (z-50) */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 border border-yellow bg-[#1e1f1c] px-4 py-2.5 font-mono text-xs text-yellow shadow-[4px_4px_0_rgba(0,0,0,0.5)] flex items-center gap-2 max-w-[90vw]"
        >
          <Sparkles size={16} className={`text-lime shrink-0 ${prefersReducedMotion ? '' : 'animate-spin'}`} />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Retro CRT Scanline Shader Elements (z-30, suppressed under prefers-reduced-motion) */}
      {active && !prefersReducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
        >
          {/* Scanline pattern */}
          <div
            className="absolute inset-0 opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0px, rgba(0, 0, 0, 0.4) 1px, transparent 1px, transparent 3px)',
              backgroundSize: '100% 3px',
            }}
          />

          {/* Color fringing & phosphor grille */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.04))',
              backgroundSize: '3px 100%',
            }}
          />

          {/* Vignette curvature */}
          <div
            className="absolute inset-0"
            style={{
              boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.65)',
            }}
          />
        </div>
      )}

      {/* Floating HUD Controller (z-50, Clickable) */}
      {active && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 border border-[#58594e] bg-[#1e1f1c] px-3 py-1.5 font-mono text-[10px] text-lime shadow-panel">
          <Monitor size={14} className={`text-lime ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
          <span>{prefersReducedMotion ? 'CRT ACTIVE [REDUCED MOTION]' : 'CRT FILTER ON'}</span>
          <button
            type="button"
            onClick={() => onToggle(false)}
            aria-label="Deactivate CRT filter"
            className="ml-2 inline-flex min-h-[44px] items-center gap-1.5 border border-[#48493e] bg-surface px-3 py-1.5 text-[9.5px] text-[#cbc9b9] hover:border-pink hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
          >
            <X size={13} />
            <span>DISABLE [ESC]</span>
          </button>
        </div>
      )}
    </>
  );
}

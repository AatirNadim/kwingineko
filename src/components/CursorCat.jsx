import { useEffect, useRef, useState } from 'react';

const PIXELS = {
  k: '#0b0b0b',
  g: '#9a9a9a',
  r: '#e53935',
  p: '#ff8a80',
  w: '#f0f0f0',
};

// 12x12 Pixel Cat frames facing right:
// RUN_1: Stride A (front legs forward, back legs back, tail up)
const RUN_1 = [
  '..kk........',
  '.kggk...kk.k',
  '.kggk..krgkk',
  '..kggkkggggk',
  '..kggggggkgk',
  '.kggggwwgpkk',
  '.kggggggkkk.',
  '..kggggggk..',
  '..kgk..kgk..',
  '.kgk....kgk.',
  '.kk......kk.',
  '............',
];

// RUN_2: Stride B (legs gathered, tail flick)
const RUN_2 = [
  '............',
  '........kk.k',
  '..kk...krgkk',
  '.kggk.kggggk',
  '.kggkggggkgk',
  '..kggggwgpkk',
  '..kgggggkkk.',
  '...kgggggk..',
  '....kggk....',
  '....kgkg....',
  '....kkkk....',
  '............',
];

// CAUGHT: Sitting cute, closed eyes curved / blush, paws together, tail curled
const CAUGHT = [
  '............',
  '.......kk.kk',
  '......krgkrk',
  '.....kgggggk',
  '.....kgkggkk',
  '....kgrrkppk',
  '....kggggkk.',
  '...kggwwwwk.',
  '..kggggwwwk.',
  '.kggkggggkkk',
  'kggkk..kkkk.',
  '.kk.........',
];

const FRAMES = { RUN_1, RUN_2, CAUGHT };
const BUBBLE_TEXTS = ['♥ gotcha!', 'meow!'];
const SPEED = 160; // pixels per second
const CATCH_RADIUS = 22;
const RESUME_RADIUS = 28;
const CAT_HALF_SIZE = 18;

function PixelSprite({ frame }) {
  const rows = FRAMES[frame] || CAUGHT;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="h-[36px] w-[36px] [image-rendering:pixelated]"
    >
      {rows.flatMap((row, y) =>
        [...row].map((pixel, x) =>
          pixel === '.' ? null : (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1"
              height="1"
              fill={PIXELS[pixel]}
            />
          )
        )
      )}
    </svg>
  );
}

export default function CursorCat({ active = false, onStatusChange }) {
  const [pos, setPos] = useState(() => ({
    x: typeof window !== 'undefined' ? Math.max(CAT_HALF_SIZE, window.innerWidth - 80) : 100,
    y: typeof window !== 'undefined' ? Math.max(CAT_HALF_SIZE, window.innerHeight - 80) : 100,
  }));
  const [frame, setFrame] = useState('CAUGHT');
  const [facingLeft, setFacingLeft] = useState(false);
  const [isCaught, setIsCaught] = useState(false);
  const [bubbleText, setBubbleText] = useState('♥ gotcha!');

  const posRef = useRef(pos);
  posRef.current = pos;

  const mouseRef = useRef({ x: null, y: null, active: false });
  const statusRef = useRef('idle');
  const isCaughtRef = useRef(false);
  const runAnimTimerRef = useRef(0);
  const currentFrameRef = useRef('CAUGHT');
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const touchTimeoutRef = useRef(null);

  const onStatusChangeRef = useRef(onStatusChange);
  onStatusChangeRef.current = onStatusChange;

  const setCatStatus = (status) => {
    if (statusRef.current !== status) {
      statusRef.current = status;
      onStatusChangeRef.current?.(status);
    }
  };

  useEffect(() => {
    if (!active) {
      setCatStatus('idle');
      return;
    }

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = reduceMotionQuery.matches;

    const onMotionChange = (e) => {
      prefersReducedMotion = e.matches;
    };
    reduceMotionQuery.addEventListener?.('change', onMotionChange);

    const handlePointerMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      };
    };

    const handleTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      mouseRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        active: true,
      };
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = setTimeout(() => {
        mouseRef.current.active = false;
        setCatStatus('idle');
      }, 2500);
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      isCaughtRef.current = false;
      setIsCaught(false);
      setFrame('CAUGHT');
      currentFrameRef.current = 'CAUGHT';
      setCatStatus('idle');
    };

    const handleMouseEnter = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      };
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    lastTimeRef.current = performance.now();

    const loop = (time) => {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      const mouse = mouseRef.current;
      const currentPos = posRef.current;

      if (!mouse.active || mouse.x === null || mouse.y === null) {
        setCatStatus('idle');
        if (currentFrameRef.current !== 'CAUGHT') {
          currentFrameRef.current = 'CAUGHT';
          setFrame('CAUGHT');
        }
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const dx = mouse.x - currentPos.x;
      const dy = mouse.y - currentPos.y;
      const dist = Math.hypot(dx, dy);

      if (prefersReducedMotion) {
        // Reduced motion: sit quietly near target without fast running animation
        const isClose = dist <= CATCH_RADIUS;
        if (isClose) {
          if (!isCaughtRef.current) {
            isCaughtRef.current = true;
            setIsCaught(true);
            setBubbleText(BUBBLE_TEXTS[Math.floor(Math.random() * BUBBLE_TEXTS.length)]);
          }
          setCatStatus('caught');
        } else {
          isCaughtRef.current = false;
          setIsCaught(false);
          setCatStatus('stalking');
          // Gently jump position near cursor without running animation
          const clampedX = Math.max(CAT_HALF_SIZE, Math.min(window.innerWidth - CAT_HALF_SIZE, mouse.x + 24));
          const clampedY = Math.max(CAT_HALF_SIZE, Math.min(window.innerHeight - CAT_HALF_SIZE, mouse.y + 24));
          setPos({ x: clampedX, y: clampedY });
        }
        setFrame('CAUGHT');
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // Hysteresis logic: catch when dist <= 22, resume when dist > 28
      if (isCaughtRef.current) {
        if (dist > RESUME_RADIUS) {
          isCaughtRef.current = false;
          setIsCaught(false);
          setCatStatus('stalking');
        } else {
          // Stay caught
          setCatStatus('caught');
          if (currentFrameRef.current !== 'CAUGHT') {
            currentFrameRef.current = 'CAUGHT';
            setFrame('CAUGHT');
          }
          rafRef.current = requestAnimationFrame(loop);
          return;
        }
      } else {
        if (dist <= CATCH_RADIUS) {
          isCaughtRef.current = true;
          setIsCaught(true);
          setBubbleText(BUBBLE_TEXTS[Math.floor(Math.random() * BUBBLE_TEXTS.length)]);
          setCatStatus('caught');
          if (currentFrameRef.current !== 'CAUGHT') {
            currentFrameRef.current = 'CAUGHT';
            setFrame('CAUGHT');
          }
          rafRef.current = requestAnimationFrame(loop);
          return;
        } else {
          setCatStatus('stalking');
        }
      }

      // Moving towards mouse
      const step = Math.min(SPEED * dt, dist);
      const nextX = currentPos.x + (dx / dist) * step;
      const nextY = currentPos.y + (dy / dist) * step;

      // Viewport boundary clamping
      const clampedX = Math.max(CAT_HALF_SIZE, Math.min(window.innerWidth - CAT_HALF_SIZE, nextX));
      const clampedY = Math.max(CAT_HALF_SIZE, Math.min(window.innerHeight - CAT_HALF_SIZE, nextY));

      setPos({ x: clampedX, y: clampedY });

      // Flip orientation based on horizontal travel
      if (dx < -1) {
        setFacingLeft(true);
      } else if (dx > 1) {
        setFacingLeft(false);
      }

      // Toggle between RUN_1 and RUN_2 every 120ms
      runAnimTimerRef.current += dt * 1000;
      if (runAnimTimerRef.current >= 120) {
        runAnimTimerRef.current = 0;
        const nextFrame = currentFrameRef.current === 'RUN_1' ? 'RUN_2' : 'RUN_1';
        currentFrameRef.current = nextFrame;
        setFrame(nextFrame);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      reduceMotionQuery.removeEventListener?.('change', onMotionChange);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed pointer-events-none z-50 will-change-transform select-none"
      style={{
        left: 0,
        top: 0,
        transform: `translate3d(${pos.x - CAT_HALF_SIZE}px, ${pos.y - CAT_HALF_SIZE}px, 0)`,
      }}
    >
      <div className="relative pointer-events-none select-none">
        {isCaught && (
          <div
            role="status"
            aria-live="polite"
            className={`pointer-events-none absolute left-1/2 -translate-x-1/2 max-w-[140px] truncate whitespace-nowrap bg-[#f0f0f0] text-[#0b0b0b] font-mono text-[9px] px-1.5 py-0.5 border border-[#0b0b0b] shadow-[1px_1px_0_#f92672] ${
              pos.y < 40 ? 'top-full mt-1.5' : 'bottom-full mb-1.5'
            }`}
          >
            {bubbleText}
          </div>
        )}
        <div style={{ transform: facingLeft ? 'scaleX(-1)' : 'scaleX(1)' }}>
          <PixelSprite frame={frame} />
        </div>
      </div>
    </div>
  );
}

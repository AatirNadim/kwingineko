import { useEffect, useRef, useState } from 'react';

const PIXELS = {
  k: '#141512', // Dark charcoal outline, pupil, shadow
  b: '#252720', // Dark charcoal tuxedo coat
  m: '#383b30', // Midtone charcoal fur
  h: '#4d5142', // Subtle coat highlight
  w: '#f8f8f2', // Crisp white bib, paws, muzzle, smiling eyes
  p: '#f92672', // Monokai pink collar and nose
  r: '#ff8a80', // Soft pink inner ear and cheek blush
  y: '#e6db74', // Monokai yellow bell
  e: '#a6e22e', // Monokai lime green eyes
};

// 24x24 Pixel Tuxedo Cat frames facing right:
// RUN_1: Stride extension (front paws reaching forward, hind legs extended back, arched tail)
const RUN_1 = [
  '........................',
  '....kk..................',
  '...kmmk.................',
  '...kmmk.........kk...kk.',
  '..kmmk.........krk..krk.',
  '..kmmk........krmk.krmk.',
  '...kmmk......kmmmmkmmmmk',
  '....kmmk....kmmmmmmkekmk',
  '.....kmmk..kbbmmmmmwwpkk',
  '......kmmk..kbbmmmmbbkk.',
  '.......kmmk..kbbkkpyk...',
  '......kbbbbk.kbbkwwk....',
  '.....kbbhhhhhhhbbkwwwk..',
  '....kbbbbbbbbbbbbkwwk...',
  '...kbbbbk.kbbbbbbbbkbbk.',
  '..kbbbbk...kbbbbbbbbkwwk',
  '.kwwk.......kkbbbbbbkwwk',
  'kwwwk.........kkkkk...kk',
  '.kkk....................',
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
];

// RUN_2: Stride gather (paws tucked under body mid-leap, tail flick)
const RUN_2 = [
  '........................',
  '........................',
  '................kk...kk.',
  '...............krk..krk.',
  '.....kk.......krmk.krmk.',
  '....kmmk.....kmmmmkmmmmk',
  '...kmmk.....kmmmmmmkekmk',
  '...kmmk....kbbmmmmmwwpkk',
  '....kmmk....kbbmmmmbbkk.',
  '....kmmk.....kbbkkpyk...',
  '.....kmmk...kbbbkwwk....',
  '......kmmkkbbhhhhkwwwk..',
  '.....kbbbbbbbbbbbbkwwk..',
  '....kbbbbbbbbbbbbbbkk...',
  '......kbbbbk..kbbbbk....',
  '.......kbbk....kbbk.....',
  '.......kwwk....kwwk.....',
  '......kwwwk...kwwwk.....',
  '.......kkk.....kkk......',
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
];

// CAUGHT: Sitting neat, happy curved eyes (^ _ ^), pink blush, white paws side-by-side, tail curled
const CAUGHT = [
  '........................',
  '........k.......k.......',
  '.......krk.....krk......',
  '......krmk....krmk......',
  '......krmkkkkkkrmk......',
  '.....kmmhhhhhhhmmk......',
  '....kmmmmmmmmmmmmmmk....',
  '....kmmwwmmmmmmwwmmk....',
  '...krmwmmwmmmmwmmwrmk...',
  '...krmmmmmmmmmmmmmrmk...',
  '....kmmmmwwppwwmmmmk....',
  '.....kmmmwwwwwwmmmk.....',
  '......kpppppypppk.......',
  '.....kbbkwwwwwwkbbk.....',
  '....kbbbkmwwwwmkbbbk....',
  '...kbbbbkmwwwwmkbbbbk...',
  '...kbbbbkbbkkbbkbbbbk...',
  '...kbbbbkwwkkwwkbbbbk...',
  '..kkbbbbkwwkkwwkbbbbk...',
  '.kmmkbbbkwwkkwwkbbbkk...',
  '.kmmkkbbkwwkkwwkbbk.....',
  '..kmmkkkkwwkkwwkkk......',
  '...kkk...kk..kk.........',
  '........................',
];

const FRAMES = { RUN_1, RUN_2, CAUGHT };
const BUBBLE_TEXTS = ['♥ gotcha!', 'meow!'];
const SPEED = 160; // pixels per second
const CATCH_RADIUS = 28;
const RESUME_RADIUS = 34;
const CAT_HALF_SIZE = 24;

function PixelSprite({ frame }) {
  const rows = FRAMES[frame] || CAUGHT;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      shapeRendering="crispEdges"
      className="h-[48px] w-[48px] [image-rendering:pixelated]"
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
  const isObservingRef = useRef(false);
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

      // Inspect hero portrait boundary so cat respects the interactive canvas
      const portraitEl = typeof document !== 'undefined' ? document.getElementById('hero-portrait') : null;
      const portraitRect = portraitEl ? portraitEl.getBoundingClientRect() : null;
      const PORTRAIT_BUFFER = 20;
      const hasPortrait = Boolean(portraitRect && portraitRect.width > 0 && portraitRect.height > 0);
      const pLeft = hasPortrait ? portraitRect.left - PORTRAIT_BUFFER : -9999;
      const pRight = hasPortrait ? portraitRect.right + PORTRAIT_BUFFER : -9999;
      const pTop = hasPortrait ? portraitRect.top - PORTRAIT_BUFFER : -9999;
      const pBottom = hasPortrait ? portraitRect.bottom + PORTRAIT_BUFFER : -9999;

      const isMouseInPortrait = Boolean(
        hasPortrait &&
        mouse.x >= pLeft &&
        mouse.x <= pRight &&
        mouse.y >= pTop &&
        mouse.y <= pBottom
      );

      // Determine target position: if mouse is in portrait, clamp target to outer perimeter
      let targetX = mouse.x;
      let targetY = mouse.y;

      if (isMouseInPortrait) {
        const dL = Math.abs(mouse.x - pLeft);
        const dR = Math.abs(mouse.x - pRight);
        const dT = Math.abs(mouse.y - pTop);
        const dB = Math.abs(mouse.y - pBottom);
        const minD = Math.min(dL, dR, dT, dB);

        if (minD === dL) {
          targetX = pLeft;
          targetY = Math.max(pTop, Math.min(pBottom, mouse.y));
        } else if (minD === dR) {
          targetX = pRight;
          targetY = Math.max(pTop, Math.min(pBottom, mouse.y));
        } else if (minD === dT) {
          targetY = pTop;
          targetX = Math.max(pLeft, Math.min(pRight, mouse.x));
        } else {
          targetY = pBottom;
          targetX = Math.max(pLeft, Math.min(pRight, mouse.x));
        }

        targetX = Math.max(CAT_HALF_SIZE, Math.min(window.innerWidth - CAT_HALF_SIZE, targetX));
        targetY = Math.max(CAT_HALF_SIZE, Math.min(window.innerHeight - CAT_HALF_SIZE, targetY));
      }

      if (prefersReducedMotion) {
        if (isMouseInPortrait) {
          isCaughtRef.current = false;
          setIsCaught(false);
          setCatStatus('observing');
          setPos({ x: targetX, y: targetY });
          const portraitCenterX = (portraitRect.left + portraitRect.right) / 2;
          setFacingLeft(targetX > portraitCenterX);
          setFrame('CAUGHT');
          rafRef.current = requestAnimationFrame(loop);
          return;
        }

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

      // If mouse is inside portrait, cat stalks to the boundary and perches observing
      if (isMouseInPortrait) {
        isCaughtRef.current = false;
        setIsCaught(false);
        const tdx = targetX - currentPos.x;
        const tdy = targetY - currentPos.y;
        const tdist = Math.hypot(tdx, tdy);

        // Hysteresis window: settle at <=12px, re-engage stalking if target shifts >24px
        if (isObservingRef.current) {
          if (tdist > 24) {
            isObservingRef.current = false;
            setCatStatus('stalking');
          } else {
            setCatStatus('observing');
            if (currentFrameRef.current !== 'CAUGHT') {
              currentFrameRef.current = 'CAUGHT';
              setFrame('CAUGHT');
            }
            const portraitCenterX = (portraitRect.left + portraitRect.right) / 2;
            setFacingLeft(currentPos.x > portraitCenterX);
            rafRef.current = requestAnimationFrame(loop);
            return;
          }
        } else {
          if (tdist <= 12) {
            isObservingRef.current = true;
            setCatStatus('observing');
            if (currentFrameRef.current !== 'CAUGHT') {
              currentFrameRef.current = 'CAUGHT';
              setFrame('CAUGHT');
            }
            const portraitCenterX = (portraitRect.left + portraitRect.right) / 2;
            setFacingLeft(currentPos.x > portraitCenterX);
            rafRef.current = requestAnimationFrame(loop);
            return;
          } else {
            setCatStatus('stalking');
          }
        }

        // Moving towards boundary perimeter
        const step = Math.min(SPEED * dt, tdist);
        let nextX = currentPos.x + (tdx / tdist) * step;
        let nextY = currentPos.y + (tdy / tdist) * step;

        const clampedX = Math.max(CAT_HALF_SIZE, Math.min(window.innerWidth - CAT_HALF_SIZE, nextX));
        const clampedY = Math.max(CAT_HALF_SIZE, Math.min(window.innerHeight - CAT_HALF_SIZE, nextY));

        setPos({ x: clampedX, y: clampedY });

        if (tdx < -1) {
          setFacingLeft(true);
        } else if (tdx > 1) {
          setFacingLeft(false);
        }

        runAnimTimerRef.current += dt * 1000;
        if (runAnimTimerRef.current >= 120) {
          runAnimTimerRef.current = 0;
          const nextFrame = currentFrameRef.current === 'RUN_1' ? 'RUN_2' : 'RUN_1';
          currentFrameRef.current = nextFrame;
          setFrame(nextFrame);
        }

        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // Standard hysteresis logic when mouse is outside the portrait
      isObservingRef.current = false;
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

      // Moving towards mouse outside the portrait
      const step = Math.min(SPEED * dt, dist);
      let nextX = currentPos.x + (dx / dist) * step;
      let nextY = currentPos.y + (dy / dist) * step;

      // Prevent cat from cutting through the portrait bounding box
      if (hasPortrait && nextX >= pLeft && nextX <= pRight && nextY >= pTop && nextY <= pBottom) {
        const dL = Math.abs(nextX - pLeft);
        const dR = Math.abs(nextX - pRight);
        const dT = Math.abs(nextY - pTop);
        const dB = Math.abs(nextY - pBottom);
        const minD = Math.min(dL, dR, dT, dB);
        if (minD === dL) nextX = pLeft;
        else if (minD === dR) nextX = pRight;
        else if (minD === dT) nextY = pTop;
        else nextY = pBottom;
      }

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
      className={`fixed pointer-events-none z-40 select-none ${isCaught ? '' : 'will-change-transform'}`}
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
            className={`pointer-events-none absolute max-w-[140px] truncate whitespace-nowrap bg-[#f8f8f2] text-[#141512] font-mono text-[9px] px-1.5 py-0.5 border border-[#141512] shadow-[2px_2px_0_#f92672] ${
              pos.y < 46 ? 'top-full mt-1.5' : 'bottom-full mb-1.5'
            } ${
              pos.x < 80
                ? 'left-0'
                : pos.x > (typeof window !== 'undefined' ? window.innerWidth - 80 : 800)
                ? 'right-0'
                : 'left-1/2 -translate-x-1/2'
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

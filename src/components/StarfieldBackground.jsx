import { useEffect, useRef } from 'react';

// Color distribution tailored to eliminate "syntax salad":
// 75% subtle off-white (#f8f8f2), 15% muted olive-grey (#88846f),
// 10% rare Monokai syntax sparkles (#e6db74 yellow, #a6e22e lime, #ae81ff violet).
function pickStarColor() {
  const roll = Math.random();
  if (roll < 0.75) return '#f8f8f2';
  if (roll < 0.90) return '#88846f';
  if (roll < 0.94) return '#e6db74';
  if (roll < 0.97) return '#a6e22e';
  return '#ae81ff';
}

function createStars(width, height) {
  // Density: ~1 star per 9,500px^2, clamped between 55 and 165
  const count = Math.min(165, Math.max(55, Math.round((width * height) / 9500)));
  return Array.from({ length: count }, () => {
    // 82% 1px pixel stars, 18% 2px pixel stars for authentic retro pixel density
    const isTwoPx = Math.random() < 0.18;
    const color = pickStarColor();
    const isAccent = color !== '#f8f8f2' && color !== '#88846f';
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: isTwoPx ? 2 : 1,
      // Accents stay dimmer so they never compete with UI semantic highlights
      alpha: isAccent ? Math.random() * 0.22 + 0.16 : Math.random() * 0.32 + 0.16,
      twinkle: Math.random() * 1.2 + 0.4,
      phase: Math.random() * Math.PI * 2,
      color,
    };
  });
}

export default function StarfieldBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerFine = window.matchMedia('(hover: hover) and (pointer: fine)');
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let stars = [];
    let frame = 0;
    let lastTime = 0;
    let offsetX = 0;
    let offsetY = 0;
    let targetX = 0;
    let targetY = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      stars = createStars(width, height);
      if (reducedMotion.matches) draw(0, true);
    };

    const draw = (time, still = false) => {
      context.clearRect(0, 0, width, height);

      // Subtle, damped parallax (capped at max ~2.5px shift) so the terminal feels solidly anchored to the desk
      offsetX += (targetX - offsetX) * 0.025;
      offsetY += (targetY - offsetY) * 0.025;

      const elapsed = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;

      for (const star of stars) {
        if (!still) {
          // Slow, calm upward drift (~120s across the viewport)
          star.y -= elapsed * (1.1 + star.size * 0.7);
          if (star.y < -4) star.y = height + 4;
        }

        const twinkle = still ? 1 : 0.78 + Math.sin(time * 0.0006 * star.twinkle + star.phase) * 0.22;
        context.globalAlpha = star.alpha * twinkle;
        context.fillStyle = star.color;

        // Crisp integer coordinates: strictly square 1px or 2px pixel blocks
        context.fillRect(
          Math.round(star.x + offsetX),
          Math.round(star.y + offsetY),
          star.size,
          star.size
        );
      }

      context.globalAlpha = 1;
      if (!still && !reducedMotion.matches) frame = window.requestAnimationFrame(draw);
    };

    const onPointerMove = (event) => {
      // Subdued parallax: maximum 2.5px travel across the screen
      targetX = ((width / 2 - event.clientX) / (width / 2 || 1)) * 2.5;
      targetY = ((height / 2 - event.clientY) / (height / 2 || 1)) * 2.5;
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const onMotionChange = () => {
      window.cancelAnimationFrame(frame);
      lastTime = 0;
      if (reducedMotion.matches) draw(0, true);
      else frame = window.requestAnimationFrame(draw);
    };

    resize();
    if (!reducedMotion.matches) frame = window.requestAnimationFrame(draw);
    window.addEventListener('resize', resize, { passive: true });

    if (pointerFine.matches && !reducedMotion.matches) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerleave', onPointerLeave, { passive: true });
    }
    reducedMotion.addEventListener?.('change', onMotionChange);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      reducedMotion.removeEventListener?.('change', onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="starfield-background" />;
}

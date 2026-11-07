import { useEffect, useRef } from 'react';

// Color distribution matching the site's Monokai theme ratio:
// 44% Crisp Ink (#f8f8f2), 14% Secondary Ink (#d6d4c5), 10% Muted Dim (#88846f),
// 10% Monokai Lime (#a6e22e), 8% Monokai Pink (#f92672), 8% Monokai Yellow (#e6db74), 6% Monokai Violet (#ae81ff).
function pickStarColor() {
  const roll = Math.random();
  if (roll < 0.44) return '#f8f8f2';
  if (roll < 0.58) return '#d6d4c5';
  if (roll < 0.68) return '#88846f';
  if (roll < 0.78) return '#a6e22e';
  if (roll < 0.86) return '#f92672';
  if (roll < 0.94) return '#e6db74';
  return '#ae81ff';
}

function createStars(width, height) {
  // Density: ~1 star per 4,800px^2, clamped between 120 and 340
  const count = Math.min(340, Math.max(120, Math.round((width * height) / 4800)));
  return Array.from({ length: count }, () => {
    // Star sizes: ~78% 1px pixel stars, ~18% 2px pixel stars, ~4% 3px prominent pixel stars
    const sizeRoll = Math.random();
    const size = sizeRoll < 0.78 ? 1 : sizeRoll < 0.96 ? 2 : 3;
    const color = pickStarColor();

    // Calibrated alpha: accents and crisp ink pop vividly, secondary and muted stars provide depth
    let baseAlpha;
    if (color === '#88846f') {
      baseAlpha = Math.random() * 0.25 + 0.35;
    } else if (color === '#d6d4c5') {
      baseAlpha = Math.random() * 0.30 + 0.45;
    } else {
      // Crisp Ink (#f8f8f2) and Syntax Accents (#a6e22e, #f92672, #e6db74, #ae81ff)
      baseAlpha = Math.random() * 0.35 + 0.55;
    }

    // Boost alpha by +0.10 for prominent 3px stars (capped at 1.0)
    const alpha = Math.min(1.0, size === 3 ? baseAlpha + 0.10 : baseAlpha);

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size,
      alpha,
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
    const animateBackground = () => !reducedMotion.matches && pointerFine.matches;
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

        const twinkle = still ? 1 : 0.82 + Math.sin(time * 0.0007 * star.twinkle + star.phase) * 0.18;
        context.globalAlpha = star.alpha * twinkle;
        context.fillStyle = star.color;

        // Crisp integer coordinates: strictly square 1px, 2px, or 3px pixel blocks
        context.fillRect(
          Math.round(star.x + offsetX),
          Math.round(star.y + offsetY),
          star.size,
          star.size
        );
      }

      context.globalAlpha = 1;
      if (!still && animateBackground()) frame = window.requestAnimationFrame(draw);
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
      if (animateBackground()) frame = window.requestAnimationFrame(draw);
      else draw(0, true);
    };

    resize();
    if (animateBackground()) frame = window.requestAnimationFrame(draw);
    else draw(0, true);
    window.addEventListener('resize', resize, { passive: true });

    if (pointerFine.matches && !reducedMotion.matches) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerleave', onPointerLeave, { passive: true });
    }
    reducedMotion.addEventListener?.('change', onMotionChange);
    pointerFine.addEventListener?.('change', onMotionChange);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      reducedMotion.removeEventListener?.('change', onMotionChange);
      pointerFine.removeEventListener?.('change', onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="starfield-background" />;
}

import { useEffect, useRef } from 'react';

const STAR_COLORS = ['#e6db74', '#a6e22e', '#f8f8f2', '#ae81ff'];

function createStars(width, height) {
  const count = Math.min(190, Math.max(55, Math.round((width * height) / 8500)));
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.05 + 0.3,
    alpha: Math.random() * 0.42 + 0.18,
    twinkle: Math.random() * 1.5 + 0.35,
    phase: Math.random() * Math.PI * 2,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
  }));
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
      offsetX += (targetX - offsetX) * 0.035;
      offsetY += (targetY - offsetY) * 0.035;
      const elapsed = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;

      for (const star of stars) {
        if (!still) star.y -= elapsed * (1.4 + star.radius * 2.1);
        if (star.y < -2) star.y = height + 2;
        const twinkle = still ? 1 : 0.72 + Math.sin(time * 0.0007 * star.twinkle + star.phase) * 0.28;
        context.globalAlpha = star.alpha * twinkle;
        context.fillStyle = star.color;
        context.beginPath();
        context.arc(star.x + offsetX, star.y + offsetY, star.radius, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      if (!still && !reducedMotion.matches) frame = window.requestAnimationFrame(draw);
    };

    const onPointerMove = (event) => {
      targetX = ((width / 2 - event.clientX) / (width / 2 || 1)) * 17;
      targetY = ((height / 2 - event.clientY) / (height / 2 || 1)) * 17;
    };
    const onPointerLeave = () => { targetX = 0; targetY = 0; };
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

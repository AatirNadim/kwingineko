import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * ParticlePortrait
 *
 * Implements a cursor-reactive and touch-interactive particle dispersion matrix for Aatir Nadim's portrait.
 * Samples /assets/aatir-portrait.png onto a calibrated raster grid of rectangular
 * phosphor-like cells. Hovering or touch dragging pushes particles radially outward
 * with organic scatter, revealing the underlying photographic portrait underneath.
 *
 * Mobile-optimized:
 * - touch-pan-y enabled so touch interactions do not block vertical page scroll.
 * - Dynamic column calibration maintains silky 60fps across low-power mobile viewports.
 * - Touch coordinates tracked relative to canvas bounding box with impulse waves on touch start.
 */
export default function ParticlePortrait({ className = '' }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0, active: false, isTouch: false });
  const [particleCount, setParticleCount] = useState(0);

  // Animation and physics state stored in refs to avoid React re-render overhead
  const stateRef = useRef({
    particles: [],
    pointer: { x: -9999, y: -9999, active: false, radius: 75, power: 8.5 },
    shockwaves: [],
    width: 220,
    height: 275,
    dpr: 1,
    rafId: null,
    isSleeping: false,
    needsRender: true,
  });

  // Build the particle grid from the cropped image data
  const initParticles = useCallback((img, canvasWidth, canvasHeight) => {
    // 4:5 aspect ratio crop matching object-position: center 22%
    // Native dimensions: 953 x 1651
    const nativeW = img.naturalWidth || 953;
    const nativeH = img.naturalHeight || 1651;
    const cropW = nativeW;
    const cropH = nativeW * 1.25; // 4:5 ratio
    const cropX = 0;
    const cropY = Math.round(0.22 * (nativeH - cropH)); // ~101px

    // Off-screen canvas for sampling pixel colors
    const offscreen = document.createElement('canvas');
    offscreen.width = canvasWidth;
    offscreen.height = canvasHeight;
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return;

    offCtx.drawImage(
      img,
      cropX, cropY, cropW, cropH,
      0, 0, canvasWidth, canvasHeight
    );

    const imgData = offCtx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imgData.data;

    // Grid resolution: calibrate columns smoothly based on canvas width:
    // target ~38-42 cols on mobile (<240px) up to ~56-60 cols on desktop
    const cols = canvasWidth < 240
      ? Math.max(36, Math.min(42, Math.round(canvasWidth / 5.2)))
      : Math.max(42, Math.min(60, Math.round(canvasWidth / 4.1)));
    const rows = Math.round(cols * 1.25);
    const stepX = canvasWidth / cols;
    const stepY = canvasHeight / rows;

    // Rectangular particle dash size (slightly wider than tall, matching terminal raster)
    const pWidth = Math.max(2.4, stepX * 0.82);
    const pHeight = Math.max(1.8, stepY * 0.72);

    const newParticles = [];

    for (let r = 0; r < rows; r++) {
      const py = Math.floor((r + 0.5) * stepY);
      for (let c = 0; c < cols; c++) {
        const px = Math.floor((c + 0.5) * stepX);
        const idx = (py * canvasWidth + px) * 4;

        const red = data[idx];
        const green = data[idx + 1];
        const blue = data[idx + 2];
        const alpha = data[idx + 3] / 255;

        // Skip completely transparent or near pitch-black border pixels to reduce draw calls
        const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
        if (alpha < 0.1) continue;

        // Warm Monokai tone calibration: slightly boost warm ochre/amber for retro digital look
        const rWarm = Math.min(255, Math.round(red * 1.05 + 8));
        const gWarm = Math.min(255, Math.round(green * 0.98 + 4));
        const bWarm = Math.min(255, Math.round(blue * 0.92));

        const baseAlpha = luminance < 0.15 ? 0.35 : 0.92;

        newParticles.push({
          originX: px,
          originY: py,
          x: px,
          y: py,
          vx: 0,
          vy: 0,
          w: pWidth,
          h: pHeight,
          color: `rgba(${rWarm}, ${gWarm}, ${bWarm}, ${baseAlpha})`,
          luminance,
          // Jitter weight for organic scattering
          jitterWeight: 0.7 + Math.random() * 0.6,
        });
      }
    }

    stateRef.current.particles = newParticles;
    setParticleCount(newParticles.length);
    stateRef.current.needsRender = true;
  }, []);

  // Main animation loop
  useEffect(() => {
    let active = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (!active) return;

      const state = stateRef.current;
      const { particles, pointer, shockwaves, width, height, dpr } = state;

      // Update shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += sw.speed;
        sw.intensity *= 0.92;
        if (sw.radius > sw.maxRadius || sw.intensity < 0.05) {
          shockwaves.splice(i, 1);
        }
      }

      // Respect prefers-reduced-motion for accessibility
      const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          ctx.fillStyle = p.color;
          ctx.fillRect(Math.round(p.originX - p.w * 0.5), Math.round(p.originY - p.h * 0.5), p.w, p.h);
        }
        ctx.restore();
        return;
      }

      let totalMovement = 0;
      const spring = 0.075;
      const friction = 0.83;
      const repelRadius = pointer.radius;
      const repelRadiusSq = repelRadius * repelRadius;

      // Physics update
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Cursor / Touch repulsion
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < repelRadiusSq && distSq > 0.001) {
            const dist = Math.sqrt(distSq);
            const normDist = 1 - dist / repelRadius;
            const force = Math.pow(normDist, 1.4) * pointer.power * p.jitterWeight;
            const angle = Math.atan2(dy, dx);

            // Radial repulsion
            p.vx += Math.cos(angle) * force;
            p.vy += Math.sin(angle) * force;

            // Organic tangent swirl + dispersion scatter
            const swirl = (Math.random() - 0.5) * force * 0.45;
            p.vx += -Math.sin(angle) * swirl;
            p.vy += Math.cos(angle) * swirl;
          }
        }

        // 2. Shockwave impulses
        for (let s = 0; s < shockwaves.length; s++) {
          const sw = shockwaves[s];
          const sdx = p.x - sw.x;
          const sdy = p.y - sw.y;
          const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
          const diff = Math.abs(sdist - sw.radius);
          if (diff < 22 && sdist > 0.1) {
            const waveForce = (1 - diff / 22) * sw.intensity;
            p.vx += (sdx / sdist) * waveForce;
            p.vy += (sdy / sdist) * waveForce;
          }
        }

        // 3. Restitution spring to home coordinate
        const ax = (p.originX - p.x) * spring;
        const ay = (p.originY - p.y) * spring;

        p.vx = (p.vx + ax) * friction;
        p.vy = (p.vy + ay) * friction;

        p.x += p.vx;
        p.y += p.vy;

        totalMovement += Math.abs(p.vx) + Math.abs(p.vy);
      }

      // Check if particles have settled and pointer is idle
      if (!pointer.active && shockwaves.length === 0 && totalMovement < 0.15) {
        state.isSleeping = true;
        // Snap to resting positions
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x = p.originX;
          p.y = p.originY;
          p.vx = 0;
          p.vy = 0;
        }
      } else {
        state.isSleeping = false;
      }

      // Render frame
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillStyle = p.color;
        // Crisp rectangular dash centered at (x, y)
        ctx.fillRect(
          Math.round(p.x - p.w * 0.5),
          Math.round(p.y - p.h * 0.5),
          p.w,
          p.h
        );
      }

      // Draw subtle retro aperture target ring at cursor if active
      if (pointer.active) {
        ctx.save();
        ctx.strokeStyle = 'rgba(166, 226, 46, 0.45)'; // Monokai lime
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, pointer.radius * 0.95, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshair ticks
        const tick = 5;
        ctx.strokeStyle = 'rgba(249, 38, 114, 0.6)'; // Monokai pink
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(pointer.x - tick, pointer.y);
        ctx.lineTo(pointer.x + tick, pointer.y);
        ctx.moveTo(pointer.x, pointer.y - tick);
        ctx.lineTo(pointer.x, pointer.y + tick);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();

      // Schedule next frame
      state.rafId = requestAnimationFrame(render);
    };

    stateRef.current.rafId = requestAnimationFrame(render);

    return () => {
      active = false;
      if (stateRef.current.rafId) {
        cancelAnimationFrame(stateRef.current.rafId);
      }
    };
  }, []);

  // Resize and initialize canvas when container dimensions or image changes
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      if (!rect.width) return;
      const width = Math.round(rect.width);
      // Keep strict 4:5 aspect ratio
      const height = Math.round(width * 1.25);

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      stateRef.current.width = width;
      stateRef.current.height = height;
      stateRef.current.dpr = dpr;

      if (imageRef.current && imageRef.current.complete) {
        initParticles(imageRef.current, width, height);
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    resizeObserver.observe(container);

    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, [initParticles]);

  // Pointer event handlers (Mouse / Stylus)
  const handlePointerMove = (e) => {
    if (e.pointerType === 'touch') return; // Handled by touch events
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    stateRef.current.pointer.x = x;
    stateRef.current.pointer.y = y;
    stateRef.current.pointer.active = true;

    setCoords({ x: Math.round(x), y: Math.round(y), active: true, isTouch: false });

    // Wake up physics loop if asleep
    if (stateRef.current.isSleeping) {
      stateRef.current.isSleeping = false;
    }
  };

  const handlePointerLeave = () => {
    stateRef.current.pointer.active = false;
    stateRef.current.pointer.x = -9999;
    stateRef.current.pointer.y = -9999;
    setCoords({ x: 0, y: 0, active: false, isTouch: false });
  };

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Trigger impulse shockwave
    stateRef.current.shockwaves.push({
      x,
      y,
      radius: 5,
      maxRadius: stateRef.current.width * 0.65,
      speed: 7.5,
      intensity: 14,
    });

    stateRef.current.isSleeping = false;
  };

  // Touch event handlers (Touchscreen devices)
  // CRITICAL: We do not call e.preventDefault() so touch-pan-y can scroll down freely
  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    stateRef.current.pointer.x = x;
    stateRef.current.pointer.y = y;
    stateRef.current.pointer.active = true;
    stateRef.current.isSleeping = false;

    // Touch tap shockwave impulse
    stateRef.current.shockwaves.push({
      x,
      y,
      radius: 6,
      maxRadius: stateRef.current.width * 0.7,
      speed: 7,
      intensity: 14,
    });

    setCoords({ x: Math.round(x), y: Math.round(y), active: true, isTouch: true });
  };

  const handleTouchMove = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    stateRef.current.pointer.x = x;
    stateRef.current.pointer.y = y;
    stateRef.current.pointer.active = true;
    if (stateRef.current.isSleeping) {
      stateRef.current.isSleeping = false;
    }

    setCoords({ x: Math.round(x), y: Math.round(y), active: true, isTouch: true });
  };

  const handleTouchEnd = () => {
    stateRef.current.pointer.active = false;
    stateRef.current.pointer.x = -9999;
    stateRef.current.pointer.y = -9999;
    setCoords({ x: 0, y: 0, active: false, isTouch: false });
  };

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* Monokai Terminal Frame */}
      <div className="relative overflow-hidden border border-[#5d5e50] bg-[#1e1f1c] p-1.5 shadow-[4px_4px_0_rgb(0_0_0_/_35%)] transition-colors duration-200 hover:border-lime/70 sm:p-2">
        {/* Retro Header Strip */}
        <div className="mb-1.5 flex items-center justify-between border-b border-[#35362e] pb-1 px-1 font-mono text-[8px] tracking-[0.5px]">
          <div className="flex items-center gap-1.5 text-[#d0cebf]">
            <span
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                coords.active ? 'bg-pink shadow-[0_0_6px_#f92672]' : 'bg-lime shadow-[0_0_5px_#a6e22e]'
              }`}
            />
            <span className="font-semibold text-ink">AATIR / 001</span>
          </div>
          <div className="flex items-center gap-2 text-[7px] text-[#88846f]">
            <span className="text-lime">{coords.active ? (coords.isTouch ? 'TOUCH DISPERSE' : 'INTERACTION') : 'LIVE MESH'}</span>
            <span className="hidden sm:inline text-[#5d5e50]">|</span>
            <span className="hidden sm:inline text-yellow">{particleCount ? `${particleCount} PTS` : 'LOADING'}</span>
          </div>
        </div>

        {/* Interactive Viewport (Canvas + Underlayer Reveal) */}
        {/* touch-pan-y allows unhindered vertical page scrolling on mobile */}
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className="relative aspect-[4/5] w-full cursor-crosshair overflow-hidden bg-[#24251f] select-none touch-pan-y"
        >
          {/* Underlayer photographic portrait: calibrated contrast revealed through the dispersion hole */}
          <img
            ref={imageRef}
            src="/assets/aatir-portrait.png"
            alt="Portrait of Aatir Nadim"
            onLoad={() => {
              setIsLoaded(true);
              if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                initParticles(imageRef.current, rect.width, rect.width * 1.25);
              }
            }}
            className={`pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_22%] contrast-125 brightness-75 transition-opacity duration-300 ${
              coords.active ? 'opacity-40' : 'opacity-20'
            }`}
          />

          {/* Particle Matrix Canvas */}
          <canvas
            ref={canvasRef}
            className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Loading indicator */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1e1f1c] font-mono text-[9px] tracking-wider text-muted">
              INITIALIZING MESH...
            </div>
          )}

          {/* Retro Corner Brackets */}
          <div className="pointer-events-none absolute left-1 top-1 h-2 w-2 border-l border-t border-lime/60" />
          <div className="pointer-events-none absolute right-1 top-1 h-2 w-2 border-r border-t border-lime/60" />
          <div className="pointer-events-none absolute bottom-1 left-1 h-2 w-2 border-b border-l border-lime/60" />
          <div className="pointer-events-none absolute bottom-1 right-1 h-2 w-2 border-b border-r border-lime/60" />
        </div>

        {/* Retro Status Footer */}
        <div className="mt-1.5 flex items-center justify-between px-1 font-mono text-[7px] tracking-[0.4px] text-[#88846f]">
          <div className="flex items-center gap-2">
            <span className="text-[#aaa897]">
              {coords.active
                ? `${coords.isTouch ? 'TOUCH' : 'CURSOR'}: X:${String(coords.x).padStart(3, '0')} Y:${String(coords.y).padStart(3, '0')}`
                : 'CURSOR: HOVER / TOUCH'}
            </span>
          </div>
          <div className="text-right text-pink font-medium">
            {coords.active ? 'DISPERSION ACTIVE' : 'REPEL: READY'}
          </div>
        </div>
      </div>

      {/* Film Strip Style Sub-label */}
      <div className="mt-1 flex items-center justify-between px-1 font-mono text-[7px] tracking-widest text-[#79786c]">
        <span>ENGINEER // CORE</span>
        <span>NO. 001</span>
      </div>
    </div>
  );
}

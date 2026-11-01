import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Maximize2, Minimize2, Terminal, ShieldAlert, RotateCcw } from 'lucide-react';

function loadJsDos() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('No window'));

    if (window.Dos) {
      resolve(window.Dos);
      return;
    }

    if (!document.querySelector('link[data-jsdos-css]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/js-dos/js-dos.css';
      link.setAttribute('data-jsdos-css', 'true');
      document.head.appendChild(link);
    }

    const existingScript = document.querySelector('script[data-jsdos-script]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.Dos));
      existingScript.addEventListener('error', (e) => reject(e));
      return;
    }

    const script = document.createElement('script');
    script.src = '/js-dos/js-dos.js';
    script.async = true;
    script.setAttribute('data-jsdos-script', 'true');
    script.onload = () => {
      if (window.Dos) {
        resolve(window.Dos);
      } else {
        reject(new Error('window.Dos was not found after loading js-dos.js'));
      }
    };
    script.onerror = (e) => reject(new Error('Failed to load js-dos runtime script'));
    document.body.appendChild(script);
  });
}

export default function DosPlayerModal({ isOpen, onClose, game }) {
  const mountRef = useRef(null);
  const dosInstanceRef = useRef(null);
  const [bootState, setBootState] = useState('idle'); // 'idle' | 'loading' | 'ready' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const modalContainerRef = useRef(null);

  const cleanupDos = useCallback(async () => {
    if (dosInstanceRef.current) {
      try {
        if (typeof dosInstanceRef.current.stop === 'function') {
          await dosInstanceRef.current.stop();
        }
      } catch (err) {
        console.warn('Error stopping DOS player:', err);
      }
      dosInstanceRef.current = null;
    }
    if (mountRef.current) {
      mountRef.current.innerHTML = '';
    }
    setBootState('idle');
  }, []);

  const handleClose = useCallback(() => {
    cleanupDos();
    onClose();
  }, [cleanupDos, onClose]);

  const handleRestart = useCallback(async () => {
    await cleanupDos();
    setReloadKey((k) => k + 1);
  }, [cleanupDos]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Handle ESC key to dismiss (when pointer lock is not holding keys)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !document.pointerLockElement) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Boot emulator when modal opens
  useEffect(() => {
    if (!isOpen || !game) return;

    let isMounted = true;
    setBootState('loading');
    setErrorMessage('');

    async function startEmulator() {
      try {
        const Dos = await loadJsDos();
        if (!isMounted || !mountRef.current) return;

        // Clean any leftover elements
        mountRef.current.innerHTML = '';

        const instance = Dos(mountRef.current, {
          url: game.bundleUrl,
          pathPrefix: '/js-dos/emulators/',
          theme: 'dark',
          autoStart: true,
          kiosk: true,
          renderAspect: '4/3',
        });

        dosInstanceRef.current = instance;
        if (isMounted) {
          setBootState('ready');
        }
      } catch (err) {
        console.error('Failed to initialize js-dos:', err);
        if (isMounted) {
          setBootState('error');
          setErrorMessage(err.message || 'Failed to initialize DOSBox WebAssembly kernel.');
        }
      }
    }

    startEmulator();

    return () => {
      isMounted = false;
      cleanupDos();
    };
  }, [isOpen, game, reloadKey, cleanupDos]);

  const toggleFullscreen = () => {
    if (!modalContainerRef.current) return;
    if (!document.fullscreenElement) {
      modalContainerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  if (!isOpen || !game) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dos-player-title"
      className="fixed inset-0 z-[120] grid place-items-center bg-canvas/90 p-2 backdrop-blur-sm sm:p-4"
    >
      <div
        ref={modalContainerRef}
        className="flex max-h-[96vh] w-full max-w-[860px] flex-col border border-line bg-surface shadow-[8px_8px_0_rgba(0,0,0,0.5)]"
      >
        {/* Retro Window Chrome Title Bar */}
        <div className="flex min-h-[44px] items-center justify-between border-b border-line bg-[#292a25] px-3 font-mono text-[9px] tracking-wider text-muted sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <Terminal size={14} className="shrink-0 text-lime" />
            <span id="dos-player-title" className="truncate font-bold text-ink">
              C:\GAMES\DOOM\{game.executable}
            </span>
            <span className="hidden items-center gap-1.5 border border-[#3e4034] bg-[#1e1f1c] px-2 py-0.5 text-[8px] text-lime sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_6px_#a6e22e]" />
              {bootState === 'loading' ? 'BOOTING...' : 'RUNNING (60 FPS)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestart}
              aria-label="Reload game session"
              title="Restart game session"
              className="inline-flex min-h-[44px] items-center justify-center gap-1.5 border border-[#444639] bg-[#1e1f1c] px-3 font-mono text-[8.5px] font-semibold text-muted transition-colors hover:border-lime hover:text-lime focus-visible:outline focus-visible:outline-1 focus-visible:outline-yellow"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">RELOAD</span>
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-[#444639] bg-[#1e1f1c] text-muted transition-colors hover:border-yellow hover:text-yellow focus-visible:outline focus-visible:outline-1 focus-visible:outline-yellow"
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close DOS Player"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 border border-[#444639] bg-[#1e1f1c] px-3 font-mono text-[8.5px] font-semibold text-yellow transition-colors hover:border-pink hover:text-pink focus-visible:outline focus-visible:outline-1 focus-visible:outline-yellow"
            >
              <X size={14} />
              <span>EXIT [ESC]</span>
            </button>
          </div>
        </div>

        {/* Emulation Viewport Area with Recessed CRT Bezel */}
        <div className="relative flex min-h-[320px] w-full flex-1 items-center justify-center overflow-hidden border-b border-[#21221b] bg-black shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] sm:min-h-[420px] md:min-h-[480px]">
          {/* Active Canvas Mount */}
          <div
            ref={mountRef}
            className="h-full w-full max-h-[64vh] aspect-[4/3] flex items-center justify-center"
          />

          {/* Loading Screen Overlay */}
          {bootState === 'loading' && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#131411] p-6 font-mono text-[#d6d4c5]">
              <div className="w-full max-w-[420px] space-y-2 border border-[#35362e] bg-[#1a1b17] p-4 text-[10px] leading-relaxed shadow-[4px_4px_0_#000]">
                <div className="flex items-center justify-between border-b border-[#35362e] pb-1.5 text-lime">
                  <span>MS-DOS 6.22 WASM KERNEL</span>
                  <span className="text-[8px] text-muted">SB16 DETECTED</span>
                </div>
                <div className="pt-1 text-[#aaa897]">
                  <p className="m-0">C:\&gt; MOUNT C /games/doom</p>
                  <p className="m-0">Drive C is mounted as 1.44MB floppy image.</p>
                  <p className="m-0 text-pink">C:\&gt; CD DOOM</p>
                  <p className="m-0 text-yellow">C:\DOOM\&gt; DOOM.EXE</p>
                  <p className="m-0 text-lime animate-pulse">Loading DOOM1.WAD (2.45 MB)...</p>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden border border-line bg-canvas">
                  <div className="h-full w-3/4 animate-[pulse_1s_infinite] bg-lime" />
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {bootState === 'error' && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#131411] p-6 text-center font-mono">
              <ShieldAlert size={32} className="text-pink mb-2" />
              <h3 className="text-sm font-bold text-pink">KERNEL INITIALIZATION FAILED</h3>
              <p className="mt-1 max-w-[400px] text-[10px] text-muted">{errorMessage}</p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-4 border border-line bg-[#252621] px-4 py-2 text-[10px] text-yellow hover:border-yellow"
              >
                RETURN TO WORKSTATION
              </button>
            </div>
          )}
        </div>

        {/* Bottom Controls Strip & Lore Reference */}
        <div className="border-t border-line bg-[#1e1f1c] px-3 py-2.5 sm:px-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#303129] pb-2 font-mono text-[8px] text-[#aaa897]">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-bold text-lime">CONTROLS:</span>
              <span><b className="text-yellow">[W A S D / ARROWS]</b> Move</span>
              <span><b className="text-yellow">[CTRL / L-CLICK]</b> Fire</span>
              <span><b className="text-yellow">[SPACE]</b> Open Door</span>
              <span><b className="text-yellow">[1-7]</b> Weapons</span>
              <span><b className="text-yellow">[SHIFT]</b> Run</span>
              <span><b className="text-yellow">[ESC]</b> Menu / Pause</span>
            </div>
            <div className="text-[7.5px] text-muted">
              CLICK SCREEN TO LOCK MOUSE · [ESC] TO UNLOCK
            </div>
          </div>

          <div className="flex items-center justify-between pt-1.5 font-mono text-[8px] text-muted">
            <span className="truncate italic text-[#959383]">
              "{game.lore}"
            </span>
            <span className="shrink-0 pl-2 text-violet">
              {game.loreTag}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

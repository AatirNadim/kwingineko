import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Maximize2, Minimize2, Terminal, ShieldAlert, RotateCcw, Disc, Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { retroGames } from '../data/games.js';

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
    script.onerror = () => reject(new Error('Failed to load js-dos runtime script'));
    document.body.appendChild(script);
  });
}

export default function DosPlayerModal({ isOpen, onClose, game, onGameChange }) {
  const mountRef = useRef(null);
  const dosInstanceRef = useRef(null);
  const [bootState, setBootState] = useState('idle'); // 'idle' | 'loading' | 'ready' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
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
    setIsPaused(false);
    setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    if (dosInstanceRef.current && typeof dosInstanceRef.current.setVolume === 'function') {
      const nextMuted = !isMuted;
      dosInstanceRef.current.setVolume(nextMuted ? 0 : 1);
      setIsMuted(nextMuted);
    }
  }, [isMuted]);

  const togglePause = useCallback(() => {
    if (dosInstanceRef.current && typeof dosInstanceRef.current.setPaused === 'function') {
      const nextPaused = !isPaused;
      dosInstanceRef.current.setPaused(nextPaused);
      setIsPaused(nextPaused);
    }
  }, [isPaused]);

  const handleClose = useCallback(() => {
    cleanupDos();
    onClose();
  }, [cleanupDos, onClose]);

  const handleRestart = useCallback(async () => {
    await cleanupDos();
    setReloadKey((k) => k + 1);
  }, [cleanupDos]);

  const handleSwitchGame = useCallback(
    async (nextGame) => {
      if (nextGame.id === game?.id) return;
      await cleanupDos();
      onGameChange?.(nextGame);
      setReloadKey((k) => k + 1);
    },
    [cleanupDos, game?.id, onGameChange]
  );

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

  // Boot emulator when modal opens or game changes
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
      className="fixed inset-0 z-[110] grid place-items-center bg-canvas/90 p-2 backdrop-blur-sm sm:p-4"
    >
      <div
        ref={modalContainerRef}
        className="flex max-h-[96vh] w-full max-w-[860px] flex-col overflow-y-auto border border-line bg-surface shadow-[8px_8px_0_rgba(0,0,0,0.7)]"
      >
        {/* Retro Window Chrome Title Bar */}
        <div className="flex min-h-[44px] items-center justify-between border-b border-line bg-[#292a25] px-2.5 sm:px-4 font-mono text-[10px] tracking-wider text-muted gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Terminal size={14} className="shrink-0 text-lime" />
            <span className="font-bold text-yellow uppercase tracking-widest shrink-0 text-[10.5px] sm:text-xs">
              AATIR'S ARCADE
            </span>
            <span className="text-[#55564c] hidden sm:inline">//</span>
            <span id="dos-player-title" className="truncate font-semibold text-ink hidden sm:inline">
              C:\GAMES\{game.cartridgeCode || game.id.toUpperCase()}\{game.executable}
            </span>
            <span className="hidden items-center gap-1.5 border border-[#3e4034] bg-[#1e1f1c] px-2 py-0.5 text-[9.5px] text-lime md:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_6px_#a6e22e]" />
              {bootState === 'loading' ? 'BOOTING...' : 'RUNNING (WASM)'}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={togglePause}
              aria-label={isPaused ? 'Resume emulation' : 'Pause emulation'}
              title={isPaused ? 'Resume emulation' : 'Pause emulation'}
              className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 border px-2 font-mono text-[10px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow ${
                isPaused
                  ? 'border-yellow bg-yellow/15 text-yellow'
                  : 'border-[#444639] bg-[#1e1f1c] text-muted hover:border-yellow hover:text-yellow'
              }`}
            >
              {isPaused ? <Play size={13} /> : <Pause size={13} />}
              <span className="hidden sm:inline">{isPaused ? 'RESUME' : 'PAUSE'}</span>
            </button>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
              title={isMuted ? 'Unmute audio' : 'Mute audio'}
              className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 border px-2 font-mono text-[10px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow ${
                isMuted
                  ? 'border-pink bg-pink/15 text-pink'
                  : 'border-[#444639] bg-[#1e1f1c] text-muted hover:border-lime hover:text-lime'
              }`}
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              <span className="hidden sm:inline">{isMuted ? 'MUTED' : 'AUDIO'}</span>
            </button>
            <button
              type="button"
              onClick={handleRestart}
              aria-label="Reload game session"
              title="Restart game session"
              className="hidden min-[380px]:inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 border border-[#444639] bg-[#1e1f1c] px-2.5 font-mono text-[10px] font-semibold text-muted transition-colors hover:border-lime hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">RELOAD</span>
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-[#444639] bg-[#1e1f1c] text-muted transition-colors hover:border-yellow hover:text-yellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close DOS Player"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 border border-[#444639] bg-[#1e1f1c] px-2.5 font-mono text-[10px] font-semibold text-yellow transition-colors hover:border-pink hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
            >
              <X size={14} />
              <span className="hidden sm:inline">EXIT [ESC]</span>
            </button>
          </div>
        </div>

        {/* In-Player ROM Quick-Switcher Strip */}
        <div className="flex items-center justify-between border-b border-[#2d2e27] bg-[#1b1c18] px-3 py-1.5 font-mono text-[9.5px] text-muted overflow-x-auto gap-2">
          <span className="shrink-0 flex items-center gap-1 text-[#88846f]">
            <Disc size={11} className="text-yellow" />
            <span>SWITCH ROM:</span>
          </span>
          <div className="flex items-center gap-1">
            {retroGames.map((g) => {
              const isCurrent = g.id === game.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleSwitchGame(g)}
                  className={`px-2 py-1 border text-[9px] transition-all font-mono min-h-[28px] ${
                    isCurrent
                      ? 'border-lime bg-lime/20 text-lime font-bold shadow-[0_0_6px_#a6e22e30]'
                      : 'border-[#383a30] bg-[#22231e] text-[#a09e8e] hover:border-[#5a5c4d] hover:text-ink'
                  }`}
                  title={`${g.title} (${g.size})`}
                >
                  <span className="opacity-70 mr-1">{g.diskNumber}:</span>
                  {g.cartridgeCode}
                </button>
              );
            })}
          </div>
        </div>

        {/* Emulation Viewport Area with Recessed CRT Bezel */}
        <div className="relative flex min-h-[260px] max-h-[60vh] w-full flex-1 items-center justify-center overflow-hidden border-b border-[#21221b] bg-black shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] sm:min-h-[380px] md:min-h-[460px]">
          {/* Subtle CRT top bezel badge */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 z-10 select-none rounded border border-[#2b2d24] bg-[#141512]/85 px-2.5 py-0.5 font-mono text-[9px] tracking-[0.2em] text-[#8a8775] backdrop-blur-[2px]"
          >
            AATIR'S ARCADE CAB · SB16 STEREO
          </div>

          {/* Active Canvas Mount */}
          <div
            ref={mountRef}
            className="h-full w-full max-h-[58vh] aspect-[4/3] flex items-center justify-center"
          />

          {/* Loading Screen Overlay */}
          {bootState === 'loading' && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#131411] p-6 font-mono text-[#d6d4c5]">
              <div className="w-full max-w-[420px] space-y-2 border border-[#35362e] bg-[#1a1b17] p-4 text-[10px] leading-relaxed shadow-[4px_4px_0_#000]">
                <div className="flex items-center justify-between border-b border-[#35362e] pb-1.5 text-lime">
                  <span>AATIR'S ARCADE // MS-DOS 6.22 WASM KERNEL</span>
                  <span className="text-[9.5px] text-muted">SB16 DETECTED</span>
                </div>
                <div className="pt-1 text-[#aaa897]">
                  <p className="m-0">C:\&gt; MOUNT C {game.bundleUrl}</p>
                  <p className="m-0">Drive C mounted from WebAssembly VFS.</p>
                  <p className="m-0 text-pink">C:\&gt; CD {game.cartridgeCode || game.id.toUpperCase()}</p>
                  <p className="m-0 text-yellow">
                    C:\{game.cartridgeCode || game.id.toUpperCase()}\&gt; {game.executable}
                  </p>
                  <p className="m-0 text-lime animate-pulse">
                    Aatir's Arcade: Loading {game.title} ({game.size})...
                  </p>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden border border-line bg-canvas">
                  <div className="h-full w-3/4 animate-[pulse_1s_infinite] bg-lime" />
                </div>
              </div>
            </div>
          )}

          {/* Paused State Overlay */}
          {isPaused && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/75 p-6 font-mono backdrop-blur-[2px]">
              <div className="border border-yellow bg-[#1a1b17] p-5 text-center shadow-[4px_4px_0_#000]">
                <p className="text-[12px] font-bold text-yellow uppercase tracking-widest m-0">
                  // EMULATION PAUSED //
                </p>
                <p className="mt-1.5 text-[10px] text-[#dedccd] m-0">
                  WASM CPU & Sound Blaster 16 halted
                </p>
                <button
                  type="button"
                  onClick={togglePause}
                  className="mt-3 inline-flex items-center gap-1.5 border border-lime bg-lime/10 px-3 py-1.5 text-[10px] font-bold text-lime transition-all hover:bg-lime/20"
                >
                  <Play size={12} />
                  RESUME SESSION
                </button>
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
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#303129] pb-2 font-mono text-[9.5px] text-[#b5b3a3]">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-bold text-lime">CONTROLS:</span>
              {game.controls && game.controls.length > 0 ? (
                game.controls.map((ctrl, idx) => (
                  <span key={idx}>
                    <b className="text-yellow">[{ctrl.key}]</b> {ctrl.action}
                  </span>
                ))
              ) : (
                <span>
                  <b className="text-yellow">[ARROWS]</b> Move · <b className="text-yellow">[SPACE/CTRL]</b> Action
                </span>
              )}
            </div>
            <div className="text-[9px] text-muted">
              <span className="text-yellow font-medium">[CLICK CANVAS TO ENGAGE SB16 AUDIO & MOUSE]</span> · [ESC] TO UNLOCK
            </div>
          </div>

          <div className="flex items-center justify-between pt-1.5 font-mono text-[9.5px] text-muted">
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

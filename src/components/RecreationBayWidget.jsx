import { useEffect, useState } from 'react';
import { Gamepad2, Play, Flame, Disc, Layers, X, ChevronRight, Terminal } from 'lucide-react';
import PanelFrame from './PanelFrame.jsx';
import { retroGames } from '../data/games.js';

export default function RecreationBayWidget({ onLaunchGame, activeGame }) {
  const [selectedGameIndex, setSelectedGameIndex] = useState(0);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const game = retroGames[selectedGameIndex] || retroGames[0];

  // Synchronize workstation selection when ROM is switched in player modal
  useEffect(() => {
    if (activeGame) {
      const idx = retroGames.findIndex((g) => g.id === activeGame.id);
      if (idx !== -1) {
        setSelectedGameIndex(idx);
      }
    }
  }, [activeGame]);

  // Detect coarse pointers for mobile microcopy
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const coarseMedia = window.matchMedia('(pointer: coarse)');
      setIsTouchDevice(coarseMedia.matches);
      const handleMedia = (e) => setIsTouchDevice(e.matches);
      coarseMedia.addEventListener?.('change', handleMedia);
      return () => coarseMedia.removeEventListener?.('change', handleMedia);
    }
  }, []);

  // Catalog Modal Dialog Ergonomics: ESC key listener & body scroll locking
  useEffect(() => {
    if (!catalogOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setCatalogOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [catalogOpen]);

  const getAccentClass = (color, isActive) => {
    if (!isActive) return 'border-line-subtle bg-surface-inset text-muted hover:border-line hover:text-ink';
    switch (color) {
      case 'pink':
        return 'border-pink bg-pink/15 text-pink shadow-[2px_2px_0_#f9267240] font-semibold';
      case 'lime':
        return 'border-lime bg-lime/15 text-lime shadow-[2px_2px_0_#a6e22e40] font-semibold';
      case 'yellow':
        return 'border-yellow bg-yellow/15 text-yellow shadow-[2px_2px_0_#e6db7440] font-semibold';
      case 'violet':
        return 'border-violet bg-violet/15 text-violet shadow-[2px_2px_0_#ae81ff40] font-semibold';
      default:
        return 'border-lime bg-lime/15 text-lime font-semibold';
    }
  };

  return (
    <>
      <PanelFrame title="RECREATION_BAY" symbol="DOS">
        {/* CRT Terminal Screen Preview Inset */}
        <div className="relative overflow-hidden border-b border-line bg-surface-inset p-3 text-ink">
          {/* Ambient CRT Scanline Overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_50%,transparent_50%)] bg-[length:100%_4px] opacity-70"
          />

          {/* Top Telemetry / Status Row */}
          <div className="relative z-10 flex items-center justify-between font-mono text-[9.5px] tracking-wider text-muted">
            <span className="flex items-center gap-1.5 text-lime">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-lime" />
              AATIR'S ARCADE // WASM
            </span>
            <span className="text-muted-dim">
              ROM.ID // 0x{game.cartridgeCode} [{game.diskNumber}/07]
            </span>
          </div>

          {/* Simulated DOS Prompt / Game Badge */}
          <div className="relative z-10 mt-2 rounded border border-line-subtle bg-surface-card/90 px-2.5 py-2 font-mono text-[10px] leading-relaxed">
            <div className="flex items-center gap-1.5 text-muted truncate">
              <span className="text-pink">C:\GAMES\{game.cartridgeCode}&gt;</span>
              <span className="text-yellow font-medium">{game.executable}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[9.5px]">
              <span className="font-bold tracking-wide text-ink truncate mr-2">{game.title}</span>
              <span className="text-violet shrink-0">{game.year}</span>
            </div>
          </div>

          {/* Status Indicator Bar */}
          <div className="relative z-10 mt-2.5 flex items-center justify-between font-mono text-[9.5px] tracking-wide text-muted">
            <span className="flex items-center gap-1">
              <Flame size={10} className="text-pink" />
              {game.loreTag}
            </span>
            <span className="text-lime">{game.size}</span>
          </div>
        </div>

        {/* Tactile ROM Cartridge Rack */}
        <div className="border-b border-line bg-surface px-3 py-2">
          <div className="flex items-center justify-between pb-1.5 font-mono text-[9.5px] tracking-wider text-muted">
            <span className="flex items-center gap-1">
              <Disc size={9} className="text-yellow" />
              CARTRIDGE RACK [7 DISKS]
            </span>
            <button
              type="button"
              onClick={() => setCatalogOpen(true)}
              className="text-yellow hover:text-ink underline transition-colors"
            >
              CATALOG ↗
            </button>
          </div>
          {/* Responsive grid adjusted for desktop sidebar column */}
          <div className="grid grid-cols-4 min-[420px]:grid-cols-7 lg:grid-cols-4 xl:grid-cols-7 gap-1 font-mono text-[9px]">
            {retroGames.map((g, idx) => {
              const isActive = idx === selectedGameIndex;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGameIndex(idx)}
                  className={`relative flex flex-col items-center justify-center border px-1 py-1 transition-all after:absolute after:-inset-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow ${getAccentClass(
                    g.diskColor,
                    isActive
                  )}`}
                  title={`${g.title} (${g.year})`}
                >
                  <span className="text-[9.5px] tracking-wider opacity-85 font-mono">{g.diskNumber}</span>
                  <span className="truncate w-full text-center font-bold tracking-tight">{g.cartridgeCode}</span>
                </button>
              );
            })}
            {/* Slot 8: View all / Catalog shortcut in 4-column layout */}
            <button
              type="button"
              onClick={() => setCatalogOpen(true)}
              className="relative flex flex-col items-center justify-center border border-dashed border-line bg-surface-card px-1 py-1 font-mono text-[9px] text-yellow transition-all hover:border-yellow hover:bg-surface-well hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow min-[420px]:hidden lg:flex xl:hidden"
              title="Open Aatir's Arcade 7-disk catalog"
            >
              <span className="text-[9.5px] tracking-wider text-muted">VAULT</span>
              <span className="font-bold tracking-tight">ALL 7 ↗</span>
            </button>
          </div>
        </div>

        {/* Narrative & Lore Copy */}
        <div className="p-3">
          <p className="m-0 font-mono text-[10px] leading-[1.65] text-ink-secondary">
            {game.lore}
          </p>

          {/* Feature Badges */}
          <div className="mt-2.5 flex flex-wrap gap-1.5 font-mono text-[9px] text-muted">
            <span className="border border-line-subtle bg-surface-card px-1.5 py-0.5 text-lime">
              {game.genre}
            </span>
            <span className="border border-line-subtle bg-surface-card px-1.5 py-0.5 text-yellow">
              {game.telemetry}
            </span>
            <span className="border border-line-subtle bg-surface-card px-1.5 py-0.5 text-violet">
              {game.publisher}
            </span>
          </div>

          {/* Dual Action Controls: Launch + Catalog */}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => onLaunchGame(game)}
              className="flex min-h-[44px] flex-1 items-center justify-center gap-2 border border-lime bg-lime/10 px-3 py-2 font-mono text-[10.5px] font-semibold tracking-wider text-lime transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-lime hover:text-[#181915] hover:shadow-[3px_3px_0_#a6e22e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow active:translate-x-0 active:translate-y-0"
            >
              <Play size={13} className="fill-current" />
              <span>LAUNCH {game.executable}</span>
            </button>
            <button
              type="button"
              onClick={() => setCatalogOpen(true)}
              aria-label="View all 7 games in catalog"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center border border-line bg-surface-card text-ink-secondary transition-all hover:border-yellow hover:text-yellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
              title="Open Aatir's Arcade catalog"
            >
              <Layers size={14} />
            </button>
          </div>

          {/* Sub-footer microcopy */}
          <div className="mt-2 flex items-center justify-between font-mono text-[9px] text-muted">
            <span>CLICK-TO-PLAY · ZERO INSTALL</span>
            <span className={isTouchDevice ? 'text-yellow' : 'text-muted-dim'}>
              {isTouchDevice ? 'KEYBOARD RECOMMENDED' : 'DESKTOP READY'}
            </span>
          </div>
        </div>
      </PanelFrame>

      {/* Retro Arcade Catalog Modal / Full Library Drawer */}
      {catalogOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Aatir's Arcade Retro Games Catalog"
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
        >
          {/* Backdrop with click to close */}
          <div
            onClick={() => setCatalogOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 bg-canvas/80 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Panel */}
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-[620px] flex-col border border-line bg-surface shadow-[8px_8px_0_rgba(0,0,0,0.7)]">
            {/* Header */}
            <div className="flex h-[46px] items-center justify-between border-b border-line bg-surface px-4 font-mono text-[11px] text-ink">
              <span className="flex items-center gap-2">
                <Terminal size={14} className="text-lime" />
                <span>AATIR'S ARCADE // RETRO DOS VAULT [7 DISKS]</span>
              </span>
              <button
                type="button"
                onClick={() => setCatalogOpen(false)}
                aria-label="Close Arcade Catalog"
                className="grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center text-muted transition-colors hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
              >
                <X size={16} />
              </button>
            </div>

            {/* Catalog List */}
            <div className="overflow-y-auto p-4 space-y-3 font-mono">
              <p className="m-0 text-[10px] text-muted leading-relaxed">
                All 7 titles run directly in-browser using compiled WebAssembly DOSBox kernels and Sound Blaster 16 emulation. Zero downloads required.
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {retroGames.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-line-subtle bg-surface-inset p-3 transition-colors hover:border-line"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="border border-line bg-[#252620] px-1.5 py-0.5 text-lime font-bold">
                          DISK {item.diskNumber}
                        </span>
                        <span className="text-violet">{item.genre}</span>
                        <span className="text-muted">· {item.year}</span>
                      </div>
                      <h4 className="m-0 mt-1 text-[12px] font-bold text-ink">
                        {item.title}
                      </h4>
                      <p className="m-0 mt-0.5 text-[10px] text-[#dedccd] leading-normal">
                        {item.lore}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-2 text-[9px] text-[#9c9987]">
                        <span className="text-yellow">{item.telemetry}</span>
                        <span>· {item.size}</span>
                        <span>· {item.publisher}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGameIndex(idx);
                        setCatalogOpen(false);
                        onLaunchGame(item);
                      }}
                      className="flex min-h-[40px] items-center justify-center gap-1.5 border border-lime bg-lime/10 px-3 py-1.5 text-[10px] font-semibold text-lime transition-all hover:bg-lime hover:text-[#181915] active:translate-y-0.5 shrink-0"
                    >
                      <Play size={11} className="fill-current" />
                      <span>PLAY</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

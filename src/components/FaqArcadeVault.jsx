import { useState } from 'react';
import { Play, Disc, Terminal, Flame, Cpu, Sparkles, ChevronRight } from 'lucide-react';
import { retroGames } from '../data/games.js';
import { prefetchBundle } from '../utils/arcadeCache.js';

export default function FaqArcadeVault({ onLaunchGame }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeGame = retroGames[selectedIdx] || retroGames[0];

  const getDiskTheme = (color, isSelected) => {
    if (!isSelected) {
      return 'border-[#3e4036] bg-[#1a1b17] text-[#9c9987] hover:border-[#5a5c4e] hover:text-[#d6d4c5]';
    }
    switch (color) {
      case 'pink':
        return 'border-pink bg-pink/15 text-pink shadow-[2px_2px_0_#f9267240] font-bold';
      case 'lime':
        return 'border-lime bg-lime/15 text-lime shadow-[2px_2px_0_#a6e22e40] font-bold';
      case 'yellow':
        return 'border-yellow bg-yellow/15 text-yellow shadow-[2px_2px_0_#e6db7440] font-bold';
      case 'violet':
        return 'border-violet bg-violet/15 text-violet shadow-[2px_2px_0_#ae81ff40] font-bold';
      default:
        return 'border-lime bg-lime/15 text-lime font-bold';
    }
  };

  return (
    <div className="mt-4 border border-[#48493e] bg-[#1a1b17] shadow-[4px_4px_0_rgba(0,0,0,0.6)] font-mono">
      {/* Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#36372f] bg-[#22231e] px-3.5 py-2.5 text-[10px] text-muted">
        <div className="flex items-center gap-2 text-lime">
          <Terminal size={14} className="text-lime shrink-0" />
          <span className="font-bold tracking-wider">AATIR'S RECREATION BAY // 1990s WASM ARCHIVE</span>
        </div>
        <div className="flex items-center gap-3 text-[9px] text-[#8e8b78]">
          <span className="flex items-center gap-1">
            <Cpu size={11} className="text-violet" />
            <span>JS-DOS v7.49 · WASM</span>
          </span>
          <span className="hidden min-[480px]:inline text-[#55564c]">|</span>
          <span className="hidden min-[480px]:inline text-yellow">7 DISKS MOUNTED</span>
        </div>
      </div>

      {/* Cartridge Selection Rack */}
      <div className="border-b border-[#36372f] bg-[#171814] p-2.5 sm:p-3">
        <div className="mb-2 flex items-center justify-between text-[9px] tracking-wider text-[#88846f]">
          <span className="flex items-center gap-1.5 text-yellow">
            <Disc size={11} />
            <span>MOUNTED CARTRIDGES [SELECT DISK]</span>
          </span>
          <span className="text-[#a4a18e]">
            DISK {activeGame.diskNumber} / 07
          </span>
        </div>

        <div className="grid grid-cols-2 min-[420px]:grid-cols-4 sm:grid-cols-7 gap-1.5">
          {retroGames.map((game, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={game.id}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                onMouseEnter={() => prefetchBundle(game.bundleUrl)}
                onFocus={() => prefetchBundle(game.bundleUrl)}
                className={`flex min-h-[44px] flex-col items-center justify-center border px-2 py-1.5 text-center transition-all last:col-span-2 min-[420px]:last:col-span-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow ${getDiskTheme(
                  game.diskColor,
                  isSelected
                )}`}
                aria-pressed={isSelected}
                aria-label={`Select Disk ${game.diskNumber}: ${game.title}`}
              >
                <span className="text-[9.5px] tracking-wider opacity-85 font-mono">
                  DISK {game.diskNumber}
                </span>
                <span className="truncate w-full text-[10px] font-bold tracking-tight">
                  {game.cartridgeCode}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Game Preview & Launch Bay */}
      <div className="relative overflow-hidden p-3.5 sm:p-4 bg-[#1e1f1c]">
        {/* Subtle Scanline Overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_50%,transparent_50%)] bg-[length:100%_4px] opacity-60"
        />

        <div className="relative z-10">
          {/* Simulated DOS Prompt Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-[#3e4036] bg-[#161713] px-3 py-2 text-[10px]">
            <div className="flex items-center gap-2 truncate">
              <span className="text-pink">C:\ARCHIVE\{activeGame.cartridgeCode}&gt;</span>
              <span className="text-yellow font-bold">{activeGame.executable}</span>
            </div>
            <div className="flex items-center gap-2 text-[9.5px]">
              <span className="border border-line-subtle bg-[#252620] px-1.5 py-0.5 text-lime">
                {activeGame.genre}
              </span>
              <span className="text-violet font-semibold">{activeGame.year}</span>
            </div>
          </div>

          {/* Title & Lore Narrative */}
          <div className="mt-3">
            <h4 className="m-0 text-sm font-bold text-ink sm:text-[15px]">
              {activeGame.title}
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-[#d6d4c5] font-sans">
              {activeGame.lore}
            </p>
          </div>

          {/* Telemetry & Metadata Strip */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[9.5px] text-[#9c9987]">
            <span className="flex items-center gap-1 text-pink">
              <Flame size={11} />
              <span>{activeGame.loreTag}</span>
            </span>
            <span>·</span>
            <span className="text-yellow">{activeGame.telemetry}</span>
            <span>·</span>
            <span
              className={`font-semibold ${
                activeGame.audio?.status === 'sfx-only'
                  ? 'text-yellow'
                  : activeGame.audio?.status === 'pc-speaker'
                  ? 'text-violet'
                  : 'text-lime'
              }`}
              title={activeGame.audio?.note}
            >
              {activeGame.audio?.label || 'SOUND BLASTER 16'}
            </span>
            <span>·</span>
            <span className="text-lime">{activeGame.size}</span>
            <span>·</span>
            <span>{activeGame.publisher}</span>
          </div>

          {activeGame.audio?.note && (
            <div className="mt-2.5 flex items-center gap-1.5 border border-[#36372f] bg-[#141512] px-2.5 py-1 text-[9px]">
              <span
                className={`font-bold uppercase tracking-wider ${
                  activeGame.audio.status === 'sfx-only'
                    ? 'text-yellow'
                    : activeGame.audio.status === 'pc-speaker'
                    ? 'text-violet'
                    : 'text-lime'
                }`}
              >
                AUDIO ARCH:
              </span>
              <span className="text-[#b5b3a3]">{activeGame.audio.note}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              type="button"
              onClick={() => onLaunchGame?.(activeGame)}
              onMouseEnter={() => prefetchBundle(activeGame.bundleUrl)}
              onFocus={() => prefetchBundle(activeGame.bundleUrl)}
              className="flex min-h-[44px] flex-1 items-center justify-center gap-2 border border-lime bg-lime/15 px-4 py-2.5 text-xs font-bold tracking-wider text-lime transition-all hover:-translate-y-0.5 hover:bg-lime hover:text-[#181915] hover:shadow-[3px_3px_0_#a6e22e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow active:translate-y-0"
            >
              <Play size={14} className="fill-current shrink-0" />
              <span>BOOT {activeGame.executable} [IN-BROWSER]</span>
              <ChevronRight size={14} className="shrink-0" />
            </button>

            <div
              className="flex items-center justify-between sm:justify-start gap-3 border border-[#3e4036] bg-[#161713] px-3 py-2 text-[9px] text-[#88846f]"
              title={activeGame.audio?.note}
            >
              <span
                className={`flex items-center gap-1.5 ${
                  activeGame.audio?.status === 'sfx-only'
                    ? 'text-yellow'
                    : activeGame.audio?.status === 'pc-speaker'
                    ? 'text-violet'
                    : 'text-lime'
                }`}
              >
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full animate-pulse ${
                    activeGame.audio?.status === 'sfx-only'
                      ? 'bg-yellow'
                      : activeGame.audio?.status === 'pc-speaker'
                      ? 'bg-violet'
                      : 'bg-lime'
                  }`}
                />
                <span>{activeGame.audio?.label || 'SOUND BLASTER 16'}</span>
              </span>
              <span>·</span>
              <span className="text-[#bbb8a5]">ZERO INSTALLS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Gamepad2, Play, Flame } from 'lucide-react';
import PanelFrame from './PanelFrame.jsx';
import { retroGames } from '../data/games.js';

export default function RecreationBayWidget({ onLaunchGame }) {
  const [selectedGameIndex, setSelectedGameIndex] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const game = retroGames[selectedGameIndex] || retroGames[0];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const coarseMedia = window.matchMedia('(pointer: coarse)');
      setIsTouchDevice(coarseMedia.matches);
      const handleMedia = (e) => setIsTouchDevice(e.matches);
      coarseMedia.addEventListener?.('change', handleMedia);
      return () => coarseMedia.removeEventListener?.('change', handleMedia);
    }
  }, []);

  return (
    <PanelFrame title="RECREATION_BAY" icon={<Gamepad2 size={13} />}>
      {/* CRT Terminal Screen Preview Inset */}
      <div className="relative overflow-hidden border-b border-line bg-[#131411] p-3 text-ink">
        {/* Ambient CRT Scanline Overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_50%,transparent_50%)] bg-[length:100%_4px] opacity-70"
        />

        {/* Top Telemetry / Status Row */}
        <div className="relative z-10 flex items-center justify-between font-mono text-[8px] tracking-wider text-muted">
          <span className="flex items-center gap-1.5 text-lime">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_6px_#a6e22e]" />
            DOSBOX-WASM // 0.74
          </span>
          <span className="text-[#88846f]">ROM.ID // 0xDOOM</span>
        </div>

        {/* Simulated DOS Prompt / Game Badge */}
        <div className="relative z-10 mt-2 rounded border border-[#2a2b24] bg-[#1a1b17]/90 px-2.5 py-2 font-mono text-[10px] leading-relaxed">
          <div className="flex items-center gap-1.5 text-muted">
            <span className="text-pink">C:\GAMES\DOOM&gt;</span>
            <span className="text-yellow">{game.executable}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[8.5px]">
            <span className="font-bold tracking-wide text-ink">{game.title}</span>
            <span className="text-violet">{game.year}</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="relative z-10 mt-2.5 flex items-center justify-between font-mono text-[7.5px] tracking-wide text-[#a7a594]">
          <span className="flex items-center gap-1">
            <Flame size={10} className="text-pink" />
            STANDBY FOR DEMON SLAYING
          </span>
          <span className="text-lime">{game.size}</span>
        </div>
      </div>

      {/* Narrative & Lore Copy */}
      <div className="p-3">
        <p className="m-0 font-mono text-[9.5px] leading-[1.6] text-[#d6d4c5]">
          Compiling? Waiting for <span className="text-yellow font-semibold">`terraform plan`</span>? Take 5 minutes in 1993.
        </p>

        {/* Feature Badges */}
        <div className="mt-2.5 flex flex-wrap gap-1.5 font-mono text-[7.5px] text-muted">
          <span className="border border-[#3c3d34] bg-[#1a1b17] px-1.5 py-0.5 text-lime">
            WASM 60FPS
          </span>
          <span className="border border-[#3c3d34] bg-[#1a1b17] px-1.5 py-0.5 text-yellow">
            SB16 AUDIO
          </span>
          <span className="border border-[#3c3d34] bg-[#1a1b17] px-1.5 py-0.5 text-violet">
            SHAREWARE v1.9
          </span>
        </div>

        {/* Launch Trigger Button */}
        <button
          type="button"
          onClick={() => onLaunchGame(game)}
          className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 border border-lime bg-lime/10 px-3 py-2 font-mono text-[10px] font-semibold tracking-wider text-lime transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-lime hover:text-[#181915] hover:shadow-[3px_3px_0_#a6e22e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow active:translate-x-0 active:translate-y-0"
        >
          <Play size={13} className="fill-current" />
          <span>LAUNCH {game.executable}</span>
        </button>

        {/* Sub-footer microcopy */}
        <div className="mt-2 flex items-center justify-between font-mono text-[7px] text-[#88846f]">
          <span>CLICK-TO-PLAY · ZERO INSTALL</span>
          <span className={isTouchDevice ? 'text-yellow' : 'text-[#88846f]'}>
            {isTouchDevice ? 'DESKTOP KEYBOARD RECOMMENDED' : 'KEYBOARD REQUIRED'}
          </span>
        </div>
      </div>
    </PanelFrame>
  );
}

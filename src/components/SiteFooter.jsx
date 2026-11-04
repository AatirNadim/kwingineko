import { Terminal, Monitor } from 'lucide-react';

export default function SiteFooter({ onHome, onOpenCommandPalette, crtActive, onToggleCrt }) {
  return (
    <footer className="mb-5 mt-[10px] flex min-h-[49px] flex-wrap items-center justify-between gap-3 border-t border-line px-3 py-3 font-mono text-[10px] text-[#bbb8a5]">
      <div className="flex flex-wrap items-center gap-2.5">
        <span>© 2026 AATIR NADIM</span>
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="inline-flex min-h-[36px] items-center gap-1 border border-[#43443a] bg-[#1a1b18] px-2.5 py-1 text-[9.5px] text-[#c2c0af] transition hover:border-lime hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
        >
          <Terminal size={12} className="text-lime" />
          <span>⌘K PALETTE</span>
        </button>
        <button
          type="button"
          onClick={() => onToggleCrt?.(!crtActive)}
          className={`inline-flex min-h-[36px] items-center gap-1.5 border px-2.5 py-1 text-[9.5px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow ${
            crtActive
              ? 'border-lime bg-lime/15 text-lime font-semibold'
              : 'border-[#43443a] bg-[#1a1b18] text-[#939180] hover:text-ink hover:border-[#58594e]'
          }`}
        >
          <Monitor size={12} className={crtActive ? 'text-lime animate-pulse' : 'text-[#88846f]'} />
          <span>CRT FILTER: {crtActive ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      <span className="order-3 w-full text-center sm:order-none sm:w-auto">
        HAND-ASSEMBLED WITH <b className="font-medium text-lime">REACT</b> + VITE <span className="text-pink">♥</span>
      </span>

      <a
        href="#home"
        onClick={onHome}
        className="inline-flex min-h-[44px] items-center text-ink-secondary hover:text-lime hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
      >
        BACK TO TOP ↑
      </a>
    </footer>
  );
}

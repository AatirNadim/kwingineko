import { Terminal } from 'lucide-react';

export default function SiteFooter({ onHome, onOpenCommandPalette }) {
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
      </div>

      <a
        href="#home"
        onClick={onHome}
        className="inline-flex min-h-[44px] shrink-0 items-center text-ink-secondary hover:text-lime hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
      >
        BACK TO TOP ↑
      </a>
    </footer>
  );
}

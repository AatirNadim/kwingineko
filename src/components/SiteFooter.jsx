import { Terminal } from 'lucide-react';

const consoleCommands = [
  ['aatir.bio()', 'Professional overview'],
  ['aatir.skills()', 'Technical competencies'],
  ['aatir.resume()', 'Open résumé'],
  ['aatir.contact()', 'Contact details'],
  ['aatir.arcade()', 'Launch DOS arcade'],
  ['aatir.crt()', 'Toggle CRT effect'],
  ['aatir.konami()', 'Reveal the Konami Code'],
  ['aatir.cat()', 'Cat easter egg'],
  ["aatir.where('zoro')", 'Find the lost swordsman'],
];

export default function SiteFooter({ onHome, onOpenCommandPalette }) {
  return (
    <footer className="mb-2 mt-[10px] border-y border-line bg-surface/95 font-mono text-[10px] text-[#bbb8a5]">
      <div className="mx-auto flex min-h-[49px] w-[calc(100%-16px)] max-w-[1360px] flex-wrap items-center justify-between gap-3 px-3 py-3 min-[380px]:w-[calc(100%-24px)] sm:w-[calc(100%-32px)] md:w-[calc(100%-48px)] lg:w-[calc(100%-64px)]">
        <div className="flex flex-wrap items-center gap-2.5">
          <span>© 2026 AATIR NADIM</span>
          <details className="group relative">
            <summary className="inline-flex min-h-[36px] cursor-pointer list-none items-center gap-1 border border-[#43443a] bg-[#1a1b18] px-2.5 py-1 text-[9.5px] text-[#c2c0af] transition hover:border-lime hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow [&::-webkit-details-marker]:hidden">
              <Terminal size={12} className="text-lime" />
              <span>DEVTOOLS HELP</span>
            </summary>
            <div className="absolute bottom-full left-0 z-20 mb-2 w-[min(340px,calc(100vw-2rem))] border border-[#58594e] bg-[#1e1f1c] p-3 text-[10px] shadow-[0_12px_30px_rgba(0,0,0,0.75)] sm:left-auto sm:right-0">
              <p className="mb-2 text-[#c7c5b7]">Run <code className="text-yellow">aatir.help()</code> in the browser DevTools console.</p>
              <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                {consoleCommands.map(([command, description]) => (
                  <li key={command} className="min-w-0">
                    <code className="block truncate text-lime">{command}</code>
                    <span className="block text-[9px] text-[#88846f]">{description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </details>
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
      </div>
    </footer>
  );
}

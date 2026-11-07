import { Menu, X, Terminal, FileText, Monitor } from 'lucide-react';

export default function SiteHeader({
  time,
  navOpen,
  onToggleNavigation,
  onHome,
  onOpenCommandPalette,
  crtActive = false,
  onToggleCrt,
}) {
  return (
    <header className="border border-line bg-surface/95 shadow-panel-lg">
      <div className="flex h-[69px] items-center justify-between border-b border-line px-3 sm:px-6">
        <a href="#home" onClick={onHome} className="flex min-w-0 shrink items-center gap-2.5 sm:gap-3 text-ink no-underline hover:no-underline">
          <span className="shrink-0 border border-lime/50 px-[7px] py-[3px] font-mono text-[17px] font-bold tracking-[-2px] text-lime sm:text-[19px]">
            AN<span className="text-pink">_</span>
          </span>
          <div className="min-w-0">
            <span className="block font-mono text-[10px] font-semibold tracking-[1px] text-ink sm:text-xs">
              AATIR NADIM
            </span>
            <span className="mt-[2px] block truncate font-mono text-[9.5px] font-normal tracking-[.5px] text-muted sm:text-[10px]">
              PERSONAL SITE / ENGINEERING NOTES
            </span>
          </div>
        </a>

        {/* Action Controls: Mobile CRT Toggle + Mobile Command Trigger + Hamburger */}
        <div className="flex shrink-0 items-center gap-1.5 min-[360px]:gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => onToggleCrt?.(!crtActive)}
            aria-label={crtActive ? 'Deactivate retro CRT phosphor filter' : 'Activate retro CRT phosphor filter'}
            aria-pressed={crtActive}
            title={crtActive ? 'CRT Filter: ON' : 'CRT Filter: OFF'}
            className={`hidden min-[360px]:grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow ${
              crtActive
                ? 'border-lime bg-lime/10 text-lime'
                : 'border-line bg-surface text-muted hover:bg-focus hover:text-ink'
            }`}
          >
            <Monitor size={18} className={crtActive ? 'animate-pulse motion-reduce:animate-none text-lime' : ''} />
          </button>
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Open command palette"
            className="grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center border border-line bg-surface font-mono text-xs text-lime transition-colors hover:bg-focus focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow"
          >
            &gt;_
          </button>
          <button
            type="button"
            aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={navOpen}
            aria-controls="mobile-navigation-drawer"
            onClick={onToggleNavigation}
            className="grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center border border-line bg-surface text-ink transition-colors hover:bg-focus focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow"
          >
            {navOpen ? <X size={20} className="text-pink" /> : <Menu size={20} />}
          </button>
        </div>

        {/* Desktop Command Palette Badge + CRT Filter Toggle + Resume + Systems Motto */}
        <div className="hidden items-center gap-3 font-mono text-[10.5px] tracking-[.6px] text-ink-secondary lg:flex">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Open command palette (Cmd+K)"
            className="inline-flex min-h-[32px] items-center gap-1.5 border border-[#43443a] bg-[#1a1b18] px-2.5 py-1 text-[9.5px] text-[#c2c0af] transition hover:border-lime hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
          >
            <Terminal size={12} className="text-lime" />
            <span>COMMANDS</span>
            <kbd className="border border-[#4c4d42] bg-[#252621] px-1 text-[8.5px] text-ink">⌘K</kbd>
          </button>
          <button
            type="button"
            onClick={() => onToggleCrt?.(!crtActive)}
            aria-label={crtActive ? 'Deactivate retro CRT phosphor filter' : 'Activate retro CRT phosphor filter'}
            aria-pressed={crtActive}
            title={crtActive ? 'CRT Filter: ON' : 'CRT Filter: OFF'}
            className={`inline-flex min-h-[32px] items-center gap-1.5 border px-2.5 py-1 text-[9.5px] font-mono transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow ${
              crtActive
                ? 'border-lime bg-lime/15 text-lime font-semibold'
                : 'border-[#43443a] bg-[#1a1b18] text-[#c2c0af] hover:border-lime hover:text-lime'
            }`}
          >
            <Monitor size={12} className={crtActive ? 'text-lime animate-pulse motion-reduce:animate-none' : 'text-[#88846f]'} />
            <span>CRT: {crtActive ? 'ON' : 'OFF'}</span>
          </button>
          <a
            href="/Aatir_Nadim_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Resume PDF"
            className="inline-flex min-h-[32px] items-center gap-1.5 border border-[#43443a] bg-[#1a1b18] px-2.5 py-1 text-[9.5px] text-[#c2c0af] transition hover:border-lime hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
          >
            <FileText size={12} className="opacity-80" />
            <span>CV.PDF</span>
          </a>
          <div className="flex items-center gap-2">
            <span className="h-[7px] w-[7px] rounded-full bg-lime" /> SYSTEMS THINKING / ON PURPOSE
          </div>
        </div>
      </div>

      {/* Sub-bar: clean wrapping & responsive text for 320px+ viewports */}
      <div className="flex min-h-[36px] flex-wrap items-center justify-between gap-x-2 gap-y-1 bg-surface-card px-3 py-1.5 sm:h-[39px] sm:px-6 sm:py-0">
        <span className="truncate font-mono text-[9px] tracking-[.4px] text-ink-secondary min-[360px]:text-[9.5px] min-[420px]:tracking-[.5px] sm:text-[10.5px]">
          SOFTWARE ENGINEER <b className="px-1 text-pink">·</b> BACKEND / CLOUD / SYSTEMS
        </span>
        <span className="ml-auto font-mono text-[9px] tracking-[.55px] text-muted min-[360px]:text-[9.5px] sm:text-[10.5px]">
          {time.toLocaleDateString('en', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase()}
        </span>
      </div>
    </header>
  );
}

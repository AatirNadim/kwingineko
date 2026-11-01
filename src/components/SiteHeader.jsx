import { Menu, X } from 'lucide-react';

export default function SiteHeader({ time, navOpen, onToggleNavigation, onHome }) {
  return (
    <header className="border border-line bg-surface/95 shadow-[5px_5px_0_rgb(0_0_0_/_25%)]">
      <div className="flex h-[69px] items-center justify-between border-b border-line px-3 sm:px-6">
        <a href="#home" onClick={onHome} className="flex min-w-0 items-center gap-2.5 sm:gap-3 text-ink no-underline hover:no-underline">
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

        {/* 44x44px minimum tap target for hamburger toggle */}
        <button
          type="button"
          aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={navOpen}
          aria-controls="mobile-navigation-drawer"
          onClick={onToggleNavigation}
          className="grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center border border-line bg-surface text-ink transition-colors hover:bg-focus focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow lg:hidden"
        >
          {navOpen ? <X size={20} className="text-pink" /> : <Menu size={20} />}
        </button>

        <div className="hidden items-center gap-2 font-mono text-[10.5px] tracking-[.6px] text-[#d2d0bf] lg:flex">
          <span className="h-[7px] w-[7px] rounded-full bg-lime shadow-[0_0_9px_#a6e22e77]"/> SYSTEMS THINKING / ON PURPOSE
        </div>
      </div>

      {/* Sub-bar: clean wrapping & responsive text for 320px+ viewports */}
      <div className="flex min-h-[36px] flex-wrap items-center justify-between gap-x-2 gap-y-1 bg-gradient-to-r from-[#292a25] to-[#22231f] px-3 py-1.5 sm:h-[39px] sm:px-6 sm:py-0">
        <span className="truncate font-mono text-[9px] tracking-[.4px] text-[#cbc9b9] min-[360px]:text-[9.5px] min-[420px]:tracking-[.5px] sm:text-[10.5px]">
          SOFTWARE ENGINEER <b className="px-1 text-pink">·</b> BACKEND / CLOUD / SYSTEMS
        </span>
        <span className="ml-auto font-mono text-[9px] tracking-[.55px] text-violet min-[360px]:text-[9.5px] sm:text-[10.5px]">
          {time.toLocaleDateString('en', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase()}
        </span>
      </div>
    </header>
  );
}

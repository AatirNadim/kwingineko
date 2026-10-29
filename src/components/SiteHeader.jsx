import { Menu, X } from 'lucide-react';

export default function SiteHeader({ time, navOpen, onToggleNavigation, onHome }) {
  return (
    <header className="border border-line bg-surface/95 shadow-[5px_5px_0_rgb(0_0_0_/_25%)]">
      <div className="flex h-[69px] items-center justify-between border-b border-line px-3.5 sm:px-6">
        <a href="#home" onClick={onHome} className="flex items-center gap-3 text-ink no-underline hover:no-underline">
          <span className="border border-lime/50 px-[7px] py-[3px] font-mono text-[19px] font-bold tracking-[-2px] text-lime">AN<span className="text-pink">_</span></span>
          <span className="font-mono text-[10px] font-semibold tracking-[1px] sm:text-xs">AATIR NADIM<small className="mt-[3px] block text-[8px] font-normal tracking-[.5px] text-muted sm:text-[9px]">PERSONAL SITE / ENGINEERING NOTES</small></span>
        </a>
        <button aria-label={navOpen ? 'Close navigation' : 'Open navigation'} onClick={onToggleNavigation} className="grid h-[34px] w-[34px] place-items-center border border-line bg-transparent text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow lg:hidden">
          {navOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <div className="hidden items-center gap-2 font-mono text-[10px] tracking-[.55px] text-[#d2d0bf] lg:flex"><span className="h-[7px] w-[7px] rounded-full bg-lime shadow-[0_0_9px_#a6e22e77]"/> SYSTEMS THINKING / ON PURPOSE</div>
      </div>
      <div className="flex h-[39px] items-center justify-between bg-gradient-to-r from-[#292a25] to-[#22231f] px-3.5 sm:px-6">
        <span className="font-mono text-[8px] tracking-[.45px] text-[#cbc9b9] sm:text-[10px]">SOFTWARE ENGINEER <b className="px-1 text-pink">·</b> BACKEND / CLOUD / SYSTEMS</span>
        <span className="font-mono text-[8px] tracking-[.55px] text-violet sm:text-[10px]">{time.toLocaleDateString('en', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase()}</span>
      </div>
    </header>
  );
}

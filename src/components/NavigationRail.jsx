import { navigation } from '../data/portfolio.js';

export default function NavigationRail({ open, active, time, onNavigate }) {
  return (
    <aside className={`${open ? 'order-first block' : 'hidden'} min-h-0 border border-line bg-surface p-[9px] lg:order-none lg:flex lg:min-h-[calc(100vh-190px)] lg:flex-col lg:border-0 lg:border-r lg:border-[#4a4a40]/25 lg:bg-transparent lg:py-[10px] lg:pr-[14px] lg:pl-0`}>
      <div className="flex justify-between border-b border-line px-[10px] pb-[13px] font-mono text-[10px] tracking-[.55px] text-muted">DIRECTORY <span className="text-[#858372]">01—0{navigation.length}</span></div>
      <nav aria-label="Main navigation" className="grid grid-cols-2 gap-[3px] pt-[10px] lg:grid-cols-1">
        {navigation.map(([id, number, label]) => (
          <button key={id} onClick={() => onNavigate(id)} className={`group flex items-center gap-3 border px-[10px] py-[11px] text-left text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow ${active === id ? 'border-[#55564b] bg-focus text-ink' : 'border-transparent bg-transparent text-[#c7c5b7] hover:bg-focus hover:text-ink'}`}>
            <span className={`font-mono text-[10px] ${active === id ? 'text-pink' : 'text-[#858372]'}`}>{number}</span>{label}
            {active === id && <span className="ml-auto text-lime">↗</span>}
          </button>
        ))}
      </nav>
      <div className="mt-auto hidden md:block">
        <div className="flex items-center gap-[10px] border-y border-line px-[9px] py-[13px]">
          <div className="grid h-[31px] w-[31px] place-items-center bg-[#37382f] font-display text-[17px] font-semibold text-lime">a<span className="text-pink">.</span></div>
          <div><b className="block text-[11px]">Aatir Nadim</b><small className="mt-0.5 block font-mono text-[9px] text-muted">Engineer · builder</small></div>
        </div>
        <div className="px-[9px] py-[17px]">
          <span className="font-mono text-[9px] text-violet">/// CURRENT FOCUS</span>
          <p className="mb-0 mt-[7px] text-[11px] leading-[1.6] text-[#dedccd]">Making complex systems easier to understand, change, and operate.</p>
        </div>
        <div className="mx-[9px] flex items-center justify-between border-t border-dashed border-line py-[11px]">
          <span className="font-mono text-[9px] text-violet">LOCAL SESSION</span>
          <b className="font-mono text-xs font-medium text-yellow">{time.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</b>
        </div>
      </div>
    </aside>
  );
}

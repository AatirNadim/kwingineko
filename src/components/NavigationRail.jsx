import { useEffect } from 'react';
import { X } from 'lucide-react';
import { navigation } from '../data/portfolio.js';

export default function NavigationRail({ open, onClose, active, time, onNavigate }) {
  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <>
      {/* 1. Desktop Persistent Sticky Rail (>= 1024px) */}
      <aside className="hidden lg:flex lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-48px)] lg:min-h-[calc(100vh-190px)] lg:overflow-y-auto lg:flex-col lg:border-0 lg:border-r lg:border-[#4a4a40]/25 lg:bg-transparent lg:py-[10px] lg:pr-[14px] lg:pl-0 [scrollbar-width:thin] [scrollbar-color:#45463e_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#45463e] [&::-webkit-scrollbar-track]:bg-transparent">
        <div className="flex justify-between border-b border-line px-[10px] pb-[13px] font-mono text-[10.5px] tracking-wider text-muted">
          DIRECTORY <span className="text-[#9d9b89]">01—0{navigation.length}</span>
        </div>
        <nav aria-label="Main desktop navigation" className="grid grid-cols-1 gap-[3px] pt-[10px]">
          {navigation.map(([id, number, label], idx) => (
            <div key={id}>
              {idx === 5 && (
                <div className="my-2 border-t border-dashed border-line-subtle pt-2 px-[10px]">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted-dim">
                    CREDENTIALS &amp; NOTES
                  </span>
                </div>
              )}
              <button
                onClick={() => onNavigate(id)}
                className={`w-full group flex items-center gap-3 border border-l-2 px-[10px] py-[11px] text-left text-xs transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow ${
                  active === id
                    ? 'border-[#55564b] border-l-pink bg-focus text-ink font-semibold shadow-[2px_2px_0_rgba(0,0,0,0.3)]'
                    : 'border-transparent border-l-transparent bg-transparent text-[#c7c5b7] hover:border-line-subtle hover:border-l-transparent hover:bg-focus hover:text-ink'
                }`}
              >
                <span className={`font-mono text-[11px] ${active === id ? 'font-bold text-pink' : 'text-[#9d9b89]'}`}>
                  {number}
                </span>
                <span>{label}</span>
                {active === id && <span className="ml-auto text-lime">↗</span>}
              </button>
            </div>
          ))}
        </nav>
        <div className="mt-auto hidden md:block">
          <div className="flex items-center gap-[10px] border-y border-line px-[9px] py-[13px]">
            <div className="grid h-[31px] w-[31px] place-items-center bg-[#37382f] font-display text-[17px] font-semibold text-lime">
              a<span className="text-pink">.</span>
            </div>
            <div>
              <b className="block text-xs">Aatir Nadim</b>
              <small className="mt-0.5 block font-mono text-[10px] text-muted">engineer · builder</small>
            </div>
          </div>
          <div className="px-[9px] py-[17px]">
            <span className="font-mono text-[10px] font-semibold tracking-wider text-muted">/// CURRENT FOCUS</span>
            <p className="mb-0 mt-[7px] text-xs leading-[1.6] text-[#dedccd]">
              Making complex systems easier to understand, change, and operate.
            </p>
          </div>
          <div className="mx-[9px] flex items-center justify-between border-t border-dashed border-line py-[11px]">
            <span className="font-mono text-[10px] font-semibold tracking-wider text-muted">LOCAL SESSION</span>
            <b className="font-mono text-xs font-medium text-ink">
              {time.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
            </b>
          </div>
        </div>
      </aside>

      {/* 2. Mobile & Tablet Accessible Drawer Overlay (< 1024px) */}
      {open && (
        <div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation drawer"
          className="fixed inset-0 z-[100] flex items-start justify-center p-3 sm:p-6 lg:hidden"
        >
          {/* Backdrop with click-to-close */}
          <div
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-canvas/80 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="relative z-10 mt-2 flex max-h-[88vh] w-full max-w-[420px] flex-col border border-line bg-surface shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="flex h-[46px] items-center justify-between border-b border-line bg-[#292a25] px-3.5">
              <span className="font-mono text-[10.5px] tracking-wider text-muted">
                DIRECTORY <span className="text-[#9d9b89]">01—0{navigation.length}</span>
              </span>
              <button
                onClick={onClose}
                type="button"
                aria-label="Close navigation"
                className="grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center text-muted transition-colors hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation links with touch targets >= 44px */}
            <nav aria-label="Mobile navigation" className="overflow-y-auto p-3">
              <div className="grid grid-cols-1 gap-2">
                {navigation.map(([id, number, label], idx) => (
                  <div key={id}>
                    {idx === 5 && (
                      <div className="my-2 border-t border-dashed border-line-subtle pt-2 px-1">
                        <span className="font-mono text-[9.5px] uppercase tracking-wider text-muted-dim">
                          CREDENTIALS &amp; NOTES
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => onNavigate(id)}
                      className={`w-full flex min-h-[44px] items-center gap-3 border px-3.5 py-3 text-left text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow ${
                        active === id
                          ? 'border-pink bg-focus text-ink font-medium shadow-[2px_2px_0_#f9267240]'
                          : 'border-[#3f4037] bg-[#22231e] text-[#c7c5b7] hover:border-line hover:bg-focus hover:text-ink'
                      }`}
                    >
                      <span className={`font-mono text-[11px] font-bold ${active === id ? 'text-pink' : 'text-[#9d9b89]'}`}>
                        {number}
                      </span>
                      <span className="tracking-wide text-[13px]">{label}</span>
                      {active === id && <span className="ml-auto text-lime text-sm">↗</span>}
                    </button>
                  </div>
                ))}
              </div>

              {/* Drawer metadata footer */}
              <div className="mt-4 border-t border-dashed border-line pt-3 font-mono">
                <div className="flex items-center justify-between text-[10px] tracking-wider">
                  <span className="text-muted font-semibold">LOCAL SESSION</span>
                  <b className="font-mono text-xs font-medium text-ink">
                    {time.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                  </b>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

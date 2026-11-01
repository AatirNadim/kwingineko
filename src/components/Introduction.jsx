import { ArrowDownRight } from 'lucide-react';
import ParticlePortrait from './ParticlePortrait.jsx';

export default function Introduction({ onExplore }) {
  return (
    <section id="home" className="border-b border-line px-3 py-4 sm:px-[14px] sm:py-[18px] md:pl-5">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#35362e] pb-2.5 font-mono text-[10px] tracking-[1px] text-lime">
        <div className="flex items-center gap-[10px]">
          <span className="h-px w-[22px] bg-lime" />
          A LITTLE ABOUT HOW I WORK
        </div>
        <span className="hidden sm:inline font-mono text-[8px] tracking-wider text-[#88846f]">
          SYS.ID // 001
        </span>
      </div>

      {/* Main Grid: About-Me Content Side-by-Side with Particle Portrait */}
      <div className="mt-5 grid grid-cols-1 items-start gap-6 sm:mt-6 cq-split-intro">
        <div className="min-w-0">
          <h1 className="mb-[18px] font-display text-[clamp(28px,6vw,56px)] font-semibold leading-[1.04] tracking-[-1.5px] sm:tracking-[-2.5px] text-ink">
            I work across<br /><em className="not-italic text-pink">the whole system.</em>
          </h1>
          <p className="m-0 max-w-[580px] text-xs leading-[1.8] text-[#d0cebf] sm:text-sm sm:leading-[1.85]">
            I’m <span className="font-display text-lg font-bold text-pink sm:text-xl">Aatir</span> — a software engineer drawn to the spaces between services, infrastructure, and the people who rely on them. I trace data flows, investigate ambiguous behavior, and shape changes with compatibility, testing, and clear documentation in mind.
          </p>

          <div className="mt-[22px] flex flex-wrap items-center gap-3 sm:gap-[23px]">
            <button
              onClick={onExplore}
              className="inline-flex min-h-[44px] items-center gap-2 border border-pink bg-pink px-3 py-2.5 font-mono text-[9px] tracking-[.35px] text-[#201e1d] font-semibold transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#f9267270] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow sm:gap-[15px] sm:px-[13px]"
            >
              EXPLORE SELECTED WORK <ArrowDownRight size={15} />
            </button>
            <span className="font-mono text-[8px] leading-[1.8] tracking-[.55px] text-muted sm:text-[9px]">
              Backend systems<br />Cloud platforms<br />Developer tooling
            </span>
          </div>
        </div>

        {/* Interactive Particle Dispersion Portrait Component */}
        <aside aria-label="Interactive Portrait" className="mx-auto w-full max-w-[240px]">
          <ParticlePortrait />
        </aside>
      </div>

      {/* Footer Meter Strip */}
      <div className="mt-[26px] flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-[8.5px] tracking-[.4px] text-[#a7a494] sm:text-[9px]">
        <span>BUILDING WITH INTENTION</span>
        <div className="flex items-center gap-[3px]">
          {[6, 11, 15, 9, 15, 11, 6, 9].map((height, i) => (
            <i key={i} style={{ height }} className="w-[3px] bg-lime opacity-70" />
          ))}
        </div>
        <span className="ml-auto text-[#79786c]">NO. 001</span>
      </div>
    </section>
  );
}

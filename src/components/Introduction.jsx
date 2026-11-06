import { ArrowDownRight, FileText, ExternalLink } from 'lucide-react';
import ParticlePortrait from './ParticlePortrait.jsx';

export default function Introduction({ onExplore }) {
  return (
    <section id="home" className="border-b border-line px-3 py-6 sm:px-5 sm:py-8 md:pl-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-line-subtle pb-3 font-mono text-[11px] tracking-wider text-muted">
        <div className="flex items-center gap-[10px]">
          <span className="h-px w-[22px] bg-violet" />
          <span className="text-violet font-semibold">01 / OVERVIEW</span>
          <span className="text-muted-dim">//</span>
          <span className="text-ink-secondary">A LITTLE ABOUT HOW I WORK</span>
        </div>
      </div>

      {/* Main Grid: About-Me Content Side-by-Side with Particle Portrait */}
      <div className="mt-6 grid grid-cols-1 items-start gap-6 sm:gap-8 cq-split-intro">
        <div className="min-w-0">
          <h1 className="mb-4 font-display text-[clamp(28px,6vw,56px)] font-semibold leading-[1.05] tracking-[-1.5px] sm:tracking-[-2px] text-ink">
            <span className="sr-only">Aatir Nadim — Software Engineer &amp; Systems Workstation. </span>
            I work across<br /><em className="not-italic text-pink">the whole system.</em>
          </h1>
          <p className="m-0 max-w-[580px] font-sans text-sm leading-[1.85] text-ink-secondary">
            I’m <span className="font-display text-lg font-bold text-pink sm:text-xl">Aatir</span> — a software engineer drawn to the spaces between services, infrastructure, and the people who rely on them. I trace data flows, investigate ambiguous behavior, and shape changes with compatibility, testing, and clear documentation in mind.
          </p>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={onExplore}
              className="inline-flex min-h-[44px] items-center gap-2 border border-pink bg-pink px-4 py-2.5 font-mono text-xs sm:text-[12.5px] font-bold tracking-wide text-surface transition select-none hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#f9267270] active:translate-x-0 active:translate-y-0 active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow"
            >
              EXPLORE SELECTED WORK <ArrowDownRight size={15} />
            </button>
            <a
              href="/Aatir_Nadim_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 border border-line bg-surface px-4 py-2.5 font-mono text-xs sm:text-[12.5px] font-semibold tracking-wide text-ink-secondary transition select-none hover:border-lime hover:text-lime hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#a6e22e40] active:translate-x-0 active:translate-y-0 active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow"
            >
              <FileText size={14} className="opacity-80" />
              <span>RÉSUMÉ [PDF]</span>
              <ExternalLink size={12} className="text-muted-dim" />
            </a>
          </div>

          {/* Quiet domain tags */}
          <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-[10.5px] tracking-wider text-muted">
            <span className="text-muted-dim">FOCUS //</span>
            <span className="border border-line-subtle bg-surface px-2 py-0.5 text-ink-secondary">Backend Systems</span>
            <span className="text-muted-dim">·</span>
            <span className="border border-line-subtle bg-surface px-2 py-0.5 text-ink-secondary">Cloud Platforms</span>
            <span className="text-muted-dim">·</span>
            <span className="border border-line-subtle bg-surface px-2 py-0.5 text-ink-secondary">Developer Tooling</span>
          </div>
        </div>

        {/* Interactive Particle Dispersion Portrait Component */}
        <aside id="hero-portrait" aria-label="Interactive Portrait" className="mx-auto w-full max-w-[200px] sm:max-w-[240px]">
          <ParticlePortrait />
        </aside>
      </div>
    </section>
  );
}

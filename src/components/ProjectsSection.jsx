import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '../data/portfolio.js';
import SectionHeading from './SectionHeading.jsx';

export default function ProjectsSection() {
  const [expandedSpecs, setExpandedSpecs] = useState({});

  const toggleSpecs = (projectName) => {
    setExpandedSpecs((prev) => ({
      ...prev,
      [projectName]: !prev[projectName],
    }));
  };

  return (
    <section id="work" className="scroll-mt-6 border-b border-line px-3 py-6 sm:px-[14px] sm:py-8 md:pl-5">
      <SectionHeading index="02 / FIELD NOTES" title="Selected work" aside="03 PROJECTS" />
      <div className="grid gap-4">
        {projects.map((project) => {
          const isSpecsOpen = !!expandedSpecs[project.name];

          return (
            <article
              key={project.name}
              className="border border-line bg-surface-card p-3 shadow-panel transition-all duration-200 hover:-translate-y-0.5 hover:border-muted-dim sm:p-5"
            >
              {/* Top metadata strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-subtle pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10.5px] font-semibold text-violet tabular-nums">{project.number}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{project.kind}</span>
                </div>

                {/* Action Links Strip */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {project.links ? (
                    project.links.map((link) => (
                      <a
                        key={link.label}
                        aria-label={`${project.name} ${link.label}`}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex min-h-[44px] sm:min-h-[28px] items-center gap-1 border px-2.5 sm:px-2 py-1 sm:py-0.5 font-mono text-[11px] sm:text-[11.5px] font-semibold tracking-wide transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow ${
                          link.type === 'demo'
                            ? 'border-lime/60 bg-lime/5 text-lime hover:bg-lime/15 hover:border-lime'
                            : 'border-line bg-surface text-ink-secondary hover:border-lime hover:text-lime hover:bg-lime/10'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight size={12} className="opacity-80" />
                      </a>
                    ))
                  ) : (
                    <a
                      aria-label={`${project.name} repository on GitHub`}
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[44px] sm:min-h-[28px] items-center gap-1 border border-line bg-surface px-2.5 sm:px-2 py-1 sm:py-0.5 font-mono text-[11px] sm:text-[11.5px] font-semibold tracking-wide text-ink-secondary transition-colors hover:border-lime hover:text-lime hover:bg-lime/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow"
                    >
                      <span>SOURCE</span>
                      <ArrowUpRight size={12} />
                    </a>
                  )}
                </div>
              </div>

              {/* Main content grid */}
              <div className={`mt-3.5 grid gap-4 ${project.image ? 'cq-split-project' : ''}`}>
                <div className="flex flex-col min-w-0">
                  <h3 className="mb-1 font-display text-lg font-bold tracking-tight text-ink min-[380px]:text-xl sm:text-2xl break-words">
                    {project.name}
                  </h3>
                  <p className="m-0 font-sans text-[13px] sm:text-[14px] leading-relaxed text-ink-secondary">
                    {project.description}
                  </p>

                  {/* Scannable Problem / Contribution / Result Block */}
                  {(project.problem || project.contribution || project.result) && (
                    <div className="my-3.5 divide-y divide-line-subtle/50 border border-line-subtle bg-surface-inset/40 p-3 sm:p-3.5">
                      {project.problem && (
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-3 pb-2.5">
                          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted shrink-0 sm:w-32 select-none flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-muted-dim" />
                            Problem
                          </span>
                          <span className="font-sans text-[12.5px] sm:text-[13.5px] leading-relaxed text-ink-secondary">
                            {project.problem}
                          </span>
                        </div>
                      )}
                      {project.contribution && (
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-3 py-2.5">
                          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted shrink-0 sm:w-32 select-none flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-muted-dim" />
                            Contribution
                          </span>
                          <span className="font-sans text-[12.5px] sm:text-[13.5px] leading-relaxed text-ink-secondary">
                            {project.contribution}
                          </span>
                        </div>
                      )}
                      {project.result && (
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-3 pt-2.5">
                          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-lime shrink-0 sm:w-32 select-none flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-lime" />
                            Result
                          </span>
                          <span className="font-sans text-[12.5px] sm:text-[13.5px] leading-relaxed text-ink">
                            {project.result}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Progressive Disclosure Toggle Button */}
                  {(project.highlight || project.telemetry) && (
                    <div className="my-2">
                      <button
                        type="button"
                        onClick={() => toggleSpecs(project.name)}
                        aria-expanded={isSpecsOpen}
                        aria-controls={`specs-${project.name}`}
                        aria-label={
                          isSpecsOpen
                            ? `Hide architecture and telemetry for ${project.name}`
                            : `Expand architecture and telemetry for ${project.name}`
                        }
                        className="inline-flex min-h-[44px] sm:min-h-[32px] items-center gap-2 border border-line-subtle bg-surface-inset px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wide text-ink-secondary transition-all select-none hover:border-lime hover:text-lime hover:bg-lime/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow"
                      >
                        <span className="text-lime">{isSpecsOpen ? '▾' : '▸'}</span>
                        <span>
                          {isSpecsOpen
                            ? '[-] HIDE ARCHITECTURE & TELEMETRY'
                            : '[+] EXPAND ARCHITECTURE & TELEMETRY'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Expanded Drawer: Architecture Callout & Telemetry Table */}
                  {isSpecsOpen && (
                    <div id={`specs-${project.name}`} className="space-y-2.5 pb-1 animate-in fade-in duration-200">
                      {/* Architecture / Engineering Callout */}
                      {(project.highlight || project.lore) && (
                        <div className="border-l-2 border-l-lime border-y border-r border-line-subtle bg-surface-inset p-2.5 sm:p-3">
                          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                            <span className="text-lime">✦</span>
                            <span className="font-semibold text-ink">SYSTEM HIGHLIGHT</span>
                            <span className="text-muted-dim">//</span>
                            <span className="text-muted">{project.highlightTag || project.loreTag}</span>
                          </div>
                          <p className="mt-1.5 font-sans text-xs leading-relaxed text-ink-secondary sm:text-[12.5px]">
                            {project.highlight || project.lore}
                          </p>
                        </div>
                      )}

                      {/* System Telemetry & Packaging */}
                      {project.telemetry && (
                        <div className="border border-line-subtle bg-surface-inset p-2.5 font-mono text-[10px] leading-relaxed shadow-sm">
                          <div className="mb-1.5 flex items-center justify-between border-b border-line-subtle pb-1 font-mono text-[9.5px] uppercase tracking-wider text-muted">
                            <span className="flex items-center gap-1 font-semibold text-muted">
                              <span className="text-muted-dim">⚡</span>
                              <span>SYSTEM TELEMETRY &amp; PACKAGING</span>
                            </span>
                            <span className="text-muted-dim">ACTIVE</span>
                          </div>
                          <div className="grid gap-1">
                            {Object.entries(project.telemetry).map(([key, val]) => (
                              <div key={key} className="flex flex-col min-[480px]:flex-row min-[480px]:items-baseline gap-0.5 min-[480px]:gap-2">
                                <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted font-medium">
                                  {key.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase()}:
                                </span>
                                <span className="font-mono text-[10.5px] sm:text-[11px] text-ink-secondary min-w-0 break-words">
                                  {val}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tech stack & status badge */}
                  <div className="mt-auto pt-3 flex flex-col items-start justify-between gap-2.5 min-[480px]:flex-row min-[480px]:items-center">
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.map((item) => (
                        <span
                          key={item}
                          className="border border-line-subtle bg-surface px-2 py-0.5 font-mono text-[10px] text-ink-secondary transition-colors hover:border-line"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    <span className="flex items-center gap-1.5 whitespace-nowrap font-mono text-[10px] text-muted min-[480px]:ml-auto">
                      <i className="h-1.5 w-1.5 rounded-full bg-lime" />
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Pixel art frame */}
                {project.image && (
                  <div className="group/art overflow-hidden border border-line bg-surface-inset shadow-panel">
                    <div className="flex items-center justify-between border-b border-line-subtle bg-surface px-2 py-1 font-mono text-[9.5px] text-muted">
                      <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-lime" />
                        <span className="font-semibold tracking-wider text-ink">{project.name.toUpperCase()}.PNG</span>
                      </span>
                      <span className="text-[9.5px] tracking-wider text-muted">{project.status}</span>
                    </div>
                    <div className="relative overflow-hidden bg-[#181915] bg-[radial-gradient(#36372f_1px,transparent_1px)] [background-size:8px_8px]">
                      <picture>
                        <source
                          type="image/webp"
                          srcSet={project.image.replace(/\.(png|jpg|jpeg)$/, '.webp')}
                        />
                        <img
                          src={project.image}
                          alt={project.imageAlt}
                          loading="lazy"
                          decoding="async"
                          width="1376"
                          height="860"
                          className="aspect-[16/10] w-full object-cover [image-rendering:pixelated] transition-transform duration-300 ease-out group-hover/art:scale-[1.03]"
                        />
                      </picture>
                    </div>
                    {project.imageCaption && (
                      <div className="border-t border-line-subtle bg-surface-inset px-2.5 py-1.5 font-mono text-[11px] leading-snug text-ink-secondary">
                        <span className="text-muted-dim mr-1">►</span>
                        {project.imageCaption}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

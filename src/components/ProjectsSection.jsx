import { ArrowUpRight } from 'lucide-react';
import { projects } from '../data/portfolio.js';
import SectionHeading from './SectionHeading.jsx';

export default function ProjectsSection() {
  return (
    <section id="work" className="scroll-mt-4 border-b border-line px-3 py-6 sm:px-[14px] sm:py-8 md:pl-5">
      <SectionHeading index="02 / FIELD NOTES" title="Selected work" aside="03 PROJECTS" />
      <div className="grid gap-4">
        {projects.map((project) => (
          <article
            key={project.name}
            className="border border-line bg-surface-card p-3 shadow-panel transition-all duration-200 hover:-translate-y-0.5 hover:border-muted-dim sm:p-5"
          >
            {/* Top metadata strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-subtle pb-2.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10.5px] font-bold text-pink">{project.number}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{project.kind}</span>
              </div>

              {/* Action Links Strip */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {project.links ? (
                  project.links.map((link) => {
                    const badgeStyles = {
                      demo: 'border-lime/40 text-lime hover:border-lime hover:bg-lime/10',
                      docker: 'border-yellow/40 text-yellow hover:border-yellow hover:bg-yellow/10',
                      article: 'border-violet/40 text-violet hover:border-violet hover:bg-violet/10',
                      source: 'border-line text-ink-secondary hover:border-muted hover:text-white hover:bg-surface-inset',
                    };
                    const styleClass = badgeStyles[link.type] || badgeStyles.source;

                    return (
                      <a
                        key={link.label}
                        aria-label={`${project.name} ${link.label}`}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex min-h-[44px] sm:min-h-[28px] items-center gap-1 border bg-surface px-2.5 sm:px-2 py-1 sm:py-0.5 font-mono text-[10px] font-semibold tracking-wider transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow ${styleClass}`}
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight size={12} className="opacity-80" />
                      </a>
                    );
                  })
                ) : (
                  <a
                    aria-label={`${project.name} repository on GitHub`}
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[44px] sm:min-h-[28px] items-center gap-1 border border-line bg-surface px-2.5 sm:px-2 py-1 sm:py-0.5 font-mono text-[10px] text-yellow transition-colors hover:border-yellow hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
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
                <p className="m-0 text-xs leading-relaxed text-ink-secondary sm:text-[13px]">
                  {project.description}
                </p>

                {/* Architecture / Engineering Callout */}
                {(project.highlight || project.lore) && (
                  <div className="my-2.5 border-l-2 border-l-lime border-y border-r border-line-subtle bg-surface-inset p-2.5 sm:p-3">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                      <span className="text-lime">✦</span>
                      <span className="font-semibold text-ink">SYSTEM HIGHLIGHT</span>
                      <span className="text-muted-dim">//</span>
                      <span className="text-yellow">{project.highlightTag || project.loreTag}</span>
                    </div>
                    <p className="mt-1.5 font-sans text-xs leading-relaxed text-ink-secondary sm:text-[12.5px]">
                      {project.highlight || project.lore}
                    </p>
                  </div>
                )}

                {/* System Telemetry & Packaging */}
                {project.telemetry && (
                  <div className="my-2.5 border border-line-subtle bg-surface-inset p-2.5 font-mono text-[10px] leading-relaxed shadow-sm">
                    <div className="mb-1.5 flex items-center justify-between border-b border-line-subtle pb-1 font-mono text-[9.5px] uppercase tracking-wider text-muted">
                      <span className="flex items-center gap-1 text-violet font-semibold">
                        <span>⚡</span>
                        <span>SYSTEM TELEMETRY &amp; PACKAGING</span>
                      </span>
                      <span className="text-muted-dim">ACTIVE</span>
                    </div>
                    <div className="grid gap-1">
                      {Object.entries(project.telemetry).map(([key, val]) => (
                        <div key={key} className="flex flex-col min-[480px]:flex-row min-[480px]:items-baseline gap-0.5 min-[480px]:gap-2">
                          <span className="shrink-0 font-mono text-[9.5px] uppercase tracking-wider text-muted font-medium">
                            {key.replace(/([A-Z])/g, ' $1')}:
                          </span>
                          <span className="font-mono text-[9.5px] sm:text-[10px] text-ink-secondary min-w-0 break-words">
                            {val}
                          </span>
                        </div>
                      ))}
                    </div>
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
                  <div className="relative overflow-hidden bg-black/50">
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
                    <div className="border-t border-line-subtle bg-surface-inset px-2.5 py-1.5 font-mono text-[9.5px] leading-snug text-ink-secondary">
                      <span className="text-violet mr-1">►</span>
                      {project.imageCaption}
                    </div>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

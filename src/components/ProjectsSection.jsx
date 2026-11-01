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
            className="border border-line bg-surface-card p-3 shadow-panel transition-all duration-200 hover:-translate-y-0.5 hover:border-line sm:p-5"
          >
            {/* Top metadata strip */}
            <div className="flex flex-wrap items-center gap-2 border-b border-line-subtle pb-2.5">
              <span className="font-mono text-[10.5px] font-bold text-pink">{project.number}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{project.kind}</span>
              <a
                aria-label={`${project.name} repository on GitHub`}
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="ml-auto inline-flex min-h-[44px] min-w-[44px] items-center justify-end gap-1 -my-2.5 -mr-1 p-2 font-mono text-[10px] text-yellow transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
              >
                <span className="hidden text-[10px] text-muted min-[440px]:inline">SOURCE</span>
                <ArrowUpRight size={16} />
              </a>
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

                {/* Lore callout */}
                {project.lore && (
                  <div className="my-3 border-l-2 border-l-pink border-y border-r border-line-subtle bg-surface-inset p-2.5 sm:p-3">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-violet">
                      <span className="text-pink">✦</span>
                      <span>lore transmission</span>
                      <span className="text-muted-dim">//</span>
                      <span className="text-lime">{project.loreTag}</span>
                    </div>
                    <p className="mt-1 font-sans text-xs italic leading-relaxed text-yellow">
                      &ldquo;{project.lore}&rdquo;
                    </p>
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
                    <span className="text-[9px] tracking-wider text-muted">{project.status}</span>
                  </div>
                  <div className="relative overflow-hidden bg-black/50">
                    <img
                      src={project.image}
                      alt={project.imageAlt}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover [image-rendering:pixelated] transition-transform duration-300 ease-out group-hover/art:scale-[1.03]"
                    />
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

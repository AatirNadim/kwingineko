import { experience } from '../data/portfolio.js';
import SectionHeading from './SectionHeading.jsx';

export default function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-6 border-b border-line px-3 py-6 sm:px-[14px] sm:py-8 md:pl-5">
      <SectionHeading index="03 / THE PATH HERE" title="Experience" />
      <div className="ml-2.5 sm:ml-3 mt-6 border-l border-line">
        {experience.map((item, i) => (
          <article key={`${item.org}-${item.role}`} className="relative pb-8 pl-5 sm:pl-[24px] last:pb-2">
            <span className="absolute -left-[9px] top-px grid h-[17px] w-[17px] place-items-center border border-violet bg-canvas font-mono text-[9.5px] font-bold text-violet">
              0{i + 1}
            </span>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="font-semibold text-yellow tracking-wide">{item.date}</span>
              {item.location && (
                <>
                  <span className="text-muted-dim">//</span>
                  <span className="text-muted text-[11px]">{item.location}</span>
                </>
              )}
            </div>
            <h3 className="mb-0.5 mt-1 font-display text-base font-bold text-ink sm:text-lg">{item.role}</h3>
            <div className="mt-2 flex items-center gap-2.5">
              <img
                src={item.logo}
                alt={item.logoAlt}
                className="h-9 w-14 shrink-0 object-contain"
                loading="lazy"
              />
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs sm:text-[13px]">
                <span className="font-semibold text-lime">{item.org}</span>
                {item.team && (
                  <>
                    <span className="text-muted-dim">·</span>
                    <span className="text-muted text-[11.5px]">{item.team}</span>
                  </>
                )}
              </div>
            </div>
            <ul className="mb-0 mt-2 max-w-[680px] list-disc space-y-1 pl-4 font-sans text-xs leading-relaxed text-ink-secondary marker:text-yellow sm:text-[13px]">
              {item.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            {item.stack && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.stack.map((tech) => (
                  <span
                    key={tech}
                    className="border border-line-subtle bg-surface px-1.5 py-0.5 font-mono text-[10.5px] text-muted font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
      <p className="mb-0 ml-2.5 sm:ml-3 mt-4 border-t border-dashed border-line pt-[10px] font-mono text-[10px] text-muted sm:text-[10.5px]">
        Selected contributions across backend services, cloud platforms, and delivery systems.
      </p>
    </section>
  );
}

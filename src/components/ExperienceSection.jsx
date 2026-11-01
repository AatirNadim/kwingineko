import { experience } from '../data/portfolio.js';
import SectionHeading from './SectionHeading.jsx';

export default function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-4 border-b border-line px-3 py-6 sm:px-[14px] sm:py-8 md:pl-5">
      <SectionHeading index="03 / THE PATH HERE" title="Experience" />
      <div className="ml-2.5 sm:ml-3 mt-5 border-l border-[#616154]">
        {experience.map((item, i) => (
          <article key={item.org} className="relative pb-6 pl-5 sm:pl-[21px] last:pb-1">
            <span className="absolute -left-[9px] top-px grid h-[17px] w-[17px] place-items-center border border-violet bg-canvas font-mono text-[9.5px] font-bold text-violet">
              0{i + 1}
            </span>
            <div className="font-mono text-[10px] text-yellow sm:text-[10.5px]">{item.date}</div>
            <h3 className="mb-px mt-1 font-display text-base font-semibold text-ink">{item.role}</h3>
            <div className="font-mono text-xs font-medium text-lime">{item.org}</div>
            <p className="mb-0 mt-[7px] max-w-[640px] text-xs leading-[1.7] text-[#c7c5b7]">{item.note}</p>
          </article>
        ))}
      </div>
      <p className="mb-0 ml-2.5 sm:ml-3 mt-4 border-t border-dashed border-line pt-[10px] font-mono text-[10px] text-[#b8b6a3] sm:text-[10.5px]">
        Selected themes from documented work. Delivery and impact are described conservatively.
      </p>
    </section>
  );
}

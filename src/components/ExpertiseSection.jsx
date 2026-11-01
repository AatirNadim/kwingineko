import { expertise } from '../data/portfolio.js';
import SectionHeading from './SectionHeading.jsx';

export default function ExpertiseSection() {
  return (
    <section id="expertise" className="scroll-mt-4 px-3 py-6 sm:px-[14px] sm:py-8 md:pl-5">
      <SectionHeading index="04 / TOOLS OF THE TRADE" title="Areas I work in" />
      <div className="border-t border-line">
        {expertise.map(([group, items], i) => (
          <div
            key={group}
            className="grid grid-cols-1 gap-1 border-b border-line/80 px-1 py-3 min-[440px]:grid-cols-[27px_120px_1fr] min-[440px]:items-center min-[440px]:gap-2"
          >
            <div className="flex items-center gap-2 min-[440px]:contents">
              <span className="font-mono text-[10px] font-semibold text-violet sm:text-[10.5px]">0{i + 1}</span>
              <span className="font-mono text-[10px] font-semibold text-yellow sm:text-[10.5px]">{group}</span>
            </div>
            <span className="text-[11px] leading-[1.6] text-ink-secondary sm:text-xs">{items}</span>
          </div>
        ))}
      </div>
      <div className="relative mt-5 border-l-2 border-lime bg-surface py-3 pl-7 pr-3 sm:pl-[35px] sm:pr-[17px]">
        <span className="absolute left-2.5 top-0 font-display text-[32px] text-lime sm:left-3 sm:top-1 sm:text-[34px]">“</span>
        <p className="m-0 font-display text-[13px] font-medium leading-[1.6] text-ink sm:text-sm">
          Start with the evidence. Map the edges. Make the change understandable for the next person, too.
        </p>
        <span className="mt-2 block font-mono text-[9.5px] tracking-wider text-muted sm:text-[10px]">
          A WORKING PRINCIPLE
        </span>
      </div>
    </section>
  );
}

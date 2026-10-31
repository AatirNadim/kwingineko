import { expertise } from '../data/portfolio.js';
import SectionHeading from './SectionHeading.jsx';

export default function ExpertiseSection() {
  return (
    <section id="expertise" className="scroll-mt-4 px-3 py-6 sm:px-[14px] sm:py-8 md:pl-5">
      <SectionHeading index="03 / TOOLS OF THE TRADE" title="Areas I work in" />
      <div className="border-t border-line">
        {expertise.map(([group, items], i) => (
          <div
            key={group}
            className="grid grid-cols-1 gap-1 border-b border-line/80 px-1 py-3 min-[440px]:grid-cols-[27px_120px_1fr] min-[440px]:items-center min-[440px]:gap-2"
          >
            <div className="flex items-center gap-2 min-[440px]:contents">
              <span className="font-mono text-[8.5px] text-violet sm:text-[9px]">0{i + 1}</span>
              <span className="font-mono text-[8.5px] font-medium text-yellow sm:text-[9px]">{group}</span>
            </div>
            <span className="text-[10px] leading-[1.5] text-[#d6d4c5] sm:text-[11px]">{items}</span>
          </div>
        ))}
      </div>
      <div className="relative mt-5 border-l-2 border-lime bg-surface py-3 pl-7 pr-3 sm:pl-[35px] sm:pr-[17px]">
        <span className="absolute left-2.5 top-0 font-display text-[32px] text-lime sm:left-3 sm:top-1 sm:text-[34px]">“</span>
        <p className="m-0 font-display text-[12px] font-medium leading-[1.6] text-[#e7e5d7] sm:text-[13px]">
          Start with the evidence. Map the edges. Make the change understandable for the next person, too.
        </p>
        <span className="mt-2 block font-mono text-[7.5px] tracking-[.55px] text-[#a5a392] sm:text-[8px]">
          A WORKING PRINCIPLE
        </span>
      </div>
    </section>
  );
}

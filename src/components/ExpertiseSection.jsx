import { expertise } from '../data/portfolio.js';
import SectionHeading from './SectionHeading.jsx';

export default function ExpertiseSection() {
  return (
    <section id="expertise" className="scroll-mt-4 px-[7px] py-6 sm:px-[14px] sm:py-8 md:pl-5">
      <SectionHeading index="03 / TOOLS OF THE TRADE" title="Areas I work in"/>
      <div className="border-t border-line">
        {expertise.map(([group, items], i) => (
          <div key={group} className="grid grid-cols-[22px_104px_1fr] items-center gap-[5px] border-b border-line/80 px-1 py-3 sm:grid-cols-[27px_127px_1fr] sm:gap-2">
            <span className="font-mono text-[8px] text-violet sm:text-[9px]">0{i + 1}</span><span className="font-mono text-[8px] text-yellow sm:text-[9px]">{group}</span><span className="text-[10px] leading-[1.5] text-[#d6d4c5] sm:text-[11px]">{items}</span>
          </div>
        ))}
      </div>
      <div className="relative mt-[21px] border-l-2 border-lime bg-surface py-[13px] pl-[35px] pr-[17px]">
        <span className="absolute left-3 top-1 font-display text-[34px] text-lime">“</span>
        <p className="m-0 font-display text-[13px] font-medium leading-[1.6] text-[#e7e5d7]">Start with the evidence. Map the edges. Make the change understandable for the next person, too.</p>
        <span className="mt-2 block font-mono text-[8px] tracking-[.55px] text-[#a5a392]">A WORKING PRINCIPLE</span>
      </div>
    </section>
  );
}

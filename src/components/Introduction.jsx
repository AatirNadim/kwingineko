import { ArrowDownRight } from 'lucide-react';

export default function Introduction({ onExplore }) {
  return (
    <section id="home" className="border-b border-line px-[7px] py-[13px] sm:px-[14px] sm:py-[18px] md:pl-5">
      <div className="flex items-center gap-[10px] font-mono text-[10px] tracking-[1px] text-lime"><span className="h-px w-[22px] bg-lime"/>A LITTLE ABOUT HOW I WORK</div>
      <h1 className="mb-[18px] mt-[25px] font-display text-[clamp(43px,9vw,68px)] font-semibold leading-[.99] tracking-[-3px] text-ink">I work across<br/><em className="not-italic text-pink">the whole system.</em></h1>
      <p className="m-0 max-w-[620px] text-sm leading-[1.85] text-[#d0cebf]">I’m <span className="bg-gradient-to-r from-pink via-yellow to-lime bg-clip-text font-display text-lg font-bold text-transparent sm:text-xl">Aatir</span> — a software engineer drawn to the spaces between services, infrastructure, and the people who rely on them. I trace data flows, investigate ambiguous behavior, and shape changes with compatibility, testing, and clear documentation in mind.</p>
      <div className="mt-[23px] flex items-center gap-3 sm:gap-[23px]">
        <button onClick={onExplore} className="inline-flex items-center gap-2 border border-pink bg-pink px-[10px] py-[10px] font-mono text-[8px] tracking-[.35px] text-[#201e1d] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#f9267270] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow sm:gap-[15px] sm:px-[13px] sm:text-[9px]">EXPLORE SELECTED WORK <ArrowDownRight size={15}/></button>
        <span className="font-mono text-[8px] leading-[1.9] tracking-[.55px] text-muted sm:text-[9px]">Backend systems<br/>Cloud platforms<br/>Developer tooling</span>
      </div>
      <div className="mt-[26px] flex items-center gap-3 font-mono text-[9px] tracking-[.4px] text-[#a7a494]"><span>BUILDING WITH INTENTION</span><div className="flex items-center gap-[3px]">{[6, 11, 15, 9, 15, 11, 6, 9].map((height, i) => <i key={i} style={{ height }} className="w-[3px] bg-lime opacity-70"/>)}</div><span className="ml-auto text-[#79786c]">NO. 001</span></div>
    </section>
  );
}

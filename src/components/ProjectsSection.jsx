import { ArrowUpRight } from 'lucide-react';
import { projects } from '../data/portfolio.js';
import SectionHeading from './SectionHeading.jsx';

export default function ProjectsSection() {
  return (
    <section id="work" className="scroll-mt-4 border-b border-line px-[7px] py-6 sm:px-[14px] sm:py-8 md:pl-5">
      <SectionHeading index="01 / FIELD NOTES" title="Selected work" aside="03 PROJECTS"/>
      <div className="grid gap-[9px]">
        {projects.map((project) => (
          <article key={project.name} className="border border-line bg-[#20211e] p-[14px] transition hover:-translate-y-0.5 hover:border-[#797a61] sm:p-4">
            <div className="flex items-center gap-[10px]"><span className="font-mono text-[10px] text-pink">{project.number}</span><span className="font-mono text-[9px] text-muted">{project.kind}</span><a aria-label={`${project.name} repository on GitHub`} href={project.href} target="_blank" rel="noreferrer" className="ml-auto p-1 text-yellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"><ArrowUpRight size={17}/></a></div>
            <h3 className="mb-[5px] mt-2 font-display text-xl font-semibold tracking-[-.3px]">{project.name}</h3>
            <p className="m-0 max-w-[690px] text-[11px] leading-[1.7] text-[#c8c6b7] sm:text-xs">{project.description}</p>
            <div className="mt-3 flex flex-col items-start justify-between gap-[9px] min-[480px]:flex-row min-[480px]:items-center">
              <div className="flex flex-wrap gap-[5px]">{project.stack.map((item) => <span key={item} className="border border-[#4e4f45] bg-[#292a25] px-[6px] py-[3px] font-mono text-[9px] text-[#d6d3c4]">{item}</span>)}</div>
              <span className="ml-auto flex items-center gap-[6px] whitespace-nowrap font-mono text-[8px] text-[#a9a796]"><i className="h-[5px] w-[5px] rounded-full bg-lime shadow-[0_0_8px_#a6e22e77]"/>{project.status}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

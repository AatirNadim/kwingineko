import { ArrowUpRight, Globe2 } from 'lucide-react';
import { socials } from '../data/portfolio.js';
import PanelFrame from './PanelFrame.jsx';

export default function SocialLinks() {
  return (
    <PanelFrame title="ELSEWHERE" icon={<Globe2 size={13} />}>
      <ul className="grid gap-1 p-[8px]">
        {socials.map((social) => (
          <li key={social.name}>
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[40px] min-w-0 items-center gap-2 border border-transparent px-2 py-1.5 text-ink no-underline transition-colors hover:border-line hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
            >
              <span aria-hidden="true" className="grid h-[25px] w-[25px] shrink-0 place-items-center border border-pink/50 font-mono text-[9px] text-pink group-hover:bg-pink group-hover:text-surface">
                {social.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <b className="block truncate font-mono text-[9px] font-medium text-[#e9e7d8]">{social.name}</b>
                <span className="block truncate font-mono text-[8px] text-muted">{social.handle}</span>
              </span>
              <ArrowUpRight aria-hidden="true" size={13} className="shrink-0 text-yellow opacity-60 group-hover:opacity-100" />
            </a>
          </li>
        ))}
      </ul>
    </PanelFrame>
  );
}

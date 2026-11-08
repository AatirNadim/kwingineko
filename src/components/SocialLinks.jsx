import { ArrowUpRight } from 'lucide-react';
import { socials } from '../data/portfolio.js';
import PanelFrame from './PanelFrame.jsx';
import PixelIcon from './PixelIcon.jsx';

export default function SocialLinks() {
  return (
    <PanelFrame title="ELSEWHERE" symbol="EXT">
      <ul className="grid gap-1 p-[8px]">
        {socials.map((social) => (
          <li key={social.name}>
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`${social.name} — ${social.handle}`}
              className="group flex min-h-[44px] sm:min-h-[40px] min-w-0 items-center gap-2 border border-transparent px-2 py-1.5 text-ink no-underline transition-colors hover:border-line hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
            >
              <span
                aria-hidden="true"
                className="grid h-[26px] w-[26px] shrink-0 place-items-center border border-line-subtle bg-surface-well transition-colors duration-150 group-hover:border-lime group-hover:bg-lime/10"
              >
                {social.logo ? (
                  <img
                    src={social.logo}
                    alt=""
                    aria-hidden="true"
                    className="h-[20px] w-[20px] object-contain transition-transform duration-150 group-hover:scale-110"
                  />
                ) : (
                  <PixelIcon
                    name={social.icon || social.name}
                    size={16}
                    className="transition-transform duration-150 group-hover:scale-110"
                  />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <b className="block truncate font-mono text-[10.5px] font-medium text-ink">{social.name}</b>
                <span className="block truncate font-mono text-[9.5px] text-muted">{social.handle}</span>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                size={13}
                className="shrink-0 text-muted-dim transition-all duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-lime"
              />
            </a>
          </li>
        ))}
      </ul>
    </PanelFrame>
  );
}

import { Radio } from 'lucide-react';
import readingConfig from '../reading.config.json';
import PanelFrame from './PanelFrame.jsx';

const { topics: readingTopics, maxSelectedTopics } = readingConfig;

export default function ReadingWidget({ topic, selectedTopicIds, onTopicChange, onToggleTopic }) {
  const selectedTopics = readingTopics.filter((item) => selectedTopicIds.includes(item.id));
  const selected = selectedTopics.find((item) => item.id === topic) ?? selectedTopics[0];
  const hasSources = selected?.feeds.length > 0;

  return (
    <PanelFrame title="READING_RADIO" icon={<Radio size={13}/> }>
      <div className="mb-[9px] ml-[10px] mt-3 font-mono text-[8px] tracking-[.55px] text-[#aaa897]">A FEW THINGS TO FOLLOW</div>
      <details className="group mx-2 mb-2 border border-line bg-[#242520]">
        <summary className="flex cursor-pointer list-none items-center justify-between px-[8px] py-[7px] font-mono text-[8px] text-[#c4c2b3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow">
          <span>DISPLAY TOPICS <span className="text-lime">{selectedTopics.length}/{maxSelectedTopics}</span></span>
          <span aria-hidden="true" className="text-yellow group-open:rotate-180">⌄</span>
        </summary>
        <div role="group" aria-label="Choose topics to display" className="grid gap-[2px] border-t border-line p-1">
          {readingTopics.map((item) => {
            const checked = selectedTopicIds.includes(item.id);
            const atLimit = selectedTopicIds.length >= maxSelectedTopics;
            return <label key={item.id} className={`flex cursor-pointer items-center gap-2 px-[6px] py-[5px] text-[9px] ${checked ? 'text-ink' : 'text-[#c4c2b3]'}`}>
              <input type="checkbox" checked={checked} disabled={!checked && atLimit} onChange={() => onToggleTopic(item.id)} className="accent-yellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"/>
              {item.label}
              {item.feeds.length === 0 && <span className="ml-auto font-mono text-[7px] text-[#aaa897]">NO SOURCES</span>}
            </label>;
          })}
        </div>
      </details>
      {selected ? <>
        <div role="tablist" aria-label="Displayed reading topics" className="flex flex-wrap gap-[3px] px-2">
          {selectedTopics.map((item) => <button key={item.id} role="tab" aria-selected={selected.id === item.id} onClick={() => onTopicChange(item.id)} className={`border px-[6px] py-[5px] text-[9px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-yellow ${selected.id === item.id ? 'border-[#57584b] bg-focus text-ink' : 'border-transparent bg-transparent text-[#c4c2b3] hover:bg-[#34352e]'}`}>{item.label}</button>)}
        </div>
        <div className="m-2 border border-dashed border-[#595a4d] bg-[#242520] px-[11px] py-[14px]">
          <Radio size={17} className="mb-[6px] text-violet"/>
          <b className="block font-display text-xs font-medium">{selected.label}</b>
          <p className="mb-[10px] mt-[5px] text-[10px] leading-[1.55] text-[#bebbab]">{hasSources ? 'Feed sources are configured; headlines will appear after the feed aggregator is connected.' : 'No feed sources yet. Add RSS or Atom URLs to this topic in reading.config.json.'}</p>
          <span className="flex items-center gap-[6px] font-mono text-[7px] text-[#c9c7b9]"><i className="h-[5px] w-[5px] rounded-full bg-yellow"/>{hasSources ? 'AGGREGATOR NOT CONNECTED' : 'SOURCES NOT CONFIGURED'}</span>
        </div>
      </> : <div className="m-2 border border-dashed border-[#595a4d] px-[11px] py-[14px] text-[10px] leading-[1.55] text-[#bebbab]">Choose up to {maxSelectedTopics} topics above to display here.</div>}
      <div className="flex justify-between border-t border-line px-[10px] py-[9px] font-mono text-[7px] text-[#a9a797]"><span>UPDATE STATUS</span><span className="text-yellow">AWAITING SOURCES</span></div>
    </PanelFrame>
  );
}

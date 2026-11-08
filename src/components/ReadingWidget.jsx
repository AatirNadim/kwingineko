import { useEffect, useState } from 'react';
import readingConfig from '../reading.config.json';
import { loadSelectedTopicFeeds } from '../readingFeeds.js';
import PanelFrame from './PanelFrame.jsx';

const { topics: readingTopics, maxSelectedTopics } = readingConfig;

export default function ReadingWidget({ topic, selectedTopicIds, onTopicChange, onToggleTopic }) {
  const selectedTopics = readingTopics.filter((item) => selectedTopicIds.includes(item.id));
  const selected = selectedTopics.find((item) => item.id === topic) ?? selectedTopics[0];
  const hasSources = selected?.feeds.length > 0;
  const [feedData, setFeedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    let active = true;
    if (!selectedTopics.length) {
      setLoading(false);
      return () => { active = false; };
    }
    setLoading(true);
    loadSelectedTopicFeeds(selectedTopics).then((data) => {
      if (active) setFeedData((current) => ({ ...current, ...data }));
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [selectedTopicIds.join('|')]);

  const currentFeed = selected ? feedData[selected.id] : null;
  const formatDate = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date);
  };

  return (
    <PanelFrame
      title="READING_RADIO"
      symbol="RAD"
      headerAction={(
        <span className="group/control relative flex h-[7px] w-[29px] items-center justify-between" role="group" aria-label="Reading feed display controls">
          {[0, 1, 2].map((item) => (
            <i key={item} aria-hidden="true" className="h-[7px] w-[7px] border border-line bg-focus transition-opacity group-hover/control:opacity-0" />
          ))}
          <button
            type="button"
            aria-label={`${expanded ? 'Minimize' : 'Maximize'} reading feed`}
            aria-expanded={expanded}
            aria-controls="reading-radio-content"
            title={`${expanded ? 'Minimize' : 'Maximize'} reading feed`}
            onClick={() => setExpanded((value) => !value)}
            className="absolute inset-0 h-[7px] w-[29px] bg-lime opacity-0 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow group-hover/control:opacity-100"
          />
        </span>
      )}
    >
      <div id="reading-radio-content" hidden={!expanded}>
      <div className="mx-2 mb-2 mt-3 border border-line bg-surface p-[9px]">
        <div className="font-mono text-[9.5px] font-semibold tracking-wider text-muted">YOUR READING MIX</div>
        <p className="mb-[7px] mt-1 text-[10px] leading-[1.45] text-ink-secondary">Choose up to {maxSelectedTopics} topics to follow. You can change them any time.</p>
        <details className="group border border-line bg-surface-card">
        <summary className="flex min-h-[36px] cursor-pointer list-none items-center justify-between px-[8px] py-[7px] font-mono text-[9.5px] font-medium text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow">
          <span>CHANGE TOPICS <span className="text-ink-secondary">{selectedTopics.length}/{maxSelectedTopics} SELECTED</span></span>
          <span aria-hidden="true" className="group-open:rotate-180">⌄</span>
        </summary>
        <div role="group" aria-label="Choose topics to display" className="grid gap-[2px] border-t border-line p-1">
          {readingTopics.map((item) => {
            const checked = selectedTopicIds.includes(item.id);
            const atLimit = selectedTopicIds.length >= maxSelectedTopics;
            return <label key={item.id} className={`flex min-h-[36px] cursor-pointer items-center gap-2 px-[6px] py-[6px] text-[10px] ${checked ? 'text-ink' : 'text-ink-secondary'}`}>
              <input type="checkbox" checked={checked} disabled={!checked && atLimit} onChange={() => onToggleTopic(item.id)} className="h-4 w-4 accent-yellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"/>
              {item.label}
              {item.feeds.length === 0 && <span className="ml-auto font-mono text-[9.5px] tracking-wider text-muted">NO SOURCES</span>}
            </label>;
          })}
        </div>
      </details>
      </div>
      {selected ? <>
        <div role="group" aria-label="Choose a topic to read" className="flex flex-wrap gap-[3px] px-2">
          {selectedTopics.map((item) => <button key={item.id} aria-pressed={selected.id === item.id} onClick={() => onTopicChange(item.id)} className={`min-h-[32px] border px-2.5 py-1.5 text-[10px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-yellow ${selected.id === item.id ? 'border-line bg-focus text-ink font-medium' : 'border-transparent bg-transparent text-ink-secondary hover:bg-focus'}`}>{item.label}</button>)}
        </div>
        <div className="m-2 border border-dashed border-line bg-surface-well px-[11px] py-[14px]">
          <div className="mb-2 font-mono text-[9.5px] font-semibold text-muted">[CHANNEL // RSS]</div>
          <b className="block font-display text-xs font-medium text-ink">{selected.label}</b>
          {loading && !currentFeed && <p role="status" className="mt-2 text-[10px] text-muted">Loading selected feeds…</p>}
          {!loading && currentFeed?.items?.length > 0 && <ul className="mt-2 grid gap-2">
            {currentFeed.items.map((item, index) => <li key={`${item.link}-${index}`} className="border-t border-line pt-2">
              <a href={item.link} target="_blank" rel="noreferrer" className="text-[11px] leading-[1.45] text-ink underline decoration-muted-dim underline-offset-2 hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow">{item.title}</a>
              <div className="mt-1 flex justify-between gap-2 font-mono text-[9px] text-muted-dim"><span>{item.source}</span>{item.date && <time dateTime={item.date}>{formatDate(item.date)}</time>}</div>
            </li>)}
          </ul>}
          {!loading && hasSources && !currentFeed?.items?.length && <p className="mt-2 text-[10px] leading-[1.5] text-muted">{currentFeed?.errors?.length ? currentFeed.errors[0] : 'No recent articles were returned by this feed.'}</p>}
          {!hasSources && <p className="mb-0 mt-[5px] text-[10px] leading-[1.55] text-muted">No feed sources yet. Add RSS or Atom URLs to this topic in reading.config.json.</p>}
          {hasSources && <span className="mt-2 flex items-center gap-[6px] font-mono text-[9px] text-ink-secondary"><i className={`h-[5px] w-[5px] rounded-full ${currentFeed?.errors?.length && !currentFeed?.items?.length ? 'bg-pink' : 'bg-lime'}`}/>{currentFeed?.errors?.length && !currentFeed?.items?.length ? 'FEED LOAD ISSUE' : 'SESSION CACHE · 6H'}</span>}
        </div>
      </> : <div className="m-2 border border-dashed border-line px-[11px] py-[14px] text-[10px] leading-[1.55] text-muted">Choose up to {maxSelectedTopics} topics above to display here.</div>}
      <div className="flex justify-between border-t border-line px-[10px] py-[9px] font-mono text-[9px] text-muted-dim"><span>UPDATE STATUS</span><span className="text-muted">{loading ? 'FETCHING SELECTED' : hasSources ? 'SELECTED FEEDS' : 'AWAITING SOURCES'}</span></div>
      </div>
    </PanelFrame>
  );
}

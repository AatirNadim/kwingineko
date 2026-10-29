import { useState } from 'react';
import readingConfig from '../reading.config.json';
import DeskCompanion from './DeskCompanion.jsx';
import NightSkyWidget from './NightSkyWidget.jsx';
import ReadingWidget from './ReadingWidget.jsx';

export default function PersonalSidebar() {
  const [selectedTopicIds, setSelectedTopicIds] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem('reading-topic-selection'));
      if (Array.isArray(saved)) {
        const valid = saved.filter((id) => readingConfig.topics.some((topic) => topic.id === id));
        if (valid.length) return valid.slice(0, readingConfig.maxSelectedTopics);
      }
    } catch { /* Use configured defaults when storage is unavailable or invalid. */ }
    return readingConfig.defaultSelectedTopicIds;
  });
  const [topic, setTopic] = useState(readingConfig.defaultSelectedTopicIds[0]);
  const [purrs, setPurrs] = useState(0);
  const toggleTopic = (id) => {
    setSelectedTopicIds((current) => {
      const next = current.includes(id)
        ? current.filter((topicId) => topicId !== id)
        : current.length < readingConfig.maxSelectedTopics ? [...current, id] : current;
      try { window.localStorage.setItem('reading-topic-selection', JSON.stringify(next)); } catch { /* Preference remains available for this visit. */ }
      if (!next.includes(topic)) setTopic(next[0] ?? '');
      return next;
    });
  };
  return (
    <aside className="grid content-start gap-[14px] pt-1 sm:grid-cols-2 lg:grid-cols-1">
      <ReadingWidget topic={topic} selectedTopicIds={selectedTopicIds} onTopicChange={setTopic} onToggleTopic={toggleTopic}/>
      <NightSkyWidget/>
      <DeskCompanion purrs={purrs} onPet={() => setPurrs((count) => count + 1)}/>
      <div className="flex items-center gap-[10px] border border-dashed border-[#5d5e50] px-3 py-[11px] font-mono text-[9px] tracking-[.5px] text-lime"><span className="text-lg">◎</span><span>BUILT IN THE OPEN<small className="mt-[3px] block text-[7px] text-[#aaa897]">CURIOUS BY DEFAULT</small></span></div>
    </aside>
  );
}

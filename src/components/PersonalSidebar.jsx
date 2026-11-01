import { useState } from 'react';
import readingConfig from '../reading.config.json';
import DeskCompanion from './DeskCompanion.jsx';
import NightSkyWidget from './NightSkyWidget.jsx';
import ReadingWidget from './ReadingWidget.jsx';
import RecreationBayWidget from './RecreationBayWidget.jsx';
import SocialLinks from './SocialLinks.jsx';

export default function PersonalSidebar({ followEnabled, onToggleFollow, catStatus, onLaunchGame, activeGame }) {
  const [selectedTopicIds, setSelectedTopicIds] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem('reading-topic-selection'));
      if (Array.isArray(saved)) {
        const valid = saved.filter((id) => readingConfig.topics.some((topic) => topic.id === id));
        return valid.slice(0, readingConfig.maxSelectedTopics);
      }
    } catch { /* Use configured defaults when storage is unavailable or invalid. */ }
    return readingConfig.defaultSelectedTopicIds;
  });
  const [topic, setTopic] = useState(readingConfig.defaultSelectedTopicIds[0]);
  const toggleTopic = (id) => {
    const next = selectedTopicIds.includes(id)
      ? selectedTopicIds.filter((topicId) => topicId !== id)
      : selectedTopicIds.length < readingConfig.maxSelectedTopics ? [...selectedTopicIds, id] : selectedTopicIds;
    setSelectedTopicIds(next);
    try { window.localStorage.setItem('reading-topic-selection', JSON.stringify(next)); } catch { /* Preference remains available for this visit. */ }
    if (!next.includes(topic)) setTopic(next[0] ?? '');
  };
  return (
    <aside className="grid content-start gap-[14px] pt-1 sm:grid-cols-2 lg:grid-cols-1">
      <ReadingWidget topic={topic} selectedTopicIds={selectedTopicIds} onTopicChange={setTopic} onToggleTopic={toggleTopic}/>
      <NightSkyWidget/>
      <DeskCompanion followEnabled={followEnabled} onToggleFollow={onToggleFollow} catStatus={catStatus}/>
      <RecreationBayWidget onLaunchGame={onLaunchGame} activeGame={activeGame}/>
      <SocialLinks/>
      <div className="flex items-center gap-[10px] border border-dashed border-[#5d5e50] px-3 py-[11px] font-mono text-[10px] tracking-wide text-lime"><span className="text-lg">◎</span><span>BUILT IN THE OPEN<small className="mt-[3px] block text-[9.5px] tracking-wider text-[#bbb8a5]">CURIOUS BY DEFAULT</small></span></div>
    </aside>
  );
}

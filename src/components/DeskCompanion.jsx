import { Heart, Sparkles } from 'lucide-react';
import PanelFrame from './PanelFrame.jsx';

export default function DeskCompanion({ purrs, onPet }) {
  return (
    <PanelFrame title="DESK_COMPANION" icon={<Sparkles size={13}/> }>
      <button onClick={onPet} aria-label="Pet the pixel cat" className="relative grid h-[85px] w-full place-items-center bg-[#242520] text-yellow hover:bg-[#2a2b25] focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow">
        <span aria-hidden="true" className="whitespace-pre text-center font-mono text-[15px] leading-[1.15] drop-shadow-[0_0_9px_#e6db7438]">{' /\_/\\'}<br/>{'( o.o )'}<br/>{'  > ^ <'}</span>
        <span aria-hidden="true" className="absolute right-[58px] top-[13px] text-pink">✦</span>
      </button>
      <div className="flex items-center justify-between px-[10px] pb-[3px] pt-2"><b className="font-display text-[10px]">tiny coworker</b><span aria-live="polite" className="font-mono text-[7px] text-[#aaa897]">{purrs ? `PURR COUNT: ${purrs} · NICE.` : 'A LITTLE ENCOURAGEMENT'}</span></div>
      <div className="flex items-center gap-[5px] px-[10px] py-[2px] font-mono text-[8px] text-[#aaa897]"><Heart size={11} className="text-pink"/> click for a morale boost</div>
    </PanelFrame>
  );
}

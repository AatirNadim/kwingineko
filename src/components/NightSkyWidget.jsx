import { Moon } from 'lucide-react';
import PanelFrame from './PanelFrame.jsx';

export default function NightSkyWidget() {
  return (
    <PanelFrame title="NIGHT_SKY" icon={<Moon size={13}/>}>
      <div aria-hidden="true" className="relative grid h-[121px] place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_120%,#414339_0,transparent_69%),#242520]">
        <span className="absolute h-[94px] w-[94px] rounded-full border border-[#858475]/20"/><span className="absolute h-[126px] w-[126px] rounded-full border border-[#858475]/10"/>
        <span className="rotate-[-22deg] text-[54px] leading-none text-yellow drop-shadow-[0_0_24px_#e6db7475]">◐</span>
        <span className="absolute left-[47px] top-[23px] text-[10px] text-violet">✦</span><span className="absolute right-[48px] top-[37px] text-[23px] text-lime">·</span><span className="absolute bottom-6 right-[66px] text-[11px] text-yellow">✧</span>
      </div>
      <div className="flex items-center justify-between px-[9px] pt-[10px]"><b className="font-mono text-[9px] text-[#e9e7d8]">TAKE A BREATH</b><span className="font-mono text-[7px] text-[#a7a594]">ONE THING AT A TIME</span></div>
    </PanelFrame>
  );
}

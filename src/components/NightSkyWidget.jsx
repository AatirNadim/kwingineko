import PanelFrame from './PanelFrame.jsx';

export default function NightSkyWidget() {
  return (
    <PanelFrame title="NIGHT_SKY" symbol="SKY">
      <div aria-hidden="true" className="relative grid h-[121px] place-items-center overflow-hidden bg-surface-well">
        {/* Crisp concentric orbital guide rings */}
        <span className="absolute h-[94px] w-[94px] rounded-full border border-line/40" />
        <span className="absolute h-[126px] w-[126px] rounded-full border border-line/25" />
        
        {/* Crisp retro moon glyph without diffuse blur */}
        <span className="relative z-10 rotate-[-22deg] select-none font-mono text-[52px] leading-none text-yellow">
          ◐
        </span>

        {/* Ambient star symbols */}
        <span className="absolute left-[47px] top-[23px] text-[10px] text-muted-dim">✦</span>
        <span className="absolute right-[48px] top-[37px] text-[20px] leading-none text-muted-dim">·</span>
        <span className="absolute bottom-6 right-[66px] text-[11px] text-muted-dim">✧</span>
      </div>
      <div className="flex items-center justify-between border-t border-line-subtle px-[9px] py-[9px]">
        <b className="font-mono text-[10px] tracking-wide text-ink">TAKE A BREATH</b>
        <span className="font-mono text-[9px] tracking-wider text-muted">ONE THING AT A TIME</span>
      </div>
    </PanelFrame>
  );
}

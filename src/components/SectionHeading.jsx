export default function SectionHeading({ index, title, aside }) {
  return (
    <div className="mb-[17px] flex items-end justify-between">
      <div>
        <span className="font-mono text-[10.5px] tracking-wider text-violet">{index}</span>
        <h2 className="mt-1.5 font-display text-[27px] font-semibold leading-tight tracking-[-.6px] text-ink">
          {title}<span className="text-pink">.</span>
        </h2>
      </div>
      {aside && <span className="font-mono text-[10px] tracking-wider text-[#bbb8a5]">{aside}</span>}
    </div>
  );
}

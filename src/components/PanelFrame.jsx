export default function PanelFrame({ title, icon, children, className = '' }) {
  return (
    <section className={`border border-line bg-[#20211e] shadow-panel ${className}`}>
      <div className="flex h-[31px] items-center justify-between border-b border-line bg-surface px-[9px]">
        <span className="flex items-center gap-[7px] font-mono text-[10px] tracking-wide text-[#e9e7d8]">
          <span className="text-pink">{icon}</span>{title}
        </span>
        <span aria-hidden="true" className="flex gap-1">
          {[0, 1, 2].map((item) => <i key={item} className="h-[7px] w-[7px] border border-[#77776a] bg-focus" />)}
        </span>
      </div>
      {children}
    </section>
  );
}

export default function PanelFrame({ title, symbol, icon, children, className = '' }) {
  const badge = symbol || icon;

  return (
    <section className={`border border-line bg-surface-card shadow-panel ${className}`}>
      <div className="flex h-[31px] items-center justify-between border-b border-line bg-surface px-[9px]">
        <span className="flex items-center gap-[7px] font-mono text-[10px] tracking-wide text-ink">
          {badge && (
            <span aria-hidden="true" className="font-mono text-[9.5px] font-semibold text-pink">
              {typeof badge === 'string' ? (badge.startsWith('[') ? badge : `[${badge}]`) : badge}
            </span>
          )}
          <span>{title}</span>
        </span>
        <span aria-hidden="true" className="flex gap-1">
          {[0, 1, 2].map((item) => (
            <i key={item} className="h-[7px] w-[7px] border border-line bg-focus" />
          ))}
        </span>
      </div>
      {children}
    </section>
  );
}

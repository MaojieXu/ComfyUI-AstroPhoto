/** Keyboard behavior adapted from the ComfyUI Frontend v1.59.1 media sidebar. */
export function SidebarTabs<T extends string>({ items, active, prefix, label, title, select }: {
  items: readonly T[]; active: T; prefix: string; label: string; title: (item: T) => string; select: (item: T) => void;
}) {
  return <div className="ap-tab-scroll"><div className="ap-tabs" role="tablist" aria-label={label}>
    {items.map((item, index) => <button key={item} id={`${prefix}-tab-${item}`} type="button" role="tab"
      aria-selected={item === active} aria-controls={`${prefix}-panel-${item}`}
      data-state={item === active ? 'active' : 'inactive'} tabIndex={item === active ? 0 : -1}
      onClick={() => select(item)} onKeyDown={event => {
        const steps: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 :
          (index + steps[event.key] + items.length) % items.length;
        if (Number.isNaN(next)) return;
        event.preventDefault();
        event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
      }}>{title(item)}</button>)}
  </div></div>;
}

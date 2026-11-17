import { useId, useRef, useState } from 'react';

type Option = { id: string; label: string; checked: boolean; select: () => void };

export function SearchOptions({ icon, label, options, multiple = false, disabled = false }: {
  icon: 'filter' | 'sort'; label: string; options: Option[]; multiple?: boolean; disabled?: boolean;
}) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const expanded = open && !disabled;

  return <div className="ap-search-options" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }} onKeyDown={event => {
    if (expanded && event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      trigger.current?.focus();
    }
  }}>
    <button ref={trigger} type="button" disabled={disabled} className="ap-search-action"
      aria-label={label} title={label} aria-expanded={expanded} aria-controls={id}
      onClick={() => setOpen(value => !value)}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" aria-hidden="true">
        {icon === 'filter' ? <path d="M3 6h18M6 12h12M9 18h6" /> :
          <><path d="M20 7h-9m3 10H5" /><circle cx="7" cy="7" r="3" /><circle cx="17" cy="17" r="3" /></>}
      </svg>
    </button>
    <div id={id} className="ap-search-menu" role={multiple ? 'group' : 'radiogroup'} aria-label={label} hidden={!expanded}>
      {options.map(option => <label key={option.id} onMouseDown={event => event.preventDefault()}>
        <input type={multiple ? 'checkbox' : 'radio'} name={id} checked={option.checked} onChange={option.select} />
        <span>{option.label}</span>
        <svg className="ap-option-check" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m5 12 4 4L19 6" />
        </svg>
      </label>)}
    </div>
  </div>;
}

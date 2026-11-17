import { useEffect, useRef, useState } from 'react';
export function SearchField({ label, clearLabel, onSearch }: { label: string; clearLabel: string; onSearch: (value: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [composing, setComposing] = useState(false);
  useEffect(() => {
    if (composing) return;
    const timer = setTimeout(() => onSearch(value), 180);
    return () => clearTimeout(timer);
  }, [value, composing, onSearch]);
  return <div className="ap-search-field">
    {value ? <button type="button" className="ap-search-clear" aria-label={clearLabel} title={clearLabel}
      onClick={() => { setValue(''); input.current?.focus(); }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" aria-hidden="true"><path d="m18 6-12 12M6 6l12 12" /></svg>
    </button> : <svg className="ap-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>}
    <input ref={input} type="search" aria-label={label} placeholder={label} value={value}
      onChange={e => setValue(e.target.value)} onCompositionStart={() => setComposing(true)}
      onCompositionEnd={e => { setValue(e.currentTarget.value); setComposing(false); }} />
  </div>;
}

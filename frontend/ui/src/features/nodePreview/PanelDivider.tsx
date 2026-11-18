import { useRef } from 'react';

export function PanelDivider({ axis, value, min, max, label, controls, onChange }: {
  axis: 'x' | 'y';
  value: number;
  min: number;
  max: number;
  label: string;
  controls: string;
  onChange: (value: number) => void;
}) {
  const drag = useRef<{ id: number; start: number; size: number; value: number }>();
  const horizontal = axis === 'x';
  const update = (next: number) => onChange(Math.max(min, Math.min(max, next)));

  return <div className="ap-inspector-splitter" data-axis={axis} role="separator" tabIndex={0}
    aria-label={label} aria-controls={controls} aria-orientation={horizontal ? 'vertical' : 'horizontal'}
    aria-valuemin={min} aria-valuemax={max} aria-valuenow={Math.round(value)}
    onPointerDown={event => {
      if (event.button !== 0) return;
      const bounds = event.currentTarget.parentElement?.getBoundingClientRect();
      const size = horizontal ? bounds?.width : bounds?.height;
      if (!size) return;
      event.currentTarget.focus();
      event.currentTarget.setPointerCapture(event.pointerId);
      drag.current = { id: event.pointerId, start: horizontal ? event.clientX : event.clientY, size, value };
    }}
    onPointerMove={event => {
      const start = drag.current;
      if (start?.id !== event.pointerId) return;
      const position = horizontal ? event.clientX : event.clientY;
      update(start.value + (position - start.start) * 100 / start.size);
    }}
    onLostPointerCapture={() => { drag.current = undefined; }}
    onKeyDown={event => {
      const moves: Record<string, number> = {
        Home: min, End: max,
        [horizontal ? 'ArrowLeft' : 'ArrowUp']: value - 3,
        [horizontal ? 'ArrowRight' : 'ArrowDown']: value + 3,
      };
      const next = moves[event.key];
      if (typeof next !== 'number') return;
      event.preventDefault();
      update(next);
    }} />;
}

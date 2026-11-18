import { useId, useState, type ReactNode } from 'react';
import { DisclosureChevron } from '../../../shared/DisclosureChevron';

export function DetailAccordion({ title, count, initiallyOpen = false, children }: {
  title: string; count?: string; initiallyOpen?: boolean; children: ReactNode;
}) {
  const [open, setOpen] = useState(initiallyOpen);
  const id = useId();
  return <section className="ap-detail-section">
    <button type="button" className="ap-detail-toggle ap-tree-row ap-tree-folder"
      aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
      <DisclosureChevron /><span>{title}</span>{count && <small>{count}</small>}
    </button>
    <div id={id} hidden={!open} className="ap-detail-content">{children}</div>
  </section>;
}

import { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import type { NodeCard } from '../../api/nodes';
import { app } from '../../host/comfy';

const margin = 16;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

export function NodeHoverPreview({ node, anchor }: { node: NodeCard; anchor: HTMLElement }) {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const panel = anchor.closest('.astrophoto-ui') ?? anchor;
    const scrollArea = anchor.closest('.ap-scroll');

    const position = () => {
      const row = anchor.getBoundingClientRect();
      const visibleArea = scrollArea?.getBoundingClientRect();
      if (!row.width || !row.height || row.bottom <= 0 || row.top >= window.innerHeight ||
        (visibleArea && (row.bottom <= visibleArea.top || row.top >= visibleArea.bottom))) {
        card.style.visibility = 'hidden';
        return;
      }

      const { width, height } = card.getBoundingClientRect();
      const bounds = panel.getBoundingClientRect();
      const left = bounds.left - margin - width;
      const right = bounds.right + margin;
      const onRight = app.extensionManager.setting.get('Comfy.Sidebar.Location') === 'right';
      let horizontal = onRight ? left : right;
      if (onRight && left < margin && right + width <= window.innerWidth - margin) horizontal = right;
      if (!onRight && right + width > window.innerWidth - margin && left >= margin) horizontal = left;
      card.style.left = `${clamp(horizontal, margin, window.innerWidth - width - margin)}px`;
      const top = row.top + row.height / 2 - height * 0.3;
      card.style.top = `${clamp(top, margin, window.innerHeight - height - margin)}px`;
      card.style.visibility = 'visible';
    };

    position();
    const observer = new ResizeObserver(position);
    observer.observe(card);
    if (panel !== anchor) observer.observe(panel);
    window.addEventListener('resize', position);
    window.addEventListener('scroll', position, true);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', position);
      window.removeEventListener('scroll', position, true);
    };
  }, [anchor]);

  const ports = [[t('nodes.inputs'), node.inputs], [t('nodes.outputs'), node.outputs]] as const;
  return createPortal(
    <aside className="astrophoto-node-preview" ref={cardRef} aria-hidden="true">
      <div className="ap-preview-miniature">
        <div className="ap-preview-node-title">{node.title}</div>
        <div className="ap-preview-sockets">
          <div>{node.inputs.map(([name], i) => <span key={i}>{name}</span>)}</div>
          <div>{node.outputs.map(([name], i) => <span key={i}>{name}</span>)}</div>
        </div>
      </div>
      <div className="ap-preview-content">
        <h3>{node.title}</h3>
        {node.description && <p>{node.description}</p>}
        {ports.map(([label, list]) => list.length > 0 && <div className="ap-preview-ports" key={label}>
          <h4>{label}</h4>
          <dl>{list.map(([name, type], i) => <div key={i}><dt>{name}</dt><dd>{type}</dd></div>)}</dl>
        </div>)}
      </div>
    </aside>,
    document.body
  );
}

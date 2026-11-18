import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import type { ComparisonImages } from './Inspector';
import './nodePreview.css';

export function NodePreview({
  expanded, images, status, badge, imageClassName = '', onToggle, onCompare, onRefresh, onReset,
}: {
  expanded: boolean;
  images?: ComparisonImages;
  status: string;
  badge?: string;
  imageClassName?: string;
  onToggle: () => void;
  onCompare: () => void;
  onRefresh?: () => void;
  onReset?: () => void;
}) {
  const { t } = useTranslation();
  const panelId = useId();
  const refresh = t('actions.refresh');
  const reset = t('nodePreview.reset');

  return <>
    <div className="ap-node-preview-toolbar">
      <button type="button" aria-controls={panelId} aria-expanded={expanded} onClick={onToggle}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
        {t('nodePreview.preview')}
      </button>
      <button className="ap-node-compare" type="button" aria-haspopup="dialog"
        aria-label={t('nodePreview.openImage')} title={t('nodePreview.openImage')} onClick={onCompare}>
        <i className="pi pi-image" aria-hidden="true" />
      </button>
      {onRefresh && <button type="button" title={refresh} aria-label={refresh} onClick={onRefresh}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5M5.5 8a7 7 0 0 1 11-2l3.5 6m-16 0 3.5 6a7 7 0 0 0 11-2" /></svg>
      </button>}
      {onReset && <button type="button" title={reset} aria-label={reset} onClick={onReset}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11h5M3 11V6m0 5 4-4a7 7 0 1 1-1 10" /></svg>
      </button>}
    </div>
    <div id={panelId} className={`ap-canvas-preview ${imageClassName}`} hidden={!expanded}>
      {expanded && (images?.after ? <>
        <img src={images.after} width={images.width} height={images.height} alt={t('nodePreview.after')} draggable={false} />
        {badge && <small className="ap-node-preview-badge">{badge}</small>}
      </> : <span role="status">{status}</span>)}
    </div>
  </>;
}

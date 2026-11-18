import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { PanelDivider } from './PanelDivider';
import './inspector.css';

export type ComparisonImages = { before?: string; after?: string; aligned?: boolean; width?: number; height?: number };

type Mode = 'side' | 'wipe' | 'single';
const modes: Mode[] = ['side', 'wipe', 'single'];
const paths: Record<Mode, string> = {
  side: 'M3 5h18v14H3z M12 5v14',
  wipe: 'M3 5h18v14H3z M12 2v20 M8 12h8',
  single: 'M3 5h18v14H3z M7 9h10v6H7z',
};
const clamp = (number: number, min: number, max: number) => Math.max(min, Math.min(max, number));

export function Inspector({ preview, title, description, details, parameters, status, onRefresh, onReset, onClose }: {
  preview?: ComparisonImages;
  title: string; description?: string; details?: { label: string; value: string }[]; parameters?: ReactNode;
  status?: string; onRefresh?: () => void; onReset?: () => void; onClose: () => void;
}) {
  const { t } = useTranslation();
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const [viewShare, setViewShare] = useState(73);
  const [analysisShare, setAnalysisShare] = useState(50);
  const [mode, setMode] = useState<Mode>('side');
  const [single, setSingle] = useState<'before' | 'after'>('after');
  const [divider, setDivider] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [native, setNative] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ id: number; x: number; y: number; ox: number; oy: number }>();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = dialog.current;
    if (element && !element.open) {
      if (typeof element.show === 'function') element.show();
      else element.setAttribute('open', '');
    }
    close.current?.focus();
    return () => { if (previous?.isConnected) previous.focus(); };
  }, []);
  const canWipe = Boolean(preview?.before && preview.after && preview.aligned);
  const activeMode = mode === 'wipe' && !canWipe ? 'side' : mode;

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !event.isPrimary) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, ox: pan.x, oy: pan.y };
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (start?.id === event.pointerId) setPan({ x: start.ox + event.clientX - start.x, y: start.oy + event.clientY - start.y });
  }

  function moveDivider(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.parentElement?.getBoundingClientRect();
    if (bounds?.width) setDivider(clamp((event.clientX - bounds.left) * 100 / bounds.width, 0, 100));
  }

  const fit = () => { setNative(false); setPan({ x: 0, y: 0 }); setZoom(1); };
  const pixels = () => { fit(); setNative(true); };
  const scale = (factor: number) => setZoom(value => clamp(value * factor, .1, 16));
  function layer(side: 'before' | 'after', clip?: string) {
    const url = preview?.[side];
    const transform = { '--ap-img-zoom': zoom, '--ap-img-x': pan.x + 'px', '--ap-img-y': pan.y + 'px',
      '--ap-native-width': preview?.width + 'px', '--ap-native-height': preview?.height + 'px', clipPath: clip } as CSSProperties;
    return <div className="ap-inspector-layer" style={transform} data-native={native}>
      {url ? <img src={url} alt={t('nodePreview.' + side)} draggable={false} /> : <span>{t('nodePreview.noImage')}</span>}
    </div>;
  }
  function panel(side: 'before' | 'after') {
    return <div className="ap-inspector-pane" key={side} onPointerDown={pointerDown} onPointerMove={pointerMove} onLostPointerCapture={() => { drag.current = undefined; }}>
      {layer(side)}<span className="ap-inspector-label">{t('nodePreview.' + side)}</span>
    </div>;
  }
  return createPortal(<dialog ref={dialog} className="astrophoto-ui ap-inspector" aria-label={t('nodePreview.compare')} onCancel={onClose}
    onKeyDown={event => { event.stopPropagation(); if (event.key === 'Escape') { event.preventDefault(); onClose(); } }}>
    <header><div className="ap-inspector-title"><strong>{title}</strong>
      {description && <InfoTip text={description} />}</div>
      <button ref={close} type="button" title={t('nodePreview.close')} aria-label={t('nodePreview.close')} onClick={onClose}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
      </button></header>
    <div className="ap-inspector-layout" style={{ '--ap-view-share': viewShare + '%' } as CSSProperties}>
      <section id={panelId + '-view'} className="ap-inspector-view">
        <div className="ap-inspector-toolbar"><div className="ap-inspector-modes">
          {modes.map(item => <button key={item} type="button" title={t('nodePreview.' + item)} aria-label={t('nodePreview.' + item)}
            aria-pressed={activeMode === item} disabled={item === 'wipe' && !canWipe} onClick={() => setMode(item)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d={paths[item]} /></svg>
          </button>)}
        </div><div className="ap-inspector-zoom">
          {onRefresh && <button type="button" aria-label={t('actions.refresh')} title={t('actions.refresh')} onClick={onRefresh}>
            <i className="pi pi-refresh" aria-hidden="true" />
          </button>}
          {activeMode === 'single' && <button type="button" onClick={() => setSingle(single === 'before' ? 'after' : 'before')}>
            {t(single === 'before' ? 'nodePreview.after' : 'nodePreview.before')}</button>}
          <button type="button" title={t('nodePreview.zoomOut')} aria-label={t('nodePreview.zoomOut')} onClick={() => scale(0.8)}>−</button>
          <button type="button" onClick={pixels} aria-pressed={native}>{native ? Math.round(zoom * 100) + '%' : '100%'}</button>
          <button type="button" title={t('nodePreview.zoomIn')} aria-label={t('nodePreview.zoomIn')} onClick={() => scale(1.25)}>+</button>
          <button type="button" onClick={fit}>{t('nodePreview.fit')}</button>
        </div></div>
        <div className="ap-inspector-images" data-mode={activeMode}
          onDragStart={event => event.preventDefault()}
          onWheel={event => { event.stopPropagation(); scale(event.deltaY < 0 ? 1.12 : 1 / 1.12); }}>
          {activeMode === 'side' && <>{panel('before')}{panel('after')}</>}
          {activeMode === 'single' && panel(single)}
          {activeMode === 'wipe' && <div className="ap-inspector-pane" onPointerDown={pointerDown} onPointerMove={pointerMove}
            onLostPointerCapture={() => { drag.current = undefined; }}>
            {layer('after')}{layer('before', `inset(0 ${100 - divider}% 0 0)`)}
            <span className="ap-inspector-label">{t('nodePreview.before')}</span>
            <span className="ap-inspector-label ap-inspector-end">{t('nodePreview.after')}</span>
            {/* Pointer capture and keyboard behavior adapted from ComfyUI_frontend
                v1.59.1 src/components/common/VideoCompareSlider.vue (GPL-3.0). */}
            <div className="ap-inspector-divider" style={{ left: divider + '%' }} tabIndex={0} role="slider"
              aria-label={t('nodePreview.wipe')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(divider)}
              onPointerDown={event => {
                event.stopPropagation();
                if (event.button !== 0 || !event.isPrimary) return;
                event.preventDefault();
                event.currentTarget.focus();
                event.currentTarget.setPointerCapture(event.pointerId);
                moveDivider(event);
              }}
              onPointerMove={event => { event.stopPropagation(); if (event.currentTarget.hasPointerCapture(event.pointerId)) moveDivider(event); }}
              onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
              onKeyDown={event => {
                const values: Record<string, number> = { ArrowLeft: divider - 2, ArrowRight: divider + 2, Home: 0, End: 100 };
                if (!(event.key in values)) return;
                event.preventDefault(); event.stopPropagation(); setDivider(clamp(values[event.key], 0, 100));
              }} />
          </div>}
        </div>
        {!canWipe && preview?.before && preview.after && <small>{t('nodePreview.unaligned')}</small>}
      </section>
      <PanelDivider axis="x" label={t('nodePreview.adjustWidth')} controls={panelId + '-view'}
        value={viewShare} min={40} max={80} onChange={setViewShare} />
      <aside className="ap-inspector-info" style={{ '--ap-analysis-share': analysisShare + '%' } as CSSProperties}>
        <section id={panelId + '-analysis'}><h3>{t('nodePreview.analysis')}</h3><p>{t('nodePreview.analysisEmpty')}</p></section>
        <PanelDivider axis="y" label={t('nodePreview.adjustHeight')} controls={panelId + '-analysis'}
          value={analysisShare} min={15} max={75} onChange={setAnalysisShare} />
        <section><div className="ap-inspector-parameters-header"><h3>{t(parameters ? 'nodePreview.parameters' : 'nodePreview.readonly')}</h3>
          {onReset && <button type="button" title={t('nodePreview.reset')} aria-label={t('nodePreview.reset')} onClick={onReset}>
            <i className="pi pi-replay" aria-hidden="true" />
          </button>}</div>
          {parameters}
          {(Boolean(details?.length) || status) && <dl>
            {details?.map(({ label, value }) => <div className="ap-inspector-value" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            {status && <><dt>{t('nodePreview.status')}</dt><dd role="status">{status}</dd></>}
          </dl>}
        </section>
      </aside>
    </div>
  </dialog>, document.body);
}

export function InfoTip({ text }: { text: string }) {
  return <span className="ap-inspector-help" role="img" tabIndex={0} aria-label={text} title={text}>
    <i className="pi pi-info-circle" aria-hidden="true" />
  </span>;
}


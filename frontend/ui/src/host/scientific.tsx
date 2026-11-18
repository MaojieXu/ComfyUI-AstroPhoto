import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ComfyApp } from './comfy';
import { watchLocale } from './locale';
import { ApiError } from '../api/client';
import { canvasPreviewWidth, previewResolutionEvents } from '../api/previewSettings';
import { defaults, fitsAssets, renderCandidate, validatePreview, type Parameters as SirilParameters, type Preview } from '../api/siril';
import { InfoTip, Inspector } from '../features/nodePreview/Inspector';
import { NodePreview } from '../features/nodePreview/NodePreview';

const SOURCE = 'AstroPhotoFITSSource';
const IMAGE_PATH = 'AstroPhotoImagePath';
const STRETCH = 'AstroPhotoSirilAutoStretch';
type Extension = Parameters<ComfyApp['registerExtension']>[0];
type Node = Parameters<NonNullable<Extension['nodeCreated']>>[0];
type Formal = { asset: string; key: string; source: string };
const executionResults = new WeakMap<Node, Formal>();
function previewOwner() {
  const values = crypto.getRandomValues(new Uint8Array(16));
  values[6] = (values[6] & 15) | 64;
  values[8] = (values[8] & 63) | 128;
  const hex = Array.from(values, byte => byte.toString(16).padStart(2, '0')).join('');
  return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-');
}

function values(node: Node): SirilParameters {
  const widget = (name: string) => node.widgets?.find(entry => entry.name === name);
  return {
    shadowsclip: Number(widget('shadowsclip')?.value ?? defaults.shadowsclip),
    targetbg: Number(widget('targetbg')?.value ?? defaults.targetbg),
    linked: widget('linked')?.value !== false,
  };
}

function sourceId(node: Node, visited = new Set<Node>()): string {
  if (visited.has(node)) return '';
  visited.add(node);
  const input = node.getInputNode(0);
  if (input?.comfyClass === SOURCE) return String(input.widgets?.find(widget => widget.name === 'asset_id')?.value || '');
  if (input?.comfyClass === IMAGE_PATH) return String(input.widgets?.find(widget => widget.name === 'image_path')?.value || '');
  if (input?.comfyClass === STRETCH) {
    const result = executionResults.get(input);
    if (result && result.key === JSON.stringify(values(input)) && result.source === sourceId(input, visited)) return result.asset;
  }
  return '';
}

function release(preview?: Preview) {
  if (preview?.before) URL.revokeObjectURL(preview.before);
  if (preview?.after) URL.revokeObjectURL(preview.after);
}

function NodeView({ node, execution, canvas }: {
  node: Node; execution: EventTarget; canvas: () => ComfyApp['canvas'];
}) {
  const { t } = useTranslation();
  const [owner] = useState(previewOwner);
  const [expanded, setExpanded] = useState(true);
  const [inspector, setInspector] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [data, setData] = useState({ asset: '', key: JSON.stringify(values(node)), formal: '', connected: false });
  const [preview, setPreview] = useState<Preview>();
  const [frameInfo, setFrameInfo] = useState<{ asset: string; channels?: number }>();
  const [previewKey, setPreviewKey] = useState('');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const scan = () => {
      const asset = sourceId(node);
      const key = JSON.stringify(values(node));
      const result = executionResults.get(node);
      const formal = result?.key === key && result.source === asset ? result.asset : '';
      const connected = node.isInputConnected(0);
      setData(previous => previous.asset === asset && previous.key === key && previous.formal === formal && previous.connected === connected
        ? previous : { asset, key, formal, connected });
    };
    const timer = window.setInterval(scan, 200);
    const refreshResolution = () => setRefresh(value => value + 1);
    previewResolutionEvents.addEventListener('change', refreshResolution);
    execution.addEventListener('changed', scan);
    scan();
    return () => {
      clearInterval(timer);
      previewResolutionEvents.removeEventListener('change', refreshResolution);
      execution.removeEventListener('changed', scan);
    };
  }, [node, execution]);

  const { asset, key, formal } = data;
  const requestKey = JSON.stringify([asset, key, formal, refresh]);
  const shown = previewKey === requestKey ? preview : undefined;
  useEffect(() => {
    setPreview(undefined);
    setPending(Boolean(asset));
    if (!asset) return;
    const controller = new AbortController();
    let owned: Preview | undefined;
    const timer = window.setTimeout(() => {
      void renderCandidate(asset, owner, JSON.parse(key) as SirilParameters, controller.signal, formal || undefined).then(
        result => {
          if (controller.signal.aborted) release(result);
          else {
            owned = result; setPreview(result); setPreviewKey(requestKey); setPending(false);
            setFrameInfo({ asset, channels: result.channels });
          }
        },
        error => {
          if (controller.signal.aborted) return;
          setPreview({ state: 'failed', error: error instanceof ApiError ? error.code : 'network' });
          setPreviewKey(requestKey); setPending(false);
        },
      );
    }, 400);
    return () => { clearTimeout(timer); controller.abort(); release(owned); };
  }, [asset, key, formal, owner, requestKey]);
  const active = expanded || inspector;
  useEffect(() => {
    if (!shown?.jobId || !shown.before || !active) return;
    const id = shown.jobId;
    const controller = new AbortController();
    const interval = window.setInterval(() => {
      if (document.hidden) return;
      void validatePreview(id, controller.signal).catch(error => {
        if (controller.signal.aborted) return;
        release(shown);
        setPreview(current => current?.jobId === id ? {
          state: 'failed', error: error instanceof ApiError ? error.code : 'PREVIEW_STALE',
        } : current);
      });
    }, 8000);
    return () => { clearInterval(interval); controller.abort(); };
  }, [shown, active]);

  const params = JSON.parse(key) as SirilParameters;
  const mono = frameInfo?.asset === asset && frameInfo?.channels === 1;
  useEffect(() => {
    const linked = node.widgets?.find(widget => widget.name === 'linked');
    if (!linked) return;
    const previous = linked.disabled;
    linked.disabled = mono;
    node.setDirtyCanvas(true, true);
    return () => { linked.disabled = previous; };
  }, [node, mono]);
  const text = (state: string) => t('siril.states.' + state, { defaultValue: state });
  const status = !asset ? t(data.connected ? 'siril.upstream' : 'siril.noInput') :
    pending || !shown ? t('siril.rendering') : shown.error ? text(shown.error) :
    t(shown.formal ? 'siril.formal' : 'siril.candidate');

  function updateParameters(changes: Partial<SirilParameters>) {
    const graph = node.graph;
    const activeCanvas = canvas();
    if (!graph || activeCanvas?.read_only || activeCanvas?.selectOnly) return;
    const updates = Object.entries(changes).flatMap(([name, value]) => {
      const widget = node.widgets?.find(entry => entry.name === name);
      return widget && widget.value !== value ? [{ name, value, widget }] : [];
    });
    if (!updates.length) return;
    graph.beforeChange(node);
    activeCanvas?.emitBeforeChange();
    try {
      for (const { name, value, widget } of updates) {
        const previous = widget.value;
        widget.value = value;
        node.onWidgetChanged?.(name, value, previous, widget);
      }
      graph.change();
      node.setDirtyCanvas(true, true);
    } finally {
      graph.afterChange(node);
      activeCanvas?.emitAfterChange();
    }
  }

  return <>
    <NodePreview expanded={expanded} images={shown} status={status} imageClassName="ap-siril-main"
      badge={shown ? t(shown.formal ? 'siril.formal' : 'siril.candidate') : undefined}
      onToggle={() => setExpanded(open => !open)} onCompare={() => setInspector(true)}
      onRefresh={asset ? () => setRefresh(value => value + 1) : undefined} onReset={() => updateParameters(defaults)} />
    {inspector && <Inspector preview={shown} title={node.title || 'Siril · AutoStretch'} description={t('siril.nodeHelp')}
      onRefresh={asset ? () => setRefresh(value => value + 1) : undefined} onReset={() => updateParameters(defaults)}
      parameters={<div className="ap-inspector-fields">
        <NumberParameter label={t('siril.shadows') + ' (σ)'} help={t('siril.shadowsHelp')} value={params.shadowsclip}
          onChange={shadowsclip => updateParameters({ shadowsclip })} />
        <NumberParameter label={t('siril.target')} help={t('siril.targetHelp')} value={params.targetbg} min={0} max={1}
          onChange={targetbg => updateParameters({ targetbg })} />
        <label className="ap-inspector-toggle">
          <span>{t('siril.linked')} <InfoTip text={t('siril.linkedHelp')} /></span>
          <input type="checkbox" role="switch" checked={params.linked && !mono} disabled={mono}
            title={t(mono ? 'siril.mono' : 'siril.rgbRisk')}
            onChange={event => updateParameters({ linked: event.currentTarget.checked })} />
        </label>
      </div>}
      onClose={() => setInspector(false)} />}
  </>;
}

function NumberParameter({ label, help, value, min, max, onChange }: {
  label: string; help: string; value: number; min?: number; max?: number; onChange: (value: number) => void;
}) {
  const [draft, setDraft] = useState<string>();
  return <label>
    <span>{label} <InfoTip text={help} /></span>
    <input type="number" value={draft ?? value} min={min} max={max} step={0.01}
      onBlur={() => setDraft(undefined)}
      onChange={event => {
        const input = event.currentTarget;
        const number = input.valueAsNumber;
        setDraft(input.value);
        if (Number.isFinite(number) && (min === undefined || number >= min) && (max === undefined || number <= max)) {
          onChange(number);
        }
      }} />
  </label>;
}

function SourcePicker({ get, select }: { get: () => string; select: (asset: string) => void }) {
  const { t } = useTranslation();
  const [assets, setAssets] = useState<{ id: string; name: string }[]>([]);
  const [selected, setSelected] = useState(get);
  const [state, setState] = useState('loading');
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState('loading');
    void fitsAssets(controller.signal).then(result => {
      if (!controller.signal.aborted) { setAssets(result); setSelected(get()); setState('ready'); }
    }, error => {
      if (!controller.signal.aborted) setState(error instanceof ApiError ? error.code : 'network');
    });
    return () => controller.abort();
  }, [get, refresh]);
  return <>
    <select aria-label={t('siril.fitsAsset')} value={selected} onFocus={() => setSelected(get())}
      onChange={event => { select(event.target.value); setSelected(event.target.value); }}>
      <option value="">{t(state === 'loading' ? 'states.loading' : 'siril.fitsAsset')}</option>
      {selected && !assets.some(asset => asset.id === selected) && <option value={selected}>
        {/^[a-f0-9-]{36}$/.test(selected) ? `${t('siril.unavailableAsset')} · ${selected}` : selected}
      </option>}
      {assets.map(asset => <option key={asset.id} value={asset.id}>{asset.name} · {asset.id.slice(0, 8)}</option>)}
    </select>
    <label>{t('siril.serverFitsPath')}
      <input type="text" value={selected} placeholder={t('siril.serverFitsPathHint')}
        onChange={event => { select(event.target.value); setSelected(event.target.value); }} />
    </label>
    {state !== 'loading' && state !== 'ready' && <small role="alert">{t('siril.states.' + state, { defaultValue: state })}</small>}
    <button type="button" onClick={() => setRefresh(value => value + 1)}>{t('siril.refreshAssets')}</button>
  </>;
}

function mountElement(measureContent = false) {
  const element = document.createElement('div');
  element.className = 'astrophoto-ui ap-siril-widget';
  const content = measureContent ? document.createElement('div') : element;
  if (measureContent) {
    element.classList.add('ap-siril-preview-widget');
    content.className = 'ap-siril-preview-content';
    element.append(content);
  }
  return { element, content, root: createRoot(content), unwatch: watchLocale(element) };
}

export function registerScientific(app: ComfyApp) {
  app.registerExtension({
    name: 'AstroPhoto.ScientificNodes',
    getCustomWidgets() {
      return {
        ASTRO_FITS_ASSET(node, name) {
          let value = '';
          const { element, root, unwatch } = mountElement();
          const widget = node.addDOMWidget(name, 'astrophoto-fits-asset', element, {
            getMinHeight: () => 145, getHeight: () => 145, getValue: () => value, setValue: next => { value = next; },
          });
          root.render(<SourcePicker get={() => value} select={asset => { widget.value = asset; node.graph?.change(); }} />);
          const remove = widget.onRemove;
          widget.onRemove = () => { unwatch(); root.unmount(); remove?.call(widget); };
          return { widget };
        },
      };
    },
    nodeCreated(node) {
      if (node.comfyClass !== STRETCH) return;
      const { element, content, root, unwatch } = mountElement(true);
      let height = 264;
      const widget = node.addDOMWidget('astrophoto_preview', 'astrophoto-scientific-preview', element,
        { serialize: false, getMinHeight: () => height, getMaxHeight: () => height });
      widget.serialize = false;
      // Measure the inner content, independent of the height allocated by the host.
      const resize = new ResizeObserver(() => {
        const measured = content.offsetHeight;
        if (!measured || measured === height) return;
        height = measured;
        node.setSize([node.size[0], node.computeSize()[1]]);
        node.setDirtyCanvas(true, true);
      });
      const events = new EventTarget();
      const previous = node.onExecuted;
      node.onExecuted = function (output) {
        previous?.call(this, output);
        const result = output as unknown as { astrophoto_asset?: string[]; astrophoto_source?: string[]; astrophoto_parameters?: SirilParameters[] };
        if (result.astrophoto_asset?.[0] && result.astrophoto_source?.[0] && result.astrophoto_parameters?.[0]) {
          executionResults.set(node, { asset: result.astrophoto_asset[0], source: sourceId(node), key: JSON.stringify(result.astrophoto_parameters[0]) });
          events.dispatchEvent(new Event('changed'));
        }
      };
      root.render(<NodeView node={node} execution={events} canvas={() => app.canvas} />);
      resize.observe(content, { box: 'border-box' });
      const remove = widget.onRemove;
      widget.onRemove = () => {
        resize.disconnect();
        unwatch(); root.unmount(); executionResults.delete(node); remove?.call(widget);
      };
      // Leave room for the configured preview width, content padding, and host widget margins.
      const defaultWidth = canvasPreviewWidth() + 8 + 2 * widget.margin;
      node.setSize([Math.max(node.size[0], defaultWidth), Math.max(node.size[1], 395)]);
    },
  });
}


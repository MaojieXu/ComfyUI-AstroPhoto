import { defineComponent, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiError } from '../api/client';
import { fitsAssets } from '../api/fits';
import type { ComfyApp } from './comfy';
import { mountWidget } from './mountWidget';
import { trackDomWidget } from './domWidgetMounts';
import '../styles/fits-source.css';

type SourceProps = { source: string; select: (asset: string) => void };

const SourcePicker = defineComponent((props: SourceProps) => {
  const { t } = useI18n();
  const assets = shallowRef<Awaited<ReturnType<typeof fitsAssets>>>([]);
  const state = ref('loading');
  const revision = ref(0);
  watch(revision, (_, __, onCleanup) => {
    const controller = new AbortController();
    onCleanup(() => controller.abort());
    state.value = 'loading';
    void fitsAssets(controller.signal).then(result => {
      if (controller.signal.aborted) return;
      assets.value = result;
      state.value = 'ready';
    }, error => {
      if (!controller.signal.aborted) state.value = error instanceof ApiError ? error.code : 'network';
    });
  }, { immediate: true });

  const select = (event: Event) => props.select((event.currentTarget as HTMLInputElement).value);
  return () => <>
    <select aria-label={t('fits.fitsAsset')} value={props.source} onChange={select}>
      <option value="">{t(state.value === 'loading' ? 'states.loading' : 'fits.fitsAsset')}</option>
      {props.source && !assets.value.some(asset => asset.id === props.source) && <option value={props.source}>
        {/^[a-f0-9-]{36}$/.test(props.source) ? `${t('fits.unavailableAsset')} · ${props.source}` : props.source}
      </option>}
      {assets.value.map(asset => <option key={asset.id} value={asset.id}>{asset.name} · {asset.id.slice(0, 8)}</option>)}
    </select>
    <label>{t('fits.serverFitsPath')}
      <input type="text" value={props.source} placeholder={t('fits.serverFitsPathHint')} onInput={select} />
    </label>
    {state.value !== 'loading' && state.value !== 'ready' && <small role="alert">{t('errors.' + state.value, state.value)}</small>}
    <button type="button" onClick={() => { revision.value += 1; }}>{t('fits.refreshAssets')}</button>
  </>;
}, { props: ['source', 'select'] });

export function registerFitsSource(host: ComfyApp) {
  host.registerExtension({
    name: 'AstroPhoto.ScientificNodes',
    getCustomWidgets() {
      return {
        ASTRO_FITS_ASSET(node, name) {
          const source = ref('');
          const element = document.createElement('div');
          element.className = 'astrophoto-ui ap-fits-source-widget';
          const widget = node.addDOMWidget(name, 'astrophoto-fits-asset', element, {
            getMinHeight: () => 145, getHeight: () => 145,
            getValue: () => source.value,
            setValue: next => { source.value = next; },
          });
          trackDomWidget(widget);
          const View = defineComponent(() => () => <SourcePicker source={source.value} select={asset => {
            if (host.canvas?.read_only || host.canvas?.selectOnly) return;
            widget.value = asset;
            node.graph?.change();
          }} />);
          const dispose = mountWidget(host, element, View, {});
          const remove = widget.onRemove;
          widget.onRemove = () => { dispose(); remove?.call(widget); };
          return { widget };
        },
      };
    },
  });
}

import { defineComponent, onScopeDispose, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { allDocuments } from '../api/assets';
import { ApiError, getJson, isRecord } from '../api/client';
import { nativePicker } from '../api/nativePicker';
import type { ComfyApp } from './comfy';
import { mountWidget } from './mountWidget';
import { trackDomWidget } from './domWidgetMounts';
import { watchLocale } from './locale';
import { subscribeLibraryChanges } from './libraryChanges';
import '../styles/fits-source.css';

const isId = (value: string) => /^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/i.test(value);
type SourceProps = { source: string; folder: boolean; select: (value: string) => void };

const SourcePicker = defineComponent((props: SourceProps) => {
  const { t } = useI18n();
  const choices = shallowRef<{ id: string; name: string }[]>([]);
  const path = ref('');
  const status = ref('');
  const picking = ref(false);
  const manual = ref(false);
  const draft = ref('');
  const retry = ref(0);
  const loading = ref(true);
  const loadError = ref(false);
  const selectedName = ref('');
  const missing = ref(false);
  const selectedError = ref(false);
  const stopChanges = subscribeLibraryChanges(() => { retry.value++; });
  onScopeDispose(stopChanges);
  watch([() => props.folder, retry], ([folder], _, cleanup) => {
    const controller = new AbortController();
    cleanup(() => controller.abort());
    loading.value = true;
    loadError.value = false;
    void allDocuments(folder ? 'import-groups' : 'assets', folder ? {} : { import_group_id: 'ungrouped' }, controller.signal)
      .then(rows => { if (!controller.signal.aborted) choices.value = rows; }, () => {
        if (!controller.signal.aborted) loadError.value = true;
      }).finally(() => { if (!controller.signal.aborted) loading.value = false; });
  }, { immediate: true });
  watch(() => props.source, () => { manual.value = false; selectedName.value = ''; path.value = ''; });
  watch([() => props.source, retry], ([source], _, cleanup) => {
    status.value = '';
    missing.value = false;
    selectedError.value = false;
    if (!isId(source)) return;
    const controller = new AbortController();
    cleanup(() => controller.abort());
    const endpoint = props.folder ? '/astrophoto/v1/catalog/subframe_collection/' : '/astrophoto/v1/library/assets/';
    void getJson(endpoint + encodeURIComponent(source), controller.signal, 'no-store').then(result => {
      if (!controller.signal.aborted && isRecord(result) && typeof result.name === 'string') selectedName.value = result.name;
    }, error => {
      if (!controller.signal.aborted) {
        if (error instanceof ApiError && error.status === 404) { missing.value = true; path.value = ''; }
        else selectedError.value = true;
      }
    });
    if (!props.folder) void getJson('/astrophoto/v1/assets/' + encodeURIComponent(source) + '/path', controller.signal, 'no-store')
      .then(result => {
        if (!controller.signal.aborted && isRecord(result) && typeof result.path === 'string') path.value = result.path;
      }, error => {
        if (!controller.signal.aborted) {
          if (error instanceof ApiError && error.status === 404) { path.value = ''; status.value = 'fits.unavailableAsset'; }
          else selectedError.value = true;
        }
      });
  }, { immediate: true });

  async function browse() {
    picking.value = true;
    status.value = '';
    try {
      const result = await nativePicker(props.folder ? 'folder' : 'file');
      if (result.path) props.select(result.path);
      else if (result.status === 'busy') status.value = 'fits.pickerBusy';
      else if (result.status !== 'cancelled') status.value = 'fits.enterHostPath';
    } catch { status.value = 'fits.enterHostPath'; }
    finally { picking.value = false; }
  }

  return () => <>
    <select aria-label={t(props.folder ? 'fits.groupAsset' : 'fits.fileAsset')} value={isId(props.source) ? props.source : ''}
      onChange={event => props.select((event.currentTarget as HTMLSelectElement).value)}>
      <option value="">{t(props.folder ? 'fits.groupAsset' : 'fits.fileAsset')}</option>
      {isId(props.source) && !choices.value.some(row => row.id === props.source) &&
        <option value={props.source}>{selectedName.value || t('fits.unavailableAsset')}</option>}
      {choices.value.map(row => <option value={row.id} key={row.id}>{row.name}</option>)}
    </select>
    {loading.value && <small role="status">{t('fits.loadingAssets')}</small>}
    {!loading.value && loadError.value && <div role="status"><small>{t('fits.loadFailed')}</small>{' '}
      <button type="button" onClick={() => { retry.value++; }}>{t('fits.retry')}</button></div>}
    {!loading.value && !loadError.value && choices.value.length === 0 &&
      <small>{t(props.folder ? 'fits.noGroups' : 'fits.noFiles')}</small>}
    {missing.value && <small role="status">{t('fits.removedAsset')}</small>}
    {selectedError.value && <div role="status"><small>{t('fits.loadFailed')}</small>{' '}
      <button type="button" onClick={() => { retry.value++; }}>{t('fits.retry')}</button></div>}
    <div class="ap-source-path">
      {!(props.folder && isId(props.source)) && <input aria-label={t(props.folder ? 'fits.folderPath' : 'fits.filePath')}
        placeholder={t(props.folder ? 'fits.folderPath' : 'fits.filePath')} value={isId(props.source) ? path.value : props.source}
        title={isId(props.source) ? path.value : props.source} readonly />}
      <button type="button" disabled={picking.value} onClick={browse}>{t(props.folder ? 'fits.browseFolder' : 'fits.browseFile')}</button>
    </div>
    <button type="button" onClick={() => { manual.value = !manual.value; if (manual.value) draft.value = isId(props.source) ? path.value : props.source; }}>{t('fits.manualPath')}</button>
    {manual.value && <div><input aria-label={t(props.folder ? 'fits.folderPath' : 'fits.filePath')} placeholder={t(props.folder ? 'fits.folderPath' : 'fits.filePath')}
      value={draft.value} onInput={event => { draft.value = (event.currentTarget as HTMLInputElement).value; }}
      onChange={() => props.select(draft.value)} onKeydown={event => {
        if (event.key === 'Enter') (event.currentTarget as HTMLInputElement).blur();
      }} />
      <small>{t('fits.remotePath')}</small></div>}
    {props.folder && isId(props.source) && <small>{t('fits.groupHint')}</small>}
    {status.value && <small role="status">{t(status.value)}</small>}
  </>;
}, { props: ['source', 'folder', 'select'] });

export function registerFitsSource(host: ComfyApp) {
  host.registerExtension({
    name: 'AstroPhoto.ScientificNodes',
    nodeCreated(node) {
      if (node.comfyClass !== 'AstroPhotoAggregate') return;
      const element = document.createElement('div');
      element.className = 'astrophoto-ui ap-aggregate-note';
      let height = 60;
      const widget = node.addDOMWidget('astrophoto_aggregate_note', 'astrophoto-aggregate-note', element, {
        serialize: false, getMinHeight: () => height, getHeight: () => height,
      });
      widget.serialize = false;
      trackDomWidget(widget);
      let locale: 'zh' | 'en' = 'en';
      const labelInputs = () => {
        for (const input of node.inputs ?? []) {
          const match = /^item(\d+)$/.exec(input.name);
          if (match) input.label = `${locale === 'zh' ? '来源' : 'Source'} ${Number(match[1]) + 1}`;
        }
        node.setDirtyCanvas(true, true);
      };
      const added = node.onInputAdded;
      node.onInputAdded = function (input) {
        added?.call(this, input);
        const match = /^item(\d+)$/.exec(input.name);
        if (match) input.label = `${locale === 'zh' ? '来源' : 'Source'} ${Number(match[1]) + 1}`;
        labelInputs();
      };
      const configured = node.onConfigure;
      node.onConfigure = function (data) {
        configured?.call(this, data);
        labelInputs();
      };
      const stopLocale = watchLocale(host, element, value => { locale = value; labelInputs(); });
      const Note = defineComponent(() => { const { t } = useI18n(); return () => <small>{t('fits.aggregateHint')}</small>; });
      const dispose = mountWidget(host, element, Note, {});
      const observer = new ResizeObserver(() => {
        const next = Math.max(60, element.scrollHeight);
        if (next !== height && node.graph) { height = next; node.setSize([node.size[0], node.computeSize()[1]]); }
      });
      observer.observe(element);
      const remove = widget.onRemove;
      widget.onRemove = () => { stopLocale(); observer.disconnect(); dispose(); remove?.call(widget); };
    },
    getCustomWidgets() {
      type Widgets = Awaited<ReturnType<NonNullable<Parameters<ComfyApp['registerExtension']>[0]['getCustomWidgets']>>>;
      const picker = (folder: boolean): Widgets[string] => (node, name) => {
        const source = ref('');
        const element = document.createElement('div');
        element.className = 'astrophoto-ui ap-fits-source-widget';
        let height = 80;
        const widget = node.addDOMWidget(name, 'astrophoto-source', element, {
          getMinHeight: () => height, getHeight: () => height,
          getValue: () => source.value,
          setValue: value => { source.value = typeof value === 'string' ? value : ''; },
        });
        trackDomWidget(widget);
        const View = defineComponent(() => () => <SourcePicker source={source.value} folder={folder} select={value => {
          if (host.canvas?.read_only || host.canvas?.selectOnly) return;
          widget.value = value;
          node.graph?.change();
        }} />);
        const dispose = mountWidget(host, element, View, {});
        const observer = new ResizeObserver(() => {
          const next = Math.max(80, element.scrollHeight);
          if (next !== height && node.graph) { height = next; node.setSize([node.size[0], node.computeSize()[1]]); }
        });
        observer.observe(element);
        const remove = widget.onRemove;
        widget.onRemove = () => { observer.disconnect(); dispose(); remove?.call(widget); };
        return { widget };
      };
      return { ASTRO_FILE_SOURCE: picker(false), ASTRO_FOLDER_SOURCE: picker(true) };
    },
  });
}

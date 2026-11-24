import { computed, defineComponent, onMounted, onScopeDispose, ref, shallowRef, watch, type ShallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchEquipment, kinds, type Device, type DeviceInput, type Kind, type Train } from '../../../api/equipment';
import { SidebarTabs } from '../../../shared/SidebarTabs';
import { EquipmentError } from '../components/equipmentFields';
import { notifyHost } from '../../../host/notify';
import { confirmAction, useMutation } from '../components/useMutation';
import { EquipmentDetails } from './EquipmentDetails';
import { emptyDevice, EquipmentForm } from './EquipmentForm';
import { EquipmentList } from './EquipmentList';
import { emptyDraft, OpticalTrainEditor, withNewDevice, type TrainEdit } from './OpticalTrainEditor';
import { OpticalTrainDetails } from './OpticalTrainDetails';
import '../components/equipment.css';

type Page = { name: 'equipment-list' | 'equipment-type' | 'train-list' | 'train-form' }
  | { name: 'equipment-form'; kind: Kind; original: Device | null; quick?: boolean }
  | { name: 'equipment-detail'; id: string }
  | { name: 'train-detail'; id: string };
const views = ['devices', 'trains'] as const;
type View = typeof views[number];
export type LeaveGuard = ShallowRef<(() => Promise<boolean>) | null>;
type Session = { page: Page; deviceInput: DeviceInput; deviceDirty: boolean; train: TrainEdit };
export type EquipmentSession = { current?: Session };
const freshTrain = (): TrainEdit => ({ id: null, expected: null, data: emptyDraft, saved: null });

export const EquipmentPage = defineComponent((props: {
  guard: LeaveGuard;
  session: EquipmentSession;
  trainAvailable: boolean;
  onBack: () => void;
}) => {
  const { t } = useI18n();
  const saved = props.session.current;
  const page = shallowRef<Page>(saved?.page ?? { name: 'equipment-list' });
  const deviceInput = shallowRef(saved?.deviceInput ?? emptyDevice);
  const deviceDirty = ref(saved?.deviceDirty ?? false);
  const train = shallowRef(saved?.train ?? freshTrain());
  const deviceSearch = shallowRef({ q: '', filter: '' });
  const trainSearch = shallowRef({ q: '', filter: '' });
  const epoch = ref(0);
  const receipt = ref('');
  const restored = ref(Boolean(saved));
  const parent = ref<HTMLDivElement | null>(null);
  const active = computed<View>(() => page.value.name.startsWith('train-') ? 'trains' : 'devices');
  const hasQuick = computed(() => page.value.name === 'equipment-form' && page.value.quick);
  const dirty = computed(() => deviceDirty.value || (
    (page.value.name === 'train-form' || hasQuick.value) &&
    JSON.stringify(train.value.data) !== JSON.stringify(train.value.saved ?? emptyDraft)
  ));
  const reload = useMutation();
  const trainVisited = ref(active.value === 'trains');

  watch([dirty, page, deviceInput, deviceDirty, train], () => {
    props.session.current = dirty.value ? {
      page: page.value, deviceInput: deviceInput.value, deviceDirty: deviceDirty.value, train: train.value,
    } : undefined;
  }, { immediate: true, flush: 'sync' });

  function isBusy() {
    return Boolean(parent.value?.querySelector('form[aria-busy="true"]'));
  }

  async function leave() {
    return !isBusy() && (!dirty.value || await confirmAction(t('equipment.unsaved'), t('equipment.discardConfirm')));
  }

  async function discardAndLeave() {
    if (!await leave()) return false;
    deviceDirty.value = false;
    train.value = freshTrain();
    page.value = { name: 'equipment-list' };
    props.session.current = undefined;
    return true;
  }

  onMounted(() => { props.guard.value = discardAndLeave; });
  onScopeDispose(() => {
    if (props.guard.value === discardAndLeave) props.guard.value = null;
  });

  watch(dirty, (value, _, onCleanup) => {
    if (!value) return;
    const prevent = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', prevent);
    onCleanup(() => window.removeEventListener('beforeunload', prevent));
  }, { immediate: true });

  function focusCurrent() {
    parent.value?.querySelector<HTMLElement>('[data-current="true"]')?.focus({ preventScroll: true });
  }
  onMounted(focusCurrent);
  watch(() => page.value.name, focusCurrent, { flush: 'post' });

  function changed(message: string) {
    receipt.value = notifyHost('success', t('equipment.' + message)) ? '' : message;
    epoch.value += 1;
  }

  function show(target: Page) {
    receipt.value = '';
    restored.value = false;
    page.value = target;
  }

  async function switchView(view: View) {
    const list = view === 'devices' ? 'equipment-list' : 'train-list';
    if (page.value.name === list || !await leave()) return;
    deviceDirty.value = false;
    train.value = freshTrain();
    if (view === 'trains') trainVisited.value = true;
    show({ name: list });
  }

  function openTrain(id: string) {
    trainVisited.value = true;
    show({ name: 'train-detail', id });
  }

  function editDevice(kind: Kind, original: Device | null, quick = false) {
    deviceInput.value = original ? {
      name: original.name, product_name: original.product_name, notes: original.notes,
    } : emptyDevice;
    deviceDirty.value = false;
    show({ name: 'equipment-form', kind, original, quick });
  }

  function startTrain(record?: Train) {
    const saved = record ? {
      name: record.name, notes: record.notes, camera_id: record.camera_id, primary_optics_id: record.primary_optics_id,
      accessory_id: record.accessory_id, filter_ids: record.filter_ids, other_ids: record.other_ids,
    } : null;
    train.value = {
      id: record?.id ?? null, expected: record?.row_version ?? null,
      data: saved ?? emptyDraft, saved,
    };
    show({ name: 'train-form' });
  }

  async function back() {
    if (isBusy()) return;
    const current = page.value;
    if (current.name === 'equipment-form' && current.quick) {
      if (deviceDirty.value && !await confirmAction(t('equipment.unsaved'), t('equipment.discardConfirm'))) return;
      deviceDirty.value = false;
      show({ name: 'train-form' });
      return;
    }
    if (!await leave()) return;
    const trainId = train.value.id;
    deviceDirty.value = false;
    train.value = freshTrain();
    props.session.current = undefined;
    switch (current.name) {
      case 'equipment-list': case 'train-list': props.onBack(); break;
      case 'equipment-type': case 'equipment-detail': show({ name: 'equipment-list' }); break;
      case 'equipment-form': show(current.original ? { name: 'equipment-detail', id: current.original.id } : { name: 'equipment-type' }); break;
      case 'train-form':
        if (trainId) openTrain(trainId);
        else show({ name: 'train-list' });
        break;
      case 'train-detail': show({ name: 'train-list' }); break;
    }
  }

  function updateDevice(input: DeviceInput) {
    deviceInput.value = input;
    deviceDirty.value = true;
  }

  function savedDevice(device: Device) {
    deviceDirty.value = false;
    if (hasQuick.value) {
      train.value = withNewDevice(train.value, device);
      show({ name: 'train-form' });
    } else show({ name: 'equipment-detail', id: device.id });
    changed('deviceReceipt');
  }

  function reloadDevice(device: Device) {
    const current = page.value;
    if (current.name !== 'equipment-form') return;
    void reload.run(async signal => {
      const fresh = await fetchEquipment(device.id, signal);
      if (!signal.aborted && page.value === current &&
        await confirmAction(t('equipment.reload'), t('equipment.rebaseDeviceConfirm')) &&
        !signal.aborted && page.value === current) page.value = { ...current, original: fresh };
    });
  }

  return () => {
    const current = page.value;
    return <div class="ap-equipment" ref={parent}>
      <div class="ap-equipment-heading">
        <button type="button" class="ap-settings-back" onClick={() => void back()}>{t('actions.back')}</button>
        <h2>{t('modules.equipment.title')}</h2>
      </div>
      <SidebarTabs items={views} active={active.value} prefix="ap-equipment" label={t('modules.equipment.title')}
        title={view => t('equipment.' + view)} select={view => void switchView(view)} />
      {restored.value && <small role="status">{t('equipment.sessionRestored')}</small>}
      {receipt.value && <small role="status">{t('equipment.' + receipt.value)}</small>}
      {dirty.value && <small>{t('equipment.unsaved')}</small>}
      {views.map(view => {
        const isList = current.name === (view === 'devices' ? 'equipment-list' : 'train-list');
        return <div key={view} role="tabpanel" id={'ap-equipment-panel-' + view} aria-labelledby={'ap-equipment-tab-' + view}
          class="ap-equipment-panel" hidden={view !== active.value}>
          <div class="ap-scroll" data-current={view === active.value && isList} tabindex={-1} hidden={!isList}>
            {view === 'devices'
              ? <EquipmentList search={deviceSearch.value} setSearch={value => { deviceSearch.value = value; }} mode="devices" epoch={epoch.value}
                open={id => show({ name: 'equipment-detail', id })} add={() => show({ name: 'equipment-type' })} />
              : !props.trainAvailable ? <p role="status">{t('equipment.unavailable')}</p>
                : trainVisited.value && <EquipmentList search={trainSearch.value} setSearch={value => { trainSearch.value = value; }}
                  mode="trains" epoch={epoch.value} open={openTrain} add={() => startTrain()} />}
          </div>
          {view === active.value && !isList &&
            <div class="ap-scroll" data-current="true" tabindex={-1} key={current.name}>
              {current.name === 'equipment-type' && <><h2>{t('equipment.chooseType')}</h2><ul class="ap-equipment-list">
                {kinds.map(kind => <li key={kind}><button class="ap-equipment-row" type="button" onClick={() => editDevice(kind, null)}>
                  <strong>{t('equipment.values.' + kind)}</strong><small>{t('equipment.typeHint.' + kind)}</small>
                </button></li>)}
              </ul></>}
              {current.name === 'equipment-form' && <>
                <EquipmentForm kind={current.kind} original={current.original} input={deviceInput.value} change={updateDevice}
                  saved={savedDevice} back={() => void back()} reload={reloadDevice} />
                <EquipmentError error={reload.error.value} />
              </>}
              {current.name === 'equipment-detail' && <EquipmentDetails key={current.id} id={current.id} edit={device => editDevice(device.equipment_type, device)}
                openTrain={openTrain} changed={changed} deleted={() => { show({ name: 'equipment-list' }); changed('deletedReceipt'); }} />}
              {current.name === 'train-form' && <OpticalTrainEditor edit={train.value} change={value => { train.value = value; }}
                addDevice={kind => editDevice(kind, null, true)} cancel={() => void back()}
                saved={id => { train.value = freshTrain(); openTrain(id); changed('trainReceipt'); }} />}
              {current.name === 'train-detail' && <OpticalTrainDetails key={current.id} id={current.id} edit={startTrain} changed={changed}
                openDevice={id => show({ name: 'equipment-detail', id })} deleted={() => { show({ name: 'train-list' }); changed('deletedReceipt'); }} />}
            </div>}
        </div>;
      })}
    </div>;
  };
}, { props: ['guard', 'session', 'trainAvailable', 'onBack'] });

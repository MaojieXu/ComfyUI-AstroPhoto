import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchEquipment, kinds, type Device, type DeviceInput, type Kind, type Train } from '../../../api/equipment';
import { SidebarTabs } from '../../../shared/SidebarTabs';
import { EquipmentDetails } from './EquipmentDetails';
import { emptyDevice, EquipmentForm } from './EquipmentForm';
import { RecordList } from './EquipmentList';
import { emptyDraft, OpticalTrainEditor, withNewDevice, type TrainEdit } from './OpticalTrainEditor';
import { OpticalTrainDetails } from './OpticalTrainDetails';
import { confirmAction, EquipmentError, useMutation } from './shared';

type Page = { name: 'equipment-list' | 'equipment-type' | 'train-list' | 'train-form' } |
  { name: 'equipment-form'; kind: Kind; original: Device | null; quick?: boolean } |
  { name: 'equipment-detail'; id: string } | { name: 'train-detail'; id: string };
type Internal = 'devices' | 'trains';
const views = ['devices', 'trains'] as const;
export type LeaveGuard = MutableRefObject<(() => Promise<boolean>) | null>;

type Session = { page: Page; deviceInput: DeviceInput; deviceDirty: boolean; train: TrainEdit };
export type EquipmentSession = { current?: Session };
const freshTrain = (): TrainEdit => ({ id: null, expected: null, data: emptyDraft, saved: null });

export function EquipmentPage({ guard, session, trainAvailable, onBack }: {
  guard: LeaveGuard; session: EquipmentSession; trainAvailable: boolean; onBack: () => void;
}) {
  const { t } = useTranslation();
  const [page, setPage] = useState<Page>(() => session.current?.page ?? { name: 'equipment-list' });
  const [deviceInput, setDeviceInput] = useState(() => session.current?.deviceInput ?? emptyDevice);
  const [deviceDirty, setDeviceDirty] = useState(() => session.current?.deviceDirty ?? false);
  const [train, setTrain] = useState(() => session.current?.train ?? freshTrain());
  const [deviceSearch, setDeviceSearch] = useState({ q: '', filter: '' });
  const [trainSearch, setTrainSearch] = useState({ q: '', filter: '' });
  const [epoch, bump] = useState(0);
  const [receipt, setReceipt] = useState('');
  const [restored, setRestored] = useState(Boolean(session.current));
  const parent = useRef<HTMLDivElement>(null);
  const active: Internal = page.name.startsWith('train-') ? 'trains' : 'devices';
  const hasQuick = page.name === 'equipment-form' && page.quick;
  const trainDirty = (page.name === 'train-form' || hasQuick) &&
    (JSON.stringify(train.data) !== JSON.stringify(train.saved ?? emptyDraft));
  const dirty = deviceDirty || trainDirty;
  const reload = useMutation();
  const [trainVisited, setTrainVisited] = useState(active === 'trains');

  useEffect(() => {
    session.current = dirty ? { page, deviceInput, deviceDirty, train } : undefined;
  }, [session, dirty, page, deviceInput, deviceDirty, train]);

  const leave = useCallback(async () => !parent.current?.querySelector('form[aria-busy="true"]') &&
    (!dirty || await confirmAction(t('equipment.unsaved'), t('equipment.discardConfirm'))), [dirty, t]);

  useEffect(() => {
    guard.current = async () => {
      if (!await leave()) return false;
      session.current = undefined;
      setDeviceDirty(false);
      setTrain(freshTrain());
      setPage({ name: 'equipment-list' });
      return true;
    };
    return () => { guard.current = null; };
  }, [guard, leave, session]);
  useEffect(() => {
    if (!dirty) return;
    const prevent = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', prevent);
    return () => window.removeEventListener('beforeunload', prevent);
  }, [dirty]);

  useEffect(() => {
    parent.current?.querySelector<HTMLElement>('[data-current="true"]')?.focus({ preventScroll: true });
  }, [page.name]);

  const changed = (message: string) => { setReceipt(message); bump(value => value + 1); };
  const show = (target: Page) => { setReceipt(''); setRestored(false); setPage(target); };
  const switchView = (view: Internal) => {
    const list = view === 'devices' ? 'equipment-list' : 'train-list';
    if (page.name === list) return;
    void (async () => {
      if (!await leave()) return;
      setDeviceDirty(false); setTrain(freshTrain());
      if (view === 'trains') setTrainVisited(true);
      show({ name: list });
    })();
  };
  const openTrain = (id: string) => { setTrainVisited(true); show({ name: 'train-detail', id }); };
  const editDevice = (kind: Kind, original: Device | null, quick = false) => {
    setDeviceInput(original ? { name: original.name, manufacturer: original.manufacturer,
      model: original.model, notes: original.notes, specs: original.specs } : emptyDevice);
    setDeviceDirty(false);
    show({ name: 'equipment-form', kind, original, quick });
  };
  const startTrain = (record?: Train) => {
    const saved = record?.configuration?.draft ?? null;
    setTrain({ id: record?.id ?? null, expected: record?.configuration?.draft_version ?? null,
      data: saved ?? (record ? { ...emptyDraft, name: record.name, notes: record.notes } : emptyDraft), saved });
    show({ name: 'train-form' });
  };
  async function back() {
    if (parent.current?.querySelector('form[aria-busy="true"]')) return;
    if (hasQuick) {
      if (deviceDirty && !await confirmAction(t('equipment.unsaved'), t('equipment.discardConfirm'))) return;
      setDeviceDirty(false); show({ name: 'train-form' }); return;
    }
    if (!await leave()) return;
    setDeviceDirty(false); setTrain(freshTrain()); session.current = undefined;
    switch (page.name) {
      case 'equipment-list': case 'train-list': onBack(); break;
      case 'equipment-type': case 'equipment-detail': show({ name: 'equipment-list' }); break;
      case 'equipment-form': show(page.original ? { name: 'equipment-detail', id: page.original.id } : { name: 'equipment-type' }); break;
      case 'train-form':
        if (train.id) openTrain(train.id);
        else show({ name: 'train-list' });
        break;
      case 'train-detail': show({ name: 'train-list' }); break;
    }
  }
  return <div className="ap-equipment" ref={parent}>
    <div className="ap-equipment-heading">
      <button type="button" className="ap-settings-back" onClick={() => void back()}>{t('actions.back')}</button>
      <h2>{t('modules.equipment.title')}</h2>
    </div>
    <SidebarTabs items={views} active={active} prefix="ap-equipment" label={t('modules.equipment.title')}
      title={view => t('equipment.' + view)} select={switchView} />
    {restored && <small role="status">{t('equipment.sessionRestored')}</small>}
    {receipt && <small role="status">{t('equipment.' + receipt)}</small>}
    {dirty && <small>{t('equipment.unsaved')}</small>}
    {views.map(view => <div key={view} role="tabpanel" id={'ap-equipment-panel-' + view} aria-labelledby={'ap-equipment-tab-' + view}
      className="ap-equipment-panel" hidden={view !== active}>
      <div className="ap-scroll" data-current={view === active && page.name === (view === 'devices' ? 'equipment-list' : 'train-list')}
        tabIndex={-1} hidden={page.name !== (view === 'devices' ? 'equipment-list' : 'train-list')}>
        {view === 'devices' ? <RecordList search={deviceSearch} setSearch={setDeviceSearch} mode="devices" epoch={epoch}
          open={id => show({ name: 'equipment-detail', id })} add={() => show({ name: 'equipment-type' })} /> :
          !trainAvailable ? <p role="status">{t('equipment.unavailable')}</p> :
            trainVisited && <RecordList search={trainSearch} setSearch={setTrainSearch} mode="trains" epoch={epoch}
              open={openTrain} add={() => startTrain()} />}
      </div>
      {view === active && page.name !== 'equipment-list' && page.name !== 'train-list' &&
        <div className="ap-scroll" data-current="true" tabIndex={-1} key={page.name}>
          {page.name === 'equipment-type' && <><h2>{t('equipment.chooseType')}</h2><ul className="ap-equipment-list">
            {kinds.map(kind => <li key={kind}><button className="ap-equipment-row" type="button" onClick={() => editDevice(kind, null)}>
              <strong>{t('equipment.values.' + kind)}</strong><small>{t('equipment.typeHint.' + kind)}</small>
            </button></li>)}
          </ul></>}
          {page.name === 'equipment-form' && <>
            <EquipmentForm kind={page.kind} original={page.original} input={deviceInput} change={input => {
              setDeviceInput(input); setDeviceDirty(true);
            }} saved={device => {
              setDeviceDirty(false);
              if (page.quick) { setTrain(withNewDevice(train, device)); show({ name: 'train-form' }); }
              else show({ name: 'equipment-detail', id: device.id });
              changed('deviceReceipt');
            }} back={() => void back()} reload={device => void reload.run(async signal => {
              const current = await fetchEquipment(device.id, signal);
              if (!signal.aborted && await confirmAction(t('equipment.reload'), t('equipment.rebaseDeviceConfirm'))) {
                setPage({ ...page, original: current });
              }
            })} /><EquipmentError error={reload.error} />
          </>}
          {page.name === 'equipment-detail' && <EquipmentDetails key={page.id} id={page.id} edit={device => editDevice(device.equipment_type, device)}
            openTrain={openTrain} changed={changed} deleted={() => { show({ name: 'equipment-list' }); changed('deletedReceipt'); }} />}
          {page.name === 'train-form' && <OpticalTrainEditor edit={train} change={setTrain}
            addDevice={kind => editDevice(kind, null, true)} cancel={() => void back()}
            saved={id => { setTrain(freshTrain()); openTrain(id); changed('trainReceipt'); }} />}
          {page.name === 'train-detail' && <OpticalTrainDetails key={page.id} id={page.id} edit={startTrain} changed={changed}
            openDevice={id => show({ name: 'equipment-detail', id })} deleted={() => { show({ name: 'train-list' }); changed('deletedReceipt'); }} />}
        </div>}
    </div>)}
  </div>;
}

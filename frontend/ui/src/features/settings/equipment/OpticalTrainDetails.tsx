import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteTrain, fetchTrain, setTrainArchived, type Device, type Train } from '../../../api/equipment';
import { useResource } from '../../../shared/useResource';
import { SpecDetails } from './EquipmentForm';
import { DetailAccordion } from './DetailAccordion';
import { DetailActions } from './DetailActions';
import { confirmAction, Content, displayNumber, EquipmentError, useMutation } from './shared';

export function OpticalTrainDetails({ id, edit, changed, openDevice, deleted }: {
  id: string; edit: (train: Train) => void; changed: (message: string) => void; openDevice: (id: string) => void; deleted: () => void;
}) {
  const { t } = useTranslation();
  const load = useCallback((signal: AbortSignal) => fetchTrain(id, signal), [id]);
  const train = useResource(load);
  const action = useMutation();
  return <Content resource={train.resource} retry={train.refresh}>{current => {
    const archived = current.status === 'archived';
    return <>
      <div className="ap-detail-card"><h2>{current.name}</h2>
        <small>{t(current.status === 'published' ? 'equipment.configured' : 'equipment.values.' + current.status)}</small>
        <TrainEstimate train={current} />
      </div>
      <CurrentConfiguration train={current} openDevice={openDevice} />
      <EquipmentError error={action.error} retry={action.error?.status === 409 ? train.refresh : undefined} />
      <DetailActions editLabel={t('equipment.editTrain')} archived={archived} pending={action.pending}
        onEdit={archived ? undefined : () => edit(current)} onArchive={() => void action.run(async signal => {
          if (!archived && !await confirmAction(t('equipment.archive'), t('equipment.archiveTrainConfirm'), current.name)) return;
          if (signal.aborted) return;
          const result = await setTrainArchived(current, signal);
          if (!signal.aborted) { changed(result.status === 'archived' ? 'archivedReceipt' : 'restoredReceipt'); train.refresh(); }
        })} onDelete={() => void action.run(async signal => {
          if (!await confirmAction(t('equipment.deleteTrain'), t('equipment.deleteTrainConfirm'), current.name, 'delete') || signal.aborted) return;
          await deleteTrain(current, signal);
          if (!signal.aborted) deleted();
        })} />
    </>;
  }}</Content>;
}

function TrainEstimate({ train }: { train: Train }) {
  const { t } = useTranslation();
  const configuration = train.configuration?.draft;
  if (!configuration) return null;
  const devices = new Map(train.components?.map(device => [device.id, device]));
  const optics = configuration.primary_optics_id ? devices.get(configuration.primary_optics_id) : undefined;
  const focal = optics?.specs.native_focal_length_mm;
  const aperture = optics?.specs.aperture_mm;
  const factors = configuration.accessory_ids.map(id => devices.get(id)?.specs.nominal_factor);
  if (typeof focal !== 'number' || focal <= 0 || !factors.every(value => typeof value === 'number' && value > 0)) return null;
  const estimate = factors.reduce<number>((value, factor) => value * Number(factor), focal);
  if (!Number.isFinite(estimate) || estimate <= 0) return null;
  return <p>{t('equipment.estimate')} · {displayNumber(estimate)} mm
    {typeof aperture === 'number' && aperture > 0 && Number.isFinite(estimate / aperture) && ' · ƒ/' + displayNumber(estimate / aperture)}</p>;
}

function CurrentConfiguration({ train, openDevice }: { train: Train; openDevice: (id: string) => void }) {
  const { t } = useTranslation();
  const configuration = train.configuration?.draft;
  if (!configuration) return <p>{t('equipment.noConfiguration')}</p>;
  const devices = new Map(train.components?.map(device => [device.id, device]));
  const label = (id: string | null) => id ? devices.get(id)?.name ?? id : t('equipment.unspecified');
  const entry = (id: string) => <DeviceEntry id={id} device={devices.get(id)} openDevice={openDevice} />;
  return <>
    <DetailAccordion title={t('equipment.currentConfiguration')} initiallyOpen>
      {configuration.notes && <p>{configuration.notes}</p>}
      <dl className="ap-equipment-definitions">
        <div><dt>{t('equipment.fields.camera_id')}</dt><dd>{label(configuration.camera_id)}</dd></div>
        <div><dt>{t('equipment.fields.primary_optics_id')}</dt><dd>{label(configuration.primary_optics_id)}</dd></div>
        <div><dt>{t('equipment.fields.accessory_ids')} · {configuration.accessory_ids.length}</dt><dd>{configuration.accessory_ids.map(label).join(', ') || t('equipment.unspecified')}</dd></div>
        <div><dt>{t('equipment.fields.filter_ids')} · {configuration.filter_ids.length}</dt><dd>{configuration.filter_ids.map(label).join(', ') || t('equipment.unspecified')}</dd></div>
      </dl>
    </DetailAccordion>
    <DetailAccordion title={t('equipment.componentDetails')} count={String([configuration.camera_id, configuration.primary_optics_id, ...configuration.accessory_ids].filter(Boolean).length)}>
      {[configuration.camera_id, configuration.primary_optics_id, ...configuration.accessory_ids].map(id => id && <div key={id}>{entry(id)}</div>)}
    </DetailAccordion>
    <DetailAccordion title={t('equipment.fields.filter_ids')} count={String(configuration.filter_ids.length)}>
      {configuration.filter_ids.length ? configuration.filter_ids.map(id => <div key={id}>{entry(id)}</div>) : <p>{t('equipment.unspecified')}</p>}
    </DetailAccordion>
  </>;
}

function DeviceEntry({ id, device, openDevice }: { id: string; device?: Device; openDevice: (id: string) => void }) {
  const { t } = useTranslation();
  if (!device) return <p>{t('equipment.invalidDevice')} · {id}</p>;
  return <details><summary>{device.name} · {t('equipment.values.' + device.equipment_type)}
    {device.archived_at_utc && ' · ' + t('equipment.values.archived')}</summary>
    <button type="button" onClick={() => openDevice(id)}>{device.name}</button>
    <small>{[device.manufacturer, device.model].filter(Boolean).join(' · ')}</small>
    {device.notes && <p>{device.notes}</p>}
    <SpecDetails specs={device.specs} kind={device.equipment_type} />
  </details>;
}

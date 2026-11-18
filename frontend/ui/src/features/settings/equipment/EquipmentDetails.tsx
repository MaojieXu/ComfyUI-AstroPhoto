import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteEquipment, fetchEquipment, setEquipmentArchived, type Device } from '../../../api/equipment';
import { useResource } from '../../../shared/useResource';
import { advanced, mainFields, SpecDetails } from './EquipmentForm';
import { DetailAccordion } from './DetailAccordion';
import { DetailActions } from './DetailActions';
import { confirmAction, Content, EquipmentError, useMutation } from './shared';

export function EquipmentDetails({ id, edit, openTrain, changed, deleted }: {
  id: string; edit: (device: Device) => void; openTrain: (id: string) => void;
  changed: (message: string) => void; deleted: () => void;
}) {
  const { t } = useTranslation();
  const load = useCallback((signal: AbortSignal) => fetchEquipment(id, signal), [id]);
  const { resource, refresh } = useResource(load);
  const action = useMutation();
  const [showReferences, setShowReferences] = useState(false);
  return <Content resource={resource} retry={refresh}>{device => {
    const usage = device.usage_summary ?? [];
    const fields = [...mainFields[device.equipment_type], ...(device.equipment_type === 'camera' ? advanced : [])];
    const filled = fields.filter(key => device.specs[key] !== null && device.specs[key] !== undefined && device.specs[key] !== '');
    const basics = (['manufacturer', 'model', 'notes'] as const).filter(key => Boolean(device[key]?.trim()));
    return <>
      <div className="ap-detail-card"><h2>{device.name}</h2>
        <small>{t('equipment.values.' + device.equipment_type)} · {t(device.archived_at_utc ? 'equipment.values.archived' : 'equipment.inUse')}</small>
        <dl className="ap-equipment-definitions">{filled.slice(0, 4).map(key =>
          <div key={key}><dt>{t('equipment.fields.' + key)}</dt><dd>{typeof device.specs[key] === 'boolean' || ['sensor_kind','optics_kind','accessory_kind','filter_kind'].includes(key) ? t('equipment.values.' + device.specs[key]) : String(device.specs[key])}</dd></div>)}</dl>
      </div>
      <DetailAccordion title={t('equipment.basics')} initiallyOpen>
        {basics.length ? <dl className="ap-equipment-definitions">{basics.map(key =>
          <div key={key}><dt>{t('equipment.fields.' + key)}</dt><dd>{device[key]}</dd></div>)}</dl> : <p>{t('equipment.noBasicInformation')}</p>}
      </DetailAccordion>
      <DetailAccordion title={t('equipment.specs')} count={filled.length + ' / ' + fields.length}>
        <SpecDetails specs={device.specs} kind={device.equipment_type} />
      </DetailAccordion>
      <DetailAccordion title={t('equipment.usage')} count={String(usage.length)}>
        {usage.length ? <ul>{usage.map(item => <li key={item.train_id}>
          <button type="button" onClick={() => openTrain(item.train_id)}>{item.name}</button>
        </li>)}</ul> : <p>{t('equipment.noUsage')}</p>}
      </DetailAccordion>
      <EquipmentError error={action.error} retry={action.error?.status === 409 ? refresh : undefined} />
      <DetailActions editLabel={t('equipment.editAction')} archived={Boolean(device.archived_at_utc)} pending={action.pending}
        onEdit={() => edit(device)} onArchive={() => void action.run(async signal => {
          if (!device.archived_at_utc && !await confirmAction(t('equipment.archive'), t('equipment.archiveDeviceConfirm'), device.name)) return;
          if (signal.aborted) return;
          const result = await setEquipmentArchived(device, signal);
          if (!signal.aborted) { changed(result.archived_at_utc ? 'archivedReceipt' : 'restoredReceipt'); refresh(); }
        })} onDelete={() => void action.run(async signal => {
          if (usage.length) { setShowReferences(true); return; }
          if (!await confirmAction(t('equipment.deleteDevice'), t('equipment.deleteDeviceConfirm'), device.name, 'delete') || signal.aborted) return;
          await deleteEquipment(device, signal);
          if (!signal.aborted) deleted();
        })} />
      {showReferences && usage.length > 0 && <div role="alert" className="ap-equipment-error">
        <p>{t('equipment.deleteReferenced')}</p>
        <ul>{usage.map(item => <li key={item.train_id}>
          <button type="button" onClick={() => openTrain(item.train_id)}>{item.name}</button>
        </li>)}</ul>
      </div>}
    </>;
  }}</Content>;
}

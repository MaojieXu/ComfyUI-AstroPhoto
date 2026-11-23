import { notifyHost } from '../../../host/notify';
import { computed, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { deleteEquipment, fetchEquipment, setEquipmentArchived, type Device } from '../../../api/equipment';
import { useResource } from '../../../shared/useResource';
import { advancedFields, mainFields, SpecDetails } from './EquipmentForm';
import { DetailAccordion } from '../components/DetailAccordion';
import { DetailActions } from '../components/DetailActions';
import { confirmAction, useMutation } from '../components/useMutation';
import { EquipmentError, renderEquipmentError } from '../components/equipmentFields';
import { ResourceContent } from '../components/ResourceContent';

export const EquipmentDetails = defineComponent((props: {
  id: string; edit: (device: Device) => void; openTrain: (id: string) => void;
  changed: (message: string) => void; deleted: () => void;
}) => {
  const { t } = useI18n();
  const load = computed(() => {
    const id = props.id;
    return (signal: AbortSignal) => fetchEquipment(id, signal);
  });
  const { resource, refresh } = useResource(load);
  const action = useMutation();
  const showReferences = ref(false);
  return () => {
    const { edit, openTrain, changed, deleted } = props;
    return <ResourceContent resource={resource.value} loadingLabel={t('states.loading')} retry={refresh} renderError={renderEquipmentError} renderContent={device => {
      const usage = device.usage_summary ?? [];
      const fields = [...mainFields[device.equipment_type], ...advancedFields[device.equipment_type]];
      const filled = fields.filter(key => device.specs[key] !== null && device.specs[key] !== undefined && device.specs[key] !== '');
      const basics = (['manufacturer', 'model', 'notes'] as const).filter(key => Boolean(device[key]?.trim()));
      return <>
        <div class="ap-detail-card"><h2>{device.name}</h2>
          <small>{t('equipment.values.' + device.equipment_type)} · {t(device.archived_at_utc ? 'equipment.values.archived' : 'equipment.inUse')}</small>
          <dl class="ap-equipment-definitions">{filled.slice(0, 4).map(key =>
            <div key={key}><dt>{t('equipment.fields.' + key)}</dt><dd>{typeof device.specs[key] === 'boolean' || ['sensor_kind','optics_kind','accessory_kind','filter_kind'].includes(key) ? t('equipment.values.' + device.specs[key]) : String(device.specs[key])}</dd></div>)}</dl>
        </div>
        <DetailAccordion title={t('equipment.basics')} initiallyOpen v-slots={{ default: () => basics.length
          ? <dl class="ap-equipment-definitions">{basics.map(key =>
            <div key={key}><dt>{t('equipment.fields.' + key)}</dt><dd>{device[key]}</dd></div>)}</dl>
          : <p>{t('equipment.noBasicInformation')}</p> }} />
        <DetailAccordion title={t('equipment.specs')} count={filled.length + ' / ' + fields.length}
          v-slots={{ default: () => <SpecDetails specs={device.specs} kind={device.equipment_type} /> }} />
        <DetailAccordion title={t('equipment.usage')} count={String(usage.length)} v-slots={{ default: () => usage.length
          ? <ul>{usage.map(item => <li key={item.train_id}>
            <button type="button" onClick={() => openTrain(item.train_id)}>{item.name}</button>
          </li>)}</ul> : <p>{t('equipment.noUsage')}</p> }} />
        <EquipmentError transient error={action.error.value} retry={action.error.value?.status === 409 ? refresh : undefined} />
        <DetailActions editLabel={t('equipment.editAction')} archived={Boolean(device.archived_at_utc)} pending={action.pending.value}
          onEdit={() => edit(device)} onArchive={() => void action.run(async signal => {
            if (!device.archived_at_utc && !await confirmAction(t('equipment.archive'), t('equipment.archiveDeviceConfirm'), device.name)) return;
            if (signal.aborted) return;
            const result = await setEquipmentArchived(device, signal);
            if (!signal.aborted) { changed(result.archived_at_utc ? 'archivedReceipt' : 'restoredReceipt'); refresh(); }
          })} onDelete={() => void action.run(async signal => {
            if (usage.length) { showReferences.value = true; notifyHost('warning', t('equipment.deleteReferenced')); return; }
            if (!await confirmAction(t('equipment.deleteDevice'), t('equipment.deleteDeviceConfirm'), device.name, 'delete') || signal.aborted) return;
            await deleteEquipment(device, signal);
            if (!signal.aborted) deleted();
          })} />
        {showReferences.value && usage.length > 0 && <div role="alert" class="ap-equipment-error">
          <p>{t('equipment.deleteReferenced')}</p>
          <ul>{usage.map(item => <li key={item.train_id}>
            <button type="button" onClick={() => openTrain(item.train_id)}>{item.name}</button>
          </li>)}</ul>
        </div>}
      </>;
    }} />;
  };
}, { props: ['id', 'edit', 'openTrain', 'changed', 'deleted'] });

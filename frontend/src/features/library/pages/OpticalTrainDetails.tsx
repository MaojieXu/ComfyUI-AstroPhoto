import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { deleteTrain, fetchTrain, setTrainArchived, type Train } from '../../../api/equipment';
import { useResource } from '../../../shared/useResource';
import { DetailAccordion } from '../components/DetailAccordion';
import { DetailActions } from '../components/DetailActions';
import { confirmAction, useMutation } from '../components/useMutation';
import { EquipmentError, renderEquipmentError } from '../components/equipmentFields';
import { ResourceContent } from '../components/ResourceContent';

export const OpticalTrainDetails = defineComponent((props: {
  id: string; edit: (train: Train) => void; changed: (message: string) => void; openDevice: (id: string) => void; deleted: () => void;
}) => {
  const { t } = useI18n();
  const load = computed(() => {
    const id = props.id;
    return (signal: AbortSignal) => fetchTrain(id, signal);
  });
  const train = useResource(load);
  const action = useMutation();
  return () => {
    const { edit, changed, openDevice, deleted } = props;
    return <ResourceContent resource={train.resource.value} loadingLabel={t('states.loading')} retry={train.refresh} renderError={renderEquipmentError} renderContent={current => {
      const archived = current.status === 'archived';
      const isDeleted = current.status === 'deleted';
      return <>
        <div class="ap-detail-card"><h2>{current.name}</h2>
          <small>{t(current.status === 'published' ? 'equipment.configured' : 'equipment.values.' + current.status)}</small>
        </div>
        <CurrentConfiguration train={current} openDevice={openDevice} />
        <EquipmentError transient error={action.error.value} retry={action.error.value?.status === 409 ? train.refresh : undefined} />
        {!isDeleted && <DetailActions editLabel={t('equipment.editTrain')} archived={archived} pending={action.pending.value}
          onEdit={archived ? undefined : () => edit(current)} onArchive={() => void action.run(async signal => {
            if (!archived && !await confirmAction(t('equipment.archive'), t('equipment.archiveTrainConfirm'), current.name)) return;
            if (signal.aborted) return;
            const result = await setTrainArchived(current, signal);
            if (!signal.aborted) { changed(result.status === 'archived' ? 'archivedReceipt' : 'restoredReceipt'); train.refresh(); }
          })} onDelete={() => void action.run(async signal => {
            if (!await confirmAction(t('equipment.deleteTrain'), t('equipment.deleteTrainConfirm'), current.name, 'delete') || signal.aborted) return;
            await deleteTrain(current, signal);
            if (!signal.aborted) deleted();
          })} />}
      </>;
    }} />;
  };
}, { props: ['id', 'edit', 'changed', 'openDevice', 'deleted'] });

const CurrentConfiguration = defineComponent((props: { train: Train; openDevice: (id: string) => void }) => {
  const { t } = useI18n();
  return () => {
    const { train } = props;
    const configuration = train;
    const devices = new Map(train.components?.map(device => [device.id, device]));
    const label = (id: string | null) => id ? devices.get(id)?.name ?? id : t('equipment.unspecified');
    return <>
      <DetailAccordion title={t('equipment.currentConfiguration')} initiallyOpen v-slots={{ default: () => <>
        {configuration.notes && <p>{configuration.notes}</p>}
        <dl class="ap-equipment-definitions">
          <div><dt>{t('equipment.fields.camera_id')}</dt><dd>{label(configuration.camera_id)}</dd></div>
          <div><dt>{t('equipment.fields.primary_optics_id')}</dt><dd>{label(configuration.primary_optics_id)}</dd></div>
          <div><dt>{t('equipment.fields.accessory_ids')}</dt><dd>{label(configuration.accessory_id)}</dd></div>
          <div><dt>{t('equipment.fields.filter_ids')} · {configuration.filter_ids.length}</dt><dd>{configuration.filter_ids.map(label).join(', ') || t('equipment.unspecified')}</dd></div>
          <div><dt>{t('equipment.fields.other_ids')} · {configuration.other_ids.length}</dt><dd>{configuration.other_ids.map(label).join(', ') || t('equipment.unspecified')}</dd></div>
        </dl>
      </> }} />
    </>;
  };
}, { props: ['train', 'openDevice'] });

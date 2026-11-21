import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export const DetailActions = defineComponent((props: {
  editLabel: string; archived: boolean; pending: boolean; onEdit?: () => void;
  onArchive: () => void; onDelete: () => void;
}) => {
  const { t } = useI18n();
  return () => {
    const { editLabel, archived, pending, onEdit, onArchive, onDelete } = props;
    return <div class="ap-equipment-actions ap-equipment-detail-actions">
      {onEdit && <button class="ap-equipment-primary" type="button" disabled={pending} onClick={onEdit}>{editLabel}</button>}
      <button type="button" disabled={pending} onClick={onArchive}>{t('equipment.' + (archived ? 'restore' : 'archive'))}</button>
      <button class="ap-equipment-delete" type="button" disabled={pending} onClick={onDelete}>{t('equipment.deleteAction')}</button>
    </div>;
  };
}, { props: ['editLabel', 'archived', 'pending', 'onEdit', 'onArchive', 'onDelete'] });

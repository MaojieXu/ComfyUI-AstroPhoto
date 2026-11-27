import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@comfyorg/design-system/button/Button';

export const DetailActions = defineComponent((props: {
  editLabel: string; archived: boolean; pending: boolean; onEdit?: () => void;
  onArchive: () => void; onDelete: () => void;
}) => {
  const { t } = useI18n();
  return () => {
    const { editLabel, archived, pending, onEdit, onArchive, onDelete } = props;
    return <div class="ap-equipment-actions ap-equipment-detail-actions">
      {onEdit && <Button class="ap-native-button" variant="primary" size="md" disabled={pending} {...{ type: 'button', onClick: onEdit }}>{editLabel}</Button>}
      <Button class="ap-native-button" variant="textonly" size="md" disabled={pending} {...{ type: 'button', onClick: onArchive }}>{t('equipment.' + (archived ? 'restore' : 'archive'))}</Button>
      <Button class="ap-native-button" variant="destructive-textonly" size="md" disabled={pending} {...{ type: 'button', onClick: onDelete }}>{t('equipment.deleteAction')}</Button>
    </div>;
  };
}, { props: ['editLabel', 'archived', 'pending', 'onEdit', 'onArchive', 'onDelete'] });

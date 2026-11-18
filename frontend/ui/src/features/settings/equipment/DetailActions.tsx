import { useTranslation } from 'react-i18next';

export function DetailActions({ editLabel, archived, pending, onEdit, onArchive, onDelete }: {
  editLabel: string; archived: boolean; pending: boolean; onEdit?: () => void;
  onArchive: () => void; onDelete: () => void;
}) {
  const { t } = useTranslation();
  return <div className="ap-equipment-actions ap-equipment-detail-actions">
    {onEdit && <button className="ap-equipment-primary" type="button" disabled={pending} onClick={onEdit}>{editLabel}</button>}
    <button type="button" disabled={pending} onClick={onArchive}>{t('equipment.' + (archived ? 'restore' : 'archive'))}</button>
    <button className="ap-equipment-delete" type="button" disabled={pending} onClick={onDelete}>{t('equipment.deleteAction')}</button>
  </div>;
}

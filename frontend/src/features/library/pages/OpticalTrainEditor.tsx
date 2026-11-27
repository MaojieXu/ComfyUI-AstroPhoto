import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@comfyorg/design-system/button/Button';
import { createTrain, fetchSelectable, fetchTrain, saveTrainDraft, type Device, type Draft, type Kind } from '../../../api/equipment';
import { ApiError } from '../../../api/client';
import { useResource } from '../../../shared/useResource';
import { ComfySingleSelect } from '../../../shared/ComfySingleSelect';
import { ComfyMultiSelect } from '../../../shared/ComfyMultiSelect';
import { confirmAction, useMutation } from '../components/useMutation';
import { EquipmentError, Field, renderEquipmentError } from '../components/equipmentFields';
import { ResourceContent } from '../components/ResourceContent';

export const emptyDraft: Draft = { name: '', notes: null, camera_id: null, primary_optics_id: null,
  accessory_id: null, filter_ids: [], other_ids: [] };
export type TrainEdit = {
  id: string | null; data: Draft; saved: Draft | null;
};
export const OpticalTrainEditor = defineComponent((props: {
  edit: TrainEdit; change: (edit: TrainEdit) => void; addDevice: (kind: Kind) => void; cancel: () => void;
  saved: (id: string) => void;
}) => {
  const { t } = useI18n();
  const choices = useResource(fetchSelectable);
  const action = useMutation();
  return () => {
    const { edit, change, addDevice, cancel, saved } = props;
    const { data } = edit;
    const devices = choices.resource.value.state === 'ready' ? choices.resource.value.data : [];
    const editDraft = (data: Draft) => change({ ...edit, data });
    const pending = action.pending.value;
    const error = action.error.value;
    const selected = [data.camera_id, data.primary_optics_id, data.accessory_id, ...data.filter_ids, ...data.other_ids];
    const invalid = selected.filter(id => id && !devices.some(device => device.id === id && !device.archived_at_utc));
    async function save(signal: AbortSignal) {
      const id = edit.id;
      if (id) {
        if (edit.saved) await saveTrainDraft(id, data, edit.saved, signal);
        if (!signal.aborted) saved(id);
      } else {
        const result = await createTrain(data, signal);
        if (!signal.aborted) saved(result.id);
      }
    }

    const available = (kind: Kind) => devices.filter(device => device.equipment_type === kind && !device.archived_at_utc);
    const name = (id: string) => devices.find(device => device.id === id)?.name ?? id;
    const flag = (id: string) => invalid.includes(id) ? ' · ' + t('equipment.invalidDevice') : '';
    const quickAdd = (kind: Kind) => {
      const label = t('equipment.quickAdd', { type: t('equipment.values.' + kind) });
      return <Button class="ap-native-button ap-equipment-quick-add" variant="textonly" size="icon" aria-label={label}
        {...{ type: 'button', title: label, onClick: () => addDevice(kind) }}>
        <i class="icon-[lucide--plus] size-4" aria-hidden="true" />
      </Button>;
    };
    const options = (kind: Kind, selected: string | null = null) => {
      const values = available(kind);
      return [{ value: '', label: t('equipment.pickDevice') }, ...values.map(device => ({ value: device.id, label: device.name })),
        ...(selected && !values.some(device => device.id === selected) ?
          [{ value: selected, label: name(selected) + flag(selected), disabled: true }] : [])];
    };
    return <form aria-busy={pending} onSubmit={event => {
      event.preventDefault();
      void action.run(save);
    }}>
      <h2>{t('equipment.' + (edit.id ? 'editTrain' : 'addTrain'))}</h2>
      <fieldset disabled={pending}>
        <legend>{t('equipment.basics')}</legend>
        <div class="ap-equipment-grid">
          <Field label={t('equipment.fields.name')} name="name" value={data.name} required error={error}
            onChange={name => editDraft({ ...data, name })} />
          <small>{t('equipment.uniqueTrainNameHint')}</small>
          <Field label={t('equipment.fields.notes')} name="notes" type="textarea" value={data.notes} error={error}
            onChange={notes => editDraft({ ...data, notes: notes || null })} />
        </div>
      </fieldset>
      <ResourceContent resource={choices.resource.value} loadingLabel={t('states.loading')} retry={choices.refresh} renderError={renderEquipmentError} renderContent={() => <>
        <fieldset disabled={pending}><legend>{t('equipment.components')}</legend>
          {(['camera_id', 'primary_optics_id'] as const).map(key => {
            const kind = key === 'camera_id' ? 'camera' : 'primary_optics';
            return <div class="ap-equipment-picker" key={key}>
              <Field label={t('equipment.fields.' + key)} name={key} error={error}
                control={(id, invalid) => <ComfySingleSelect id={id} label={t('equipment.fields.' + key)}
                  value={data[key] ?? ''} options={options(kind, data[key])} disabled={pending} invalid={invalid}
                  onChange={value => editDraft({ ...data, [key]: value || null })} />} />
              {quickAdd(kind)}
            </div>;
          })}
          <div class="ap-equipment-picker">
            <Field label={t('equipment.fields.accessory_ids')} name="accessory_id" error={error}
              control={(id, invalid) => <ComfySingleSelect id={id} label={t('equipment.fields.accessory_ids')} value={data.accessory_id ?? ''}
                options={options('optical_accessory', data.accessory_id)} disabled={pending} invalid={invalid}
                onChange={value => editDraft({ ...data, accessory_id: value || null })} />} />
            {quickAdd('optical_accessory')}
          </div>
          <div class="ap-equipment-picker">
            <div class="ap-equipment-field">
              <span class="ap-equipment-picker-label">{t('equipment.fields.filter_ids')}</span>
              <ComfyMultiSelect label={t('equipment.fields.filter_ids')} placeholder={t('equipment.pickDevice')}
                emptyText={t('equipment.unspecified')} disabled={pending} value={data.filter_ids}
                options={[...new Set([...available('filter').map(device => device.id), ...data.filter_ids])]
                  .map(id => ({ value: id, name: name(id) + flag(id) }))}
                onChange={filter_ids => { if (filter_ids.length <= 50) editDraft({ ...data, filter_ids }); }} />
            </div>
            {quickAdd('filter')}
          </div>
          <div class="ap-equipment-picker">
            <div class="ap-equipment-field">
              <span class="ap-equipment-picker-label">{t('equipment.fields.other_ids')}</span>
              <ComfyMultiSelect label={t('equipment.fields.other_ids')} placeholder={t('equipment.pickDevice')}
                emptyText={t('equipment.unspecified')} disabled={pending} value={data.other_ids}
                options={[...new Set([...available('other').map(device => device.id), ...data.other_ids])]
                  .map(id => ({ value: id, name: name(id) + flag(id) }))}
                onChange={other_ids => { if (other_ids.length <= 50) editDraft({ ...data, other_ids }); }} />
            </div>
            {quickAdd('other')}
          </div>
        </fieldset>
      </>} />
      {choices.resource.value.state === 'ready' && invalid.length > 0 && <small>{t('equipment.invalidDevice')}</small>}
      <EquipmentError error={error} retry={error?.status === 409 && edit.id ? () => void action.run(async signal => {
        const current = await fetchTrain(edit.id!, signal);
        if (current.status === 'archived') throw new ApiError('TRAIN_ARCHIVED');
        if (current.status === 'deleted') throw new ApiError('TRAIN_NOT_FOUND');
        if (!signal.aborted && await confirmAction(t('equipment.reload'), t('equipment.rebaseTrainConfirm')) && !signal.aborted) {
          change({ ...edit });
        }
      }) : undefined} />
      <div class="ap-equipment-actions">
        <Button class="ap-native-button" variant="textonly" size="md" disabled={pending} {...{ type: 'button', onClick: cancel }}>{t('equipment.cancel')}</Button>
        <Button class="ap-native-button" variant="primary" size="md" disabled={pending} {...{ type: 'submit' }}>{t('equipment.save')}</Button>
      </div>
      {pending && <small role="status">{t('equipment.saving')}</small>}
    </form>;
  };
}, { props: ['edit', 'change', 'addDevice', 'cancel', 'saved'] });

export function withNewDevice(edit: TrainEdit, device: Device): TrainEdit {
  const data = { ...edit.data };
  switch (device.equipment_type) {
    case 'camera': data.camera_id = device.id; break;
    case 'primary_optics': data.primary_optics_id = device.id; break;
    case 'optical_accessory': data.accessory_id = device.id; break;
    case 'filter': data.filter_ids = [...data.filter_ids, device.id].slice(0, 50); break;
    case 'other': data.other_ids = [...data.other_ids, device.id].slice(0, 50); break;
  }
  return { ...edit, data };
}

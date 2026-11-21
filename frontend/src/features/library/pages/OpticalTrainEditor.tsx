import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { createTrain, fetchSelectable, fetchTrain, saveTrainDraft, type Device, type Draft, type Kind } from '../../../api/equipment';
import { ApiError } from '../../../api/client';
import { useResource } from '../../../shared/useResource';
import { ComfySingleSelect } from '../../../shared/ComfySingleSelect';
import { ComfyMultiSelect } from '../../../shared/ComfyMultiSelect';
import { confirmAction, useMutation } from '../components/useMutation';
import { displayNumber, EquipmentError, Field, renderEquipmentError } from '../components/equipmentFields';
import { ResourceContent } from '../components/ResourceContent';

export const emptyDraft: Draft = { name: '', notes: null, base_revision_id: null, change_summary: null, camera_id: null, primary_optics_id: null,
  accessory_ids: [], filter_ids: [], optical_state: { rotation_deg: null, flat_validity_note: null, configuration_note: null } };
export type TrainEdit = {
  id: string | null; expected: number | null; data: Draft; saved: Draft | null;
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
    const selected = [data.camera_id, data.primary_optics_id, ...data.accessory_ids, ...data.filter_ids];
    const invalid = selected.filter(id => id && !devices.some(device => device.id === id && !device.archived_at_utc));
    async function save(signal: AbortSignal) {
      const id = edit.id;
      if (id) {
        await saveTrainDraft(id, data, edit.expected, signal);
        if (!signal.aborted) saved(id);
      } else {
        const result = await createTrain(data, signal);
        if (!signal.aborted) saved(result.train.id);
      }
    }

    function move(index: number, delta: number) {
      const ids = [...data.accessory_ids];
      [ids[index], ids[index + delta]] = [ids[index + delta], ids[index]];
      editDraft({ ...data, accessory_ids: ids });
    }
    const available = (kind: Kind) => devices.filter(device => device.equipment_type === kind && !device.archived_at_utc);
    const name = (id: string) => devices.find(device => device.id === id)?.name ?? id;
    const flag = (id: string) => invalid.includes(id) ? ' · ' + t('equipment.invalidDevice') : '';
    const quickAdd = (kind: Kind) => <button type="button" onClick={() => addDevice(kind)}>
      {t('equipment.quickAdd', { type: t('equipment.values.' + kind) })}</button>;
    const options = (kind: Kind, selected: string | null = null, excluding: string[] = []) => {
      const values = available(kind).filter(device => !excluding.includes(device.id));
      return [{ value: '', label: t('equipment.pickDevice') }, ...values.map(device => ({ value: device.id, label: device.name })),
        ...(selected && !values.some(device => device.id === selected) ?
          [{ value: selected, label: name(selected) + flag(selected), disabled: true }] : [])];
    };
    const accessorySpecs = data.accessory_ids.map(id => devices.find(device => device.id === id)?.specs.nominal_factor);
    const optics = devices.find(device => device.id === data.primary_optics_id);
    const native = optics?.specs.native_focal_length_mm;
    const aperture = optics?.specs.aperture_mm;
    const estimate = typeof native === 'number' && accessorySpecs.every(value => typeof value === 'number') &&
      !invalid.length ? accessorySpecs.reduce<number>((value, factor) => value * Number(factor), native) : null;
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
          <h3>{t('equipment.fields.accessory_ids')}</h3>
          <ol class="ap-equipment-list">{data.accessory_ids.map((id, index) => <li key={id}>
            <span>{index + 1}. {name(id)}{flag(id)}</span>
            <div class="ap-equipment-actions">
              <button type="button" disabled={index === 0} onClick={() => move(index, -1)}>{t('equipment.moveUp')}</button>
              <button type="button" disabled={index + 1 === data.accessory_ids.length} onClick={() => move(index, 1)}>{t('equipment.moveDown')}</button>
              <button type="button" onClick={() => editDraft({ ...data, accessory_ids: data.accessory_ids.filter(key => key !== id) })}>{t('equipment.remove')}</button>
            </div>
          </li>)}</ol>
          <div class="ap-equipment-picker">
            <Field label={t('equipment.addAccessory')} name="accessory_ids" error={error}
              control={(id, invalid) => <ComfySingleSelect id={id} label={t('equipment.addAccessory')} value=""
                options={options('optical_accessory', null, data.accessory_ids)} disabled={pending} invalid={invalid}
                onChange={value => { if (value && data.accessory_ids.length < 50) editDraft({ ...data, accessory_ids: [...data.accessory_ids, value] }); }} />} />
            {quickAdd('optical_accessory')}
          </div>
        </fieldset>
        <fieldset disabled={pending}><legend>{t('equipment.fields.filter_ids')}</legend>
          <div class="ap-equipment-picker">
            <div class="ap-equipment-field">
              <ComfyMultiSelect label={t('equipment.fields.filter_ids')} placeholder={t('equipment.pickDevice')}
                emptyText={t('equipment.unspecified')} disabled={pending} value={data.filter_ids}
                options={[...new Set([...available('filter').map(device => device.id), ...data.filter_ids])]
                  .map(id => ({ value: id, name: name(id) + flag(id) }))}
                onChange={filter_ids => { if (filter_ids.length <= 50) editDraft({ ...data, filter_ids }); }} />
            </div>
            {quickAdd('filter')}
          </div>
        </fieldset>
        <small>{t('equipment.estimate')} · {displayNumber(estimate) ?? t('equipment.unspecified')}
          {estimate !== null && ' mm'} · ƒ/{estimate !== null && typeof aperture === 'number' ?
            displayNumber(estimate / aperture) : t('equipment.unspecified')}</small>
      </>} />
      {choices.resource.value.state === 'ready' && invalid.length > 0 && <small>{t('equipment.invalidDevice')}</small>}
      <EquipmentError error={error} retry={error?.status === 409 && edit.id ? () => void action.run(async signal => {
        const current = await fetchTrain(edit.id!, signal);
        if (current.status === 'archived') throw new ApiError('TRAIN_ARCHIVED');
        if (!signal.aborted && await confirmAction(t('equipment.reload'), t('equipment.rebaseTrainConfirm')) && !signal.aborted) {
          change({ ...edit, expected: current.configuration?.draft_version ?? null, saved: current.configuration?.draft ?? null });
        }
      }) : undefined} />
      <div class="ap-equipment-actions">
        <button type="button" disabled={pending} onClick={cancel}>{t('equipment.cancel')}</button>
        <button type="submit" class="ap-equipment-primary" disabled={pending}>{t('equipment.save')}</button>
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
    case 'optical_accessory': data.accessory_ids = [...data.accessory_ids, device.id].slice(0, 50); break;
    case 'filter': data.filter_ids = [...data.filter_ids, device.id].slice(0, 50); break;
  }
  return { ...edit, data };
}

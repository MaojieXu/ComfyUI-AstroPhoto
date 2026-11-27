import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@comfyorg/design-system/button/Button';
import { saveEquipment, type Device, type DeviceInput, type Kind } from '../../../api/equipment';
import { EquipmentError, Field } from '../components/equipmentFields';
import { useMutation } from '../components/useMutation';

export const emptyDevice: DeviceInput = { name: '', product_name: '', notes: null };

export const EquipmentForm = defineComponent((props: {
  kind: Kind; original: Device | null; input: DeviceInput; change: (input: DeviceInput) => void;
  saved: (device: Device) => void; back: () => void; reload: (device: Device) => void;
}) => {
  const { t } = useI18n();
  const action = useMutation();
  const nameEdited = ref(Boolean(props.original));
  return () => {
    const { kind, original, input, change, saved, back, reload } = props;
    const pending = action.pending.value;
    const error = action.error.value;
    return <form aria-busy={pending} onSubmit={event => {
      event.preventDefault();
      void action.run(async signal => {
        const device = await saveEquipment(kind, input, original, signal);
        if (!signal.aborted) saved(device);
      });
    }}>
      <h2>{t('equipment.' + (original ? 'editDevice' : 'addDevice'))} · {t('equipment.values.' + kind)}</h2>
      <fieldset disabled={pending}><legend>{t('equipment.basics')}</legend>
        <div class="ap-equipment-grid">
          <Field label={t('equipment.fields.product_name')} name="product_name" value={input.product_name} required
            error={error} onChange={product_name => change({ ...input, product_name,
              name: nameEdited.value ? input.name : product_name })} />
          <Field label={t('equipment.fields.name')} name="name" value={input.name} required
            error={error} onChange={name => { nameEdited.value = true; change({ ...input, name }); }} />
          <small>{t('equipment.uniqueDeviceNameHint')}</small>
          <Field label={t('equipment.fields.notes')} name="notes" type="textarea" value={input.notes}
            error={error} onChange={notes => change({ ...input, notes: notes || null })} />
        </div>
      </fieldset>
      <EquipmentError error={error} retry={error?.status === 409 && original ? () => reload(original) : undefined} />
      <div class="ap-equipment-actions">
        <Button class="ap-native-button" variant="textonly" size="md" disabled={pending} {...{ type: 'button', onClick: back }}>{t('equipment.cancel')}</Button>
        <Button class="ap-native-button" variant="primary" size="md" disabled={pending} {...{ type: 'submit' }}>{t(pending ? 'equipment.saving' : 'equipment.save')}</Button>
      </div>
    </form>;
  };
}, { props: ['kind', 'original', 'input', 'change', 'saved', 'back', 'reload'] });

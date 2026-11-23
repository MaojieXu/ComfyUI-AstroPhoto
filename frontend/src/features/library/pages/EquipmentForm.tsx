import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { saveEquipment, type Device, type DeviceInput, type Kind, type Mode, type Passband, type Specs } from '../../../api/equipment';
import type { ApiError } from '../../../api/client';
import { DisclosureChevron } from '../../../shared/DisclosureChevron';
import { ComfySingleSelect } from '../../../shared/ComfySingleSelect';
import { EquipmentError, Field, imagingType, numberValue } from '../components/equipmentFields';
import { useMutation } from '../components/useMutation';

export const emptyDevice: DeviceInput = { name: '', notes: null, manufacturer: null, model: null, specs: {} };
const enums: Record<string, string[]> = {
  sensor_kind: ['mono', 'color'],
  optics_kind: ['telescope', 'lens'], accessory_kind: ['reducer', 'flattener', 'barlow'],
  filter_kind: ['l', 'r', 'g', 'b', 'ha', 'oiii', 'sii', 'broadband', 'uv_ir_cut', 'solar', 'dual_band', 'multi_band', 'other'],
};
const positive: Record<string, number> = { sensor_width_px: 1000000, sensor_height_px: 1000000,
  adc_bit_depth: 64, max_bin_x: 1024, max_bin_y: 1024 };
const decimals = new Set(['pixel_size_x_um', 'pixel_size_y_um', 'aperture_mm', 'native_focal_length_mm',
  'native_f_ratio', 'image_circle_mm', 'nominal_factor', 'design_backfocus_mm', 'clear_aperture_mm', 'physical_size_mm']);
export const mainFields: Record<Kind, string[]> = {
  camera: ['sensor_kind', 'sensor_width_px', 'sensor_height_px', 'pixel_size_x_um', 'pixel_size_y_um'],
  primary_optics: ['aperture_mm', 'native_focal_length_mm'],
  optical_accessory: ['accessory_kind', 'nominal_factor'],
  filter: ['filter_kind'],
};
export const advancedFields: Record<Kind, string[]> = {
  camera: ['sensor_name', 'cooling_supported', 'bayer_pattern', 'adc_bit_depth', 'max_bin_x', 'max_bin_y'],
  primary_optics: ['optics_kind', 'optical_design', 'native_f_ratio', 'image_circle_mm', 'optical_notes'],
  optical_accessory: ['design_backfocus_mm', 'clear_aperture_mm', 'optical_notes'],
  filter: ['physical_size_mm', 'filter_format'],
};
const rangeFields = ['gain_min', 'gain_max', 'offset_min', 'offset_max'] as const;
export function bands(specs: Specs) { return (specs.passbands ?? []) as Passband[]; }
function modes(specs: Specs) { return (specs.readout_modes ?? []) as Mode[]; }
const blankBand: Passband = { band_label: '', center_nm: null, fwhm_nm: null };
const blankMode: Mode = { mode_key: '', display_name: '', gain_min: null, gain_max: null, offset_min: null, offset_max: null };

export const EquipmentForm = defineComponent((props: {
  kind: Kind; original: Device | null; input: DeviceInput; change: (input: DeviceInput) => void;
  saved: (device: Device) => void; back: () => void; reload: (device: Device) => void;
}) => {
  const { t } = useI18n();
  const action = useMutation();
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
          <Field label={t('equipment.fields.name')} name="name" value={input.name} required
            error={error} onChange={value => change({ ...input, name: value })} />
        </div>
        <SpecFields kind={kind} input={input} change={change} error={error} disabled={pending} />
      </fieldset>
      <EquipmentError error={error} retry={error?.status === 409 && original ? () => reload(original) : undefined} />
      <div class="ap-equipment-actions">
        <button type="button" disabled={pending} onClick={back}>{t('equipment.cancel')}</button>
        <button class="ap-equipment-primary" disabled={pending} type="submit">{t(pending ? 'equipment.saving' : 'equipment.save')}</button>
      </div>
    </form>;
  };
}, { props: ['kind', 'original', 'input', 'change', 'saved', 'back', 'reload'] });

const SpecFields = defineComponent((props: {
  kind: Kind; input: DeviceInput; change: (input: DeviceInput) => void; error?: ApiError; disabled: boolean;
}) => {
  const { t } = useI18n();
  return () => {
    const { kind, input, error, disabled } = props;
    const specs = input.specs;
    const change = (specs: Specs) => props.change({ ...input, specs });
    function spec(key: string) {
      const numeric = key in positive || decimals.has(key);
      const values = key === 'cooling_supported' ? ['true', 'false'] : enums[key];
      const options = values && [{ value: '', label: t('equipment.unspecified') }, ...values.map(value =>
        ({ value, label: t('equipment.values.' + value) }))];
      const entry = key === 'sensor_kind' ? imagingType(specs[key]) : specs[key];
      const label = t('equipment.fields.' + key);
      const name = 'specs.' + key;
      if (options) return <Field key={key} label={label} name={name} error={error}
        control={(id, invalid) => <ComfySingleSelect id={id} label={label} value={entry == null ? '' : String(entry)}
          options={options} disabled={disabled} invalid={invalid}
          onChange={value => change({ ...specs, [key]: value === '' ? null : key === 'cooling_supported' ? value === 'true' : value })} />} />;
      return <Field key={key} label={label} name={name} value={entry == null ? null : String(entry)} error={error}
        type={numeric ? 'number' : key === 'optical_notes' ? 'textarea' : 'text'}
        min={key === 'design_backfocus_mm' ? 0 : numeric ? (key in positive ? 1 : 0.000000001) : undefined}
        max={numeric ? (positive[key] ?? 1000000) : undefined} step={key in positive ? 1 : 'any'}
        onChange={value => change({ ...specs, [key]: numeric ? numberValue(value) : value || null })} />;
    }
    return <>
      <div class="ap-equipment-grid">{mainFields[kind].map(spec)}</div>
      <details class="ap-equipment-advanced"
        open={Object.keys(error?.fields ?? {}).some(key => ['manufacturer', 'model', 'notes'].includes(key) ||
          advancedFields[kind].includes(key.replace(/^specs\./, '')) || key.startsWith('specs.readout_modes') ||
          key.startsWith('specs.passbands')) || undefined}
        {...{ onInvalidCapture: (event: Event) => { (event.currentTarget as HTMLDetailsElement).open = true; } }}>
        <summary class="ap-tree-row ap-tree-folder" onKeydown={event => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
          const details = (event.currentTarget as HTMLElement).closest('details');
          if (!details) return;
          event.preventDefault();
          event.stopPropagation();
          details.open = event.key === 'ArrowRight';
        }}>
          <DisclosureChevron />
          <span>{t('equipment.advancedFields')}</span>
        </summary>
        <div class="ap-equipment-grid">
          {(['manufacturer', 'model', 'notes'] as const).map(key =>
            <Field key={key} label={t('equipment.fields.' + key)} name={key} value={input[key]}
              type={key === 'notes' ? 'textarea' : 'text'} error={error}
              onChange={value => props.change({ ...input, [key]: value })} />)}
          {advancedFields[kind].map(spec)}
        </div>
        {kind === 'camera' && <>
        <h3>{t('equipment.fields.readout_modes')}</h3>
        {modes(specs).map((mode, index) => <fieldset key={index}><legend>{index + 1}</legend>
          <div class="ap-equipment-grid">
            {(['mode_key', 'display_name', ...rangeFields] as const).map(key => {
              const numeric = key !== 'mode_key' && key !== 'display_name';
              return <Field key={key} label={t('equipment.fields.' + key)} name={`specs.readout_modes.${index}.${key}`}
                value={mode[key]} required={!numeric} type={numeric ? 'number' : 'text'} min={numeric ? -1000000 : undefined}
                max={numeric ? 1000000 : undefined} step="any" error={error} onChange={value =>
                  change({ ...specs, readout_modes: modes(specs).map((entry, i) => i === index ? { ...entry, [key]: numeric ? numberValue(value) : value } : entry) })} />;
            })}
          </div>
          <button type="button" onClick={() => change({ ...specs, readout_modes: modes(specs).filter((_, i) => i !== index) })}>{t('equipment.remove')}</button>
        </fieldset>)}
        <button type="button" disabled={modes(specs).length >= 32}
          onClick={() => change({ ...specs, readout_modes: [...modes(specs), blankMode] })}>{t('equipment.addMode')}</button>
      </>}
      {kind === 'filter' && <>
        <h3>{t('equipment.fields.passbands')}</h3>
        {bands(specs).map((band, index) => <fieldset key={band.id ?? index}><legend>{index + 1}</legend>
          <div class="ap-equipment-grid">{(['band_label', 'center_nm', 'fwhm_nm'] as const).map(key =>
            <Field key={key} label={t('equipment.fields.' + key)} name={`specs.passbands.${index}.${key}`}
              value={band[key]} required={key === 'band_label'} type={key === 'band_label' ? 'text' : 'number'}
              min={key === 'band_label' ? undefined : 0.000000001} max={key === 'band_label' ? undefined : 1000000}
              step="any" error={error} onChange={value => change({ ...specs, passbands: bands(specs).map((row, i) =>
                i === index ? { ...row, [key]: key === 'band_label' ? value : numberValue(value) } : row) })} />)}</div>
          <button type="button" onClick={() => change({ ...specs, passbands: bands(specs).filter((_, i) => i !== index) })}>{t('equipment.remove')}</button>
        </fieldset>)}
        <button type="button" disabled={bands(specs).length >= 32}
          onClick={() => change({ ...specs, passbands: [...bands(specs), blankBand] })}>{t('equipment.addBand')}</button>
      </>}
      </details>
    </>;
  };
}, { props: ['kind', 'input', 'change', 'error', 'disabled'] });

export const SpecDetails = defineComponent((props: { specs: Specs; kind: Kind }) => {
  const { t } = useI18n();
  return () => {
    const { specs, kind } = props;
    const value = (key: string) => {
      const entry = key === 'sensor_kind' ? imagingType(specs[key]) : specs[key];
      if (entry == null) return t('equipment.unspecified');
      if (key === 'cooling_supported' || key in enums) return t('equipment.values.' + entry);
      return String(entry);
    };
    const passbands = bands(specs);
    return <>
      <dl class="ap-equipment-definitions">{[...mainFields[kind], ...advancedFields[kind]].map(key =>
        <div key={key}><dt>{t('equipment.fields.' + key)}</dt><dd>{value(key)}</dd></div>)}
      </dl>
      {kind === 'filter' && <>
        <h4>{t('equipment.fields.passbands')}</h4>
        {(!passbands.length || (specs.filter_kind === 'dual_band' && passbands.length < 2) ||
          passbands.some(row => row.center_nm === null || row.fwhm_nm === null)) && <small>{t('equipment.incompleteBands')}</small>}
        <ul>{passbands.map((row, index) => <li key={row.id ?? index}>{row.band_label} · {row.center_nm === null ? t('equipment.unspecified') : row.center_nm + ' nm'} ·
          {' '}{t('equipment.fields.fwhm_nm')} {row.fwhm_nm ?? t('equipment.unspecified')}</li>)}</ul>
      </>}
      {kind === 'camera' && modes(specs).length > 0 && <>
        <h4>{t('equipment.fields.readout_modes')}</h4>
        {modes(specs).map(mode => <details key={mode.mode_key}><summary>{mode.display_name} ({mode.mode_key})</summary>
          <dl>{rangeFields.map(key => <div key={key}><dt>{t('equipment.fields.' + key)}</dt><dd>{mode[key] ?? t('equipment.unspecified')}</dd></div>)}</dl>
        </details>)}
      </>}
    </>;
  };
}, { props: ['specs', 'kind'] });

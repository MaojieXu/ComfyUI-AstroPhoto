import { defineComponent, ref, useId, watch, type VNodeChild } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiError } from '../../../api/client';
import { notifyHost } from '../../../host/notify';

export const EquipmentError = defineComponent((props: { error?: unknown; retry?: () => void; transient?: boolean }) => {
  const { t, te } = useI18n();
  const translateOr = (key: string, fallback: string) => te(key) ? t(key) : fallback;
  const notified = ref(false);
  watch(() => props.error, error => {
    const problem = error instanceof ApiError ? error : new ApiError('network');
    const key = ['equipment.errors.' + problem.code, 'errors.' + problem.code].find(key => te(key));
    const delivered = !!error && notifyHost('error', [t(key ?? 'errors.unknown'), problem.code, problem.requestId].filter(Boolean).join(' · '));
    notified.value = delivered && !!props.transient && !props.retry && !problem.fields && problem.status !== 409;
  }, { immediate: true });
  return () => {
    const { error, retry } = props;
    if (!error || notified.value) return null;
    const problem = error instanceof ApiError ? error : new ApiError('network');
    const key = ['equipment.errors.' + problem.code, 'errors.' + problem.code].find((key) => te(key));
    return <div role="alert" class="ap-equipment-error">
      <p>{t(key ?? 'errors.unknown')}</p>
      {problem.fields && Object.entries(problem.fields).map(([key, reason]) => <small key={key}>
        {translateOr('equipment.fields.' + key.split('.').at(-1), key)} · {translateOr('equipment.validation.' + String(reason), String(reason))}
      </small>)}
      <small>{problem.code}{problem.requestId ? ' · ' + problem.requestId : ''}</small>
      {retry && <button type="button" onClick={retry}>{t('actions.retry')}</button>}
    </div>;
  };
}, { props: ['error', 'retry', 'transient'] });

export function renderEquipmentError(error: unknown, retry: () => void) {
  return <EquipmentError error={error} retry={retry} />;
}

type Option = { value: string; label: string; disabled?: boolean };
type FieldProps = {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'textarea' | 'search';
  required?: boolean;
  min?: number;
  max?: number;
  step?: number | 'any';
  error?: ApiError;
} & (
  | { control: (id: string, invalid: boolean) => VNodeChild; options?: never; value?: never; onChange?: never }
  | { control?: never; value: string | number | null; onChange: (value: string) => void; options?: Option[] }
);

export const Field = defineComponent((props: FieldProps) => {
  const { t } = useI18n();
  const id = useId();
  return () => {
    const { label, name, value, onChange, options, control, type = 'text', required = false, min, max, step, error } = props;
    const reason = error?.fields?.[name];
    const attributes = { id, name, required, value: value ?? '', 'aria-invalid': reason ? true : undefined,
      'aria-describedby': reason ? id + '-error' : undefined };
    const update = (event: Event) => onChange?.((event.currentTarget as HTMLInputElement).value);
    return <div class="ap-equipment-field"><label for={id}>{label}{required ? ' *' : ''}</label>
      {control ? control(id, Boolean(reason)) : options ? <select {...attributes} onChange={update}>
        {options.map(option => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
      </select> : type === 'textarea' ? <textarea {...attributes} maxlength={4000} rows={2} onInput={update} /> :
        <input {...attributes} type={type} min={min} max={max} step={step} maxlength={120} onInput={update} />}
      {Boolean(reason) && <small id={id + '-error'} class="ap-equipment-error">{t('equipment.validation.' + String(reason))}</small>}
    </div>;
  };
}, { props: ['label', 'name', 'type', 'required', 'min', 'max', 'step', 'error', 'control', 'options', 'value', 'onChange'] });

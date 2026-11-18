import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../../api/client';
import { app } from '../../../host/comfy';
import type { Resource } from '../../../shared/useResource';

export async function confirmAction(title: string, message: string, hint?: string, type: 'default' | 'delete' = 'default') {
  const trigger = document.activeElement;
  try {
    return await app.extensionManager.dialog.confirm({ key: 'astrophoto.equipment.' + crypto.randomUUID(),
      title, message, type, ...(hint ? { itemList: [hint] } : {}) });
  } finally {
    if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
  }
}

export function useMutation() {
  const lifetime = useRef<AbortController | null>(null);
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<ApiError>();
  useEffect(() => {
    const controller = new AbortController();
    lifetime.current = controller;
    return () => controller.abort();
  }, []);
  async function run(action: (signal: AbortSignal) => Promise<void>) {
    const signal = lifetime.current?.signal;
    if (!signal || signal.aborted || busy.current) return;
    busy.current = true;
    setPending(true);
    setError(undefined);
    try { await action(signal); }
    catch (error) {
      if (!signal.aborted) setError(error instanceof ApiError ? error : new ApiError('network'));
    } finally {
      busy.current = false;
      if (!signal.aborted) setPending(false);
    }
  }
  return { run, pending, error, setError };
}

export function EquipmentError({ error, retry }: { error?: unknown; retry?: () => void }) {
  const { t } = useTranslation();
  if (!error) return null;
  const problem = error instanceof ApiError ? error : new ApiError('network');
  return <div role="alert" className="ap-equipment-error">
    <p>{t('equipment.errors.' + problem.code, { defaultValue: t('errors.' + problem.code, { defaultValue: t('errors.unknown') }) })}</p>
    {problem.fields && Object.entries(problem.fields).map(([key, reason]) => <small key={key}>
      {t('equipment.fields.' + key.split('.').at(-1), { defaultValue: key })} · {t('equipment.validation.' + String(reason), { defaultValue: String(reason) })}
    </small>)}
    <small>{problem.code}{problem.requestId ? ' · ' + problem.requestId : ''}</small>
    {retry && <button type="button" onClick={retry}>{t('actions.retry')}</button>}
  </div>;
}

export function Content<T>({ resource, retry, children }: { resource: Resource<T>; retry: () => void; children: (data: T) => ReactNode }) {
  const { t } = useTranslation();
  if (resource.state === 'loading') return <p role="status">{t('states.loading')}</p>;
  if (resource.state === 'error') return <EquipmentError error={resource.error} retry={retry} />;
  return <>{children(resource.data)}</>;
}

type Option = { value: string; label: string; disabled?: boolean };
export function Field({ label, name, value, onChange, options, control, type = 'text', required = false, min, max, step, error }:
  { label: string; name: string;
    type?: 'text' | 'number' | 'textarea' | 'search'; required?: boolean; min?: number; max?: number; step?: number | 'any';
    error?: ApiError } & (
    { control: (id: string, invalid: boolean) => ReactNode; options?: never; value?: never; onChange?: never } |
    { control?: never; value: string | number | null; onChange: (value: string) => void; options?: Option[] }
  )) {
  const { t } = useTranslation();
  const id = useId();
  const reason = error?.fields?.[name];
  const props = { id, name, required, value: value ?? '', 'aria-invalid': reason ? true : undefined,
    'aria-describedby': reason ? id + '-error' : undefined };
  return <div className="ap-equipment-field"><label htmlFor={id}>{label}{required ? ' *' : ''}</label>
    {control ? control(id, Boolean(reason)) : options ? <select {...props} onChange={event => onChange(event.target.value)}>
      {options.map(option => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
    </select> : type === 'textarea' ? <textarea {...props} maxLength={4000} rows={2} onChange={event => onChange(event.target.value)} /> :
      <input {...props} type={type} min={min} max={max} step={step} maxLength={120}
        onChange={event => onChange(event.target.value)} />}
    {Boolean(reason) && <small id={id + '-error'} className="ap-equipment-error">{t('equipment.validation.' + String(reason))}</small>}
  </div>;
}
export const numberValue = (value: string) => value === '' ? null : Number(value);
export function imagingType(value: unknown): 'mono' | 'color' | null {
  if (value === 'mono') return 'mono';
  if (value === 'color' || value === 'osc') return 'color';
  return null;
}
export const displayNumber = (value: number | null) => value === null ? null :
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(value);

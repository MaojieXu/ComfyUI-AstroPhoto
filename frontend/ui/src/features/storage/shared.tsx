import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../api/client';
import { fetchReceipt, mutate, operationPath, type Operation, type Receipt } from '../../api/storage';

export function bytes(value: number | null | undefined) {
  return value == null ? '—' : value < 1024 ? value + ' B' :
    new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value / 1024 ** 3) + ' GiB';
}

export function StorageError({ code }: { code: string }) {
  const { t } = useTranslation();
  return <p role="alert" className="ap-storage-error">{t('storage.errors.' + code, { defaultValue: t('storage.error') })} <code>{code}</code></p>;
}

export function useStorageAction() {
  const lifetime = useRef<AbortController | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    lifetime.current = controller;
    return () => controller.abort();
  }, []);
  async function run(action: (signal: AbortSignal) => Promise<void>) {
    const signal = lifetime.current?.signal;
    if (!signal || signal.aborted || pending) return;
    setPending(true);
    setError('');
    try {
      await action(signal);
    } catch (error) {
      if (!signal.aborted) setError(error instanceof ApiError ? error.code : 'network');
    } finally {
      if (!signal.aborted) setPending(false);
    }
  }
  return { pending, error, run };
}

const terminal = ['completed', 'failed', 'cancelled'];

export function OperationProgress({ job, onTerminal }: { job: Operation; onTerminal: () => void }) {
  const { t } = useTranslation();
  const [receipt, setReceipt] = useState<Receipt>();
  const [code, setCode] = useState('');
  const [restart, setRestart] = useState(0);
  const { pending, error, run } = useStorageAction();
  const { operation_id, kind } = job;
  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    async function poll() {
      try {
        const current = await fetchReceipt({ operation_id, kind, phase: 'queued' }, controller.signal);
        if (controller.signal.aborted) return;
        setReceipt(current);
        setCode('');
        if (terminal.includes(current.phase)) onTerminal();
        else if (!current.error) timer = setTimeout(() => void poll(), 800);
      } catch (error) {
        if (!controller.signal.aborted) setCode(error instanceof ApiError ? error.code : 'network');
      }
    }
    void poll();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [operation_id, kind, restart, onTerminal]);
  const phase = receipt?.phase ?? 'queued';
  const totals = receipt?.receipt;
  const partial = phase === 'completed' && typeof totals?.failed === 'number' && totals.failed > 0;
  return <section className="ap-operation" aria-label={t('storage.operation')}>
    <div role="status">
      <strong className="ap-storage-badge" data-state={phase}>{t('storage.phases.' + (partial ? 'partial' : phase), { defaultValue: phase })}</strong>
      <p><code>{job.operation_id}</code></p>
      {typeof totals?.processed === 'number' && typeof totals.total === 'number' &&
        <progress aria-label={t('storage.operation')} value={totals.processed} max={Math.max(1, totals.total)} />}
      {(['registered', 'copied', 'skipped', 'failed', 'verification'] as const).map(key =>
        typeof totals?.[key] === 'number' || typeof totals?.[key] === 'string'
          ? <p key={key}>{t('storage.' + key)} {String(totals[key])}</p> : null)}
    </div>
    {(receipt?.error || code || error) && <StorageError code={code || error || receipt!.error!.code} />}
    {Array.isArray(totals?.errors) && totals.errors.map((item: { entry: number; code: string }) =>
      <div key={item.entry}>#{item.entry} <StorageError code={item.code} /></div>)}
    {!terminal.includes(phase) && <button disabled={pending} onClick={() => void run(async signal => {
      await mutate(operationPath(job) + '/cancel', {}, signal);
      setRestart(value => value + 1);
    })} className="ap-storage-button">{t('storage.cancel')}</button>}
    {code && <button type="button" className="ap-storage-button" onClick={() => setRestart(value => value + 1)}>{t('actions.refresh')}</button>}
    {receipt?.error && !terminal.includes(phase) && <button disabled={pending} onClick={() => void run(async signal => {
      await mutate(operationPath(job) + '/retry', {}, signal);
      setRestart(value => value + 1);
    })} className="ap-storage-button">{t('storage.retry')}</button>}
  </section>;
}


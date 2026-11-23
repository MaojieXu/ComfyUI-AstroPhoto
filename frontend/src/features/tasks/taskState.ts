import { shallowRef } from 'vue';
import { notifyHost } from '../../host/notify';
import { ApiError } from '../../api/client';
import { fetchOperations, type Receipt } from '../../api/storage';

export const taskReceipts = shallowRef<Receipt[]>([]);
export const taskPollError = shallowRef('');
export const taskLocalErrors = shallowRef<Record<string, string>>({});
const seen = new Map<string, string>();
let initialized = false;
let controller: AbortController | undefined;
let timer: ReturnType<typeof setTimeout> | undefined;
type Translator = (key: string, values?: Record<string, unknown>) => string;
let translate: Translator | undefined;

// A task may be observed by both its initiating page and the global panel.
const notifications = new Set<string>();

export function observeTask(id: string) {
  const receipt = taskReceipts.value.find(job => job.operation_id === id);
  if (receipt && translate) reportOutcome(receipt);
  if (!seen.has(id)) seen.set(id, 'queued');
}

export function notifyTask(id: string, state: string, kind: 'success' | 'error' | 'warning', message: string) {
  const key = `${id}:${state}`;
  if (notifications.has(key)) return true;
  if (!notifyHost(kind, message)) return false;
  notifications.add(key);
  return true;
}

export function reportTaskError(id: string, code: string, message: string) {
  taskLocalErrors.value = { ...taskLocalErrors.value, [id]: code };
  notifyTask(id, `error:${code}`, 'error', message);
}

export function clearTaskError(id: string) {
  const code = taskLocalErrors.value[id];
  if (code) notifications.delete(`${id}:error:${code}`);
  const next = { ...taskLocalErrors.value };
  delete next[id];
  taskLocalErrors.value = next;
}

function reportOutcome(job: Receipt) {
  if (!translate) return;
  const name = translate(job.kind === 'import' ? 'taskPanel.import' : 'taskPanel.migration');
  const firstError = Array.isArray(job.receipt.errors) ? job.receipt.errors[0] : undefined;
  if (job.error || job.phase === 'failed' || job.receipt.direct_import === true && firstError) {
    const code = job.error?.code || firstError?.code || 'unknown';
    notifyTask(job.operation_id, `error:${code}`, 'error', translate('taskPanel.failed', { name }));
  } else if (job.phase === 'completed' && typeof job.receipt.failed === 'number' && job.receipt.failed > 0) {
    notifyTask(job.operation_id, 'partial', 'warning', translate('taskPanel.partial', { name }));
  } else if (job.phase === 'completed') {
    notifyTask(job.operation_id, 'completed', 'success', translate('taskPanel.completed', { name }));
  }
}

export function startTaskTracking(t: Translator) {
  translate = t;
  if (controller) return;
  controller = new AbortController();
  const signal = controller.signal;

  async function poll() {
    try {
      const next = await fetchOperations(signal);
      if (signal.aborted) return;
      for (const job of next) {
        const partial = job.phase === 'completed' && typeof job.receipt.failed === 'number' && job.receipt.failed > 0;
        const firstError = job.receipt.direct_import === true && Array.isArray(job.receipt.errors) ? job.receipt.errors[0] : undefined;
        const state = job.error || firstError ? `error:${job.error?.code || firstError.code}` : partial ? 'partial' : job.phase;
        if ((initialized || seen.has(job.operation_id)) && seen.get(job.operation_id) !== state) {
          reportOutcome(job);
        }
        seen.set(job.operation_id, state);
      }
      initialized = true;
      taskReceipts.value = next;
      taskPollError.value = '';
    } catch (cause) {
      if (!signal.aborted && taskReceipts.value.length) taskPollError.value = cause instanceof ApiError ? cause.code : 'network';
    } finally {
      if (!signal.aborted) timer = setTimeout(() => void poll(), 1200);
    }
  }
  void poll();
}

export function stopTaskTracking() {
  controller?.abort();
  controller = undefined;
  clearTimeout(timer);
  seen.clear();
  notifications.clear();
  initialized = false;
  taskReceipts.value = [];
  taskPollError.value = '';
  taskLocalErrors.value = {};
}

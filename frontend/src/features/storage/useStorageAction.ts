import { onScopeDispose, ref } from 'vue';
import { ApiError } from '../../api/client';

export function useStorageAction() {
  const lifetime = new AbortController();
  const pending = ref(false);
  const error = ref('');
  const details = ref<Record<string, unknown>>();
  onScopeDispose(() => lifetime.abort());

  async function run(action: (signal: AbortSignal) => Promise<void>) {
    const { signal } = lifetime;
    if (signal.aborted || pending.value) return;

    pending.value = true;
    error.value = '';
    details.value = undefined;
    try {
      await action(signal);
    } catch (cause) {
      if (!signal.aborted) {
        error.value = cause instanceof ApiError ? cause.code : 'network';
        details.value = cause instanceof ApiError ? cause.details : undefined;
      }
    } finally {
      if (!signal.aborted) pending.value = false;
    }
  }

  return { pending, error, details, run };
}

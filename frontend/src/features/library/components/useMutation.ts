import { onScopeDispose, ref, shallowRef } from 'vue';
import { ApiError } from '../../../api/client';
import { app } from '../../../host/comfy';

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
  const controller = new AbortController();
  const pending = ref(false);
  const error = shallowRef<ApiError>();
  onScopeDispose(() => controller.abort());

  async function run(action: (signal: AbortSignal) => Promise<void>) {
    const { signal } = controller;
    if (signal.aborted || pending.value) return;
    pending.value = true;
    error.value = undefined;
    try {
      await action(signal);
    } catch (reason) {
      if (!signal.aborted) error.value = reason instanceof ApiError ? reason : new ApiError('network');
    } finally {
      if (!signal.aborted) pending.value = false;
    }
  }
  return { run, pending, error };
}

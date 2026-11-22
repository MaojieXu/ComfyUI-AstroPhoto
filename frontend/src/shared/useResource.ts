import { shallowRef, unref, watch, type MaybeRef } from 'vue';

export type Resource<T> = { state: 'loading' } | { state: 'error'; error: unknown } | { state: 'ready'; data: T };

export function useResource<T>(load: MaybeRef<(signal: AbortSignal) => Promise<T>>, keepData = false) {
  const resource = shallowRef<Resource<T>>({ state: 'loading' });
  const revision = shallowRef(0);
  let pending: AbortController | undefined;
  const refresh = () => {
    pending?.abort();
    if (!keepData) resource.value = { state: 'loading' };
    revision.value += 1;
  };

  watch([() => unref(load), revision], ([request], _, onCleanup) => {
    const controller = new AbortController();
    pending = controller;
    onCleanup(() => {
      controller.abort();
      if (pending === controller) pending = undefined;
    });
    if (!keepData || resource.value.state !== 'ready') resource.value = { state: 'loading' };
    void request(controller.signal).then(data => {
      if (!controller.signal.aborted) resource.value = { state: 'ready', data };
    }, error => {
      if (!controller.signal.aborted) resource.value = { state: 'error', error };
    });
  }, { immediate: true });

  return { resource, refresh };
}

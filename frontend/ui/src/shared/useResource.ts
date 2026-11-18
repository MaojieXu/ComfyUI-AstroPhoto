import { useCallback, useEffect, useState } from 'react';
export type Resource<T> = { state: 'loading' } | { state: 'error'; error: unknown } | { state: 'ready'; data: T };
export function useResource<T>(load: (signal: AbortSignal) => Promise<T>, keepData = false) {
  const [resource, setResource] = useState<Resource<T>>({ state: 'loading' });
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setResource(current => keepData && current.state === 'ready' ? current : { state: 'loading' });
    void load(controller.signal).then(data => {
      if (!controller.signal.aborted) setResource({ state: 'ready', data });
    }, error => { if (!controller.signal.aborted) setResource({ state: 'error', error }); });
    return () => controller.abort();
  }, [load, revision, keepData]);
  const refresh = useCallback(() => setRevision(r => r + 1), []);
  return { resource, refresh };
}

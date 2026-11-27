import { app } from './comfy';

/** Coalesce bursts from imports and refresh after the host connection recovers. */
export function subscribeLibraryChanges(callback: () => void) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const changed = () => {
    clearTimeout(timer);
    timer = setTimeout(callback, 250);
  };
  const events: EventTarget = app.api;
  events.addEventListener('astrophoto.library_changed', changed);
  events.addEventListener('reconnected', changed);
  return () => {
    clearTimeout(timer);
    events.removeEventListener('astrophoto.library_changed', changed);
    events.removeEventListener('reconnected', changed);
  };
}

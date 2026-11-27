import { expect, test, vi } from 'vitest';
import { subscribeLibraryChanges } from '../../src/host/libraryChanges';
import { app } from '../host';

test('library events are coalesced, reconnect refreshes, and disposal stops updates', async () => {
  vi.useFakeTimers();
  const refresh = vi.fn();
  const stop = subscribeLibraryChanges(refresh);
  app.api.dispatchEvent(new Event('astrophoto.library_changed'));
  app.api.dispatchEvent(new Event('astrophoto.library_changed'));
  await vi.advanceTimersByTimeAsync(250);
  expect(refresh).toHaveBeenCalledTimes(1);
  app.api.dispatchEvent(new Event('reconnected'));
  await vi.advanceTimersByTimeAsync(250);
  expect(refresh).toHaveBeenCalledTimes(2);
  stop();
  app.api.dispatchEvent(new Event('astrophoto.library_changed'));
  await vi.advanceTimersByTimeAsync(250);
  expect(refresh).toHaveBeenCalledTimes(2);
  vi.useRealTimers();
});

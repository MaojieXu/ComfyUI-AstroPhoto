import { act, waitFor } from '@testing-library/react';
import { registerSidebar } from '../host/sidebar';
import { app, tabs } from './hostMock';
import type { ComfyApp } from '../host/comfy';
test('one tab, idempotent render, replacement and destroy clean roots and timers', async () => {
  jest.useFakeTimers();
  registerSidebar(app as unknown as ComfyApp); registerSidebar(app as unknown as ComfyApp);
  expect(tabs).toHaveLength(1);
  const a = document.createElement('div'), b = document.createElement('div'); document.body.append(a, b);
  await act(async () => tabs[0].render(a));
  await waitFor(() => expect(a.querySelectorAll('[role=tab]')).toHaveLength(3));
  const root = a.firstChild;
  await act(async () => tabs[0].render(a)); expect(a.firstChild).toBe(root);
  await act(async () => tabs[0].render(b)); expect(a.children).toHaveLength(0);
  await act(async () => { tabs[0].destroy(); tabs[0].destroy(); });
  expect(b.children).toHaveLength(0); expect(jest.getTimerCount()).toBe(0);
  a.remove(); b.remove(); jest.useRealTimers();
});

import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { expect, test, vi } from 'vitest';
import { registerSidebar } from '../../src/host/sidebar';
import type { ComfyApp } from '../../src/host/comfy';
import { SearchField } from '../../src/shared/SearchField';
import { app, settings, tabs } from '../host';
import { definitions, status } from '../host/fixtures';

function openSidebar() {
  const container = document.createElement('div');
  document.body.append(container);
  registerSidebar(app as unknown as ComfyApp, []);
  tabs[0].render(container);
  return container;
}

function tab(container: HTMLElement, id: string) {
  return container.querySelector<HTMLButtonElement>('#ap-tab-' + id)!;
}

const assetList = () => Response.json({ items: [], next: null });

test('one Vue sidebar starts on Assets, loads its library, follows host locale and cleans up', async () => {
  vi.useFakeTimers();
  app.api.fetchApi.mockImplementation(async () => assetList());
  const setInterval = vi.spyOn(window, 'setInterval');
  const clearInterval = vi.spyOn(window, 'clearInterval');
  const a = openSidebar();
  const b = document.createElement('div');
  document.body.append(b);
  registerSidebar(app as unknown as ComfyApp, []);
  expect(tabs).toHaveLength(1);
  const root = a.firstElementChild;
  expect(tab(a, 'assets').closest('[role="tablist"]')?.children).toHaveLength(3);
  expect(tab(a, 'assets').getAttribute('aria-selected')).toBe('true');
  expect(a.querySelector('#ap-asset-tab-projects')?.textContent).toBe('Projects');
  expect(app.api.fetchApi).toHaveBeenCalled();
  expect(app.api.fetchApi.mock.calls.every(([path]) => path.startsWith('/astrophoto/v1/library/') ||
    path === '/astrophoto/v1/storage/operations' || path === '/astrophoto/v1/storage')).toBe(true);

  tab(a, 'assets').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
  expect(document.activeElement).toBe(tab(a, 'settings'));
  expect(tab(a, 'assets').getAttribute('aria-selected')).toBe('true');

  settings.set('Comfy.Locale', 'zh-CN');
  window.dispatchEvent(new Event('focus'));
  await nextTick();
  expect(a.querySelector('#ap-asset-tab-projects')?.textContent).toBe('项目');
  tabs[0].render(a);
  expect(a.firstElementChild).toBe(root);
  tabs[0].render(b);
  expect(a.children).toHaveLength(0);
  tabs[0].destroy?.();
  tabs[0].destroy?.();
  expect(b.children).toHaveLength(0);
  const localeTimers = setInterval.mock.results.map(result => result.value);
  expect(localeTimers).toHaveLength(2);
  expect(clearInterval.mock.calls.map(([id]) => id)).toEqual(localeTimers);
  setInterval.mockRestore();
  clearInterval.mockRestore();
});

test('loads the catalog when visited and preserves the search across sidebar tabs', async () => {
  const definition = definitions['vue-basic'];
  app.api.fetchApi.mockImplementation(async (path: string) => path.startsWith('/astrophoto/v1/library/') ? assetList() : Response.json(path === '/object_info' ? {
    'Frame-A': { ...definition, name: 'Frame-A', display_name: 'Frame Alpha', category: 'AstroPhoto/Science', search_aliases: ['Infrared'] },
    'Frame-B': { ...definition, name: 'Frame-B', display_name: 'Frame Beta', category: 'AstroPhoto/Calibration', search_aliases: [] },
  } : status));
  const container = openSidebar();
  tab(container, 'nodes').click();
  await expect.poll(() => container.querySelector<HTMLInputElement>('#ap-panel-nodes input')?.getAttribute('type')).toBe('search');
  const input = container.querySelector<HTMLInputElement>('#ap-panel-nodes input')!;
  input.value = 'Infrared';
  input.dispatchEvent(new InputEvent('input', { bubbles: true }));
  await expect.poll(() => [...container.querySelectorAll('.ap-resource')].map(node => node.textContent?.trim())).toEqual(['Frame Alpha']);
  container.querySelector<HTMLButtonElement>('.ap-resource')!.click();
  await nextTick();
  expect(container.querySelector('#ap-panel-nodes h2')?.textContent).toBe('Frame Alpha');
  tab(container, 'nodes').click();
  await nextTick();
  expect(container.querySelector('#ap-panel-nodes h2')).toBeNull();
  container.querySelector<HTMLButtonElement>('.ap-resource')!.click();
  await nextTick();
  tab(container, 'assets').click();
  await nextTick();
  tab(container, 'nodes').click();
  await nextTick();
  expect(container.querySelector('#ap-panel-nodes h2')).toBeNull();
  expect(input.value).toBe('Infrared');
  expect(container.querySelectorAll('.ap-resource')).toHaveLength(1);
  expect(app.api.fetchApi.mock.calls.filter(([path]) => !path.startsWith('/astrophoto/v1/library/') &&
    path !== '/astrophoto/v1/storage/operations' && path !== '/astrophoto/v1/storage').map(([path]) => path)).toEqual(['/object_info']);
});

test('IME defers debounced search, clear focuses the input and unmount cancels pending updates', async () => {
  vi.useFakeTimers();
  const onSearch = vi.fn();
  const view = mount(SearchField, { props: { label: 'Search', clearLabel: 'Clear search', onSearch }, attachTo: document.body });
  const input = view.get('input');
  await input.trigger('compositionstart');
  await input.setValue('hua');
  await vi.advanceTimersByTimeAsync(500);
  expect(onSearch).not.toHaveBeenCalled();
  input.element.value = '画板';
  await input.trigger('compositionend');
  await vi.advanceTimersByTimeAsync(180);
  expect(onSearch).toHaveBeenLastCalledWith('画板');
  await view.get('button').trigger('click');
  expect(document.activeElement).toBe(input.element);
  await vi.advanceTimersByTimeAsync(180);
  expect(onSearch).toHaveBeenLastCalledWith('');
  await input.setValue('pending');
  view.unmount();
  await vi.advanceTimersByTimeAsync(500);
  expect(onSearch).toHaveBeenCalledTimes(2);
});

test('CASE-02: refresh hides stale actions, rejects a late result and retries a failure', async () => {
  const requests: { resolve: (response: Response) => void; signal: AbortSignal }[] = [];
  app.api.fetchApi.mockImplementation((path, { signal }: { signal: AbortSignal }) => path === '/object_info'
    ? new Promise(resolve => { requests.push({ resolve, signal }); })
    : Promise.resolve(assetList()));
  const container = openSidebar();
  const refresh = () => container.querySelector<HTMLButtonElement>('.ap-refresh-button')!.click();
  const catalog = (id: string) => Response.json({
    [id]: { ...definitions['vue-basic'], name: id, display_name: id, category: '' },
  });
  tab(container, 'nodes').click();
  await expect.poll(() => requests.length).toBe(1);
  requests[0].resolve(catalog('Initial'));
  await expect.poll(() => container.querySelector('.ap-resource')?.textContent?.trim()).toBe('Initial');
  container.querySelector<HTMLButtonElement>('.ap-resource')!.click();
  await nextTick();
  expect(container.querySelector('#ap-panel-nodes h2')?.textContent).toBe('Initial');

  refresh();
  await expect.poll(() => requests.length).toBe(2);
  expect(container.querySelector('#ap-panel-nodes h2')).toBeNull();
  expect(container.querySelector('.ap-resource')).toBeNull();
  refresh();
  await expect.poll(() => requests.length).toBe(3);
  expect(requests[1].signal.aborted).toBe(true);
  requests[2].resolve(new Response(null, { status: 503 }));
  await expect.poll(() => Boolean(container.querySelector('[role=alert]'))).toBe(true);
  expect(container.querySelector<HTMLElement>('.ap-search-toolbar')?.hidden).toBe(true);
  requests[1].resolve(catalog('Obsolete'));
  await nextTick();
  expect(container.querySelector('.ap-resource')).toBeNull();
  container.querySelector<HTMLButtonElement>('[role=alert] button')!.click();
  await expect.poll(() => requests.length).toBe(4);
  requests[3].resolve(catalog('Current'));
  await expect.poll(() => container.querySelector('.ap-resource')?.textContent?.trim()).toBe('Current');
});

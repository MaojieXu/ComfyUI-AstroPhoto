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

test('one Vue sidebar starts on Assets without requests, follows host locale and cleans up', async () => {
  vi.useFakeTimers();
  const setInterval = vi.spyOn(window, 'setInterval');
  const clearInterval = vi.spyOn(window, 'clearInterval');
  const a = openSidebar();
  const b = document.createElement('div');
  document.body.append(b);
  registerSidebar(app as unknown as ComfyApp, []);
  expect(tabs).toHaveLength(1);
  const root = a.firstElementChild;
  expect(a.querySelectorAll('[role="tab"]')).toHaveLength(3);
  expect(tab(a, 'assets').getAttribute('aria-selected')).toBe('true');
  expect(a.querySelector('#ap-panel-assets')?.textContent).toContain('available in a future release');
  expect(app.api.fetchApi).not.toHaveBeenCalled();

  tab(a, 'assets').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
  expect(document.activeElement).toBe(tab(a, 'settings'));
  expect(tab(a, 'assets').getAttribute('aria-selected')).toBe('true');

  settings.set('Comfy.Locale', 'zh-CN');
  window.dispatchEvent(new Event('focus'));
  await nextTick();
  expect(a.querySelector('#ap-panel-assets')?.textContent).toContain('素材页将在后续版本提供');
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
  app.api.fetchApi.mockImplementation(async (path: string) => Response.json(path === '/object_info' ? {
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
  tab(container, 'assets').click();
  tab(container, 'nodes').click();
  expect(input.value).toBe('Infrared');
  expect(container.querySelectorAll('.ap-resource')).toHaveLength(1);
  expect(app.api.fetchApi.mock.calls.map(([path]) => path)).toEqual(['/object_info']);
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

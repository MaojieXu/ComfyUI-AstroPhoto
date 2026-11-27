import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { useI18n } from 'vue-i18n';
import { expect, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import type { FrontendBundle } from '../../src/bundles/types';
import type { ComfyApp } from '../../src/host/comfy';
import { initializeFrontend } from '../../src/main';
import { Sidebar } from '../../src/features/sidebar/Sidebar';
import { createFrontendI18n } from '../../src/i18n';
import { app, tabs } from '../host';

// Supplement to CASE-08/10: the public entry must assemble bundles instead of
// owning them. The empty-bundle path and a second (non-Siril) bundle are the
// regression surface for FR-08; the shipped entry file is covered by the build
// scripts and the real-host runs.

const api = '/astrophoto/v1';
const storage = {
  status: 'ready', data_root: { path: 'C:/fixture', source: 'default' }, database: { assets: 'ready' },
  imports: { default_mode: 'reference', revision: 1 }, default_workspace_id: 'workspace',
  workspaces: [{ id: 'workspace', name: 'Local', root_path: 'C:/fixture/workspace', status: 'online',
    enabled: true, revision: 0, is_default: true, free_bytes: 100 }],
  cache: { path: 'C:/fixture/cache', max_size_gb: 20, used_bytes: 0, status: 'online' },
  capabilities: { write: true, import: true }, operations: [],
};
function status(software: { available: boolean; reason: string | null }) {
  return {
    extension: { id: 'ComfyUI_AstroPhoto', version: '0.0.1' }, api_version: 'v1', status: 'ok',
    runtime: { node_registered: true, routes_registered: true },
    capabilities: {
      equipment: { available: false, reason: 'local_storage_disabled' },
      optical_trains: { available: false, reason: 'local_storage_disabled' },
      software, processing: software,
      storage: { available: true, reason: null }, database: { available: true, reason: null },
    },
  };
}
function serve(capabilities: { available: boolean; reason: string | null }) {
  const snapshot = status(capabilities);
  app.api.fetchApi.mockImplementation(async (path: string) => {
    if (path === `${api}/status`) return Response.json(snapshot);
    if (path === `${api}/storage`) return Response.json(storage);
    return Response.json({ error: { code: 'UNEXPECTED_PATH' } }, 404);
  });
}
function mountSidebar(bundles: readonly FrontendBundle[] = []) {
  const element = document.createElement('div');
  element.className = 'astrophoto-ui';
  document.body.append(element);
  const i18n = createFrontendI18n(bundles);
  const wrapper = mount(Sidebar, { attachTo: element, props: { equipmentSession: {}, bundles }, global: { plugins: [i18n] } });
  return { wrapper, i18n, element };
}
function demoBundle(registerNodes = vi.fn()): FrontendBundle {
  return {
    id: 'demo',
    summary: defineComponent({
      props: { onOpen: { type: Function, required: true } },
      setup(props: { onOpen: () => void }) {
        const { t } = useI18n();
        return () => h('button', { type: 'button', onClick: props.onOpen }, t('demo.title'));
      },
    }),
    settings: defineComponent({
      setup() {
        const { t } = useI18n();
        return () => h('p', t('demo.settings'));
      },
    }),
    messages: {
      en: { demo: { title: 'Demo bundle', settings: 'Demo settings' } },
      zh: { demo: { title: '演示包', settings: '演示设置' } },
    },
    registerNodes,
  };
}
const requested = () => app.api.fetchApi.mock.calls.map(([path]) => String(path));

test('08-A: the public entry registers the shared extensions once and delegates bundle nodes', async () => {
  const registerNodes = vi.fn();
  const demo = demoBundle(registerNodes);
  initializeFrontend(app as unknown as ComfyApp, [demo]);

  const extensions = app.registerExtension.mock.calls.map(([entry]) => entry.name);
  expect(extensions).toEqual(['vue-basic', 'AstroPhoto.ScientificNodes', 'AstroPhoto.Sidebar']);
  expect(registerNodes).toHaveBeenCalledTimes(1);
  expect(registerNodes).toHaveBeenCalledWith(app, [demo]);
  expect(requested()).toEqual([]);

  const sidebar = app.registerExtension.mock.calls.map(([entry]) => entry).find(entry => entry.name === 'AstroPhoto.Sidebar')!;
  sidebar.setup();
  expect(requested()).toEqual([`${api}/previews/settings`]);
  expect(tabs).toHaveLength(1);
  expect(tabs[0].id).toBe('astrophoto.sidebar');
  const container = document.createElement('div');
  document.body.append(container);
  tabs[0].render(container);
  await expect.element(page.getByRole('tab', { name: 'Assets', exact: true })).toBeVisible();
  expect(container.querySelector('#ap-tab-assets')?.closest('[role="tablist"]')?.children).toHaveLength(3);
});

test('08-A: without a bundle the software entry stays unavailable and exposes no bundle entry', async () => {
  serve({ available: false, reason: 'not_implemented' });
  mountSidebar();
  await page.getByRole('tab', { name: 'Settings', exact: true }).click();
  const entry = page.getByText('Software', { exact: true });
  await expect.element(entry).toBeVisible();
  expect(entry.element().closest('button')?.textContent).toContain('Unavailable');

  await entry.click();
  await expect.element(page.getByText('PixInsight', { exact: true })).toBeVisible();
  expect(document.body.textContent).not.toMatch(/siril/i);
  expect(requested().filter(path => /siril/i.test(path))).toEqual([]);
});

test('08-A: a second bundle plugs into the shared software entry and its own messages', async () => {
  serve({ available: true, reason: null });
  const { i18n, element } = mountSidebar([demoBundle()]);
  await page.getByRole('tab', { name: 'Settings', exact: true }).click();
  await page.getByText('Software', { exact: true }).click();

  const summary = page.getByRole('button', { name: 'Demo bundle', exact: true });
  await expect.element(summary).toBeVisible();
  i18n.global.locale.value = 'zh';
  await expect.element(page.getByRole('button', { name: '演示包', exact: true })).toBeVisible();
  i18n.global.locale.value = 'en';

  await summary.click();
  await expect.element(page.getByText('Demo settings', { exact: true })).toBeVisible();
  element.querySelector<HTMLButtonElement>('.ap-software button[aria-label="Back"]')!.click();
  await expect.element(summary).toBeVisible();
  expect(requested().filter(path => /siril/i.test(path))).toEqual([]);
});

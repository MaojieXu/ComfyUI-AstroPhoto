import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { expect, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import { getPreviewSettings, previewResolutionEvents } from '../../src/api/previewSettings';
import { fetchStorage, type Storage } from '../../src/api/storage';
import EnvironmentPage from '../../src/features/storage/EnvironmentPage.vue';
import StoragePage from '../../src/features/storage/StoragePage.vue';
import { createFrontendI18n } from '../../src/i18n';
import { useResource } from '../../src/shared/useResource';
import { app } from '../host';

const api = '/astrophoto/v1';
const workspace = {
  id: 'workspace', name: 'Local', root_path: 'C:/fixture/workspace', status: 'online', enabled: true,
  revision: 0, is_default: true, free_bytes: 100,
};

function storageSnapshot(): Storage {
  return {
    status: 'ready', data_root: { path: 'C:/fixture', source: 'default' }, database: { assets: 'ready' },
    imports: { default_mode: 'reference', revision: 1 }, default_workspace_id: 'workspace', workspaces: [workspace],
    cache: { path: 'C:/fixture/cache', max_size_gb: 20, used_bytes: 0, status: 'online' },
    capabilities: { write: true, import: true }, operations: [],
  };
}

function response(body: unknown, status = 200) {
  return Response.json(body, { status });
}

function vueOptions() {
  return { attachTo: document.body, global: { plugins: [createFrontendI18n()] } };
}

function mountStorage() {
  const Parent = defineComponent(() => {
    const { resource, refresh } = useResource(fetchStorage, true);
    return () => h(StoragePage, { resource: resource.value, refresh });
  });
  return mount(Parent, vueOptions());
}

function settings(revision: number, longest_edge = 960, width = 460) {
  return { revision, longest_edge, options: [0, 480, 960], canvas: { width, max_height: 390 }, canvas_min: 220, canvas_max: 1400 };
}

test('03-C rejected mode revision preserves the checked server value, accepted mode refreshes it', async () => {
  const snapshot = storageSnapshot();
  const update = vi.fn(() => response({ error: { code: 'REVISION_CONFLICT' } }, 409));
  app.api.fetchApi.mockImplementation(async (path: string, init: RequestInit) => {
    if (path === `${api}/storage`) return response(snapshot);
    expect(path).toBe(`${api}/storage/settings`);
    expect(init.method).toBe('PATCH');
    expect(new Headers(init.headers).get('X-AstroPhoto-Local')).toBe('1');
    expect(JSON.parse(String(init.body))).toEqual({ expected_revision: 1, imports: { default_mode: 'copy' } });
    return update();
  });

  mountStorage();
  const reference = page.getByRole('radio', { name: /Index in database only/ });
  const copy = page.getByRole('radio', { name: /Copy into managed workspace/ });
  await expect.element(reference).toBeChecked();
  await copy.click();
  await expect.element(page.getByRole('alert').getByText('REVISION_CONFLICT', { exact: true })).toBeVisible();
  await expect.element(reference).toBeChecked();

  update.mockImplementationOnce(() => {
    snapshot.imports = { default_mode: 'copy', revision: 2 };
    return response({ request_id: 'accepted' });
  });
  await copy.click();
  await expect.element(copy).toBeChecked();
  expect(update).toHaveBeenCalledTimes(2);
  expect(app.api.fetchApi.mock.calls.some(([path]) => String(path).includes('/assets/'))).toBe(false);
});

test('03-A migration opens a native prompt, displays the receipt and refreshes the workspace path', async () => {
  const snapshot = storageSnapshot();
  const prompt = vi.spyOn(app.extensionManager.dialog, 'prompt').mockResolvedValueOnce(null).mockResolvedValueOnce(' D:/new ');
  const confirm = vi.spyOn(app.extensionManager.dialog, 'confirm').mockResolvedValueOnce(false).mockResolvedValueOnce(true);
  const start = vi.fn(async () => response({ operation_id: 'job', request_id: 'accepted' }, 202));
  app.api.fetchApi.mockImplementation(async (path: string, init: RequestInit) => {
    if (path === `${api}/storage`) return response(snapshot);
    if (path === `${api}/storage/migrations/preflight`) {
      expect(JSON.parse(String(init.body))).toEqual({ workspace_id: 'workspace', target_path: 'D:/new' });
      return response({ plan_id: 'plan', source: workspace.root_path, target: 'D:/new', base_bytes: 24, requested_bytes: 24,
        options: [{ id: 'complete', bytes: 24, difference_bytes: 0, groups: [] }], groups: [],
        cleanup_files: ['objects/sample.fit'], reason: null, same_volume: false, request_id: 'preflight' });
    }
    if (path === `${api}/storage/migrations`) {
      expect(init.method).toBe('POST');
      expect(JSON.parse(String(init.body))).toEqual({ plan_id: 'plan', option_id: 'complete', idempotency_key: expect.any(String) });
      return start();
    }
    expect(path).toBe(`${api}/storage/migrations/job`);
    snapshot.workspaces = [{ ...workspace, root_path: 'D:/new' }];
    return response({ operation_id: 'job', kind: 'migration', phase: 'completed', effective_import_mode: null,
      receipt: { processed: 1, total: 1, verification: 'sha256' }, error: null });
  });

  mountStorage();
  const more = page.getByRole('button', { name: 'Actions for Local' });
  const migrate = page.getByRole('button', { name: 'Migrate workspace' });
  await expect.element(migrate).not.toBeInTheDocument();
  await more.click();
  await expect.element(page.getByRole('button', { name: 'Remove' })).toBeDisabled();
  await migrate.element().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await expect.element(more).toHaveFocus();

  await more.click();
  await migrate.click();
  expect(start).not.toHaveBeenCalled();
  await migrate.click();
  expect(prompt).toHaveBeenLastCalledWith(expect.objectContaining({
    title: 'Migrate workspace', message: 'Absolute path on the ComfyUI server',
  }));
  const option = page.getByRole('button', { name: 'Move the workspace (24 B)' });
  await option.click();
  expect(start).not.toHaveBeenCalled();
  expect(confirm).toHaveBeenCalledWith(expect.objectContaining({ itemList: ['objects/sample.fit'] }));
  await option.click();
  const receipt = page.getByRole('region', { name: 'Storage operation' });
  await expect.element(receipt.getByText('Verification sha256', { exact: true })).toBeVisible();
  await expect.element(page.getByText('D:/new', { exact: true })).toBeVisible();
  expect(start).toHaveBeenCalledTimes(1);
  prompt.mockRestore();
  confirm.mockRestore();
});

test('03-A cache clear obeys host confirmation and renders the matching response counts', async () => {
  const confirm = vi.spyOn(app.extensionManager.dialog, 'confirm').mockResolvedValueOnce(false).mockResolvedValueOnce(true);
  const clear = vi.fn(() => response({ request_id: 'cache-clear', removed: 1, removed_bytes: 12, skipped: 2, failed: 0 }));
  app.api.fetchApi.mockImplementation(async (path: string, init: RequestInit) => {
    if (path === `${api}/storage`) return response(storageSnapshot());
    expect(path).toBe(`${api}/storage/cache/clear`);
    expect(JSON.parse(String(init.body))).toEqual({ scope: 'all' });
    return clear();
  });

  mountStorage();
  const button = page.getByRole('button', { name: 'Clear cache' });
  await button.click();
  expect(confirm).toHaveBeenCalledWith(expect.objectContaining({ itemList: ['C:/fixture/cache'] }));
  expect(clear).not.toHaveBeenCalled();
  await button.click();
  await expect.element(page.getByText('Removed 1 (12 B). Skipped 2. Failed 0.')).toBeVisible();
  expect(clear).toHaveBeenCalledTimes(1);
  confirm.mockRestore();
});

test('03-C refreshing after a cache revision conflict preserves edits and retries against the new revision', async () => {
  const snapshot = storageSnapshot();
  const writes: unknown[] = [];
  const loads = vi.fn(() => response(snapshot));
  app.api.fetchApi.mockImplementation(async (path: string, init: RequestInit) => {
    if (path === `${api}/storage`) return loads();
    expect(path).toBe(`${api}/storage/cache/configure`);
    const body = JSON.parse(String(init.body));
    writes.push(body);
    if (body.expected_revision === 1) {
      snapshot.cache = { ...snapshot.cache, path: 'C:/fixture/server-cache', max_size_gb: 25 };
      snapshot.imports.revision = 2;
      return response({ error: { code: 'REVISION_CONFLICT' } }, 409);
    }
    snapshot.cache = { ...snapshot.cache, path: 'C:/fixture/local-draft-cache', max_size_gb: 32 };
    snapshot.imports.revision = 3;
    return response({ request_id: 'accepted' });
  });

  mountStorage();
  const path = page.getByRole('textbox', { name: 'Absolute path on the ComfyUI server', exact: true });
  const limit = page.getByRole('spinbutton', { name: 'Cache limit (GB)' });
  const save = page.getByRole('button', { name: 'Save', exact: true });
  await path.fill('C:/fixture/local-draft-cache');
  await limit.fill('32');
  await save.click();
  await expect.element(page.getByText('REVISION_CONFLICT', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await vi.waitFor(() => expect(loads).toHaveBeenCalledTimes(2));
  await expect.element(path).toHaveValue('C:/fixture/local-draft-cache');
  await expect.element(limit).toHaveValue(32);
  await save.click();
  await expect.element(save).toBeDisabled();
  expect(writes).toEqual([
    { expected_revision: 1, path: 'C:/fixture/local-draft-cache', max_size_gb: 32 },
    { expected_revision: 2, path: 'C:/fixture/local-draft-cache', max_size_gb: 32 },
  ]);
});

test('03-B/03-C preview conflict keeps draft and saves against reloaded revision; a stale DTO does not restore old CSS', async ({ onTestFinished }) => {
  let accepted = settings(100);
  const saved = vi.fn();
  const changed = vi.fn();
  const puts: unknown[] = [];
  previewResolutionEvents.addEventListener('change', changed);
  onTestFinished(() => previewResolutionEvents.removeEventListener('change', changed));
  app.api.fetchApi.mockImplementation(async (path: string, init: RequestInit) => {
    expect(path).toBe(`${api}/previews/settings`);
    if (init.method === 'GET') return response(accepted);
    const body = JSON.parse(String(init.body));
    puts.push(body);
    if (body.expected_revision === 100) {
      accepted = settings(101, 960, 500);
      return response({ request_id: 'conflict', error: { code: 'REVISION_CONFLICT' } }, 409);
    }
    accepted = settings(102, 480, 500);
    return response(accepted);
  });

  const wrapper = mount(EnvironmentPage, { ...vueOptions(), props: { onSaved: saved } });
  const select = page.getByRole('combobox', { name: 'Preview resolution' });
  const save = page.getByRole('button', { name: 'Save', exact: true });
  await expect.element(select).toHaveTextContent('960 px');
  await select.click();
  await page.getByRole('option', { name: '480 px' }).click();
  await save.click();
  await expect.element(page.getByRole('alert').getByText('Settings changed. Reload the current value before saving.', { exact: true })).toBeVisible();
  await expect.element(save).toBeDisabled();
  await expect.element(select).toHaveTextContent('480 px');
  expect(saved).not.toHaveBeenCalled();

  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await expect.element(save).toBeEnabled();
  await expect.element(select).toHaveTextContent('480 px');
  await save.click();
  await expect.element(page.getByText('Preview settings saved.')).toBeVisible();
  expect(puts).toEqual([
    { expected_revision: 100, longest_edge: 480, canvas: { width: 460, max_height: 390 } },
    { expected_revision: 101, longest_edge: 480, canvas: { width: 500, max_height: 390 } },
  ]);
  expect(saved).toHaveBeenCalledTimes(1);
  expect(changed).toHaveBeenCalledTimes(1);
  expect(document.documentElement.style.getPropertyValue('--astrophoto-canvas-preview-width')).toBe('500px');
  wrapper.unmount();

  app.api.fetchApi.mockResolvedValueOnce(response(settings(100)));
  expect(await getPreviewSettings()).toEqual(accepted);
  expect(document.documentElement.style.getPropertyValue('--astrophoto-canvas-preview-width')).toBe('500px');
  mount(EnvironmentPage, { ...vueOptions(), props: { onSaved: saved } });
  await expect.element(select).toHaveTextContent('480 px');
});

test('03-C leaving before preview settings respond aborts the GET and suppresses a delayed failure', async () => {
  let signal: AbortSignal | undefined;
  let rejectRequest: ((error: Error) => void) | undefined;
  app.api.fetchApi.mockImplementation((_, init: RequestInit) => new Promise((_, reject) => {
    signal = init.signal ?? undefined;
    rejectRequest = reject;
  }));
  const onSaved = vi.fn();
  const wrapper = mount(EnvironmentPage, { ...vueOptions(), props: { onSaved } });
  expect(signal?.aborted).toBe(false);
  wrapper.unmount();
  expect(signal?.aborted).toBe(true);
  rejectRequest?.(new Error('late network error'));
  await flushPromises();
  expect(onSaved).not.toHaveBeenCalled();
  await expect.element(page.getByRole('alert')).not.toBeInTheDocument();
});

test('03-C preview settings reject an invalid server response and recover on retry', async () => {
  app.api.fetchApi.mockResolvedValueOnce(response({ longest_edge: '480' }))
    .mockResolvedValueOnce(response(settings(110, 480)));
  mount(EnvironmentPage, { ...vueOptions(), props: { onSaved: vi.fn() } });
  await expect.element(page.getByText('The server response does not match the supported contract.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await expect.element(page.getByRole('combobox', { name: 'Preview resolution' })).toHaveTextContent('480 px');
});

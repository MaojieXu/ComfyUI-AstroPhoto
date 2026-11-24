import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
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
  const reference = page.getByRole('radio', { name: /Index original files/ });
  const copy = page.getByRole('radio', { name: /Copy to storage/ });
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

test('03-A the storage page shows only workspace registration and existing quotas are read-only', async () => {
  const snapshot = storageSnapshot();
  snapshot.data_root_receipt = { source: 'C:/old', target: 'C:/fixture', copy_bytes: 12 };
  snapshot.operations = [{ operation_id: 'job', kind: 'migration', phase: 'running' }];
  snapshot.volumes = [{
    id: 'configured-volume', workspace_ids: [workspace.id], quota_bytes: 1000000000, used_bytes: 0,
    reserved_bytes: 0, remaining_quota_bytes: 1000000000, free_bytes: 2000000000, available_bytes: 1000000000,
  }];
  const requests: { name: string; path: string }[] = [];
  app.api.fetchApi.mockImplementation(async (path: string, init: RequestInit) => {
    if (path === `${api}/storage`) return response(snapshot);
    expect(path).toBe(`${api}/storage/locations`);
    expect(init.method).toBe('POST');
    const input = JSON.parse(String(init.body));
    requests.push(input);
    snapshot.workspaces.push({
      ...workspace, id: input.name, name: input.name, root_path: input.path, is_default: false,
    });
    return response({ request_id: input.name }, 201);
  });

  mountStorage();
  const add = page.getByRole('button', { name: 'Add storage location' });
  const rows = page.getByRole('listitem');
  await expect.element(rows.nth(0).getByText(workspace.root_path, { exact: true })).not.toBeInTheDocument();
  await rows.nth(0).getByText('⋯').click();
  await expect.element(rows.nth(0).getByRole('button', { name: 'Remove', exact: true })).toBeDisabled();
  await expect.element(rows.nth(0).getByText(workspace.root_path, { exact: true })).toBeVisible();
  await page.getByRole('heading', { name: 'Storage locations' }).click();
  await expect.element(rows.nth(0).getByText(workspace.root_path, { exact: true })).not.toBeVisible();
  for (const name of ['Z archive', 'A archive']) {
    await add.click();
    await page.getByRole('textbox', { name: 'Location name' }).fill(` ${name} `);
    await page.getByRole('textbox', { name: 'Local absolute path' }).fill(` D:/${name} `);
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect.element(page.getByText(name, { exact: true })).toBeVisible();
  }
  await expect.element(rows.nth(0).getByText('Local', { exact: true })).toBeVisible();
  await expect.element(rows.nth(1).getByText('Z archive', { exact: true })).toBeVisible();
  await expect.element(rows.nth(2).getByText('A archive', { exact: true })).toBeVisible();
  expect(requests).toEqual([{ name: 'Z archive', path: 'D:/Z archive' }, { name: 'A archive', path: 'D:/A archive' }]);

  await expect.element(page.getByRole('heading', { name: 'Shared volume quota' })).toBeVisible();
  await expect.element(page.getByRole('button', { name: /Move AstroPhoto data|Actions for|Edit quota|Migrate workspace|Clear cache/ })).not.toBeInTheDocument();
  await expect.element(page.getByRole('heading', { name: 'Cache', exact: true })).not.toBeInTheDocument();
  await expect.element(page.getByText(/clears AstroPhoto Cache on exit/)).not.toBeInTheDocument();
  await expect.element(page.getByText('C:/old', { exact: false })).not.toBeInTheDocument();
  await expect.element(page.getByRole('region', { name: 'Storage operation' })).not.toBeInTheDocument();
});

test('removing the preferred location requires an explicit target and confirmation', async () => {
  const snapshot = storageSnapshot();
  snapshot.workspaces.push(
    { ...workspace, id: 'archive', name: 'Archive', root_path: 'D:/archive', is_default: false },
    { ...workspace, id: 'offline', name: 'Offline', status: 'offline', is_default: false },
  );
  const remove = vi.fn();
  app.api.fetchApi.mockImplementation(async (path: string, init: RequestInit) => {
    if (path === api + '/storage') return response(snapshot);
    expect(path).toBe(api + '/storage/locations/workspace');
    expect(init.method).toBe('DELETE');
    remove(JSON.parse(String(init.body)));
    if (remove.mock.calls.length === 1) return response({ error: { code: 'INSUFFICIENT_DISK_SPACE' } }, 409);
    snapshot.workspaces.shift();
    return response({ request_id: 'removed' });
  });
  mountStorage();
  const row = page.getByRole('listitem').nth(0);
  await row.getByText('⋯').click();
  const action = row.getByRole('button', { name: 'Remove', exact: true });
  await action.click();
  const dialog = page.getByRole('dialog', { name: 'Remove storage location' });
  const confirm = dialog.getByRole('button', { name: 'Move and remove' });
  const picker = dialog.getByRole('combobox', { name: 'Move files to' });
  await expect.element(confirm).toBeDisabled();
  expect([...picker.element().querySelectorAll('option')].map(item => item.value)).toEqual(['', 'archive']);
  await picker.selectOptions('archive');
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  expect(remove).not.toHaveBeenCalled();
  await row.getByText('⋯').click();
  await action.click();
  await expect.element(confirm).toBeDisabled();
  await picker.selectOptions('archive');
  await confirm.click();
  await expect.element(page.getByRole('alert').getByText('INSUFFICIENT_DISK_SPACE')).toBeVisible();
  await expect.element(row.getByText('Local', { exact: true })).toBeVisible();
  await row.getByText('⋯').click();
  await action.click();
  await picker.selectOptions('archive');
  await confirm.click();
  await expect.element(row.getByText('Archive', { exact: true })).toBeVisible();
  expect(remove.mock.calls).toEqual(Array(2).fill([{ expected_revision: 0, target_workspace_id: 'archive' }]));
  await row.getByText('⋯').click();
  await action.click();
  await expect.element(dialog.getByText('Bring another storage location online to move these files.', { exact: true })).toBeVisible();
  await expect.element(confirm).toBeDisabled();
});

test('a refreshed removal resumes only against its recorded destination', async () => {
  const snapshot = storageSnapshot();
  snapshot.workspaces[0] = { ...workspace, removal_target_id: 'target', status: 'migrating' };
  snapshot.workspaces.push(
    { ...workspace, id: 'target', name: 'Destination', is_default: false, status: 'migrating' },
    { ...workspace, id: 'other', name: 'Alternate', is_default: false },
  );
  const writes = vi.fn();
  app.api.fetchApi.mockImplementation(async (path: string, init: RequestInit) => {
    if (path === api + '/storage') return response(snapshot);
    writes(path, init.method, JSON.parse(String(init.body)));
    snapshot.workspaces.shift();
    return response({ request_id: 'resumed' });
  });
  mountStorage();
  const row = page.getByRole('listitem').nth(0);
  await row.getByText('⋯').click();
  await row.getByRole('button', { name: 'Resume removal' }).click();
  const dialog = page.getByRole('dialog', { name: 'Remove storage location' });
  const picker = dialog.getByRole('combobox');
  await expect.element(picker).toBeDisabled();
  await expect.element(picker).toHaveValue('target');
  expect(writes).not.toHaveBeenCalled();
  await dialog.getByRole('button', { name: 'Resume removal' }).click();
  await expect.element(row.getByText('Destination', { exact: true })).toBeVisible();
  expect(writes).toHaveBeenCalledExactlyOnceWith(api + '/storage/locations/workspace', 'DELETE', {
    expected_revision: 0, target_workspace_id: 'target',
  });
});

test('folder browser fills the storage location path and can cancel', async () => {
  app.api.fetchApi.mockImplementation(async (path: string) => {
    if (path === `${api}/storage`) return response(storageSnapshot());
    if (path === `${api}/storage/native-picker`) return response({ status: 'unavailable', path: null });
    if (path === `${api}/storage/directories`) return response({
      path: null, parent: null, directories: [{ name: 'Drive C', path: 'C:/' }],
    });
    if (path === `${api}/storage/directories?path=C%3A%2F` ||
        path === `${api}/storage/directories?path=C%3A%5C`) return response({
      path: 'C:/', parent: null, directories: [{ name: 'Images', path: 'C:/Images' }],
    });
    if (path === `${api}/storage/directories?path=C%3A%2FImages`) return response({
      path: 'C:/Images', parent: 'C:/', directories: [],
    });
    throw new Error('Unexpected request ' + path);
  });
  mountStorage();
  await page.getByRole('button', { name: 'Add storage location' }).click();
  const input = page.getByRole('textbox', { name: 'Local absolute path' });
  await page.getByRole('button', { name: 'Choose folder' }).click();
  await page.getByRole('button', { name: 'Drive C' }).click();
  await page.getByRole('button', { name: 'Images' }).click();
  await expect.element(page.getByRole('dialog', { name: 'Choose folder' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Current path' }).getByRole('button', { name: 'C:\\', exact: true }).click();
  await page.getByRole('button', { name: 'Images', exact: true }).click();
  await expect.element(page.getByRole('button', { name: 'Add to batch' })).not.toBeInTheDocument();
  await page.getByRole('button', { name: 'Select this folder' }).click();
  await expect.element(input).toHaveValue('C:/Images');
  await page.getByRole('button', { name: 'Choose folder' }).click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect.element(input).toHaveValue('C:/Images');
});

test('storage location order is saved through the policy API', async () => {
  const snapshot = storageSnapshot();
  snapshot.workspaces.push({ ...workspace, id: 'second', name: 'Second', is_default: false });
  app.api.fetchApi.mockImplementation(async (path: string, init: RequestInit) => {
    if (path === `${api}/storage`) return response(snapshot);
    expect(path).toBe(`${api}/storage/location-policy`);
    expect(init.method).toBe('PUT');
    const body = JSON.parse(String(init.body));
    expect(body.order).toEqual(['second', workspace.id]);
    snapshot.workspaces.reverse();
    snapshot.imports.revision++;
    return response({ request_id: 'reorder' });
  });
  mountStorage();
  const rows = page.getByRole('listitem');
  await expect.element(rows.nth(1).getByRole('button', { name: 'Drag Second to reorder' })).toBeVisible();
  rows.nth(1).getByRole('button', { name: 'Drag Second to reorder' }).element().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
  await expect.element(rows.nth(0).getByText('Second', { exact: true })).toBeVisible();
});

test('dragging a storage location saves the reordered IDs', async () => {
  const snapshot = storageSnapshot();
  snapshot.workspaces.push({ ...workspace, id: 'second', name: 'Second', is_default: false });
  const orders: string[][] = [];
  app.api.fetchApi.mockImplementation(async (path: string, init: RequestInit) => {
    if (path === `${api}/storage`) return response(snapshot);
    expect(path).toBe(`${api}/storage/location-policy`);
    const body = JSON.parse(String(init.body));
    orders.push(body.order);
    snapshot.workspaces.reverse();
    snapshot.imports.revision++;
    return response({ request_id: 'drag-reorder' });
  });
  const wrapper = mountStorage();
  await expect.element(page.getByText('Second', { exact: true })).toBeVisible();
  const handle = wrapper.element.querySelector('[aria-label="Drag Second to reorder"]');
  const target = wrapper.element.querySelector('.ap-workspace-row');
  expect(handle).not.toBeNull();
  expect(target).not.toBeNull();
  const transfer = new DataTransfer();
  handle!.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: transfer }));
  target!.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: transfer }));
  target!.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: transfer }));
  await vi.waitFor(() => expect(orders).toEqual([['second', workspace.id]]));
});

test('03-C a rejected workspace registration keeps the draft and allows another attempt', async () => {
  const snapshot = storageSnapshot();
  const failed = vi.fn(() => response({ error: { code: 'INVALID_STORAGE_PATH' } }, 422));
  app.api.fetchApi.mockImplementation(async (path: string, init: RequestInit) => {
    if (path === `${api}/storage`) return response(snapshot);
    expect(path).toBe(`${api}/storage/locations`);
    const input = JSON.parse(String(init.body));
    expect(input.name).toBe('Archive');
    if (input.path === 'relative') return failed();
    snapshot.workspaces.push({ ...workspace, id: 'archive', name: input.name, root_path: input.path, is_default: false });
    return response({ request_id: 'archive' }, 201);
  });

  mountStorage();
  await page.getByRole('button', { name: 'Add storage location' }).click();
  const name = page.getByRole('textbox', { name: 'Location name' });
  const path = page.getByRole('textbox', { name: 'Local absolute path' });
  const save = page.getByRole('button', { name: 'Save', exact: true });
  await name.fill('Archive');
  await path.fill('relative');
  await save.click();
  await expect.element(page.getByRole('alert').getByText('INVALID_STORAGE_PATH', { exact: true })).toBeVisible();
  await expect.element(name).toHaveValue('Archive');
  await expect.element(path).toHaveValue('relative');
  await path.fill('D:/archive');
  await save.click();
  await expect.element(page.getByText('Archive', { exact: true })).toBeVisible();
  await expect.element(save).not.toBeInTheDocument();
  expect(failed).toHaveBeenCalledTimes(1);
});

test('03-B/03-C preview selection saves and conflict reloads the current revision', async ({ onTestFinished }) => {
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
  await expect.element(select).toHaveTextContent('960 px');
  await select.click();
  await page.getByRole('option', { name: '480 px' }).click();
  await expect.element(page.getByRole('alert').getByText('Settings changed. Reload the current value before saving.', { exact: true })).toBeVisible();
  await expect.element(select).toHaveTextContent('960 px');
  expect(saved).not.toHaveBeenCalled();

  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await expect.element(select).toHaveTextContent('960 px');
  await select.click();
  await page.getByRole('option', { name: '480 px' }).click();
  await expect.element(select).toHaveTextContent('480 px');
  await vi.waitFor(() => expect(saved).toHaveBeenCalledTimes(1));
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


test('location panel saves name and limit, and cancel discards changes', async () => {
  const snapshot = storageSnapshot();
  const writes: string[] = [];
  app.api.fetchApi.mockImplementation(async (path: string, init: RequestInit) => {
    if (path === `${api}/storage`) return response(snapshot);
    writes.push(path);
    const body = JSON.parse(String(init.body));
    if (path.endsWith('/location-policy')) {
      expect(body.quotas.workspace).toBe(2 * 1073741824);
      snapshot.workspaces[0] = { ...snapshot.workspaces[0], quota_bytes: body.quotas.workspace };
      snapshot.imports.revision++;
    } else {
      expect(body.name).toBe('Renamed');
      snapshot.workspaces[0] = { ...snapshot.workspaces[0], name: body.name };
    }
    return response({ request_id: 'saved' });
  });
  mountStorage();
  const row = page.getByRole('listitem').nth(0);
  await row.getByText('⋯').click();
  await expect.element(row.getByRole('button', { name: 'Save', exact: true })).toBeDisabled();
  await row.getByRole('textbox', { name: 'Location name' }).fill('discarded');
  await row.getByRole('button', { name: 'Cancel', exact: true }).click();
  await row.getByText('⋯').click();
  await expect.element(row.getByRole('textbox', { name: 'Location name' })).toHaveValue('Local');
  await row.getByRole('textbox', { name: 'Location name' }).fill('outside');
  await page.getByRole('heading', { name: 'Storage locations' }).click();
  expect(writes).toEqual([]);
  await row.getByText('⋯').click();
  await expect.element(row.getByRole('textbox', { name: 'Location name' })).toHaveValue('Local');
  await row.getByRole('textbox', { name: 'Location name' }).fill('Renamed');
  await row.getByRole('textbox', { name: 'Capacity limit (GiB)' }).fill('2');
  await row.getByRole('button', { name: 'Save', exact: true }).click();
  await expect.element(page.getByText('Renamed', { exact: true })).toBeVisible();
  expect(writes).toEqual([`${api}/storage/location-policy`, `${api}/storage/locations/workspace`]);
});

test('location panel reports a partially saved limit and retries only the name', async () => {
  const snapshot = storageSnapshot();
  const calls: string[] = [];
  let nameAttempts = 0;
  app.api.fetchApi.mockImplementation(async (path: string, init: RequestInit) => {
    if (path === `${api}/storage`) return response(snapshot);
    calls.push(path);
    if (path.endsWith('/location-policy')) {
      snapshot.workspaces[0] = { ...snapshot.workspaces[0], quota_bytes: 1073741824 };
      snapshot.imports.revision++;
    } else if (++nameAttempts === 1) {
      return response({ error: { code: 'TEMPORARY_FAILURE' } }, 500);
    } else {
      snapshot.workspaces[0] = { ...snapshot.workspaces[0], name: JSON.parse(String(init.body)).name };
    }
    return response({ request_id: 'saved' });
  });
  mountStorage();
  const row = page.getByRole('listitem').nth(0);
  await row.getByText('⋯').click();
  await row.getByRole('textbox', { name: 'Location name' }).fill('Renamed');
  await row.getByRole('textbox', { name: 'Capacity limit (GiB)' }).fill('1');
  await row.getByRole('button', { name: 'Save', exact: true }).click();
  await expect.element(row.getByText('The limit was saved but the name was not; retry or close to review.')).toBeVisible();
  await row.getByRole('button', { name: 'Save', exact: true }).click();
  await expect.element(page.getByText('Renamed', { exact: true })).toBeVisible();
  expect(calls).toEqual([`${api}/storage/location-policy`, `${api}/storage/locations/workspace`, `${api}/storage/locations/workspace`]);
});

test('location panel displays the current capacity reference and help, not used space', async () => {
  const snapshot = storageSnapshot();
  const gib = 1073741824;
  snapshot.workspaces[0] = { ...workspace, free_bytes: 60 * gib, used_bytes: 5 * gib, reserved_bytes: gib };
  snapshot.volumes = [{ id: 'disk', workspace_ids: [workspace.id], quota_bytes: 50 * gib,
    used_bytes: 20 * gib, reserved_bytes: 2 * gib, remaining_quota_bytes: 28 * gib,
    free_bytes: 60 * gib, available_bytes: 58 * gib }];
  app.api.fetchApi.mockImplementation(async () => response(snapshot));
  mountStorage();
  const row = page.getByRole('listitem').nth(0);
  await row.getByText('⋯').click();
  await expect.element(row.getByText('Current limit reference: 34.00 GiB')).toBeVisible();
  await expect.element(row.getByText(/Location used:/)).not.toBeInTheDocument();
  const help = row.getByRole('button', { name: 'About capacity limit' });
  await userEvent.hover(help);
  await expect.element(page.getByText(/availability can change/)).toBeVisible();
  await userEvent.unhover(help);
  await expect.element(page.getByText(/availability can change/)).not.toBeInTheDocument();
});

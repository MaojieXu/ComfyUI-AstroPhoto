import { mount } from '@vue/test-utils';
import { afterEach, expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { Sidebar } from '../../src/features/sidebar/Sidebar';
import { createFrontendI18n } from '../../src/i18n';
import type { Storage } from '../../src/api/storage';
import type { Asset, Project } from '../../src/api/assets';
import '../../src/styles/theme.css';
import { app } from '../host';

const prefix = '/astrophoto/v1';
const asset: Asset = {
  id: '11111111-1111-4111-8111-111111111111', revision: 1, name: 'Andromeda.fit', size_bytes: 55,
  storage_mode: 'external_reference', workspace_id: null, available: true,
  attributes: { target: 'M31', usage: 'light', calibration_state: 'uncalibrated', role: 'master_frame' },
};
const project: Project = { id: '22222222-2222-4222-8222-222222222222', revision: 1, name: 'Andromeda project' };
const workspace = {
  id: '33333333-3333-4333-8333-333333333333', revision: 1, is_default: true, enabled: true,
  name: 'Default', root_path: 'C:/test/workspace', status: 'online', free_bytes: 10000,
};
function storage(mode: Storage['imports']['default_mode'], revision: number): Storage {
  return {
    status: 'ready', data_root: { path: 'C:/test', source: 'env' }, database: { assets: 'ready' },
    imports: { default_mode: mode, revision }, default_workspace_id: workspace.id, workspaces: [workspace],
    cache: { path: 'C:/test/cache', status: 'online', max_size_gb: 5, used_bytes: 0 },
    capabilities: { write: true, import: true }, operations: [],
  };
}
type Handler = (route: string, request: RequestInit) => Response | undefined;
const empty = () => Response.json({ items: [], next: null });
function serve(override?: Handler) {
  app.api.fetchApi.mockImplementation(async (path: string, request: RequestInit = {}) => {
    const response = override?.(path, request);
    if (response) return response;
    if (path === prefix + '/library/assets/' + asset.id) return Response.json(asset);
    if (path.startsWith(prefix + '/library/assets?')) return Response.json({ items: [asset], next: null });
    if (path.startsWith(prefix + '/library/projects?')) return Response.json({ items: [project], next: null });
    if (path.startsWith(prefix + '/library/') || path.includes('/equipment?') || path.includes('/optical-trains?')) return empty();
    return new Response(null, { status: 404 });
  });
}
const cleanups: (() => void)[] = [];
afterEach(() => {
  for (const cleanup of cleanups.splice(0)) cleanup();
  vi.restoreAllMocks();
  app.api.fetchApi.mockReset();
});
function openSidebar(width = 340) {
  const element = document.createElement('div');
  element.className = 'astrophoto-ui';
  Object.assign(element.style, { width: width + 'px', height: '700px' });
  document.body.append(element);
  const i18n = createFrontendI18n();
  const wrapper = mount(Sidebar, { attachTo: element, props: { equipmentSession: {}, bundles: [] },
    global: { plugins: [i18n] } });
  cleanups.push(() => { wrapper.unmount(); element.remove(); });
  return { element, i18n };
}
const tab = (name: string) => page.getByRole('tab', { name, exact: true });
const button = (name: string | RegExp) => page.getByRole('button', { name, exact: true });
async function allAssets() { await tab('All Assets').click(); }
async function importAssets() {
  await allAssets();
  await button('Import Assets').click();
}

test('top-level tabs return to Projects and the settings list while the import shortcut opens Storage', async () => {
  serve((path) => path === prefix + '/storage' ? Response.json(storage('reference', 1)) : undefined);
  app.extensionManager.dialog.confirm.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
  openSidebar();
  await importAssets();
  await page.getByRole('textbox', { name: 'Authorized server path' }).fill('C:/authorized/Andromeda.fit');
  await button('Add path').click();
  await tab('Assets').click();
  await expect.element(button('Open Storage settings')).toBeVisible();
  expect(app.extensionManager.dialog.confirm).toHaveBeenCalledOnce();
  await button('Open Storage settings').click();
  const storageTitle = page.getByRole('heading', { name: 'Storage', exact: true });
  await expect.element(storageTitle).toBeVisible();
  await tab('Settings').click();
  await expect.element(storageTitle).not.toBeInTheDocument();
  await expect.element(button(/^Storage /)).toBeVisible();
  await tab('Assets').click();
  await expect.element(page.getByRole('heading', { name: 'Projects', exact: true })).toBeVisible();
  expect(app.extensionManager.dialog.confirm).toHaveBeenCalledTimes(2);
  await allAssets();
  await tab('Nodes').click();
  await tab('Assets').click();
  await expect.element(page.getByRole('heading', { name: 'Projects', exact: true })).toBeVisible();
});

test('UX-01/02: preserves the Assets filters and retains three host tabs in a narrow sidebar', async () => {
  serve();
  const { element, i18n } = openSidebar(245);
  await expect.element(button(/Andromeda project/)).toBeVisible();
  await expect.element(button('Calibration Library')).not.toBeInTheDocument();
  await allAssets();
  await expect.element(button(/Andromeda.fit/)).toBeVisible();
  await page.getByRole('combobox', { name: 'Search assets' }).fill('Andromeda');
  await button('MasterFrame').click();
  await button('Calibration Library').click();
  await expect.element(page.getByRole('heading', { name: 'Calibration Library' })).toBeVisible();
  await button('← Back').click();
  await expect.element(page.getByRole('combobox', { name: 'Search assets' })).toHaveValue('Andromeda');
  await expect.element(button('MasterFrame')).toHaveAttribute('aria-pressed', 'true');
  expect(element.querySelector('#ap-tab-assets')?.closest('[role="tablist"]')?.children).toHaveLength(3);
  const view = element.querySelector<HTMLElement>('#ap-asset-panel-allAssets')!;
  expect(view.scrollWidth).toBeLessThanOrEqual(view.clientWidth);
  i18n.global.locale.value = 'zh';
  await expect.element(tab('全部素材')).toBeVisible();
});

test('asset view settings use a keyboard dismissible popover and update sorting', async () => {
  serve();
  openSidebar();
  await allAssets();
  await button('View settings').click();
  await expect.element(page.getByRole('combobox', { name: 'Sort by' })).toBeVisible();
  await button('Ascending').click();
  await vi.waitFor(() => expect(app.api.fetchApi.mock.calls.some(([path]: [string]) =>
    path.startsWith(prefix + '/library/assets?') && path.includes('sort=-name'))).toBe(true));
  await userEvent.keyboard('{Escape}');
  await expect.element(page.getByRole('combobox', { name: 'Sort by' })).not.toBeInTheDocument();
  await expect.element(button('View settings')).toHaveFocus();
});

test('filter menu offers only values found across all asset pages and preserves search on clear', async () => {
  const other = { ...asset, id: '44444444-4444-4444-8444-444444444444', name: 'Orion.fit',
    attributes: { target: 'M42', usage: 'dark' } };
  serve((path) => {
    if (!path.startsWith(prefix + '/library/assets?')) return undefined;
    const params = new URLSearchParams(path.split('?')[1]);
    if (!params.has('sort')) return Response.json(params.has('after') ? { items: [other], next: null } : { items: [asset], next: 'next' });
    return Response.json({ items: [asset], next: null });
  });
  openSidebar();
  await allAssets();
  await page.getByRole('combobox', { name: 'Search assets' }).fill('Andromeda');
  await button('Filters').click();
  await expect.element(page.getByRole('combobox', { name: 'Target', exact: true })).toBeVisible();
  await expect.element(page.getByRole('combobox', { name: 'Gain', exact: true })).not.toBeInTheDocument();
  await page.getByRole('combobox', { name: 'Target', exact: true }).click();
  await expect.element(page.getByRole('option', { name: 'M42' })).toBeVisible();
  await page.getByRole('option', { name: 'M42' }).click();
  await vi.waitFor(() => expect(app.api.fetchApi.mock.calls.some(([path]: [string]) =>
    path.startsWith(prefix + '/library/assets?') && path.includes('target=M42'))).toBe(true));
  await button('Clear filters').click();
  await expect.element(page.getByRole('combobox', { name: 'Search assets' })).toHaveValue('Andromeda');
  await userEvent.keyboard('{Escape}');
  await expect.element(button('Filters')).toHaveFocus();
});

test('empty asset library offers no filter categories', async () => {
  serve(path => path.startsWith(prefix + '/library/assets?') ? empty() : undefined);
  openSidebar();
  await allAssets();
  await button('Filters').click();
  await expect.element(page.getByText('No filter options available yet.')).toBeVisible();
  await expect.element(page.getByRole('combobox', { name: 'Target', exact: true })).not.toBeInTheDocument();
});

test('filter options report a loading failure and can retry', async () => {
  let failed = false;
  serve(path => {
    if (path.startsWith(prefix + '/library/assets?') && !path.includes('sort=') && !failed) {
      failed = true;
      return new Response(null, { status: 500 });
    }
    return undefined;
  });
  openSidebar();
  await allAssets();
  await button('Filters').click();
  await expect.element(page.getByRole('alert')).toBeVisible();
  await button('Retry').click();
  await expect.element(page.getByRole('combobox', { name: 'Target', exact: true })).toBeVisible();
});

test('UX-05/06/07/09: Reference uses authorized paths, requires current policy and sends the preflight receipt', async () => {
  let revision = 7;
  const checks: Record<string, unknown>[] = [];
  const submits: Record<string, unknown>[] = [];
  let retries = 0;
  serve((path, req) => {
    if (path === prefix + '/storage') return Response.json(storage('reference', revision));
    if (path === prefix + '/assets/import/preview') {
      checks.push(JSON.parse(String(req.body)));
      return Response.json({ preview_id: 'preview-' + revision, file_count: 2, failed: 0, size_bytes: 110 });
    }
    if (path === prefix + '/assets/import') {
      submits.push(JSON.parse(String(req.body)));
      return Response.json({ operation_id: 'operation', request_id: 'request' }, { status: 202 });
    }
    if (path === prefix + '/assets/imports/operation')
      return Response.json({ operation_id: 'operation', kind: 'import', phase: 'completed', effective_import_mode: 'reference',
        error: null, receipt: { total: 2, processed: 2, registered: 1, failed: 1, retryable: 1 } });
    if (path === prefix + '/library/imports/operation/retry-remaining' && req.method === 'POST') {
      expect(JSON.parse(String(req.body))).toEqual({});
      retries++;
      return Response.json({ operation_id: 'retry-operation', request_id: 'request' }, { status: 202 });
    }
    if (path === prefix + '/assets/imports/retry-operation')
      return Response.json({ operation_id: 'retry-operation', kind: 'import', phase: 'completed', effective_import_mode: 'reference',
        error: null, receipt: { total: 1, processed: 1, registered: 1 } });
  });
  openSidebar();
  await importAssets();
  await expect.element(button('Choose files')).not.toBeInTheDocument();
  const path = page.getByRole('textbox', { name: 'Authorized server path' });
  for (let attempt = 0; attempt < 2; attempt++) {
    await path.fill('C:/authorized/Andromeda.fit');
    await button('Add path').click();
  }
  await expect.element(button('Confirm import')).toBeDisabled();
  await button('Check selection').click();
  await expect.element(button('Confirm import')).toBeEnabled();
  revision = 8;
  await button('Confirm import').click();
  await expect.element(page.getByRole('alert').getByText(/SETTINGS_CHANGED/)).toBeVisible();
  expect(submits).toEqual([]);
  await button('Check selection').click();
  await button('Confirm import').click();
  await expect.element(page.getByText('Registered 1')).toBeVisible();
  await button('Retry remaining files (1)').click();
  await expect.element(page.getByText('retry-operation', { exact: true })).toBeVisible();
  await expect.element(button('Retry remaining files (1)')).not.toBeInTheDocument();
  expect(retries).toBe(1);
  expect(checks).toEqual([7, 8].map(settings_revision => ({
    settings_revision, allow_duplicate: true, sources: ['C:/authorized/Andromeda.fit', 'C:/authorized/Andromeda.fit'],
  })));
  expect(submits).toEqual([expect.objectContaining({ ...checks[1], preview_id: 'preview-8', idempotency_key: expect.any(String) })]);
});

test('UX-03/04/08: selected files and relative folder entries stage as File bodies, and abandoned staging is released', async () => {
  const put: { path: string; file: File; filename: string }[] = [];
  const deleted: string[] = [];
  serve((path, request) => {
    if (path === prefix + '/storage') return Response.json(storage('copy', 3));
    if (path.startsWith(prefix + '/library/uploads/') && request.method === 'PUT') {
      put.push({ path, file: request.body as File, filename: new Headers(request.headers).get('X-AstroPhoto-Filename')! });
      return Response.json({ upload_id: path.split('/').at(-1) });
    }
    if (path.startsWith(prefix + '/library/uploads/') && request.method === 'DELETE') {
      deleted.push(path);
      return new Response(null, { status: 204 });
    }
    if (path === prefix + '/assets/import/preview')
      return Response.json({ preview_id: 'preview', file_count: 2, failed: 0, size_bytes: 7 });
  });
  const { element } = openSidebar();
  await importAssets();
  await expect.element(button('Choose files')).toBeEnabled();
  await expect.element(button('Choose folder')).toBeEnabled();
  const files = element.querySelectorAll<HTMLInputElement>('input[type=file]');
  expect(files[0].multiple).toBe(true);
  expect(files[1].hasAttribute('webkitdirectory')).toBe(true);
  const video = new File(['1234'], 'Moon.ser');
  Object.defineProperty(video, 'webkitRelativePath', { value: 'Panel01/Moon.ser' });
  for (const [index, file] of [new File(['fit'], 'M31.fit'), video].entries()) {
    const selected = new DataTransfer();
    selected.items.add(file);
    files[index].files = selected.files;
    files[index].dispatchEvent(new Event('change', { bubbles: true }));
  }
  await expect.element(page.getByText('Panel01/Moon.ser', { exact: false })).toBeVisible();
  await button('Check selection').click();
  await expect.element(button('Confirm import')).toBeEnabled();
  expect(put.map(item => [item.file.name, item.filename, item.file.size])).toEqual([
    ['M31.fit', 'M31.fit', 3], ['Moon.ser', 'Moon.ser', 4],
  ]);
  await button('Clear selection').click();
  await vi.waitFor(() => expect(deleted).toEqual(put.map(item => item.path)));
});

test('UX-14/20/23: revision conflict preserves modified metadata; Reference delete keeps only unregister action', async () => {
  const mutations: Record<string, unknown>[] = [];
  serve((path, request) => {
    if (path === prefix + '/library/assets/' + asset.id && request.method === 'PATCH') {
      mutations.push(JSON.parse(String(request.body)));
      return Response.json({ error: { code: 'REVISION_CONFLICT' } }, { status: 409 });
    }
  });
  openSidebar();
  await allAssets();
  await button(/Andromeda.fit/).click();
  await expect.element(button('Unregister asset')).toBeVisible();
  await expect.element(button('Permanently delete file')).not.toBeInTheDocument();
  await page.getByRole('textbox', { name: 'Target', exact: true }).fill('M31 HDR');
  await button('Save').click();
  await expect.element(page.getByRole('alert').getByText(/REVISION_CONFLICT/)).toBeVisible();
  await expect.element(page.getByRole('textbox', { name: 'Target', exact: true })).toHaveValue('M31 HDR');
  expect(mutations).toEqual([{
    revision: 1, attributes: { ...asset.attributes, target: 'M31 HDR' },
  }]);
});

test('UX-16/17: Calibration Library renders eligible subframe collections in the persisted virtual folder', async () => {
  const folder = { id: '44444444-4444-4444-8444-444444444444', revision: 1, name: 'Camera A',
    project_id: null, parent_id: null };
  const flat = { id: '55555555-5555-4555-8555-555555555555', revision: 1, name: 'Flat collection',
    asset_ids: [asset.id], calibration_eligible: true, calibration_folder_id: folder.id };
  const unverified = { ...flat, id: '66666666-6666-4666-8666-666666666666', name: 'Unverified flats', calibration_eligible: false };
  serve(path => {
    if (path.startsWith(prefix + '/library/folders?')) return Response.json({ items: [folder], next: null });
    if (path.startsWith(prefix + '/library/collections?')) return Response.json({ items: [flat, unverified], next: null });
  });
  openSidebar();
  await allAssets();
  await button('Calibration Library').click();
  await page.getByRole('treeitem', { name: 'Camera A' }).click();
  await expect.element(page.getByRole('treeitem', { name: /Flat collection/ })).toBeVisible();
  await expect.element(page.getByRole('treeitem', { name: /Unverified flats/ })).not.toBeInTheDocument();
  await page.getByRole('treeitem', { name: /Flat collection/ }).click();
  await button('Collection editor').click();
  await expect.element(page.getByRole('combobox', { name: 'Calibration Library folder' })).toHaveTextContent('Camera A');
});

test('UX-15/18: changing a draft invalidates the original confirmation', async () => {
  const proposed: Record<string, unknown>[] = [];
  serve((path, req) => {
    if (path === prefix + '/library/collections' && req.method === 'POST') {
      proposed.push(JSON.parse(String(req.body)));
      return Response.json({ error: { code: 'CONFIRMATION_REQUIRED', details: { unknown: ['temperature'] } } }, { status: 409 });
    }
  });
  const { element } = openSidebar();
  await allAssets();
  element.querySelector<HTMLElement>('#ap-asset-panel-allAssets details summary')!.click();
  await button('New collection').click();
  const name = page.getByRole('textbox', { name: 'Name', exact: true });
  await name.fill('Dark group');
  await button('Save').click();
  await expect.element(button('Confirm')).toBeVisible();
  await name.fill('New draft');
  await expect.element(button('Save')).toBeEnabled();
  await button('Save').click();
  await expect.element(button('Confirm')).toBeVisible();
  expect(proposed).toEqual([
    { name: 'Dark group', asset_ids: [], calibration_folder_id: null },
    { name: 'New draft', asset_ids: [], calibration_folder_id: null },
  ]);
});

test('UX-18: new calibration assignment submits one atomic batch across selected usages', async () => {
  const darkAsset = { ...asset, id: '77777777-7777-4777-8777-777777777777', name: 'Dark 180s.fit' };
  const flatAsset = { ...asset, id: '88888888-8888-4888-8888-888888888888', name: 'Flat Ha.fit' };
  const dark = { id: '99999999-9999-4999-8999-999999999999', revision: 1, asset_id: darkAsset.id, usage: 'dark' };
  const flat = { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', revision: 1, asset_id: flatAsset.id, usage: 'flat' };
  const existing = { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', revision: 1, asset_id: asset.id,
    master_id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', usage: 'bias' };
  const submissions: Record<string, unknown>[] = [];
  app.extensionManager.dialog.confirm.mockResolvedValue(true);
  serve((path, request) => {
    if (path.startsWith(prefix + '/library/masters?')) return Response.json({ items: [dark, flat], next: null });
    if (path.startsWith(prefix + '/library/assignments?')) return Response.json({ items: [existing], next: null });
    if (path.endsWith('/' + darkAsset.id)) return Response.json(darkAsset);
    if (path.endsWith('/' + flatAsset.id)) return Response.json(flatAsset);
    if (path === prefix + '/library/assignments/batch' && request.method === 'POST') {
      submissions.push(JSON.parse(String(request.body)));
      return submissions.length === 1
        ? Response.json({ error: { code: 'CONFIRMATION_REQUIRED', details: { unknown: ['gain'] } } }, { status: 409 })
        : Response.json({ assignments: [] });
    }
  });
  openSidebar();
  await allAssets();
  const assetRow = page.getByRole('listitem').filter({ has: button(/Andromeda.fit/) });
  await assetRow.getByRole('button', { name: 'More actions' }).click();
  await button('Assign calibration master').click();
  await expect.element(page.getByRole('combobox', { name: 'Master Bias', exact: true })).not.toBeInTheDocument();
  for (const [group, name] of [['Master Dark', darkAsset.name], ['Master Flat', flatAsset.name]]) {
    await page.getByRole('combobox', { name: group, exact: true }).click();
    await page.getByRole('option', { name, exact: true }).click();
  }
  await button('Save').click();
  await expect.element(button('Confirm')).toBeVisible();
  await button('Confirm').click();
  await expect.element(page.getByText('Changes saved.', { exact: true })).toBeVisible();
  expect(submissions).toEqual([
    { asset_id: asset.id, master_ids: [dark.id, flat.id] },
    { asset_id: asset.id, master_ids: [dark.id, flat.id], confirmed: true },
  ]);
});

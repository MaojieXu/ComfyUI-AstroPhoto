import { mount } from '@vue/test-utils';
import { afterEach, expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import AssetEditor from '../../src/features/assets/AssetEditor.vue';
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
  await button('Import batch').click();
}

test('asset edits preserve a deleted equipment group by its historical ID', async () => {
  const groupId = '88888888-8888-4888-8888-888888888888';
  const historical = { ...asset, attributes: { ...asset.attributes, optical_train_id: groupId } };
  let sent: unknown;
  serve((path, request) => {
    if (path === prefix + '/optical-trains/' + groupId) return Response.json({
      id: groupId, name: 'M31 original setup', notes: null, status: 'deleted', row_version: 2, has_draft: false,
      latest_revision: null, default_revision: null,
      summary: { camera: null, primary_optics: null, accessories: [], filters: [] },
    });
    if (path === prefix + '/library/assets/' + asset.id && request.method === 'PATCH') {
      sent = JSON.parse(String(request.body));
      return Response.json(historical);
    }
    return undefined;
  });
  const wrapper = mount(AssetEditor, { attachTo: document.body, props: { asset: historical },
    global: { plugins: [createFrontendI18n()] } });
  cleanups.push(() => wrapper.unmount());
  await expect.element(page.getByRole('combobox', { name: 'Equipment group' })).toHaveTextContent('M31 original setup · Deleted');
  await page.getByRole('textbox', { name: 'Target', exact: true }).fill('M31 core');
  await button('Save').click();
  expect(sent).toMatchObject({ attributes: { target: 'M31 core', optical_train_id: groupId } });
});

test('asset action menu closes outside and with Escape', async () => {
  serve();
  openSidebar();
  await allAssets();
  const actions = page.getByRole('button', { name: 'More actions' }).first();
  await actions.click();
  await expect.element(actions).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('heading', { name: 'All Assets', exact: true }).click();
  await expect.element(actions).toHaveAttribute('aria-expanded', 'false');
  await actions.click();
  await userEvent.keyboard('{Escape}');
  await expect.element(actions).toHaveAttribute('aria-expanded', 'false');
});

test('one subframe group opens independently selectable frames from both storage locations', async () => {
  const groupId = '88888888-8888-4888-8888-888888888888';
  const second = { ...asset, id: '99999999-9999-4999-8999-999999999999', name: 'Andromeda-2.fit' };
  serve(path => {
    if (path.startsWith(prefix + '/library/import-groups?')) return Response.json({ items: [{
      id: groupId, name: 'M31 capture', revision: 1, count: 2,
      workspaces: [{ id: 'd', name: 'Disk D', count: 1 }, { id: 'e', name: 'Disk E', count: 1 }],
    }], next: null });
    if (path.includes('import_group_id=ungrouped')) return empty();
    if (path.includes('import_group_id=' + groupId) && path.includes('sort=import_index')) {
      return Response.json({ items: [asset, second], next: null });
    }
    return undefined;
  });
  openSidebar();
  await allAssets();
  const groupRow = page.getByRole('button', { name: /M31 capture.*2 frames.*Disk D.*Disk E/ });
  await groupRow.click();
  await expect.element(page.getByRole('checkbox', { name: /Andromeda-2/ })).toBeVisible();
  await page.getByRole('checkbox', { name: /Andromeda-2/ }).click();
  await expect.element(button(/Bulk edit.*1/i)).toBeVisible();
  await button('← Back').click();
  await expect.element(groupRow).toBeVisible();
});

test('reference import adds the path returned by the native picker', async () => {
  serve((path) => {
    if (path === prefix + '/storage') return Response.json(storage('reference', 1));
    if (path === prefix + '/storage/native-picker') return Response.json({ status: 'selected', path: 'C:\\Photos\\frame.fit' });
    return undefined;
  });
  openSidebar();
  await importAssets();
  await button('Choose file in system dialog').click();
  await expect.element(page.getByText('C:\\Photos\\frame.fit')).toBeVisible();
});

test('reference import browses server files and directories as absolute paths', async () => {
  serve((path) => {
    if (path === prefix + '/storage') return Response.json(storage('reference', 1));
    if (path.startsWith(prefix + '/storage/directories?')) {
      const query = new URLSearchParams(path.split('?')[1]);
      if (!query.get('path')) return Response.json({ path: null, parent: null, directories: [{ name: 'C:\\', path: 'C:\\' }] });
      return Response.json({ path: 'C:\\', parent: null, directories: [{ name: 'Photos', path: 'C:\\Photos' }],
        files: [{ name: 'frame.fit', path: 'C:\\frame.fit' }] });
    }
    return undefined;
  });
  openSidebar();
  await importAssets();
  await button('Browse files and folders').click();
  await button('📁 C:\\').click();
  await button('📄 frame.fit').click();
  await expect.element(page.getByText('C:\\frame.fit')).toBeVisible();
  await button('Browse files and folders').click();
  await button('📁 C:\\').click();
  await button('Select this folder').click();
  await expect.element(page.getByText('C:\\', { exact: true })).toBeVisible();
});

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
  const storageTitle = page.getByRole('heading', { name: 'Configuration', exact: true });
  await expect.element(storageTitle).toBeVisible();
  await tab('Settings').click();
  await expect.element(storageTitle).not.toBeInTheDocument();
  await expect.element(button(/^Configuration /)).toBeVisible();
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
  const assetsTabs = element.querySelectorAll<HTMLElement>('[aria-label="Assets"] [role="tab"]');
  expect(Array.from(assetsTabs, item => item.textContent?.trim())).toEqual(['All Assets', 'Projects']);
  assetsTabs[0].focus();
  await userEvent.keyboard('{ArrowRight}');
  await expect.element(tab('Projects')).toHaveFocus();
  await expect.element(button(/Andromeda project/)).toBeVisible();
  await expect.element(button('Calibration Library')).not.toBeInTheDocument();
  await allAssets();
  expect(element.querySelector('#ap-asset-panel-allAssets > .ap-assets-toolbar details')).toBeNull();
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

test('copy previews file metadata, writes on confirmation and resumes only the missing original after reopening', async () => {
  const direct = prefix + '/library/direct-imports';
  const files = [new File(['fit'], 'M31.fit', { lastModified: 1234 }), new File(['moon'], 'Moon.ser', { lastModified: 5678 })];
  Object.defineProperty(files[1], 'webkitRelativePath', { value: 'Panel01/Moon.ser' });
  const entries = files.map((file, index) => ({ id: 'entry-' + index, index, name: file.name, size_bytes: file.size,
    last_modified_ms: file.lastModified, workspace_id: workspace.id, lane: 'disk-0', status: 'pending', error: null as string | null }));
  const receipt = () => Response.json({ id: 'job', group_id: null, phase: entries.every(entry => entry.status === 'copied') ? 'completed' : 'importing', entries });
  const puts: string[] = [];
  const previews: Record<string, unknown>[] = [];
  serve((path, request) => {
    if (path === prefix + '/storage') return Response.json(storage('copy', 3));
    if (path === prefix + '/storage/operations') return Response.json({ operations: puts.length ? [{
      operation_id: 'job', kind: 'import', phase: entries.every(entry => entry.status === 'copied') ? 'completed' : 'importing',
      error: null, effective_import_mode: 'copy', receipt: { direct_import: true, copied: entries.filter(entry => entry.status === 'copied').length, total: 2 },
    }] : [] });
    if (path === direct + '/preview') {
      previews.push(JSON.parse(String(request.body)));
      return Response.json({ preview_id: 'job', file_count: 2, failed: 0, size_bytes: 7,
        workspaces: [{ workspace_id: workspace.id, lane: 'disk-0', file_count: 2, size_bytes: 7 }] });
    }
    if (path === direct || path === direct + '/job') return receipt();
    if (path.startsWith(direct + '/job/files/')) {
      const entry = entries.find(item => path.endsWith('/' + item.id))!;
      expect((request.body as File).name).toBe(entry.name);
      puts.push(entry.name);
      if (puts.length === 2) {
        entry.status = 'failed'; entry.error = 'WORKSPACE_OFFLINE';
        return Response.json({ error: { code: entry.error } }, { status: 409 });
      }
      entry.status = 'copied'; entry.error = null;
      return Response.json({ id: entry.id, status: entry.status, workspace_id: entry.workspace_id });
    }
  });
  const { element } = openSidebar();
  const picker = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {});
  await importAssets();
  expect(picker).toHaveBeenCalledOnce();
  const inputs = element.querySelectorAll<HTMLInputElement>('input[type=file]');
  expect(inputs[0].multiple).toBe(true);
  expect(inputs[1].hasAttribute('webkitdirectory')).toBe(true);
  function pick(input: HTMLInputElement, file: File) {
    const selected = new DataTransfer();
    selected.items.add(file);
    input.files = selected.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
  files.forEach((file, index) => pick(inputs[index], file));
  await expect.element(page.getByText('Panel01/Moon.ser', { exact: false })).toBeVisible();
  await button('Check selection').click();
  await expect.element(button('Confirm import')).toBeEnabled();
  expect(previews).toEqual([{ parallel: false, settings_revision: 3, files: entries.map(({ name, size_bytes, last_modified_ms }) => ({ name, size_bytes, last_modified_ms })) }]);
  expect(puts).toEqual([]);
  await button('Confirm import').click();
  await expect.element(button('Retry remaining files (1)')).toBeEnabled();
  expect(puts).toEqual(['M31.fit', 'Moon.ser']);
  const taskToggle = page.getByRole('button', { name: /Tasks/ });
  await expect.element(taskToggle).toBeVisible();
  await taskToggle.click();
  await tab('Settings').click();
  await button('View and resume import').click();
  await expect.element(button('Retry remaining files (1)')).toBeEnabled();
  await button('All Assets').click();
  sessionStorage.removeItem('astrophoto.directImport.v1');
  await button('View and resume import').click();
  await expect.element(page.getByText('Select the original files to resume the 1 remaining transfers.')).toBeVisible();
  await button('All Assets').click();
  sessionStorage.removeItem('astrophoto.directImport.v1');
  await button('Import batch').click();
  await button('Resume import job (1/2)').click();
  await expect.element(page.getByText('Select the original files to resume the 1 remaining transfers.')).toBeVisible();
  const reselect = element.querySelector<HTMLInputElement>('.ap-operation input[type=file]')!;
  pick(reselect, files[1]);
  await button('Retry remaining files (1)').click();
  await expect.element(page.getByText('Imported 2 of 2 files', { exact: true })).toBeVisible();
  expect(puts).toEqual(['M31.fit', 'Moon.ser', 'Moon.ser']);
  await vi.waitFor(() => expect(sessionStorage.getItem('astrophoto.directImport.v1')).toBeNull());
});

test('parallel copy is opt-in and preflights only the selected online locations', async () => {
  const preview = vi.fn();
  serve((path, request) => {
    if (path === prefix + '/storage') {
      const current = storage('copy', 5);
      current.workspaces.push(...['External', 'Archive', 'Offline'].map(name => ({
        ...workspace, id: name, name, is_default: false, status: name === 'Offline' ? 'offline' : 'online',
      })));
      return Response.json(current);
    }
    if (path === prefix + '/library/direct-imports/preview') {
      preview(JSON.parse(String(request.body)));
      return Response.json({ preview_id: 'copy', file_count: 1, failed: 0, size_bytes: 1, workspaces: [
        { workspace_id: workspace.id, lane: 'disk-0', file_count: 1, size_bytes: 1 },
      ] });
    }
  });
  const { element } = openSidebar();
  vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {});
  await importAssets();
  const input = element.querySelector<HTMLInputElement>('input[type=file]')!;
  const selected = new DataTransfer();
  selected.items.add(new File(['x'], 'Light_001.fit'));
  input.files = selected.files;
  input.dispatchEvent(new Event('change', { bubbles: true }));
  const check = (name: string) => page.getByRole('checkbox', { name, exact: true });
  await expect.element(check('Import across multiple disks')).not.toBeChecked();
  await check('Import across multiple disks').click();
  await expect.element(check('Offline')).not.toBeInTheDocument();
  await check('Archive').click();
  await button('Check selection').click();
  await expect.element(button('Confirm import')).toBeEnabled();
  expect(preview).toHaveBeenCalledWith(expect.objectContaining({ parallel: true, workspace_ids: [workspace.id, 'External'] }));
  await check('External').click();
  await expect.element(button('Check selection')).toBeDisabled();
  await expect.element(button('Confirm import')).toBeDisabled();
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
  openSidebar();
  await allAssets();
  await page.getByRole('checkbox', { name: /Andromeda.fit/ }).click();
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
    { name: 'Dark group', asset_ids: [asset.id], calibration_folder_id: null },
    { name: 'New draft', asset_ids: [asset.id], calibration_folder_id: null },
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


test('single import accepts one selected file and replaces the previous selection', async () => {
  serve(path => path === prefix + '/storage' ? Response.json(storage('copy', 3)) : undefined);
  const { element } = openSidebar();
  await allAssets();
  await expect.element(button('Import single file')).toBeVisible();
  await expect.element(button('Import batch')).toBeVisible();
  const picker = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {});
  await button('Import single file').click();
  expect(picker).toHaveBeenCalledOnce();
  await expect.element(button('Choose file')).toBeEnabled();
  await expect.element(button('Choose folder')).not.toBeInTheDocument();
  const input = element.querySelector<HTMLInputElement>('input[type=file]')!;
  expect(input.multiple).toBe(false);
  for (const name of ['first.fit', 'second.fit']) {
    const transfer = new DataTransfer();
    transfer.items.add(new File(['fit'], name));
    input.files = transfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
  await expect.element(page.getByText('second.fit', { exact: false })).toBeVisible();
  await expect.element(page.getByText('first.fit', { exact: false })).not.toBeInTheDocument();
  await expect.element(page.getByRole('combobox', { name: 'Classification' })).toBeVisible();
  await expect.element(page.getByRole('combobox', { name: 'Project' })).toBeVisible();
});

test('single reference import rejects a path that expands to multiple files', async () => {
  serve((path) => {
    if (path === prefix + '/storage') return Response.json(storage('reference', 3));
    if (path === prefix + '/assets/import/preview')
      return Response.json({ preview_id: 'preview', file_count: 2, failed: 0, size_bytes: 7 });
  });
  openSidebar();
  await allAssets();
  await button('Import single file').click();
  await page.getByRole('textbox', { name: 'Authorized server path' }).fill('C:/authorized/folder');
  await button('Add path').click();
  await button('Check selection').click();
  await expect.element(page.getByText('Select one file for single-file import.')).toBeVisible();
  await expect.element(button('Confirm import')).toBeDisabled();
});


test('batch import submits one classification and project for all selected paths', async () => {
  let checked: Record<string, unknown> | undefined;
  serve((path, request) => {
    if (path === prefix + '/storage') return Response.json(storage('reference', 3));
    if (path === prefix + '/assets/import/preview') {
      checked = JSON.parse(String(request.body));
      return Response.json({ preview_id: 'preview', file_count: 2, failed: 0, size_bytes: 7 });
    }
  });
  openSidebar();
  await importAssets();
  const path = page.getByRole('textbox', { name: 'Authorized server path' });
  for (const value of ['C:/authorized/a.fit', 'C:/authorized/b.fit']) {
    await path.fill(value);
    await button('Add path').click();
  }
  await page.getByRole('combobox', { name: 'Classification', exact: true }).click();
  await page.getByRole('option', { name: 'Subframes', exact: true }).click();
  await page.getByRole('combobox', { name: 'Project', exact: true }).click();
  await page.getByRole('option', { name: project.name, exact: true }).click();
  await button('Check selection').click();
  await expect.element(button('Confirm import')).toBeEnabled();
  expect(checked).toMatchObject({ sources: ['C:/authorized/a.fit', 'C:/authorized/b.fit'],
    attributes: { role: 'raw' }, project_id: project.id });
});


test('project adds selected existing assets and keeps already-linked items disabled', async () => {
  const other: Asset = { ...asset, id: '44444444-4444-4444-8444-444444444444', name: 'Orion.fit' };
  const placement = { id: '55555555-5555-4555-8555-555555555555', revision: 1, project_id: project.id,
    asset_id: asset.id, folder_id: null, collection_id: null };
  const submissions: unknown[] = [];
  serve((path, request) => {
    if (path.startsWith(prefix + '/library/assets?')) return Response.json({ items: [asset, other], next: null });
    if (path.startsWith(prefix + '/library/placements?')) return Response.json({ items: [placement], next: null });
    if (path === `${prefix}/library/projects/${project.id}/assets` && request.method === 'POST') {
      submissions.push(JSON.parse(String(request.body)));
      return Response.json({ added: 1, already_present: 0 });
    }
  });
  openSidebar();
  await button(/Andromeda project/).click();
  await page.getByLabelText('Project actions for Andromeda project').click();
  await expect.element(button('Add existing assets')).toBeVisible();
  await page.getByRole('heading', { name: 'Projects', exact: true }).click();
  await expect.element(button('Add existing assets')).not.toBeInTheDocument();
  await page.getByLabelText('Project actions for Andromeda project').click();
  await button('Add existing assets').click();
  const already = page.getByRole('checkbox', { name: 'Andromeda.fit' });
  await expect.element(already).toBeDisabled();
  await expect.element(page.getByText('Already in project')).toBeVisible();
  await page.getByRole('checkbox', { name: 'Orion.fit' }).click();
  await button('Add to project').click();
  await expect.element(page.getByText('Added 1, already present 0.')).toBeVisible();
  expect(submissions).toEqual([{ asset_ids: [other.id] }]);
});


test('project folders can be created, nested, renamed and removed inline', async () => {
  const folders: { id: string; revision: number; name: string; project_id: string; parent_id: string | null }[] = [];
  const rootId = '77777777-7777-4777-8777-777777777777';
  const childId = '88888888-8888-4888-8888-888888888888';
  serve((path, request) => {
    if (path.startsWith(prefix + '/library/folders?')) return Response.json({ items: folders, next: null });
    if (path === prefix + '/library/folders' && request.method === 'POST') {
      const fields = JSON.parse(String(request.body));
      const row = { ...fields, id: folders.length ? childId : rootId, revision: 1 };
      folders.push(row);
      return Response.json(row, { status: 201 });
    }
    if (path === prefix + '/library/folders/' + childId && request.method === 'PATCH') {
      const fields = JSON.parse(String(request.body));
      expect(fields.revision).toBe(1);
      Object.assign(folders[1], fields, { revision: 2 });
      return Response.json(folders[1]);
    }
    if (path === prefix + '/library/folders/' + childId && request.method === 'DELETE') {
      expect(JSON.parse(String(request.body))).toMatchObject({ revision: 2, confirmed: true });
      folders.pop();
      return Response.json({});
    }
  });
  app.extensionManager.dialog.confirm.mockResolvedValue(true);
  openSidebar();
  await button(/Andromeda project/).click();
  await page.getByLabelText('Project actions for Andromeda project').click();
  await button('New folder').click();
  await page.getByRole('textbox', { name: 'Folder name' }).fill('RAW');
  await userEvent.keyboard('{Enter}');
  await expect.element(page.getByRole('treeitem', { name: 'RAW' })).toBeVisible();
  await page.getByRole('treeitem', { name: 'RAW' }).click();
  await page.getByLabelText('Folder actions for RAW').click();
  await button('New subfolder').click();
  await page.getByRole('textbox', { name: 'Folder name' }).fill('Ha');
  await userEvent.keyboard('{Enter}');
  await expect.element(page.getByRole('treeitem', { name: 'Ha' })).toBeVisible();
  expect(folders[1].parent_id).toBe(rootId);
  await page.getByLabelText('Folder actions for Ha').click();
  await button('Rename').click();
  await page.getByRole('textbox', { name: 'Folder name' }).fill('OIII');
  await userEvent.keyboard('{Enter}');
  await expect.element(page.getByRole('treeitem', { name: 'OIII' })).toBeVisible();
  await page.getByLabelText('Folder actions for OIII').click();
  await button('Delete folder').click();
  await expect.element(page.getByRole('treeitem', { name: 'OIII' })).not.toBeInTheDocument();
  expect(app.extensionManager.dialog.confirm).toHaveBeenCalled();
});


test('project folder context menu and drag moves preserve hierarchy', async () => {
  const rootId = '77777777-7777-4777-8777-777777777777';
  const childId = '88888888-8888-4888-8888-888888888888';
  const otherId = '99999999-9999-4999-8999-999999999999';
  const folders = [
    { id: rootId, revision: 1, name: 'RAW', project_id: project.id, parent_id: null as string | null },
    { id: childId, revision: 1, name: 'Lights', project_id: project.id, parent_id: rootId as string | null },
    { id: otherId, revision: 1, name: 'Results', project_id: project.id, parent_id: null as string | null },
  ];
  const updates: { id: string; parent_id: string | null }[] = [];
  serve((path, request) => {
    if (path.startsWith(prefix + '/library/folders?')) return Response.json({ items: folders, next: null });
    if (path.startsWith(prefix + '/library/folders/') && request.method === 'PATCH') {
      const id = path.split('/').at(-1)!;
      const row = folders.find(folder => folder.id === id)!;
      const fields = JSON.parse(String(request.body));
      updates.push({ id, parent_id: fields.parent_id });
      Object.assign(row, fields, { revision: row.revision + 1 });
      return Response.json(row);
    }
  });
  const { element } = openSidebar();
  await button(/Andromeda project/).click();
  await page.getByRole('treeitem', { name: 'RAW' }).click();
  await expect.element(page.getByRole('treeitem', { name: 'Lights' })).toBeVisible();
  const treeItem = (id: string) => element.querySelector<HTMLElement>(`[data-tree-id="${id}"]`)!;
  treeItem(childId).dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
  await expect.element(button('New subfolder')).toBeVisible();
  await page.getByLabelText('Folder actions for Lights').click();
  function drag(source: HTMLElement, target: HTMLElement) {
    const dataTransfer = new DataTransfer();
    source.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer }));
    target.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer }));
    target.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }));
    source.dispatchEvent(new DragEvent('dragend', { bubbles: true, dataTransfer }));
  }
  drag(treeItem(rootId), treeItem(childId));
  expect(updates).toEqual([]);
  drag(treeItem(childId), treeItem(otherId));
  await vi.waitFor(() => expect(updates).toEqual([{ id: childId, parent_id: otherId }]));
  await page.getByRole('treeitem', { name: 'Results' }).click();
  await expect.element(page.getByRole('treeitem', { name: 'Lights' })).toBeVisible();
  const root = element.querySelector<HTMLElement>('.ap-assets-project')!;
  drag(treeItem(childId), root);
  await vi.waitFor(() => expect(updates).toEqual([{ id: childId, parent_id: otherId }, { id: childId, parent_id: null }]));
});


test('project roots expand independently and search reveals nested matching paths', async () => {
  const second = { ...project, id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', name: 'Pleiades' };
  const folderId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  const childId = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
  serve((path) => {
    if (path.startsWith(prefix + '/library/projects?')) return Response.json({ items: [project, second], next: null });
    if (path.startsWith(prefix + '/library/folders?')) return Response.json({ items: [
      { id: folderId, revision: 1, name: 'RAW', project_id: project.id, parent_id: null },
      { id: childId, revision: 1, name: 'Hydrogen', project_id: project.id, parent_id: folderId },
      { id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', revision: 1, name: 'Results', project_id: second.id, parent_id: null },
    ], next: null });
  });
  openSidebar();
  await button(/Andromeda project/).click();
  await button(/Pleiades/).click();
  await expect.element(page.getByRole('treeitem', { name: 'RAW' })).toBeVisible();
  await expect.element(page.getByRole('treeitem', { name: 'Results' })).toBeVisible();
  await page.getByRole('combobox', { name: 'Search projects, folders and assets' }).fill('Hydrogen');
  await expect.element(page.getByRole('treeitem', { name: 'Hydrogen' })).toBeVisible();
  await expect.element(page.getByRole('treeitem', { name: 'RAW' })).toBeVisible();
  await expect.element(button(/Pleiades/)).not.toBeInTheDocument();
});


test('host notification adapter uses current and legacy APIs with a safe fallback', async () => {
  const { notifyHost } = await import('../../src/host/notify');
  const modern = { success: vi.fn(), error: vi.fn() };
  Object.assign(app.extensionManager, { toast: modern });
  cleanups.push(() => { Reflect.deleteProperty(app.extensionManager, 'toast'); });
  expect(notifyHost('success', 'Saved')).toBe(true);
  expect(modern.success).toHaveBeenCalledWith('Saved', expect.objectContaining({ duration: 4000 }));
  const legacy = { add: vi.fn() };
  Object.assign(app.extensionManager, { toast: legacy });
  expect(notifyHost('error', 'Failed')).toBe(true);
  expect(legacy.add).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error', summary: 'Failed' }));
  await Promise.resolve();
  Object.assign(app.extensionManager, { toast: { error: () => { throw new Error('unavailable'); } } });
  expect(notifyHost('error', 'Failed')).toBe(false);
});


test('detailed library errors notify the host and retain their retry control', async () => {
  const { default: LibraryError } = await import('../../src/features/assets/LibraryError.vue');
  const { ApiError } = await import('../../src/api/client');
  const toast = { error: vi.fn() };
  Object.assign(app.extensionManager, { toast });
  const element = document.createElement('div');
  document.body.append(element);
  const retry = vi.fn();
  const wrapper = mount(LibraryError, { attachTo: element, props: { error: new ApiError('network'), retry },
    global: { plugins: [createFrontendI18n()] } });
  cleanups.push(() => { wrapper.unmount(); element.remove(); Reflect.deleteProperty(app.extensionManager, 'toast'); });
  expect(toast.error).toHaveBeenCalledTimes(1);
  await expect.element(page.getByRole('alert')).toBeVisible();
  await button('Retry').click();
  expect(retry).toHaveBeenCalledTimes(1);
});

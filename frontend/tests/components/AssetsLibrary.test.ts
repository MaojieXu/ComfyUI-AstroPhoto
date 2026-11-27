import { mount } from '@vue/test-utils';
import { reactive } from 'vue';
import { afterEach, expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import AssetEditor from '../../src/features/assets/AssetEditor.vue';
import CatalogDetails from '../../src/features/assets/CatalogDetails.vue';
import CatalogCalibration from '../../src/features/assets/CatalogCalibration.vue';
import CatalogEditor from '../../src/features/assets/CatalogEditor.vue';
import CaptureFields from '../../src/features/assets/CaptureFields.vue';
import CatalogOpticalBinding from '../../src/features/assets/CatalogOpticalBinding.vue';
import CatalogProjects from '../../src/features/assets/CatalogProjects.vue';
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
    if (path === prefix + '/storage/native-picker') {
      const kind = JSON.parse(String(request.body)).kind;
      return Response.json(kind === 'files' ? { status: 'cancelled', paths: [] } : { status: 'cancelled', path: null });
    }
    if (path === prefix + '/library/assets/' + asset.id) return Response.json(asset);
    if (path.startsWith(prefix + '/library/assets?')) return Response.json({ items: [asset], next: null });
    if (path.startsWith(prefix + '/catalog/assets?')) return Response.json({ items: [{ id: asset.id, name: asset.name, asset_type: 'master_frame', master_type: 'unknown', extensions: ['fit'], workspace_ids: ['external'] }], next: null });
    if (path.startsWith(prefix + '/library/') || path.includes('/equipment?') || path.includes('/optical-trains?') || path.includes('/catalog/calibration_master?') || path.includes('/catalog/projects?')) return empty();
    return new Response(null, { status: 404 });
  });
}
const cleanups: (() => void)[] = [];
afterEach(() => {
  for (const cleanup of cleanups.splice(0)) cleanup();
  sessionStorage.removeItem('astrophoto.directImport.v1');
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
const kindButton = (name: string) => page.getByRole('button', { name: new RegExp('^' + name + '(?:\\s|$)') });
async function projectAction(row: string, action: string) {
  await expect.element(button(row)).toBeVisible();
  button(row).elements()[0].dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
  await button(action).click();
}
async function createProjectAction() {
  const root = document.querySelector('.ap-projects');
  if (!root) throw new Error('Project panel unavailable');
  root.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 40, clientY: 80 }));
  await button('Create project').click();
}

async function allAssets() { await tab('All Assets').click(); }
async function importAssets() {
  await allAssets();
  await button('Import Assets').click();
}

test('asset type filter offers only types found in the catalog', async () => {
  serve(path => {
    if (path.startsWith(prefix + '/catalog/assets?')) return Response.json({ items: [
      { id: asset.id, name: asset.name, asset_type: 'master_frame', master_type: 'unknown' },
      { id: 'video', name: 'Moon.mp4', asset_type: 'video' },
    ], next: null });
    return undefined;
  });
  openSidebar();
  await allAssets();
  await button('Filters').click();
  await expect.element(button('Master Frame 1')).toBeVisible();
  await expect.element(button('Video 1')).toBeVisible();
  await expect.element(button('Image Result 1')).not.toBeInTheDocument();
  await button('Video 1').click();
  await userEvent.keyboard('{Escape}');
  await expect.element(button(/Andromeda.fit/)).not.toBeInTheDocument();
});

test('filter sections use the shared disclosure and retain selected options when collapsed', async () => {
  serve();
  openSidebar();
  await allAssets();
  await button('Filters').click();
  const section = button(/^Asset type/);
  await expect.element(section).toHaveAttribute('aria-expanded', 'true');
  await button('Master Frame 1').click();
  await section.click();
  await expect.element(section).toHaveAttribute('aria-expanded', 'false');
  const contentId = section.element().getAttribute('aria-controls');
  expect(contentId && document.getElementById(contentId)?.hasAttribute('hidden')).toBe(true);
  await section.click();
  await expect.element(button('Master Frame 1')).toHaveAttribute('aria-pressed', 'true');
  expect(document.querySelector('.ap-assets-filter-popover summary')).toBeNull();
});

test('facet filtering keeps matching subframe groups and combines categories', async () => {
  serve(path => {
    if (path.startsWith(prefix + '/library/import-groups?')) return Response.json({ items: [
      { id: 'light-group', revision: 1, name: 'Lights', frame_type: 'light', count: 1, workspaces: [] },
      { id: 'dark-group', revision: 1, name: 'Darks', frame_type: 'dark', count: 1, workspaces: [] },
    ], next: null });
    if (path.startsWith(prefix + '/catalog/assets?')) return Response.json({ items: [
      { id: 'light-group', name: 'Lights', asset_type: 'subframe_collection', frame_type: 'light' },
      { id: 'dark-group', name: 'Darks', asset_type: 'subframe_collection', frame_type: 'dark' },
      { id: asset.id, name: asset.name, asset_type: 'master_frame', master_type: 'dark' },
    ], next: null });
    return undefined;
  });
  openSidebar();
  await allAssets();
  await button('Filters').click();
  await button('Subframe Group 2').click();
  await button('Dark 1').click();
  await userEvent.keyboard('{Escape}');
  await expect.element(button(/Darks/)).toBeVisible();
  await expect.element(button(/Lights/)).not.toBeInTheDocument();
  await expect.element(button(/Andromeda.fit/)).not.toBeInTheDocument();
});

test.each([
  { kind: 'video', endpoint: 'video', train: true },
  { kind: 'image_result', endpoint: 'image_result', train: true },
])('catalog $endpoint detail shows the registered location', async ({ kind, endpoint, train }) => {
  serve(path => {
    if (path === prefix + '/storage') return Response.json(storage('reference', 1));
    if (path === prefix + '/catalog/' + endpoint + '/' + asset.id) return Response.json({
      id: asset.id, name: 'Result', external_path: 'C:/photos/result.fit', notes: 'Test note',
      filter_state: 'unknown', equipment_snapshot: { name: 'Imaging train' },
      filter_snapshot: { name: 'Historic H-alpha' },
    });
    return undefined;
  });
  const container = document.createElement('div');
  document.body.append(container);
  const wrapper = mount(CatalogDetails, { attachTo: container,
    props: { asset: { ...asset, catalog_resource: kind } }, global: { plugins: [createFrontendI18n()] } });
  cleanups.push(() => { wrapper.unmount(); container.remove(); });
  await expect.element(page.getByText('C:/photos/result.fit')).toBeVisible();
  await expect.element(page.getByText('Test note')).toBeVisible();
  await button('Equipment and filter').click();
  expect(page.getByText('Imaging train').elements().length).toBe(train ? 1 : 0);
  await expect.element(page.getByText('Historic H-alpha')).toBeVisible();
});

test('catalog deletion shows associations and respects cancel before submitting the inspected revision', async () => {
  const deleted = vi.fn();
  app.extensionManager.dialog.confirm.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
  const path = prefix + '/catalog/image_result/' + asset.id;
  serve((route, request) => {
    if (route === prefix + '/storage') return Response.json(storage('reference', 1));
    if (route === path + '/deletion-impact') return Response.json({
      name: 'Result', impact_revision: 'asset-impact', has_associations: true,
      projects: [{ project: 'M31', name: 'Result' }],
      calibration_bindings: [], sources: [], files: [{ storage_mode: 'managed' }],
    });
    if (route === path && request.method === 'DELETE') {
      deleted(JSON.parse(String(request.body)));
      return Response.json({ error: { code: 'REVISION_CONFLICT' } }, { status: 409 });
    }
    if (route === path) return Response.json({ id: asset.id, name: 'Result', revision: 7 });
  });
  const container = document.createElement('div');
  document.body.append(container);
  const wrapper = mount(CatalogDetails, { attachTo: container,
    props: { asset: { ...asset, catalog_resource: 'image_result' } }, global: { plugins: [createFrontendI18n()] } });
  cleanups.push(() => { wrapper.unmount(); container.remove(); });
  await button('More actions').click();
  await button('Delete asset').click();
  await vi.waitFor(() => expect(app.extensionManager.dialog.confirm).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ title: 'Delete Result?',
      message: expect.stringContaining('Files managed by AstroPhoto to delete (1)'),
      itemList: ['Project M31 · Result'],
    }),
  ));
  expect(deleted).not.toHaveBeenCalled();
  await button('More actions').click();
  await button('Delete asset').click();
  await expect.element(page.getByRole('alert').getByText(/REVISION_CONFLICT/)).toBeVisible();
  expect(deleted).toHaveBeenCalledExactlyOnceWith({ revision: 7, impact_revision: 'asset-impact' });
  expect(wrapper.emitted('removed')).toBeUndefined();
});

test('open group details refresh on library changes without losing an edit', async () => {
  let record = { id: 'group', name: 'Original group', revision: 1, count: 2,
    frame_type: 'unknown', calibration_state: 'unknown' };
  serve(path => {
    if (path === prefix + '/storage') return Response.json(storage('reference', 1));
    if (path === prefix + '/catalog/subframe_collection/group?summary=1&bindings=1')
      return Response.json(record);
    return undefined;
  });
  const container = document.createElement('div');
  document.body.append(container);
  const wrapper = mount(CatalogDetails, { attachTo: container, props: { groupId: 'group' },
    global: { plugins: [createFrontendI18n()] } });
  cleanups.push(() => { wrapper.unmount(); container.remove(); });
  await expect.element(page.getByRole('heading', { name: 'Original group' })).toBeVisible();
  record = { ...record, name: 'Updated group', revision: 2, count: 3 };
  app.api.dispatchEvent(new Event('astrophoto.library_changed'));
  await expect.element(page.getByRole('heading', { name: 'Updated group' })).toBeVisible();
  expect(wrapper.text()).toContain('3 frames');
  await button('Edit').click();
  const name = page.getByRole('textbox', { name: 'Name', exact: true });
  await name.fill('My unsaved change');
  record = { ...record, name: 'Changed remotely', revision: 3, count: 4 };
  app.api.dispatchEvent(new Event('astrophoto.library_changed'));
  await new Promise(resolve => setTimeout(resolve, 300));
  await expect.element(name).toHaveValue('My unsaved change');
  app.extensionManager.dialog.confirm.mockResolvedValue(true);
  await button('Cancel operation').click();
  await expect.element(page.getByRole('heading', { name: 'Changed remotely' })).toBeVisible();
  expect(wrapper.text()).toContain('4 frames');
});

test('catalog equipment binding can be selected, saved, and explicitly unbound', async () => {
  const trainId = '88888888-8888-4888-8888-888888888888';
  const filterId = '99999999-9999-4999-8999-999999999999';
  const train = { id: trainId, name: 'Imaging train', notes: null, status: 'published', row_version: 1,
    camera_id: null, primary_optics_id: null, accessory_id: null, filter_ids: [filterId], other_ids: [],
    summary: { camera: null, primary_optics: null, accessories: [], filters: ['L'], others: [] } };
  const requests: Record<string, unknown>[] = [];
  serve((path, request) => {
    if (path.startsWith(prefix + '/optical-trains?')) return Response.json({ items: [train], next: null });
    if (path === prefix + '/optical-trains/' + trainId) return Response.json(train);
    if (path === prefix + '/catalog/image_result/' + asset.id && request.method === 'PATCH') {
      requests.push(JSON.parse(String(request.body)));
      return Response.json({});
    }
    return undefined;
  });
  const wrapper = mount(CatalogOpticalBinding, { attachTo: document.body,
    props: { endpoint: 'image_result/' + asset.id, record: { revision: 1, filter_state: 'unknown' } },
    global: { plugins: [createFrontendI18n()] } });
  cleanups.push(() => wrapper.unmount());
  await button('Edit equipment train').click();
  await vi.waitFor(() => expect(wrapper.findAll('select')[0].element.disabled).toBe(false));
  await wrapper.findAll('select')[0].setValue(trainId);
  await vi.waitFor(() => expect(wrapper.findAll('select')[1].element.disabled).toBe(false));
  await wrapper.findAll('select')[1].setValue(filterId);
  await button('Save').click();
  await vi.waitFor(() => expect(requests[0]).toEqual({ revision: 1, equipment_train_id: trainId,
    filter_state: 'selected', filter_id: filterId }));
  await wrapper.setProps({ record: { revision: 2, equipment_train_id: trainId, filter_state: 'selected', filter_id: filterId } });
  await button('Edit equipment train').click();
  await wrapper.findAll('select')[0].setValue('');
  await button('Save').click();
  await vi.waitFor(() => expect(requests[1]).toEqual({ revision: 2, equipment_train_id: null,
    filter_state: 'unknown', filter_id: null }));
});

test('asset edits preserve a deleted equipment group by its historical ID', async () => {
  const groupId = '88888888-8888-4888-8888-888888888888';
  const historical = { ...asset, attributes: { ...asset.attributes, optical_train_id: groupId } };
  let sent: unknown;
  serve((path, request) => {
    if (path === prefix + '/optical-trains/' + groupId) return Response.json({
      id: groupId, name: 'M31 original setup', notes: null, status: 'deleted', row_version: 2, has_draft: false,
      camera_id: null, primary_optics_id: null, accessory_id: null, filter_ids: [], other_ids: [],
      summary: { camera: null, primary_optics: null, accessories: [], filters: [], others: [] },
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

test.each([
  ['equipment group', 'Equipment Train', '', { equipment_train_id: null, filter_state: 'unknown', filter_id: null }],
  ['filter only', 'Filter', 'none', { filter_state: 'none', filter_id: null }],
] as const)('the image result editor updates %s without writing unrelated fields', async (_case, label, option, patch) => {
  let sent: unknown;
  const trainId = '88888888-8888-4888-8888-888888888888';
  const filterId = '99999999-9999-4999-8999-999999999999';
  serve((path, request) => {
    if (path === prefix + '/catalog/image_result/' + asset.id && request.method === 'PATCH') {
      sent = JSON.parse(String(request.body));
      return Response.json({});
    }
  });
  const wrapper = mount(CatalogEditor, { attachTo: document.body, props: {
    endpoint: 'image_result/' + asset.id, group: false,
    record: { name: 'Result', asset_type: 'image_result', revision: 1, equipment_train_id: trainId,
      equipment_snapshot: { name: 'Imaging train' }, filter_state: 'selected', filter_id: filterId, filter_snapshot: { name: 'L' } },
  }, global: { plugins: [createFrontendI18n()] } });
  cleanups.push(() => wrapper.unmount());
  await expect.element(button('Equipment and filter')).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('combobox', { name: label, exact: true }).selectOptions(option);
  await button('Save').click();
  await vi.waitFor(() => expect(sent).toEqual({ revision: 1, ...patch }));
});

test('outer asset rows show name and type without batch selection or actions', async () => {
  serve();
  openSidebar();
  await allAssets();
  await expect.element(page.getByRole('button', { name: 'Andromeda.fit Master Frame', exact: true })).toBeVisible();
  expect(page.getByRole('button', { name: 'More actions' }).elements()).toHaveLength(0);
  expect(page.getByRole('checkbox', { name: /Select / }).elements()).toHaveLength(0);
});

test('asset rows identify videos, masters, results and unknown types', async () => {
  const rows = [
    { ...asset, name: 'video.mp4', catalog_resource: 'video', attributes: {} },
    { ...asset, id: 'a', name: 'master.fit', catalog_resource: 'image_result', attributes: { role: 'master_frame' } },
    { ...asset, id: 'b', name: 'result.fit', catalog_resource: 'image_result', attributes: { role: 'processed' } },
    { ...asset, id: 'c', name: 'unknown.fit', catalog_resource: 'image_result', attributes: {} },
  ];
  serve(path => path.startsWith(prefix + '/library/assets?') ? Response.json({ items: rows, next: null }) : undefined);
  openSidebar();
  await allAssets();
  for (const name of ['video.mp4 Video', 'master.fit Master Frame', 'result.fit Image Result', 'unknown.fit Unknown']) {
    await expect.element(page.getByRole('button', { name, exact: true })).toBeVisible();
  }
});

test('the library opens a calibration master through its catalog resource', async () => {
  const master = { ...asset, catalog_resource: 'calibration_master', name: 'Dark.fit' };
  const imageResult = vi.fn();
  serve(path => {
    if (path === prefix + '/storage') return Response.json(storage('reference', 0));
    if (path.startsWith(prefix + '/library/assets?')) return Response.json({ items: [master], next: null });
    if (path === prefix + '/catalog/calibration_master/' + master.id) {
      return Response.json({ id: master.id, name: 'Registered dark', asset_type: 'master_frame', master_type: 'dark' });
    }
    if (path === prefix + '/catalog/image_result/' + master.id) imageResult();
    return undefined;
  });
  openSidebar();
  await allAssets();
  await button('Dark.fit Master Frame').click();
  await expect.element(page.getByRole('heading', { name: 'Registered dark' })).toBeVisible();
  expect(imageResult).not.toHaveBeenCalled();
});

test('calibration candidates show differences and missing metadata', async () => {
  const id = '88888888-8888-4888-8888-888888888888';
  serve((path, request) => {
    if (path === prefix + '/catalog/subframe_collection/' + id) return Response.json({ frame_type: 'light', master_ids: [] });
    if (path.startsWith(prefix + '/catalog/calibration_master?')) return Response.json({ items: [
      { id: 'match', name: 'Matching Dark', master_type: 'dark' },
      { id: 'unknown', name: 'Unknown Dark', master_type: 'dark' },
      { id: 'conflict', name: 'Wrong Dark', master_type: 'dark' },
    ], next: null });
    if (path.endsWith('/bindings') && request.method === 'POST') return Response.json({ items: [
      { id: 'match', fields: { camera_id: { status: 'match', actual: 'A', expected: 'A' } } },
      { id: 'unknown', fields: { gain: { status: 'unknown', actual: null, expected: 100 } } },
      { id: 'conflict', fields: { camera_id: { status: 'difference', actual: 'A', expected: 'B' } } },
    ] });
    return undefined;
  });
  const element = document.createElement('div'); element.className = 'astrophoto-ui'; document.body.append(element);
  const wrapper = mount(CatalogCalibration, { attachTo: element, props: { id }, global: { plugins: [createFrontendI18n()] } });
  cleanups.push(() => { wrapper.unmount(); element.remove(); });
  await button('Calibration master').click();
  await page.getByRole('button', { name: 'Choose', exact: true }).first().click();
  await expect.element(page.getByText('Matching Dark')).toBeVisible();
  await expect.element(page.getByText('Unknown Dark')).toBeVisible();
  await expect.element(page.getByText('Wrong Dark')).toBeVisible();
});

test('subframe group editor submits group parameters and preserves optical snapshot when unchanged', async () => {
  let sent: any;
  serve((path, request) => {
    if (path === prefix + '/catalog/subframe_collection/group' && request.method === 'PATCH') {
      sent = JSON.parse(String(request.body)); return Response.json({ id: 'group' });
    }
    return undefined;
  });
  const wrapper = mount(CatalogEditor, { attachTo: document.body, props: { endpoint: 'subframe_collection/group', group: true,
    record: { name: 'Group', revision: 1, frame_type: 'light', calibration_state: 'unknown', filter_state: 'unknown', gain: 100 } },
    global: { plugins: [createFrontendI18n()] } });
  cleanups.push(() => wrapper.unmount());
  await button(/Capture Parameters/).click();
  await page.getByRole('spinbutton', { name: 'Gain' }).fill('120');
  await button('Save').click();
  await vi.waitFor(() => expect(sent).toEqual({ revision: 1, gain: 120 }));
});

test('subframe group displays shared parameters and read-only frame details', async () => {
  const groupId = '88888888-8888-4888-8888-888888888888';
  const first = { ...asset, import_group_id: groupId };
  const second = { ...first, id: '99999999-9999-4999-8999-999999999999', name: 'Andromeda-2.fit' };
  const removed = vi.fn();
  app.extensionManager.dialog.confirm.mockResolvedValue(true);
  serve((path, request) => {
    if (path === prefix + '/storage') return Response.json(storage('reference', 1));
    if (path === prefix + '/catalog/subframe_collection/' + groupId + '/files/' + second.id + '/deletion-impact') {
      return Response.json({ name: second.name, impact_revision: 'frame-impact', has_associations: false, files: [] });
    }
    if (path === prefix + '/catalog/subframe_collection/' + groupId + '/files/' + second.id && request.method === 'DELETE') {
      removed(JSON.parse(String(request.body)));
      return Response.json({ id: second.id, deleted: true });
    }
    if (path.startsWith(prefix + '/library/import-groups?')) return Response.json({ items: [{
      id: groupId, name: 'M31 capture', frame_type: 'light', available: true, revision: 7, count: 2,
      workspaces: [{ id: 'd', name: 'Disk D', count: 1 }, { id: 'e', name: 'Disk E', count: 1 }],
    }], next: null });
    if (path.includes('import_group_id=ungrouped')) return empty();
    if (path === prefix + '/catalog/subframe_collection/' + groupId + '/files?view=assets') {
      return Response.json({ items: [first, second], next: null });
    }
    if (path === prefix + '/catalog/subframe_collection/' + groupId + '/files/' + second.id)
      return Response.json({ id: second.id, external_path: 'C:/photos/two.fit' });
    if (path === prefix + '/catalog/subframe_collection/' + groupId + '?summary=1&bindings=1') return Response.json({ id: groupId,
      name: 'M31 capture', frame_type: 'light', calibration_state: 'uncalibrated', exposure_seconds: 180,
      equipment_snapshot: { name: 'Rig', components: [
        { id: 'camera', equipment_type: 'camera', name: 'Camera 1', product_name: 'ASI2600MM' },
        { id: 'filter1', equipment_type: 'filter', name: 'L filter' },
        { id: 'filter2', equipment_type: 'filter', name: 'Ha filter' },
      ] }, filter_state: 'selected', filter_snapshot: { name: 'L filter' }, master_ids: [], count: 2 });
    return undefined;
  });
  openSidebar();
  await allAssets();
  const groupRow = page.getByRole('button', { name: 'M31 capture Subframe Group', exact: true });
  await groupRow.click();
  await page.getByRole('button', { name: 'More actions' }).first().click();
  await expect.element(button('Create Source node')).toBeVisible();
  await expect.element(button('Delete asset')).toBeVisible();
  await userEvent.keyboard('{Escape}');
  await button('Equipment and filter').click();
  await expect.element(page.getByText(/Camera 1/)).toBeVisible();
  await expect.element(page.getByText('ASI2600MM')).toBeVisible();
  await expect.element(page.getByText('L filter')).toBeVisible();
  expect(page.getByText('Ha filter').elements()).toHaveLength(0);
  await button('Capture Parameters').click();
  await expect.element(page.getByText('180', { exact: true })).toBeVisible();
  expect(app.api.fetchApi.mock.calls.some(([path]) => path.includes('/files?view=assets'))).toBe(false);
  await button('2 frames').click();
  await button(/Andromeda-2/).click();
  await expect.element(page.getByText('C:/photos/two.fit')).toBeVisible();
  expect(page.getByRole('button', { name: 'Save' }).elements()).toHaveLength(0);
  await button('← Back').click();
  await page.getByRole('button', { name: 'More actions' }).nth(2).click();
  await button('Remove subframe').click();
  await vi.waitFor(() => expect(removed).toHaveBeenCalledWith({ revision: 7, impact_revision: 'frame-impact' }));
  await button('← Back').click();
  await expect.element(groupRow).toBeVisible();
});

test('reference import offers four types and returns to the type choices on cancel', async () => {
  const native = vi.fn();
  serve((path, request) => {
    if (path === prefix + '/storage') return Response.json(storage('reference', 1));
    if (path === prefix + '/storage/native-picker') {
      native(JSON.parse(String(request.body)));
      return Response.json({ status: 'cancelled', path: null });
    }
  });
  openSidebar();
  await importAssets();
  for (const kind of ['Subframe Group', 'Video', 'Master Frame', 'Image Result']) {
    await kindButton(kind).click();
    await expect.element(kindButton(kind)).toBeEnabled();
  }
  expect(native.mock.calls.map(([body]) => body.kind)).toEqual(['folder', 'file', 'file', 'file']);
});

test('reference import falls back to the browser and keeps a single selected file', async () => {
  serve((path) => {
    if (path === prefix + '/storage') return Response.json(storage('reference', 1));
    if (path === prefix + '/storage/native-picker') return Response.json({ status: 'unavailable', path: null });
    if (path.startsWith(prefix + '/storage/directories?')) {
      const query = new URLSearchParams(path.split('?')[1]);
      if (!query.get('path')) return Response.json({ path: null, parent: null, directories: [{ name: 'Photos', path: 'C:/Photos' }] });
      return Response.json({ path: 'C:/Photos', parent: null, directories: [], files: [{ name: 'frame.fit', path: 'C:/Photos/frame.fit' }] });
    }
  });
  openSidebar();
  await importAssets();
  await kindButton('Master Frame').click();
  await button('📁 Photos').click();
  await button('📄 frame.fit').click();
  await expect.element(page.getByRole('textbox', { name: 'Name' })).toHaveValue('frame.fit');
  await expect.element(page.getByRole('combobox', { name: 'Project' })).not.toBeInTheDocument();
});

test('UX-01/02: preserves the Assets filters and retains three host tabs in a narrow sidebar', async () => {
  serve();
  const { element, i18n } = openSidebar(245);
  const assetsTabs = element.querySelectorAll<HTMLElement>('[aria-label="Assets"] [role="tab"]');
  expect(Array.from(assetsTabs, item => item.textContent?.trim())).toEqual(['All Assets', 'Projects']);
  assetsTabs[0].focus();
  await userEvent.keyboard('{ArrowRight}');
  await expect.element(tab('Projects')).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  await expect.element(page.getByRole('searchbox', { name: 'Search projects and assets' })).toBeVisible();
  await expect.element(button('Calibration Library')).not.toBeInTheDocument();
  await allAssets();
  expect(element.querySelector('#ap-asset-panel-allAssets > .ap-assets-toolbar details')).toBeNull();
  await expect.element(button(/Andromeda.fit/)).toBeVisible();
  await page.getByRole('combobox', { name: 'Search assets' }).fill('Andromeda');
  await button('Filters').click();
  await button('Master Frame 1').click();
  await userEvent.keyboard('{Escape}');
  await expect.element(button('Calibration Library')).not.toBeInTheDocument();
  await expect.element(page.getByRole('combobox', { name: 'Search assets' })).toHaveValue('Andromeda');
  await button('Filters').click();
  await expect.element(button('Master Frame 1')).toHaveAttribute('aria-pressed', 'true');
  await userEvent.keyboard('{Escape}');
  expect(element.querySelector('#ap-tab-assets')?.closest('[role="tablist"]')?.children).toHaveLength(3);
  const view = element.querySelector<HTMLElement>('#ap-asset-panel-allAssets')!;
  expect(view.scrollWidth).toBeLessThanOrEqual(view.clientWidth);
  i18n.global.locale.value = 'zh';
  await expect.element(tab('全部素材')).toBeVisible();
});

test('filter popover remains available and view settings are removed', async () => {
  serve();
  openSidebar();
  await allAssets();
  expect(button('View settings').elements()).toHaveLength(0);
  await button('Filters').click();
  await expect.element(button('Master Frame 1')).toBeVisible();
});

test('filter menu loads all catalog pages and preserves search on clear', async () => {
  serve((path) => {
    if (!path.startsWith(prefix + '/catalog/assets?')) return undefined;
    const params = new URLSearchParams(path.split('?')[1]);
    return Response.json(params.get('after') ? { items: [{ id: 'video', name: 'Orion.mp4', asset_type: 'video' }], next: null } : { items: [{ id: asset.id, name: asset.name, asset_type: 'master_frame' }], next: 'next' });
  });
  openSidebar();
  await allAssets();
  await button('Filters').click();
  await expect.element(button('Video 1')).toBeVisible();
  await button('Master Frame 1').click();
  await userEvent.keyboard('{Escape}');
  await page.getByRole('combobox', { name: 'Search assets' }).fill('Andromeda');
  await button('Filters').click();
  await button('Clear filters').click();
  await userEvent.keyboard('{Escape}');
  await expect.element(page.getByRole('combobox', { name: 'Search assets' })).toHaveValue('Andromeda');
  await expect.element(button('Filters')).toHaveFocus();
});

test('empty asset library offers no filter categories', async () => {
  serve(path => path.startsWith(prefix + '/library/assets?') || path.startsWith(prefix + '/catalog/assets?') ? empty() : undefined);
  openSidebar();
  await allAssets();
  await button('Filters').click();
  await expect.element(page.getByText('No filter options available yet.')).toBeVisible();
  await expect.element(page.getByRole('combobox', { name: 'Target', exact: true })).not.toBeInTheDocument();
});

test('filter options report a loading failure and can retry', async () => {
  let failed = false;
  serve(path => {
    if (path.startsWith(prefix + '/catalog/assets?') && !failed) {
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
  await expect.element(button('Master Frame 1')).toBeVisible();
});

test('reference subframe import appends folders, removes frames and submits the retained files', async () => {
  const checked = vi.fn();
  const submitted = vi.fn();
  let pickerCount = 0;
  serve((path, request) => {
    if (path === prefix + '/storage') return Response.json(storage('reference', 3));
    if (path === prefix + '/storage/native-picker') return Response.json({ status: 'selected', path: ++pickerCount === 1 ? 'C:/Photos/M31' : 'C:/Photos/M42' });
    if (path === prefix + '/catalog/source-folder') return Response.json({ names: ['a.fit', 'b.fit'] });
    if (path === prefix + '/assets/import/preview') {
      checked(JSON.parse(String(request.body)));
      return Response.json({ preview_id: 'preview', file_count: 2, failed: 0, size_bytes: 8 });
    }
    if (path === prefix + '/assets/import') {
      submitted(JSON.parse(String(request.body)));
      return Response.json({ operation_id: 'job', kind: 'import', phase: 'queued' });
    }
  });
  openSidebar();
  await importAssets();
  await kindButton('Subframe Group').click();
  await expect.element(page.getByRole('textbox', { name: 'Name' })).toHaveValue('M31');
  await button('Choose folder').click();
  await button('4 frames').click();
  await button('Remove M31/a.fit').click();
  await expect.element(button('3 frames')).toBeVisible();
  await button('Import').click();
  await vi.waitFor(() => expect(submitted).toHaveBeenCalledOnce());
  expect(checked).toHaveBeenCalledWith({ sources: ['C:/Photos/M31/b.fit', 'C:/Photos/M42/a.fit', 'C:/Photos/M42/b.fit'], settings_revision: 3,
    catalog: expect.objectContaining({ kind: 'subframe_collection', name: 'M31', calibration_state: 'unknown' }) });
  expect(submitted).toHaveBeenCalledWith(expect.objectContaining({ preview_id: 'preview', idempotency_key: expect.any(String) }));
});

test('copy subframe selection appends folders and removes only the selected frame', async () => {
  serve(path => path === prefix + '/storage' ? Response.json(storage('copy', 3)) : undefined);
  const { element } = openSidebar();
  vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {});
  await importAssets();
  await kindButton('Subframe Group').click();
  const input = element.querySelector<HTMLInputElement>('input[webkitdirectory]')!;
  for (const folder of ['First', 'Second']) {
    const file = new File([folder], folder + '.fit');
    Object.defineProperty(file, 'webkitRelativePath', { value: folder + '/' + file.name });
    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
  await button('2 frames').click();
  await button('Remove First/First.fit').click();
  await expect.element(button('1 frames')).toBeVisible();
  await expect.element(button('Remove Second/Second.fit')).toBeVisible();
});

test('copy previews file metadata, writes on confirmation and resumes only the missing original after reopening', async () => {
  const direct = prefix + '/library/direct-imports';
  const files = [new File(['fit'], 'M31.fit', { lastModified: 1234 }), new File(['moon'], 'Moon.fit', { lastModified: 5678 })];
  for (const file of files) Object.defineProperty(file, 'webkitRelativePath', { value: 'Panel01/' + file.name });
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
  await kindButton('Subframe Group').click();
  expect(picker).toHaveBeenCalledOnce();
  const inputs = element.querySelectorAll<HTMLInputElement>('input[type=file]');
  expect(inputs[0].multiple).toBe(false);
  expect(inputs[1].hasAttribute('webkitdirectory')).toBe(true);
  function pick(input: HTMLInputElement, file: File) {
    const selected = new DataTransfer();
    selected.items.add(file);
    input.files = selected.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
  const captured = new DataTransfer();
  files.forEach(file => captured.items.add(file));
  inputs[1].files = captured.files;
  inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
  await button('Import').click();
  await vi.waitFor(() => expect(previews).toEqual([expect.objectContaining({ parallel: false, settings_revision: 3,
    catalog: expect.objectContaining({ kind: 'subframe_collection', name: 'Panel01' }),
    files: entries.map(({ name, size_bytes, last_modified_ms }) => ({ name, size_bytes, last_modified_ms })) })]));
  await expect.element(button('Retry remaining files (1)')).toBeEnabled();
  expect(puts).toEqual(['M31.fit', 'Moon.fit']);
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
  await button('Import Assets').click();
  await button('Resume import job (1/2)').click();
  await expect.element(page.getByText('Select the original files to resume the 1 remaining transfers.')).toBeVisible();
  const reselect = element.querySelector<HTMLInputElement>('.ap-operation input[type=file]')!;
  pick(reselect, files[1]);
  await button('Retry remaining files (1)').click();
  await expect.element(page.getByText('Imported 2 of 2 files', { exact: true })).toBeVisible();
  expect(puts).toEqual(['M31.fit', 'Moon.fit', 'Moon.fit']);
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
  await kindButton('Subframe Group').click();
  const input = element.querySelector<HTMLInputElement>('input[webkitdirectory]')!;
  const selected = new DataTransfer();
  const file = new File(['x'], 'Light_001.fit');
  Object.defineProperty(file, 'webkitRelativePath', { value: 'M31/Light_001.fit' });
  selected.items.add(file);
  input.files = selected.files;
  input.dispatchEvent(new Event('change', { bubbles: true }));
  const check = (name: string) => page.getByRole('checkbox', { name, exact: true });
  await expect.element(check('Import across multiple disks')).not.toBeChecked();
  await check('Import across multiple disks').click();
  await expect.element(check('Offline')).not.toBeInTheDocument();
  await check('Archive').click();
  await button('Import').click();
  await vi.waitFor(() => expect(preview).toHaveBeenCalledWith(expect.objectContaining({
    parallel: true, workspace_ids: [workspace.id, 'External'],
  })));
});

test('UX-14/20/23: revision conflict preserves modified metadata; Reference has the unified delete action', async () => {
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
  await expect.element(button('Delete asset')).toBeVisible();
  await expect.element(button('Permanently delete file')).not.toBeInTheDocument();
  await page.getByRole('textbox', { name: 'Target', exact: true }).fill('M31 HDR');
  await button('Save').click();
  await expect.element(page.getByRole('alert').getByText(/REVISION_CONFLICT/)).toBeVisible();
  await expect.element(page.getByRole('textbox', { name: 'Target', exact: true })).toHaveValue('M31 HDR');
  expect(mutations).toEqual([{
    attributes: { ...asset.attributes, target: 'M31 HDR' },
  }]);
});

test.each(['Master Frame', 'Image Result'])('%s saves the same image result model', async kind => {
  const checked = vi.fn();
  const trainId = '88888888-8888-4888-8888-888888888888';
  const filterId = '99999999-9999-4999-9999-999999999999';
  const train = { id: trainId, name: 'Imaging train', notes: null, status: 'published', row_version: 1,
    camera_id: null, primary_optics_id: null, accessory_id: null, filter_ids: [filterId], other_ids: [],
    summary: { camera: null, primary_optics: null, accessories: [], filters: ['L'], others: [] } };
  serve((path, request) => {
    if (path === prefix + '/storage') return Response.json(storage('reference', 3));
    if (path === prefix + '/storage/native-picker') return Response.json({ status: 'selected', path: 'C:/Photos/stack.fit' });
    if (path.startsWith(prefix + '/optical-trains?')) return Response.json({ items: [train], next: null });
    if (path === prefix + '/optical-trains/' + trainId) return Response.json(train);
    if (path === prefix + '/assets/import/preview') {
      checked(JSON.parse(String(request.body)));
      return Response.json({ preview_id: 'preview', file_count: 1, failed: 0, size_bytes: 8 });
    }
  });
  openSidebar();
  await importAssets();
  await kindButton(kind).click();
  await page.getByRole('textbox', { name: 'Name' }).fill('Stack');
  if (kind === 'Image Result') {
    await expect.element(button('Equipment and filter')).toHaveAttribute('aria-expanded', 'false');
    await button('Equipment and filter').click();
    const trainSelect = page.getByRole('combobox', { name: 'Equipment Train', exact: true });
    await trainSelect.selectOptions(trainId);
    const filterSelect = page.getByRole('combobox', { name: 'Filter', exact: true });
    await filterSelect.selectOptions(filterId);
  }
  await button('Import').click();
  await vi.waitFor(() => expect(checked).toHaveBeenCalledWith({
    sources: ['C:/Photos/stack.fit'], settings_revision: 3, catalog: { kind: 'image_result', name: 'Stack', notes: null,
      asset_type: kind === 'Master Frame' ? 'master_frame' : 'image_result',
      ...(kind === 'Master Frame' ? { master_type: 'unknown', exposure_seconds: null, iso: null, gain: null,
        offset: null, temperature_c: null, binning: '1', readout_mode: null } : {}),
      equipment_train_id: kind === 'Image Result' ? trainId : null,
      filter_state: kind === 'Image Result' ? 'selected' : 'unknown',
      filter_id: kind === 'Image Result' ? filterId : null },
  }));
});

test('calibration master is configured during the master frame import', async () => {
  const checked = vi.fn();
  serve((path, request) => {
    if (path === prefix + '/storage') return Response.json(storage('reference', 3));
    if (path === prefix + '/storage/native-picker') return Response.json({ status: 'selected', path: 'C:/Photos/dark.fit' });
    if (path === prefix + '/assets/import/preview') {
      checked(JSON.parse(String(request.body)));
      return Response.json({ preview_id: 'preview', file_count: 1, failed: 0, size_bytes: 8 });
    }
  });
  openSidebar();
  await importAssets();
  await kindButton('Master Frame').click();
  await page.getByRole('combobox', { name: 'Master purpose' }).selectOptions('dark');
  await button('Import').click();
  await vi.waitFor(() => expect(checked).toHaveBeenCalledWith(expect.objectContaining({
    catalog: expect.objectContaining({ kind: 'image_result', asset_type: 'master_frame', master_type: 'dark' }),
  })));
});

test('capture editor keeps sensitivity values and places binning in more parameters', async () => {
  const values: Record<string, string | number> = reactive({ binning: '1', gain: 100, offset: 0 });
  const wrapper = mount(CaptureFields, { props: { modelValue: values }, attachTo: document.body,
    global: { plugins: [createFrontendI18n()] } });
  cleanups.push(() => wrapper.unmount());
  await button(/Capture Parameters/).click();
  await expect.element(button(/More parameters/)).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('combobox', { name: 'Sensitivity' }).selectOptions('iso');
  await page.getByRole('spinbutton', { name: 'ISO' }).fill('800');
  await button(/More parameters/).click();
  await expect.element(page.getByRole('combobox', { name: 'Binning' })).toHaveValue('1');
  await page.getByRole('combobox', { name: 'Binning' }).selectOptions('2');
  expect(values).toMatchObject({ gain: 100, offset: 0, iso: 800, binning: '2' });
});

test('catalog editor displays a clear duplicate name error', async () => {
  serve((path, request) => {
    if (path === prefix + '/catalog/image_result/' + asset.id && request.method === 'PATCH')
      return Response.json({ error: { code: 'ASSET_NAME_CONFLICT' } }, { status: 409 });
    return undefined;
  });
  const container = document.createElement('div'); document.body.append(container);
  const wrapper = mount(CatalogEditor, { attachTo: container, props: {
    endpoint: 'image_result/' + asset.id, group: false,
    record: { id: asset.id, revision: 1, name: 'Master', asset_type: 'master_frame', master_type: 'light', filter_state: 'unknown' },
  }, global: { plugins: [createFrontendI18n()] } });
  cleanups.push(() => { wrapper.unmount(); container.remove(); });
  await page.getByRole('textbox', { name: 'Name' }).fill('Existing');
  await button('Save').click();
  await expect.element(page.getByRole('alert').getByText(/asset name is already in use/i)).toBeVisible();
});

test('asset import displays a clear duplicate name error', async () => {
  serve((path, request) => {
    if (path === prefix + '/storage') return Response.json(storage('reference', 3));
    if (path === prefix + '/storage/native-picker') return Response.json({ status: 'selected', path: 'C:/Photos/duplicate.fit' });
    if (path === prefix + '/assets/import/preview' && request.method === 'POST')
      return Response.json({ error: { code: 'ASSET_NAME_CONFLICT' } }, { status: 409 });
    return undefined;
  });
  openSidebar();
  await importAssets();
  await kindButton('Master Frame').click();
  await button('Import').click();
  await expect.element(page.getByRole('alert').getByText(/asset name is already in use/i)).toBeVisible();
});

test('an existing master frame can be edited into a calibration master', async () => {
  const writes = vi.fn();
  serve((path, request) => {
    if (path.startsWith(prefix + '/catalog/subframe_collection?')) return empty();
    if (path === prefix + '/catalog/image_result/' + asset.id && request.method === 'PATCH') {
      writes(JSON.parse(String(request.body))); return Response.json({});
    }
    return undefined;
  });
  const container = document.createElement('div'); document.body.append(container);
  const wrapper = mount(CatalogEditor, { attachTo: container, props: {
    endpoint: 'image_result/' + asset.id, group: false,
    record: { id: asset.id, revision: 1, name: 'Master', asset_type: 'master_frame', master_type: 'unknown', filter_state: 'unknown' },
  }, global: { plugins: [createFrontendI18n()] } });
  cleanups.push(() => { wrapper.unmount(); container.remove(); });
  await page.getByRole('combobox', { name: 'Master purpose' }).selectOptions('dark');
  await button('Save').click();
  await vi.waitFor(() => expect(writes).toHaveBeenCalledWith(expect.objectContaining({ revision: 1, master_type: 'dark' })));
});

test('new projects create folders and reference an imported catalog record', async () => {
  const catalog = prefix + '/catalog';
  const created = { ...project, id: 'new-project', name: 'Moon' };
  const writes = vi.fn();
  let exists = false;
  const folder = { id: 'raw-folder', name: 'Raw', kind: 'folder', parent_id: null, revision: 1 };
  let folderCreated = false;
  serve((path, request) => {
    if (path === catalog + '/projects' && request.method === 'POST') {
      exists = true;
      return Response.json(created, { status: 201 });
    }
    if (path.startsWith(catalog + '/projects?')) return Response.json({ items: exists ? [created] : [], next: null });
    if (path === catalog + '/projects/' + created.id) return Response.json({
      project: created, items: folderCreated ? [folder] : [],
    });
    if (path.startsWith(catalog + '/assets?')) return Response.json({ items: [{ id: asset.id, name: asset.name, asset_type: 'subframe_collection' }], next: null });
    if (path === catalog + '/projects/' + created.id + '/folders' || path === catalog + '/projects/' + created.id + '/references') {
      writes(path.split('/').at(-1), JSON.parse(String(request.body)));
      if (path.endsWith('/folders')) folderCreated = true;
      return Response.json(path.endsWith('/folders') ? { items: [folder] } : {}, { status: 201 });
    }
  });
  openSidebar();
  await tab('Projects').click();
  await createProjectAction();
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Moon');
  await userEvent.keyboard('{Enter}');
  await projectAction('Moon', 'New folder');
  await page.getByRole('textbox', { name: 'Folder name' }).fill('Raw');
  await userEvent.keyboard('{Enter}');
  await vi.waitFor(() => expect(writes).toHaveBeenCalledWith('folders', { paths: ['/Raw'] }));
  await page.getByText('Raw', { exact: true }).click();
  await vi.waitFor(() => expect(document.querySelector('.ap-project-tree .selected')?.textContent).toContain('Raw'));
  await projectAction('Raw', 'Add existing assets');
  await page.getByRole('checkbox', { name: /Andromeda.fit/ }).click();
  await button('Add (1)').click();
  await vi.waitFor(() => expect(writes).toHaveBeenCalledWith('references', {
    parent_path: '/Raw', assets: [{ kind: 'subframe_collection', resource_id: asset.id }],
  }));
});

test('project picker retains selections across asset filters and submits mixed assets atomically', async () => {
  const catalog = prefix + '/catalog';
  const folder = { id: 'raw-folder', name: 'Raw', kind: 'folder', parent_id: null, revision: 1 };
  const existing = { id: 'existing', name: 'Final result', kind: 'image_result', resource_id: 'result', parent_id: null, revision: 1 };
  const picked = vi.fn();
  serve((path, request) => {
    if (path.startsWith(catalog + '/projects?')) return Response.json({ items: [project], next: null });
    if (path === catalog + '/projects/' + project.id) return Response.json({ project, items: [folder, existing] });
    if (path.startsWith(catalog + '/assets?')) return Response.json({ items: [
      { id: 'group', name: 'Light frames', asset_type: 'subframe_collection', frame_type: 'light' },
      { id: 'video', name: 'Moon video', asset_type: 'video' },
      { id: 'master', name: 'Moon master', asset_type: 'master_frame', master_type: 'light' },
      { id: 'result', name: 'Final result', asset_type: 'image_result' },
    ], next: null });
    if (path === catalog + '/projects/' + project.id + '/references' && request.method === 'POST') {
      picked(JSON.parse(String(request.body))); return Response.json({ items: [] }, { status: 201 });
    }
  });
  openSidebar();
  await tab('Projects').click();
  await button(project.name).click();
  await button('Raw').click();
  await projectAction('Raw', 'Add existing assets');
  await expect.element(page.getByText('Destination: Andromeda project / Raw')).toBeVisible();
  await expect.element(page.getByRole('checkbox', { name: /Final result/ })).toBeDisabled();
  await page.getByRole('checkbox', { name: /Light frames/ }).click();
  await button('Filters').click();
  await button(/Video\s+1/).click();
  await userEvent.keyboard('{Escape}');
  await page.getByRole('checkbox', { name: /Moon video/ }).click();
  await button('Add (2)').click();
  await vi.waitFor(() => expect(picked).toHaveBeenCalledWith({ parent_path: '/Raw', assets: [
    { kind: 'subframe_collection', resource_id: 'group' }, { kind: 'video', resource_id: 'video' },
  ] }));
});

test('project removal submits directly without confirmation or impact preview', async () => {
  const target = prefix + '/catalog/projects/' + project.id;
  const deleted = vi.fn();
  const preview = vi.fn();
  serve((path, request) => {
    if (path.startsWith(prefix + '/catalog/projects?')) return Response.json({ items: [project], next: null });
    if (path === target + '?path=%2F&view=impact') { preview(); return Response.json({}); }
    if (path === target && request.method === 'DELETE') {
      deleted(JSON.parse(String(request.body)));
      return Response.json({ error: { code: 'REVISION_CONFLICT' } }, { status: 409 });
    }
  });
  openSidebar();
  await tab('Projects').click();
  await projectAction(project.name, 'Remove Project');
  await expect.element(page.getByRole('alert').getByText(/REVISION_CONFLICT/)).toBeVisible();
  expect(deleted).toHaveBeenCalledExactlyOnceWith({});
  expect(preview).not.toHaveBeenCalled();
  expect(app.extensionManager.dialog.confirm).not.toHaveBeenCalled();
  await expect.element(button(project.name)).toBeVisible();
});

test('project picker keeps selection and shows a localized missing-record error', async () => {
  const catalog = prefix + '/catalog';
  serve((path, request) => {
    if (path.startsWith(catalog + '/projects?')) return Response.json({ items: [project], next: null });
    if (path === catalog + '/projects/' + project.id) return Response.json({ project, items: [] });
    if (path.startsWith(catalog + '/assets?')) return Response.json({ items: [{ id: 'group', name: 'Lights', asset_type: 'subframe_collection' }], next: null });
    if (path === catalog + '/projects/' + project.id + '/references' && request.method === 'POST')
      return Response.json({ error: { code: 'LIBRARY_RECORD_NOT_FOUND' } }, { status: 404 });
  });
  openSidebar();
  await tab('Projects').click();
  await button(project.name).click();
  await projectAction(project.name, 'Add existing assets');
  await page.getByRole('checkbox', { name: /Lights/ }).click();
  await button('Add (1)').click();
  await expect.element(page.getByRole('alert')).toBeVisible();
  expect(page.getByRole('alert').elements()[0].textContent).toContain('The requested project, folder, or asset is unavailable.');
  await expect.element(page.getByRole('checkbox', { name: /Lights/ })).toBeChecked();
  await expect.element(button('Add (1)')).toBeVisible();
});

test('project opens a calibration master through its V1 image result', async () => {
  const catalog = prefix + '/catalog';
  const master = { id: 'master-node', resource_id: 'dark-master', name: 'Dark master', kind: 'image_result',
    asset_type: 'master_frame', parent_id: null, revision: 1 };
  const loaded = vi.fn();
  serve(path => {
    if (path === prefix + '/storage') return Response.json(storage('reference', 0));
    if (path.startsWith(catalog + '/projects?')) return Response.json({ items: [project], next: null });
    if (path === catalog + '/projects/' + project.id) return Response.json({ project, items: [master] });
    if (path === catalog + '/image_result/dark-master') {
      loaded();
      return Response.json({ id: master.resource_id, name: master.name, master_type: 'dark', asset_type: 'master_frame', revision: 1 });
    }
  });
  openSidebar();
  await tab('Projects').click();
  await button(project.name).click();
  await projectAction(master.name, 'View details');
  await expect.element(page.getByRole('heading', { name: master.name })).toBeVisible();
  expect(loaded).toHaveBeenCalled();
});

test('asset context menu adds to its parent folder', async () => {
  const catalog = prefix + '/catalog';
  const folder = { id: 'folder', name: 'Raw', kind: 'folder', parent_id: null, revision: 1 };
  const video = { id: 'video', name: 'Moon video', kind: 'video', parent_id: 'folder', revision: 1, resource_id: 'video-resource' };
  serve(path => {
    if (path.startsWith(catalog + '/projects?')) return Response.json({ items: [project], next: null });
    if (path === catalog + '/projects/' + project.id) return Response.json({ project, items: [folder, video] });
  });
  openSidebar();
  await tab('Projects').click();
  await button(project.name).click();
  await button('Raw').click();
  await projectAction('Moon video', 'Add existing assets');
  await expect.element(page.getByText('Destination: Andromeda project / Raw')).toBeVisible();
});

test('project inline creation cancels blank, invalid and duplicate inputs, and saves on blur', async () => {
  const catalog = prefix + '/catalog';
  const writes = vi.fn();
  const folder = { id: 'folder', name: 'Raw', kind: 'folder', parent_id: null, revision: 1 };
  serve((path, request) => {
    if (path.startsWith(catalog + '/projects?')) return Response.json({ items: [project], next: null });
    if (path === catalog + '/projects/' + project.id) return Response.json({ project, items: [folder] });
    if (path.endsWith('/folders')) { writes(JSON.parse(String(request.body))); return Response.json({ items: [{ id: 'new-folder' }] }); }
    return undefined;
  });
  const container = document.createElement('div'); document.body.append(container);
  const wrapper = mount(CatalogProjects, { attachTo: container, global: { plugins: [createFrontendI18n()] } });
  cleanups.push(() => { wrapper.unmount(); container.remove(); });
  await button(project.name).click();
  await vi.waitFor(() => expect(wrapper.find('[data-node-row="folder"]').exists()).toBe(true));
  await projectAction(project.name, 'New folder');
  await userEvent.keyboard('{Enter}');
  expect(page.getByRole('textbox', { name: 'Folder name' }).elements()).toHaveLength(0);
  await projectAction(project.name, 'New folder');
  await page.getByRole('textbox', { name: 'Folder name' }).fill('bad/name');
  await userEvent.keyboard('{Enter}');
  await expect.element(page.getByText('Invalid name. Please try again.')).toBeVisible();
  await projectAction(project.name, 'New folder');
  await page.getByRole('textbox', { name: 'Folder name' }).fill('Raw');
  await userEvent.keyboard('{Enter}');
  await expect.element(page.getByText('An item with this name already exists here.')).toBeVisible();
  await projectAction(project.name, 'New folder');
  await page.getByRole('textbox', { name: 'Folder name' }).fill('Unfinished');
  await page.getByRole('searchbox', { name: 'Search projects and assets' }).click();
  await vi.waitFor(() => expect(writes).toHaveBeenCalledWith({ paths: ['/Unfinished'] }));
  await vi.waitFor(() => expect(page.getByRole('textbox', { name: 'Folder name' }).elements()).toHaveLength(0));
});

test('project tree drag moves references within a project and rejects folder cycles', async () => {
  const catalog = prefix + '/catalog';
  const writes = vi.fn();
  const folder = { id: 'folder', name: 'Raw', kind: 'folder', parent_id: null, revision: 1 };
  const child = { id: 'child', name: 'Nested', kind: 'folder', parent_id: 'folder', revision: 1 };
  const video = { id: 'video', name: 'Moon', kind: 'video', parent_id: null, revision: 1, resource_id: 'video-resource' };
  serve((path, request) => {
    if (path.startsWith(catalog + '/projects?')) return Response.json({ items: [project], next: null });
    if (path === catalog + '/projects/' + project.id) return Response.json({ project, items: [folder, child, video] });
    if (path === catalog + '/projects/' + project.id + '/nodes/video' && request.method === 'PATCH') {
      writes(JSON.parse(String(request.body))); return Response.json({});
    }
    return undefined;
  });
  const container = document.createElement('div'); document.body.append(container);
  const wrapper = mount(CatalogProjects, { attachTo: container, global: { plugins: [createFrontendI18n()] } });
  cleanups.push(() => { wrapper.unmount(); container.remove(); });
  await button(project.name).click();
  await vi.waitFor(() => expect(wrapper.find('[data-node-row="folder"]').exists()).toBe(true));
  await button('Raw').click();
  await vi.waitFor(() => expect(wrapper.find('[data-node-row="child"]').exists()).toBe(true));
  await projectAction('Raw', 'Move to');
  expect(Array.from(wrapper.find('select').element.options).map(option => option.value)).toEqual(['']);
  await wrapper.find('.ap-project-actions button').trigger('click');
  const drag = new DataTransfer();
  await wrapper.find('[data-node-row="folder"]').element.closest('li')!.dispatchEvent(new DragEvent('dragstart', { bubbles: true, dataTransfer: drag }));
  await wrapper.find('[data-node-row="child"]').element.closest('li')!.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: drag }));
  expect(writes).not.toHaveBeenCalled();
  await wrapper.find('[data-node-row="video"]').element.closest('li')!.dispatchEvent(new DragEvent('dragstart', { bubbles: true, dataTransfer: drag }));
  expect(wrapper.emitted('sourceDrag')?.at(-1)?.[1]).toBe('video-resource');
  await wrapper.find('[data-node-row="folder"]').element.closest('li')!.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: drag }));
  await wrapper.find('[data-node-row="folder"]').element.closest('li')!.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: drag }));
  await vi.waitFor(() => expect(writes).toHaveBeenCalledWith({ parent_id: 'folder', revision: 1 }));
});

test('project and node renames save on blur and escape cancels', async () => {
  const catalog = prefix + '/catalog';
  const writes = vi.fn();
  const folder = { id: 'folder', name: 'Raw', kind: 'folder', parent_id: null, revision: 1 };
  const renamedProject = { ...project };
  serve((path, request) => {
    if (path.startsWith(catalog + '/projects?')) return Response.json({ items: [renamedProject], next: null });
    if (path === catalog + '/projects/' + project.id && request.method === 'PATCH') {
      const body = JSON.parse(String(request.body)); writes('project', body); renamedProject.name = body.name; return Response.json(renamedProject);
    }
    if (path === catalog + '/projects/' + project.id) return Response.json({ project: renamedProject, items: [folder] });
    if (path === catalog + '/projects/' + project.id + '/nodes/folder' && request.method === 'PATCH') {
      const body = JSON.parse(String(request.body)); writes('folder', body); folder.name = body.name; return Response.json(folder);
    }
  });
  const container = document.createElement('div'); document.body.append(container);
  const wrapper = mount(CatalogProjects, { attachTo: container, global: { plugins: [createFrontendI18n()] } });
  cleanups.push(() => { wrapper.unmount(); container.remove(); });
  await button(project.name).click();
  await button('Raw').click();
  await userEvent.keyboard('{F2}');
  await page.getByRole('textbox', { name: 'Name' }).fill('Raw renamed');
  await page.getByRole('searchbox', { name: 'Search projects and assets' }).click();
  await vi.waitFor(() => expect(writes).toHaveBeenCalledWith('folder', { name: 'Raw renamed', revision: 1 }));
  await button('Raw renamed').click();
  await userEvent.keyboard('{F2}');
  await page.getByRole('searchbox', { name: 'Search projects and assets' }).click();
  expect(writes).toHaveBeenCalledTimes(1);
  await button('Raw renamed').click();
  await userEvent.keyboard('{F2}');
  await page.getByRole('textbox', { name: 'Name' }).fill('bad/name');
  await page.getByRole('searchbox', { name: 'Search projects and assets' }).click();
  await expect.element(page.getByText('Invalid name. Please try again.')).toBeVisible();
  expect(writes).toHaveBeenCalledTimes(1);
  await button('Raw renamed').click();
  await userEvent.keyboard('{F2}');
  await page.getByRole('textbox', { name: 'Name' }).fill('Discard');
  await userEvent.keyboard('{Escape}');
  expect(writes).toHaveBeenCalledTimes(1);
  await button(project.name).click();
  await userEvent.keyboard('{F2}');
  await page.getByRole('textbox', { name: 'Name' }).fill('Project renamed');
  await page.getByRole('searchbox', { name: 'Search projects and assets' }).click();
  await vi.waitFor(() => expect(writes).toHaveBeenCalledWith('project', { name: 'Project renamed', revision: 1 }));
});

test('project context menu opens without an ellipsis button and supports keyboard dismissal', async () => {
  const catalog = prefix + '/catalog';
  serve(path => {
    if (path.startsWith(catalog + '/projects?')) return Response.json({ items: [project], next: null });
    if (path === catalog + '/projects/' + project.id) return Response.json({ project, items: [] });
  });
  const container = document.createElement('div'); document.body.append(container);
  const wrapper = mount(CatalogProjects, { attachTo: container, global: { plugins: [createFrontendI18n()] } });
  cleanups.push(() => { wrapper.unmount(); container.remove(); });
  await button(project.name).click();
  expect(wrapper.find('.ap-project-icon').exists()).toBe(false);
  await userEvent.keyboard('{ContextMenu}');
  await expect.element(button('Rename')).toBeVisible();
  await expect.element(button('New folder')).toHaveFocus();
  await userEvent.keyboard('{Escape}');
  await expect.element(button(project.name)).toHaveFocus();
  expect(wrapper.find('.ap-project-menu').exists()).toBe(false);
  wrapper.find('[data-project-row]').element.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
  await expect.element(button('Rename')).toBeVisible();
});

test('empty project area offers project creation with mouse and keyboard', async () => {
  serve();
  const container = document.createElement('div'); document.body.append(container);
  const wrapper = mount(CatalogProjects, { attachTo: container, global: { plugins: [createFrontendI18n()] } });
  cleanups.push(() => { wrapper.unmount(); container.remove(); });
  await expect.element(page.getByRole('searchbox', { name: 'Search projects and assets' })).toBeVisible();
  expect(wrapper.find('.ap-project-toolbar button').exists()).toBe(false);
  wrapper.element.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 10, clientY: 20 }));
  await expect.element(button('Create project')).toBeVisible();
  await button('Create project').click();
  await expect.element(page.getByRole('textbox', { name: 'Name' })).toBeVisible();
  await userEvent.keyboard('{Escape}');
  (wrapper.element as HTMLElement).focus();
  await userEvent.keyboard('{ContextMenu}');
  await expect.element(button('Create project')).toHaveFocus();
  await userEvent.keyboard('{Escape}');
  expect(document.activeElement).toBe(wrapper.element);
});

test('project inline creation preserves a valid name and can retry after a service failure', async () => {
  const catalog = prefix + '/catalog';
  let attempts = 0;
  serve((path, request) => {
    if (path.startsWith(catalog + '/projects?')) return Response.json({ items: [project], next: null });
    if (path === catalog + '/projects/' + project.id) return Response.json({ project, items: [] });
    if (path.endsWith('/folders') && request.method === 'POST') {
      attempts++;
      return attempts === 1 ? new Response(null, { status: 503 }) : Response.json({ items: [{ id: 'new-folder' }] });
    }
    return undefined;
  });
  const container = document.createElement('div'); document.body.append(container);
  const wrapper = mount(CatalogProjects, { attachTo: container, global: { plugins: [createFrontendI18n()] } });
  cleanups.push(() => { wrapper.unmount(); container.remove(); });
  await button(project.name).click();
  await projectAction(project.name, 'New folder');
  await page.getByRole('textbox', { name: 'Folder name' }).fill('Raw');
  await userEvent.keyboard('{Enter}');
  await expect.element(button('Retry')).toBeVisible();
  await expect.element(page.getByRole('textbox', { name: 'Folder name' })).toHaveValue('Raw');
  await button('Retry').click();
  await vi.waitFor(() => expect(attempts).toBe(2));
  await vi.waitFor(() => expect(page.getByRole('textbox', { name: 'Folder name' }).elements()).toHaveLength(0));
});

test('project tree supports keyboard navigation and retains ancestors in search', async () => {
  const catalog = prefix + '/catalog';
  const folder = { id: 'folder', name: 'Raw', kind: 'folder', parent_id: null, revision: 1 };
  const video = { id: 'video', name: 'Moon video', kind: 'video', parent_id: 'folder', revision: 1, resource_id: 'video-resource' };
  serve(path => {
    if (path.startsWith(catalog + '/projects?')) return Response.json({ items: [project], next: null });
    if (path === catalog + '/projects/' + project.id) return Response.json({ project, items: [folder, video] });
    return undefined;
  });
  const container = document.createElement('div'); document.body.append(container);
  const wrapper = mount(CatalogProjects, { attachTo: container, global: { plugins: [createFrontendI18n()] } });
  cleanups.push(() => { wrapper.unmount(); container.remove(); });
  await button(project.name).click();
  await vi.waitFor(() => expect(wrapper.find('[data-node-row="folder"]').exists()).toBe(true));
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(button('Raw')).toHaveFocus();
  await userEvent.keyboard('{ArrowRight}');
  await expect.element(button('Moon video')).toBeVisible();
  await userEvent.keyboard('{F2}');
  await expect.element(page.getByRole('textbox', { name: 'Name', exact: true })).toHaveFocus();
  await userEvent.keyboard('{Escape}');
  await page.getByRole('searchbox', { name: 'Search projects and assets' }).fill('Moon');
  await expect.element(button('Raw')).toBeVisible();
  await expect.element(button('Moon video')).toBeVisible();
  await page.getByRole('searchbox', { name: 'Search projects and assets' }).fill('No such item');
  await expect.element(page.getByText('No matching items.')).toBeVisible();
});

test('host notification adapter uses current API and preserves page feedback', async () => {
  const { notifyHost } = await import('../../src/host/notify');
  const modern = { success: vi.fn(), error: vi.fn() };
  Object.assign(app.extensionManager, { toast: modern });
  cleanups.push(() => { Reflect.deleteProperty(app.extensionManager, 'toast'); });
  expect(notifyHost('success', 'Saved')).toBe(true);
  expect(modern.success).toHaveBeenCalledWith('Saved', expect.objectContaining({ duration: 4000 }));
  const legacy = { add: vi.fn() };
  Object.assign(app.extensionManager, { toast: legacy });
  expect(notifyHost('error', 'Failed')).toBe(false);
  expect(legacy.add).not.toHaveBeenCalled();
  await Promise.resolve();
  Object.assign(app.extensionManager, { toast: { error: () => { throw new Error('unavailable'); } } });
  expect(notifyHost('error', 'Failed')).toBe(false);
});

test('project subframe groups expand in place, retry a page, and expose read-only file facts', async () => {
  let scrollIntoPage: (() => void) | undefined;
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: IntersectionObserverCallback) {
      scrollIntoPage = () => callback([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
    }
    observe() {}
    disconnect() {}
  });
  cleanups.push(() => vi.unstubAllGlobals());
  const catalog = prefix + '/catalog';
  const group = { id: 'project-group', name: 'Bias alias', kind: 'subframe_collection', parent_id: null,
    revision: 1, resource_id: 'group-resource' };
  const first = { id: asset.id, file_name: 'Bias_0001.fit', size_bytes: 55, file_path: 'D:/raw/Bias_0001.fit' };
  const second = { ...first, id: 'second', file_name: 'Bias_0002.fit' };
  let loads = 0;
  let secondPageAttempts = 0;
  serve(path => {
    if (path.startsWith(catalog + '/projects?')) return Response.json({ items: [project], next: null });
    if (path === catalog + '/projects/' + project.id) return Response.json({ project, items: [group] });
    if (path.startsWith(catalog + '/subframe_collection/group-resource/files?')) {
      loads += 1;
      if (path.includes('after=')) {
        if (secondPageAttempts++ === 0) return Response.json({ error: { code: 'network' } }, { status: 503 });
        return Response.json({ items: [second], next: null, total: 2 });
      }
      return Response.json({ items: [first], next: first.id, total: 2 });
    }
  });
  const container = document.createElement('div'); document.body.append(container);
  const wrapper = mount(CatalogProjects, { attachTo: container, global: { plugins: [createFrontendI18n()] } });
  cleanups.push(() => { wrapper.unmount(); container.remove(); });
  await button(project.name).click();
  await expect.element(button(group.name)).toHaveAttribute('aria-expanded', 'false');
  expect(loads).toBe(0);
  await button(group.name).click();
  await expect.element(button(first.file_name)).toBeVisible();
  await vi.waitFor(() => expect(scrollIntoPage).toBeDefined());
  scrollIntoPage?.();
  await expect.element(button('Retry')).toBeVisible();
  await button('Retry').click();
  await expect.element(button(second.file_name)).toBeVisible();
  await expect.element(page.getByText('Subframe Group · 2 frames', { exact: true })).toBeVisible();
  await button(first.file_name).click();
  await expect.element(page.getByText(first.file_path)).toBeVisible();
  await expect.element(page.getByText('Online', { exact: true })).toBeVisible();
  await userEvent.keyboard('{ArrowLeft}');
  await expect.element(button(group.name)).toHaveFocus();
  await userEvent.keyboard('{ArrowLeft}');
  await expect.element(button(group.name)).toHaveAttribute('aria-expanded', 'false');
  expect(wrapper.find('[data-project-frames]').exists()).toBe(false);
  await button(group.name).dblClick();
  await expect.element(page.getByRole('textbox', { name: 'Name', exact: true })).toHaveValue(group.name);
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

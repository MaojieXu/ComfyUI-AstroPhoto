import { mount } from '@vue/test-utils';
import { beforeEach, expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import type { AstroStatus } from '../../src/api/status';
import type { Device, Draft, Train } from '../../src/api/equipment';
import { DetailAccordion } from '../../src/features/library/components/DetailAccordion';
import { RecordRows } from '../../src/features/library/components/RecordRows';
import type { EquipmentSession } from '../../src/features/library/pages/EquipmentPage';
import { emptyDraft } from '../../src/features/library/pages/OpticalTrainEditor';
import { Sidebar } from '../../src/features/sidebar/Sidebar';
import { createFrontendI18n } from '../../src/i18n';
import { ComfySingleSelect } from '../../src/shared/ComfySingleSelect';
import '../../src/styles/theme.css';
import { h } from 'vue';
import { app } from '../host';

const base = '/astrophoto/v1';
const cameraId = '11111111-1111-4111-8111-111111111111';
const trainId = '22222222-2222-4222-8222-222222222222';
const opticsId = '33333333-3333-4333-8333-333333333333';
const camera: Device = {
  id: cameraId, equipment_type: 'camera', name: 'Observatory camera', archived_at_utc: null,
  manufacturer: null, model: null, notes: null, specs: { sensor_kind: 'mono' }, row_version: 1, usage_summary: [],
};
const train: Train = {
  id: trainId, name: 'Wide field', notes: null, row_version: 3, status: 'draft', has_draft: false,
  latest_revision: null, default_revision: null, configuration: null, components: [],
  summary: { camera: null, primary_optics: null, accessories: [], filters: [] },
};
const status: AstroStatus = {
  extension: { id: 'ComfyUI_AstroPhoto', version: '0.0.1' }, api_version: 'v1', status: 'ok',
  runtime: { node_registered: true, routes_registered: true },
  capabilities: {
    equipment: { available: true, reason: null }, optical_trains: { available: true, reason: null },
  },
};

function json(value: object, responseStatus = 200) {
  return Response.json(value, { status: responseStatus });
}

function list<T>(items: T[] = []) {
  return json({ items, next: null, total: items.length });
}

type Handler = (route: string, request: RequestInit) => Response | Promise<Response> | undefined;
function serve(override?: Handler) {
  app.api.fetchApi.mockImplementation(async (path: string, options: RequestInit = {}) => {
    const response = override?.(path, options);
    if (response) return response;
    if (path === `${base}/status`) return json(status);
    if (path === '/object_info') return json({});
    if (path.startsWith(`${base}/equipment?`) || path.startsWith(`${base}/optical-trains?`)) return list();
    return json({ error: { code: 'UNAUTHORIZED_STORAGE_OPERATION' } }, 403);
  });
}

function mountSidebar(equipmentSession: EquipmentSession = {}, width = 480) {
  const element = document.createElement('div');
  element.className = 'astrophoto-ui';
  Object.assign(element.style, { width: `${width}px`, height: '700px' });
  document.body.append(element);
  const i18n = createFrontendI18n();
  const wrapper = mount(Sidebar, { attachTo: element, props: { equipmentSession, bundles: [] }, global: { plugins: [i18n] } });
  return { wrapper, i18n };
}

const tab = (name: string) => page.getByRole('tab', { name, exact: true });
const button = (name: string | RegExp) => page.getByRole('button', { name, exact: true });
const heading = (name: string) => page.getByRole('heading', { name, exact: true });
const nameField = () => page.getByRole('textbox', { name: /^Name/ });
const exactText = (value: string) => page.getByText(value, { exact: true });

async function enterEquipment() {
  await tab('Settings').click();
  await exactText('Equipment & Optics').click();
  await expect.element(tab('My Equipment')).toBeVisible();
}

async function addCamera() {
  await button('Add equipment').click();
  await button(/^Camera Sensor/).click();
  await nameField().fill(camera.name);
}

beforeEach(() => {
  serve();
  app.extensionManager.dialog.confirm.mockReset().mockResolvedValue(true);
});

test('04-A/B: equipment loads lazily and a field rejection preserves input before save and archive', async ({ onTestFinished }) => {
  const warn = vi.spyOn(console, 'warn');
  onTestFinished(() => warn.mockRestore());
  const submissions: Record<string, unknown>[] = [];
  const save = Promise.withResolvers<Response>();
  let current = camera;
  serve((path, options) => {
    if (path === `${base}/equipment` && options.method === 'POST') {
      submissions.push(JSON.parse(String(options.body)));
      if (submissions.length === 1) return json({ error: { code: 'EQUIPMENT_VALIDATION_FAILED',
        details: { fields: { name: 'invalid_value' } } }, request_id: 'validation-id' }, 422);
      return save.promise;
    }
    if (path === `${base}/equipment/${cameraId}/archive`) {
      expect(JSON.parse(String(options.body))).toEqual({ expected_version: 1 });
      current = { ...camera, archived_at_utc: '2026-11-21T12:00:00Z', row_version: 2 };
      return json(current);
    }
    if (path === `${base}/equipment/${cameraId}`) return json(current);
  });
  mountSidebar();
  await expect.element(tab('Assets')).toHaveAttribute('aria-selected', 'true');
  expect(app.api.fetchApi.mock.calls.some(([path]) => path.startsWith(`${base}/equipment`))).toBe(false);
  await enterEquipment();
  await expect.element(page.getByText(/No equipment yet/)).toBeVisible();
  await addCamera();
  await expect.element(page.getByLabelText('Sensor width (px)')).toBeVisible();
  await expect.element(page.getByLabelText('Aperture (mm)')).not.toBeInTheDocument();
  await button('Save').click();
  await expect.element(page.getByRole('alert').getByText(/validation-id/)).toBeVisible();
  await expect.element(exactText('Check the highlighted equipment or optical train fields.')).toBeVisible();
  expect(warn.mock.calls.flat()).not.toContainEqual(expect.stringContaining('EQUIPMENT_VALIDATION_FAILED'));
  await expect.element(nameField()).toHaveValue(camera.name);
  await expect.element(nameField()).toHaveAttribute('aria-invalid', 'true');
  await button('Save').click();
  await expect.element(button('Saving…')).toBeDisabled();
  await tab('Nodes').click();
  await expect.element(tab('Settings')).toHaveAttribute('aria-selected', 'true');
  expect(app.extensionManager.dialog.confirm).not.toHaveBeenCalled();
  save.resolve(json(camera, 201));
  await expect.element(heading(camera.name)).toBeVisible();
  await expect.element(exactText('Equipment saved.')).toBeVisible();
  expect(submissions).toEqual([expect.objectContaining({ name: camera.name, equipment_type: 'camera' }), expect.objectContaining({ name: camera.name, equipment_type: 'camera' })]);
  await button('Archive').click();
  await expect.element(button('Restore')).toBeVisible();
  expect(current.archived_at_utc).not.toBeNull();
});

test('04-B: navigation cancellation retains the form, host remount restores it, and confirmed navigation discards it', async () => {
  const session: EquipmentSession = {};
  const original = mountSidebar(session);
  await enterEquipment();
  await addCamera();
  app.extensionManager.dialog.confirm.mockResolvedValueOnce(false);
  await tab('Settings').click();
  expect(app.extensionManager.dialog.confirm).toHaveBeenCalledOnce();
  await expect.element(tab('Settings')).toHaveAttribute('aria-selected', 'true');
  await expect.element(nameField()).toHaveValue(camera.name);
  original.wrapper.unmount();

  const reopened = mountSidebar(session);
  await expect.element(page.getByText(/Unsaved edits recovered/)).toBeVisible();
  reopened.i18n.global.locale.value = 'zh';
  await expect.element(page.getByRole('textbox', { name: /^名称/ })).toHaveValue(camera.name);
  reopened.i18n.global.locale.value = 'en';
  await tab('Settings').click();
  await expect.element(button(/^Equipment & Optics/)).toBeVisible();
  await expect.element(nameField()).not.toBeInTheDocument();
  expect(session.current).toBeUndefined();
});

test.each([true, false])('04-C: equipment deletion honors links (referenced: %s)', async referenced => {
  const device = { ...camera, usage_summary: referenced ? [{ train_id: trainId, name: train.name, draft: true, revisions: [] }] : [] };
  const deletions: number[] = [];
  serve((path, options) => {
    if (path.startsWith(`${base}/equipment?`)) return list(deletions.length ? [] : [device]);
    if (path === `${base}/equipment/${cameraId}`) {
      if (options.method !== 'DELETE') return json(device);
      deletions.push(JSON.parse(String(options.body)).expected_version);
      return new Response(null, { status: 204 });
    }
  });
  mountSidebar();
  await enterEquipment();
  await button(/^Observatory camera/).click();
  await expect.element(heading(camera.name)).toBeVisible();
  if (referenced) {
    await button('Delete permanently').click();
    const warning = page.getByRole('alert');
    await expect.element(warning.getByText(/optical train/)).toBeVisible();
    await expect.element(warning.getByRole('button', { name: 'Wide field' })).toBeVisible();
    expect(app.extensionManager.dialog.confirm).not.toHaveBeenCalled();
    expect(deletions).toEqual([]);
    return;
  }

  const confirm = app.extensionManager.dialog.confirm;
  confirm.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
  const remove = button('Delete permanently');
  await remove.click();
  expect(confirm).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'delete', itemList: [camera.name] }));
  await expect.element(remove).toBeEnabled();
  expect(deletions).toEqual([]);
  await remove.click();
  await expect.element(exactText('Equipment deleted.')).toBeVisible();
  expect(deletions).toEqual([1]);
});

test('04-B/C: a stale train deletion reports its receipt and retries with the reloaded version', async () => {
  let current = { ...train };
  const deleteVersions: number[] = [];
  serve((path, options) => {
    if (path.startsWith(`${base}/optical-trains?`)) return list(deleteVersions.includes(4) ? [] : [current]);
    if (path !== `${base}/optical-trains/${trainId}`) return;
    if (options.method !== 'DELETE') return json(current);
    const { expected_version } = JSON.parse(String(options.body));
    deleteVersions.push(expected_version);
    if (expected_version === 3) {
      current = { ...current, row_version: 4 };
      return json({ error: { code: 'DRAFT_VERSION_CONFLICT' }, request_id: 'stale-delete' }, 409);
    }
    return new Response(null, { status: 204 });
  });
  mountSidebar();
  await enterEquipment();
  await tab('Optical Trains').click();
  await button(/^Wide field/).click();
  const remove = button('Delete permanently');
  await expect.element(remove).toBeVisible();
  const actions = remove.element().parentElement!;
  expect(Array.from(actions.querySelectorAll('button'), entry => entry.textContent)).toEqual(['Edit optical train', 'Archive', 'Delete permanently']);
  app.extensionManager.dialog.confirm.mockResolvedValueOnce(false);
  await remove.click();
  await expect.element(remove).toBeEnabled();
  expect(deleteVersions).toEqual([]);
  await remove.click();
  await expect.element(page.getByRole('alert').getByText(/stale-delete/)).toBeVisible();
  await expect.element(heading(train.name)).toBeVisible();
  await button('Retry').click();
  await remove.click();
  await expect.element(button('Create optical train')).toBeVisible();
  await expect.element(button(/^Wide field/)).not.toBeInTheDocument();
  expect(deleteVersions).toEqual([3, 4]);
});

test('04-A: device and train filters remain independent and the tabs support manual keyboard activation', async () => {
  const requested = (route: string, parameters: Record<string, string>) => app.api.fetchApi.mock.calls.some(([path]) => {
    if (!path.startsWith(`${base}/${route}?`)) return false;
    const query = new URLSearchParams(path.split('?')[1]);
    return Object.entries(parameters).every(([key, value]) => query.get(key) === value);
  });
  mountSidebar();
  await enterEquipment();
  const devices = tab('My Equipment');
  const trains = tab('Optical Trains');
  await devices.click();
  await userEvent.keyboard('{ArrowRight}');
  await expect.element(trains).toHaveFocus();
  await expect.element(devices).toHaveAttribute('aria-selected', 'true');

  const filter = button('Filter records');
  const choices = page.getByRole('radiogroup', { name: 'Filter records' });
  const deviceSearch = page.getByLabelText('Search name, manufacturer or model');
  await filter.click();
  await choices.getByText('Camera', { exact: true }).click();
  await expect.poll(() => requested('equipment', { type: 'camera' })).toBe(true);
  await userEvent.keyboard('{Escape}');
  await expect.element(filter).toHaveFocus();
  await deviceSearch.fill('camera model');
  await expect.poll(() => requested('equipment', { type: 'camera', q: 'camera model' })).toBe(true);

  await trains.click();
  await filter.click();
  await expect.element(page.getByRole('radio', { name: 'All active' })).toBeChecked();
  await choices.getByText('Draft', { exact: true }).click();
  await expect.poll(() => requested('optical-trains', { status: 'draft' })).toBe(true);
  await devices.click();
  await expect.element(deviceSearch).toHaveValue('camera model');
  await button('Clear search and filters').click();
  await expect.element(deviceSearch).toHaveValue('');
  await expect.element(page.getByText(/No equipment yet/)).toBeVisible();
});

test('04-A/C: real Reka options support keyboard selection and Escape in a narrow sidebar, then save a train with quick-added optics', async () => {
  const optics: Device = { ...camera, equipment_type: 'primary_optics', name: 'Quick telescope', id: opticsId, specs: {} };
  const filter: Device = { ...camera, equipment_type: 'filter', name: 'Urban filter', id: '55555555-5555-4555-8555-555555555555', specs: {} };
  const archivedCamera: Device = { ...camera, id: '44444444-4444-4444-8444-444444444444', name: 'Archived camera', archived_at_utc: '2026-11-21T10:00:00Z' };
  let savedTrain = train;
  let quickAdded = false;
  let savedDraft: Draft | undefined;
  serve((path, options) => {
    if (path.startsWith(`${base}/equipment?`)) return list(quickAdded ? [camera, archivedCamera, optics, filter] : [camera, archivedCamera, filter]);
    if (path === `${base}/equipment` && options.method === 'POST') {
      expect(JSON.parse(String(options.body))).toMatchObject({ name: optics.name, equipment_type: 'primary_optics' });
      quickAdded = true;
      return json(optics, 201);
    }
    if (path === `${base}/optical-trains` && options.method === 'POST') {
      const { draft } = JSON.parse(String(options.body)) as { draft: Draft };
      savedDraft = draft;
      savedTrain = { ...train, name: draft.name, has_draft: true, configuration: { draft, draft_version: 1 },
        draft: { draft, draft_version: 1, updated_at_utc: '2026-11-21T12:00:00Z' }, components: [camera, optics, filter] };
      return json(savedTrain, 201);
    }
    if (path === `${base}/optical-trains/${trainId}`) return json(savedTrain);
  });
  mountSidebar({}, 280);
  await enterEquipment();
  await tab('Optical Trains').click();
  await button('Create optical train').click();
  await nameField().fill(train.name);
  const picker = page.getByRole('combobox', { name: 'Imaging camera', exact: true });
  await expect.element(picker).toHaveTextContent('Select equipment');
  (picker.element() as HTMLElement).focus();
  await userEvent.keyboard('{ArrowDown}');
  const options = page.getByRole('listbox');
  const emptyOption = options.getByRole('option', { name: 'Select equipment', exact: true });
  const cameraOption = options.getByRole('option', { name: camera.name, exact: true });
  await expect.element(options).toBeVisible();
  // Reka focuses the current option after the portalled list has been positioned.
  await expect.element(emptyOption).toHaveFocus();
  expect(options.element().closest('.astrophoto-ui')).toBeNull();
  await expect.element(page.getByRole('option', { name: 'Archived camera' })).not.toBeInTheDocument();
  await userEvent.keyboard('{Escape}');
  await expect.element(picker).toHaveFocus();
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(emptyOption).toHaveFocus();
  await userEvent.keyboard('{End}');
  await expect.element(cameraOption).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  await expect.element(picker).toHaveTextContent(camera.name);

  await button('Add Telescope / lens').click();
  await nameField().fill(optics.name);
  await button('Save').click();
  await expect.element(nameField()).toHaveValue(train.name);
  await expect.element(page.getByRole('combobox', { name: 'Primary optics', exact: true })).toHaveTextContent(optics.name);
  const filters = page.getByLabelText('Available filters', { exact: true });
  await filters.click();
  await page.getByRole('option', { name: filter.name, exact: true }).click();
  await userEvent.keyboard('{Escape}');
  await expect.element(filters.getByText(filter.name, { exact: true })).toBeVisible();
  await expect.element(button('Publish revision')).not.toBeInTheDocument();
  await button('Save').click();
  await expect.element(heading(train.name)).toBeVisible();
  await expect.element(exactText('Optical train saved.')).toBeVisible();
  expect(savedDraft).toMatchObject({ name: train.name, camera_id: cameraId, primary_optics_id: opticsId, filter_ids: [filter.id] });
});

test('04-A/B: editing a stale optical draft retains changes and rebases onto the current server revision', async () => {
  const versions: Array<number | null> = [];
  let saved = { ...emptyDraft, name: train.name, notes: 'original' };
  let version = 1;
  serve((path, options) => {
    const current = () => ({ ...train, configuration: { draft: saved, draft_version: version }, has_draft: true });
    if (path.startsWith(`${base}/optical-trains?`)) return list([current()]);
    if (path === `${base}/optical-trains/${trainId}`) return json(current());
    if (path === `${base}/optical-trains/${trainId}/draft` && options.method === 'PUT') {
      const request = JSON.parse(String(options.body)) as { draft: Draft; expected_draft_version: number | null };
      versions.push(request.expected_draft_version);
      if (version === 1) {
        version = 2;
        saved = { ...saved, notes: 'other session' };
        return json({ error: { code: 'DRAFT_VERSION_CONFLICT' }, request_id: 'stale-edit' }, 409);
      }
      expect(request.expected_draft_version).toBe(version);
      version += 1;
      saved = request.draft;
      return json({ draft: saved, draft_version: version, updated_at_utc: '2026-11-21T12:00:00Z' });
    }
  });
  mountSidebar();
  await enterEquipment();
  await tab('Optical Trains').click();
  await button(/^Wide field/).click();
  await button('Edit optical train').click();
  const notes = page.getByRole('textbox', { name: 'Notes', exact: true });
  await notes.fill('local edits');
  await button('Save').click();
  await expect.element(page.getByRole('alert').getByText(/stale-edit/)).toBeVisible();
  expect(saved.notes).toBe('other session');
  await expect.element(notes).toHaveValue('local edits');
  await button('Retry').click();
  await expect.element(button('Save')).toBeEnabled();
  await expect.element(notes).toHaveValue('local edits');
  await button('Save').click();
  await expect.element(exactText('Optical train saved.')).toBeVisible();
  expect(versions).toEqual([1, 2]);
  expect(saved.notes).toBe('local edits');
});

test('04-A: generic record rows and detail folding also work with a non-device record', async () => {
  const rows = [{ key: 'source-1', title: 'First light' }];
  const Root = { render: () => h(DetailAccordion, { title: 'Details', count: '1', initiallyOpen: true }, {
    default: () => RecordRows({ records: rows, recordKey: row => row.key,
      renderRecord: row => h('div', row.title), renderEmpty: () => h('p', 'No records') }),
  }) };
  mount(Root, { attachTo: document.body });
  const trigger = button(/^Details/);
  const record = exactText('First light');
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect.element(record).toBeVisible();
  await trigger.click();
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect.element(record).not.toBeVisible();
});

test('04-C: disabled choices remain unavailable and the empty selection survives a keyboard round trip', async () => {
  const options = [{ value: '', label: 'Unset' }, { value: 'disabled', label: 'Unavailable', disabled: true },
    { value: 'active', label: 'Available' }];
  const selections: string[] = [];
  const control = mount(ComfySingleSelect, { attachTo: document.body, props: {
    id: 'asset-picker-test', label: 'Record source', value: '', options,
    onChange: value => { selections.push(value); void control.setProps({ value }); },
  } });
  const picker = page.getByRole('combobox', { name: 'Record source', exact: true });
  const emptyOption = page.getByRole('option', { name: 'Unset', exact: true });
  const activeOption = page.getByRole('option', { name: 'Available', exact: true });
  await expect.element(picker).toHaveTextContent('Unset');
  (picker.element() as HTMLElement).focus();
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(page.getByRole('option', { name: 'Unavailable', exact: true })).toHaveAttribute('aria-disabled', 'true');
  await expect.element(emptyOption).toHaveFocus();
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(activeOption).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  await expect.element(picker).toHaveTextContent('Available');
  await expect.element(picker).toHaveFocus();
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(activeOption).toHaveFocus();
  await userEvent.keyboard('{Home}');
  await expect.element(emptyOption).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  await expect.element(picker).toHaveTextContent('Unset');
  expect(selections).toEqual(['active', '']);
});

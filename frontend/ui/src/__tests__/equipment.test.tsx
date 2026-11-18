import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { App } from '../app/App';
import { i18n } from '../i18n';
import { app } from './hostMock';
import { definitions, status } from './fixtures';
import type { EquipmentSession } from '../features/settings/equipment/EquipmentPage';

const ID = '11111111-1111-4111-8111-111111111111';
const device = { id: ID, equipment_type: 'camera', name: 'Observatory camera', archived_at_utc: null,
  manufacturer: null, model: null, notes: null, specs: { sensor_kind: 'mono' }, row_version: 1, usage_summary: [] };
const result = (value: object, status = 200) => ({ ok: status < 400, status, json: async () => value });
const ready = { ...status, capabilities: { ...status.capabilities, equipment: { available: true, reason: null },
  optical_trains: { available: true, reason: null } } };
const mount = (session: EquipmentSession = {}) => render(<I18nextProvider i18n={i18n}><App equipmentSession={session} /></I18nextProvider>);

async function enter() {
  fireEvent.click(screen.getByRole('tab', { name: 'Settings' }));
  fireEvent.click(screen.getByText('Equipment & Optics', { exact: true }));
  await screen.findByRole('tab', { name: 'My Equipment' });
}

async function createCamera() {
  fireEvent.click(await screen.findByRole('button', { name: 'Add equipment' }));
  fireEvent.click(screen.getByRole('button', { name: /^Camera Sensor/ }));
  fireEvent.change(screen.getByRole('textbox', { name: /^Name/ }), { target: { value: device.name } });
}

beforeEach(() => {
  Object.defineProperty(crypto, 'randomUUID', { value: () => ID, configurable: true });
  app.api.fetchApi.mockImplementation(async path => {
    if (path === '/object_info') return result(definitions);
    if (path.endsWith('/status')) return result(ready);
    if (path.includes('/equipment?')) return result({ items: [], next: null });
    if (path.includes('/optical-trains?')) return result({ items: [], next: null });
    return result({ reason: 'UNAUTHORIZED_STORAGE_OPERATION' }, 403);
  });
});

test('lazy device loading, field error keeps input, and successful receipt opens real details', async () => {
  let saved = false;
  const read = app.api.fetchApi.getMockImplementation()!;
  app.api.fetchApi.mockImplementation(async (path, init) => {
    if (path.endsWith('/equipment') && init.method === 'POST') {
      const body = JSON.parse(init.body);
      expect(body.name).toBe(device.name);
      expect(body.equipment_type).toBe('camera');
      if (!saved) return result({ error: { code: 'EQUIPMENT_VALIDATION_FAILED', details: { fields: { name: 'invalid_value' } } },
        request_id: 'validation-id' }, 422);
      return result(device, 201);
    }
    if (path.endsWith('/equipment/' + ID)) return result(device);
    return read(path, init);
  });
  mount();
  expect(app.api.fetchApi.mock.calls.some(([path]) => path.includes('/equipment?'))).toBe(false);
  await enter();
  expect(await screen.findByText(/No equipment yet/)).toBeVisible();
  await createCamera();
  expect(screen.getByLabelText('Sensor width (px)')).toBeVisible();
  expect(screen.queryByLabelText('Aperture (mm)')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(await screen.findByText(/validation-id/)).toBeVisible();
  expect(screen.getByRole('textbox', { name: /^Name/ })).toHaveValue(device.name);
  expect(screen.getByRole('textbox', { name: /^Name/ })).toHaveAttribute('aria-invalid', 'true');
  saved = true;
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(await screen.findByRole('heading', { name: device.name })).toBeVisible();
  expect(screen.getByText('Equipment saved.')).toBeVisible();
});

test('unsaved edit is guarded during global navigation and restored on host remount', async () => {
  const session: EquipmentSession = {};
  const original = mount(session);
  await enter();
  await createCamera();
  app.extensionManager.dialog.confirm.mockResolvedValueOnce(false);
  fireEvent.click(screen.getByRole('tab', { name: 'Nodes' }));
  await waitFor(() => expect(app.extensionManager.dialog.confirm).toHaveBeenCalled());
  expect(screen.getByRole('textbox', { name: /^Name/ })).toHaveValue(device.name);
  original.unmount();
  mount(session);
  expect(await screen.findByText(/Unsaved edits recovered/)).toBeVisible();
  expect(screen.getByRole('textbox', { name: /^Name/ })).toHaveValue(device.name);
  await act(async () => { await i18n.changeLanguage('zh'); });
  expect(screen.getByRole('textbox', { name: /^名称/ })).toHaveValue(device.name);
});

test.each([false, true])('permanent device deletion respects train references (referenced: %s)', async referenced => {
  const record = { ...device, usage_summary: referenced ? [{ train_id: ID, name: 'Wide field', draft: true, revisions: [] }] : [] };
  const remove = jest.fn(() => result({}, 204));
  const read = app.api.fetchApi.getMockImplementation()!;
  app.api.fetchApi.mockImplementation(async (path, init) => {
    if (path.includes('/equipment?')) return result({ items: [record], next: null });
    if (path.endsWith('/equipment/' + ID)) return init.method === 'DELETE' ? remove() : result(record);
    return read(path, init);
  });
  mount();
  await enter();
  fireEvent.click(await screen.findByRole('button', { name: /^Observatory camera/ }));
  const edit = await screen.findByRole('button', { name: 'Edit' });
  if (referenced) {
    const confirm = app.extensionManager.dialog.confirm;
    fireEvent.click(screen.getByRole('button', { name: 'Delete permanently' }));
    const warning = await screen.findByRole('alert');
    expect(warning).toHaveTextContent('optical train');
    expect(within(warning).getByRole('button', { name: 'Wide field' })).toBeVisible();
    expect(confirm).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
    return;
  }
  const deleteButton = screen.getByRole('button', { name: 'Delete permanently' });
  expect(deleteButton.parentElement).toBe(edit.parentElement);
  expect(screen.getByRole('button', { name: 'Archive' }).parentElement).toBe(edit.parentElement);
  const confirm = app.extensionManager.dialog.confirm;
  confirm.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
  fireEvent.click(deleteButton);
  expect(confirm).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'delete', itemList: [device.name] }));
  await waitFor(() => expect(deleteButton).toBeEnabled());
  expect(remove).not.toHaveBeenCalled();
  fireEvent.click(deleteButton);
  expect(await screen.findByText('Equipment deleted.')).toBeVisible();
  expect(remove).toHaveBeenCalledTimes(1);
});

test('train deletion confirms intent, handles a stale version, and refreshes the list after success', async () => {
  const path = '/astrophoto/v1/optical-trains/' + ID;
  const record = { id: ID, name: 'Wide field', notes: null, row_version: 3, status: 'draft', has_draft: false,
    latest_revision: null, default_revision: null, configuration: null, components: [],
    summary: { camera: null, primary_optics: null, accessories: [], filters: [] } };
  let present = true;
  const deleteVersions: number[] = [];
  const read = app.api.fetchApi.getMockImplementation()!;
  app.api.fetchApi.mockImplementation(async (route, init) => {
    if (route.includes('/optical-trains?')) return result({ items: present ? [record] : [], next: null, total: Number(present) });
    if (route === path && init.method === 'DELETE') {
      const { expected_version } = JSON.parse(init.body);
      deleteVersions.push(expected_version);
      if (expected_version === 3) {
        record.row_version = 4;
        return result({ error: { code: 'DRAFT_VERSION_CONFLICT' }, request_id: 'stale-delete' }, 409);
      }
      present = false;
      return { ok: true, status: 204 };
    }
    if (route === path) return result({ ...record });
    return read(route, init);
  });
  const confirm = app.extensionManager.dialog.confirm;
  confirm.mockResolvedValueOnce(false).mockResolvedValueOnce(true).mockResolvedValueOnce(true);
  mount();
  await enter();
  fireEvent.click(screen.getByRole('tab', { name: 'Optical Trains' }));
  fireEvent.click(await screen.findByRole('button', { name: /^Wide field/ }));
  await screen.findByRole('heading', { name: record.name });
  const remove = () => screen.getByRole('button', { name: 'Delete permanently' });
  const actions = remove().parentElement!;
  expect(within(actions).getAllByRole('button').map(button => button.textContent))
    .toEqual(['Edit optical train', 'Archive', 'Delete permanently']);

  fireEvent.click(remove());
  await waitFor(() => expect(remove()).toBeEnabled());
  expect(deleteVersions).toEqual([]);
  expect(confirm).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'delete', itemList: [record.name] }));

  fireEvent.click(remove());
  const warning = await screen.findByRole('alert');
  expect(warning).toHaveTextContent('stale-delete');
  expect(screen.getByRole('heading', { name: record.name })).toBeVisible();
  fireEvent.click(within(warning).getByRole('button', { name: 'Retry' }));
  await screen.findByRole('button', { name: 'Delete permanently' });
  expect(deleteVersions).toEqual([3]);

  fireEvent.click(remove());
  expect(await screen.findByRole('button', { name: 'Create optical train' })).toBeVisible();
  await waitFor(() => expect(screen.queryByRole('button', { name: /^Wide field/ })).not.toBeInTheDocument());
  expect(deleteVersions).toEqual([3, 4]);
});

test('inner tabs support manual keyboard activation and train draft editor can open without equipment', async () => {
  mount();
  await enter();
  const devices = screen.getByRole('tab', { name: 'My Equipment' });
  const trains = screen.getByRole('tab', { name: 'Optical Trains' });
  fireEvent.keyDown(devices, { key: 'ArrowRight' });
  expect(trains).toHaveFocus();
  expect(devices).toHaveAttribute('aria-selected', 'true');
  fireEvent.click(trains);
  fireEvent.click(await screen.findByRole('button', { name: 'Create optical train' }));
  expect(await screen.findByLabelText('Imaging camera')).toBeVisible();
  expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
  expect(screen.queryByRole('button', { name: 'Publish revision' })).not.toBeInTheDocument();
});

test('equipment and optical trains share the search toolbar with independent filters', async () => {
  const request = (route: string, params: Record<string, string>) => app.api.fetchApi.mock.calls.some(([path]) => {
    if (!path.startsWith(`/astrophoto/v1/${route}?`)) return false;
    const query = new URLSearchParams(path.split('?')[1]);
    return Object.entries(params).every(([key, value]) => query.get(key) === value);
  });
  mount();
  await enter();
  const filter = () => screen.getByRole('button', { name: 'Filter records' });
  fireEvent.click(filter());
  fireEvent.click(screen.getByRole('radio', { name: 'Camera' }));
  await waitFor(() => expect(request('equipment', { type: 'camera' })).toBe(true));
  fireEvent.keyDown(screen.getByRole('radio', { name: 'Camera' }), { key: 'Escape' });
  expect(filter()).toHaveFocus();
  const deviceSearch = screen.getByRole('searchbox');
  fireEvent.change(deviceSearch, { target: { value: 'camera model' } });
  await waitFor(() => expect(request('equipment', { type: 'camera', q: 'camera model' })).toBe(true));

  fireEvent.click(screen.getByRole('tab', { name: 'Optical Trains' }));
  const trains = within(await screen.findByRole('tabpanel', { name: 'Optical Trains' }));
  fireEvent.click(trains.getByRole('button', { name: 'Filter records' }));
  expect(trains.getByRole('radio', { name: 'All active' })).toBeChecked();
  fireEvent.click(trains.getByRole('radio', { name: 'Draft' }));
  await waitFor(() => expect(request('optical-trains', { status: 'draft' })).toBe(true));
  fireEvent.click(screen.getByRole('tab', { name: 'My Equipment' }));
  const devices = within(await screen.findByRole('tabpanel', { name: 'My Equipment' }));
  expect(devices.getByRole('searchbox')).toHaveValue('camera model');
  fireEvent.click(await devices.findByRole('button', { name: 'Clear search and filters' }));
  expect(devices.getByRole('searchbox')).toHaveValue('');
  expect(await devices.findByText(/No equipment yet/)).toBeVisible();
});

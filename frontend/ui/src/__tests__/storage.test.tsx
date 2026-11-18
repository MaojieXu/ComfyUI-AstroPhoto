import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { App } from '../app/App';
import { i18n } from '../i18n';
import { app } from './hostMock';
import { definitions, status } from './fixtures';

const workspace = { id: 'ws', name: 'Local', root_path: 'C:/data/workspace', status: 'online', enabled: true,
  revision: 0, is_default: true, free_bytes: 100 };
const snapshot = () => ({
  status: 'ready', data_root: { path: 'C:/data', source: 'default' }, database: { assets: 'ready' },
  imports: { default_mode: 'reference', revision: 1 }, default_workspace_id: 'ws', workspaces: [workspace],
  cache: { path: 'C:/data/cache', max_size_gb: 20, used_bytes: 0, status: 'online' },
  capabilities: { write: true, import: true }, operations: [],
});
const response = (document: object, code = 200) => ({ ok: code < 400, status: code, json: async () => document });
const mount = () => render(<I18nextProvider i18n={i18n}><App /></I18nextProvider>);

function openStorage() {
  fireEvent.click(screen.getByRole('tab', { name: 'Settings' }));
  fireEvent.click(screen.getByText('Storage', { exact: true }));
}

test('only the accepted server settings change the selected mode', async () => {
  const current = snapshot();
  let reject = true;
  app.api.fetchApi.mockImplementation(async (path, init) => {
    if (path === '/object_info') return response(definitions);
    if (path.endsWith('/status')) return response(status);
    if (path.endsWith('/settings')) {
      expect(init.method).toBe('PATCH');
      expect(init.headers['X-AstroPhoto-Local']).toBe('1');
      expect(JSON.parse(init.body)).toEqual({ expected_revision: 1, imports: { default_mode: 'copy' } });
      if (reject) return response({ error: { code: 'REVISION_CONFLICT' } }, 409);
      current.imports.default_mode = 'copy';
      return response({ request_id: 'changed' });
    }
    if (path.endsWith('/storage')) return response(current);
    return response({ assets: [], next: null });
  });
  mount();
  openStorage();
  const reference = await screen.findByRole('radio', { name: /Index in database only/ });
  const copy = screen.getByRole('radio', { name: /Copy into managed workspace/ });
  expect(reference).toBeChecked();
  fireEvent.click(copy);
  await screen.findByText('REVISION_CONFLICT');
  expect(reference).toBeChecked();
  reject = false;
  fireEvent.click(copy);
  await waitFor(() => expect(copy).toBeChecked());
  expect(app.api.fetchApi.mock.calls.some(([path]) => path.endsWith('/import'))).toBe(false);
});

test('migration displays a backend receipt and a refreshed workspace path', async () => {
  const current = snapshot();
  Object.defineProperty(crypto, 'randomUUID', { configurable: true, value: () => 'idempotency-key' });
  const calls: string[] = [];
  app.api.fetchApi.mockImplementation(async (path) => {
    calls.push(path);
    if (path === '/object_info') return response(definitions);
    if (path.endsWith('/status')) return response(status);
    if (path.endsWith('/migrations')) return response({ operation_id: 'job', request_id: 'accepted' }, 202);
    if (path.endsWith('/migrations/job')) {
      current.workspaces = [{ ...workspace, root_path: 'D:/new' }];
      return response({ operation_id: 'job', kind: 'migration', phase: 'completed', effective_import_mode: null,
        receipt: { processed: 1, total: 1, verification: 'sha256' }, error: null });
    }
    if (path.endsWith('/storage')) return response(current);
    return response({ assets: [], next: null });
  });
  mount();
  openStorage();
  const more = await screen.findByRole('button', { name: 'Actions for Local' });
  expect(screen.queryByRole('button', { name: 'Migrate workspace' })).not.toBeInTheDocument();
  fireEvent.click(more);
  const migrate = screen.getByRole('button', { name: 'Migrate workspace' });
  expect(screen.getByRole('button', { name: 'Remove' })).toBeDisabled();
  fireEvent.keyDown(migrate, { key: 'Escape' });
  expect(more).toHaveFocus();
  fireEvent.click(more);
  app.extensionManager.dialog.prompt.mockResolvedValueOnce(null).mockResolvedValueOnce(' D:/new ');
  fireEvent.click(migrate);
  await waitFor(() => expect(app.extensionManager.dialog.prompt).toHaveBeenCalledTimes(1));
  expect(calls.some(path => path.endsWith('/migrations'))).toBe(false);
  fireEvent.click(migrate);
  expect(app.extensionManager.dialog.prompt).toHaveBeenLastCalledWith(expect.objectContaining({
    title: 'Migrate workspace', message: 'Absolute path on the ComfyUI server',
  }));
  const progress = await screen.findByRole('region', { name: 'Storage operation' });
  expect(await within(progress).findByText('Verification sha256')).toBeVisible();
  expect(await screen.findByText('D:/new')).toBeVisible();
  expect(calls.some(path => path.endsWith('/migrations/job'))).toBe(true);
});

test('clears the active cache only after host confirmation, then shows the server receipt', async () => {
  const clear = jest.fn(() => response({ request_id: 'cleared', removed: 1, removed_bytes: 12, skipped: 2, failed: 0 }));
  app.api.fetchApi.mockImplementation(async path => {
    if (path === '/object_info') return response(definitions);
    if (path.endsWith('/status')) return response(status);
    if (path.endsWith('/storage')) return response(snapshot());
    if (path.endsWith('/storage/cache/clear')) return clear();
    return response({ assets: [], next: null });
  });
  app.extensionManager.dialog.confirm.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
  mount();
  openStorage();
  const button = await screen.findByRole('button', { name: 'Clear cache' });
  fireEvent.click(button);
  await waitFor(() => expect(app.extensionManager.dialog.confirm).toHaveBeenCalledWith(expect.objectContaining({ itemList: ['C:/data/cache'] })));
  expect(clear).not.toHaveBeenCalled();
  fireEvent.click(button);
  expect(await screen.findByText('Removed 1 (12 B). Skipped 2. Failed 0.')).toBeVisible();
  expect(clear).toHaveBeenCalledTimes(1);
});


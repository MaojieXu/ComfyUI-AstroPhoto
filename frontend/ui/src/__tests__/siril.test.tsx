import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { SIRIL, type SoftwareStatus } from '../api/siril';
import { SoftwarePage } from '../features/settings/SoftwarePage';
import { Inspector } from '../features/siril/Inspector';
import { i18n } from '../i18n';
import { app } from './hostMock';

test('manual verification preserves the active configuration on version mismatch', async () => {
  const base = { os: 'Windows', target_version: '1.4.5', enabled: true };
  const ready = {
    ...base, state: 'ready', path: 'C:\\Siril\\siril-cli.exe', version: '1.4.5', verified_at: '2026-10-29T01:00:00Z'
  } satisfies SoftwareStatus;
  const incompatiblePath = 'C:\\old\\siril-cli.exe';
  let configured: SoftwareStatus = { ...base, state: 'SIRIL_NOT_CONFIGURED' };
  app.api.fetchApi.mockImplementation(async (url: string, options: RequestInit) => {
    if (url === SIRIL && options.method === 'GET') {
      return { ok: true, json: async () => configured };
    }
    if (url === SIRIL && options.method === 'PUT' && typeof options.body === 'string') {
      const { path } = JSON.parse(options.body) as { path: string };
      if (path === incompatiblePath) {
        return {
          ok: false, status: 422,
          json: async () => ({ error: { code: 'SIRIL_VERSION_MISMATCH', details: { detected: '1.4.4', expected: '1.4.5' } } })
        };
      }
      if (path === ready.path) {
        configured = ready;
        return { ok: true, json: async () => configured };
      }
    }
    throw new Error('Unexpected Siril API request');
  });
  render(<I18nextProvider i18n={i18n}><SoftwarePage /></I18nextProvider>);
  await screen.findByText('Siril has not been configured.');
  fireEvent.click(screen.getByRole('button', { name: /^Siril\b/ }));
  await screen.findByText('Siril has not been configured.', { selector: '[role="status"]' });
  const input = screen.getByLabelText('Siril CLI executable path');
  fireEvent.change(input, { target: { value: ready.path } });
  fireEvent.click(screen.getByRole('button', { name: 'Verify and save' }));
  expect(await screen.findByText(ready.path, { selector: 'dd' })).toBeVisible();
  fireEvent.change(input, { target: { value: incompatiblePath } });
  fireEvent.click(screen.getByRole('button', { name: 'Verify and save' }));
  const alert = await screen.findByRole('alert');
  expect(alert).toHaveTextContent('requires Siril 1.4.5');
  expect(alert).toHaveTextContent('1.4.4');
  expect(screen.getByText(ready.path, { selector: 'dd' })).toBeVisible();

  fireEvent.click(screen.getByRole('button', { name: /Back/ }));
  fireEvent.click(screen.getByRole('button', { name: /^Siril\b/ }));
  expect(await screen.findByText(ready.path, { selector: 'dd' })).toBeVisible();
});

test('Inspector shows three views, keyboard wipe, and read-only values', () => {
  const preview = { state: 'ready', before: 'blob:before', after: 'blob:after', aligned: true, channels: 3 };
  const renderInspector = (aligned: boolean) => <I18nextProvider i18n={i18n}>
    <Inspector preview={{ ...preview, aligned }} title="AutoStretch"
      details={[{ label: 'Shadows clip', value: '-2.8 σ' }]} status="Candidate" onClose={() => {}} />
  </I18nextProvider>;
  const view = render(renderInspector(true));
  expect(screen.getByRole('button', { name: 'Side by side' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getAllByRole('img')).toHaveLength(2);
  fireEvent.click(screen.getByRole('button', { name: 'Sliding divider' }));
  const divider = screen.getByRole('slider');
  fireEvent.keyDown(divider, { key: 'ArrowRight' });
  expect(divider).toHaveAttribute('aria-valuenow', '52');
  expect(screen.getByText('-2.8 σ')).toBeVisible();
  expect(screen.queryByRole('spinbutton')).toBeNull();
  view.rerender(renderInspector(false));
  expect(screen.getByRole('button', { name: 'Sliding divider' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Single image' }));
  expect(screen.getAllByRole('img')).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', { name: 'Before' }));
  expect(screen.getByRole('img')).toHaveAttribute('src', 'blob:before');
});


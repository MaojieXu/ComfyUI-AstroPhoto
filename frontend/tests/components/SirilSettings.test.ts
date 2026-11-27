import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { expect, test, vi } from 'vitest';
import { SirilSettings } from '../../../extension/siril/frontend/SirilSettings';
import en from '../../../extension/siril/frontend/locales/en/siril.json';

const mocks = vi.hoisted(() => ({ get: vi.fn(), discover: vi.fn(), save: vi.fn(), clear: vi.fn(), picker: vi.fn() }));
vi.mock('../../../extension/siril/frontend/api', () => ({
  getSiril: mocks.get, discoverSiril: mocks.discover, saveSiril: mocks.save, clearSiril: mocks.clear,
  setSirilEnabled: vi.fn(),
}));
vi.mock('../../src/api/nativePicker', () => ({ nativePicker: mocks.picker }));
const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: { siril: en,
  software: { noCandidates: 'No candidates' }, actions: { refresh: 'Refresh' }, states: { loading: 'Loading' } } } });
const unconfigured = { os: 'Windows', target_version: '1.4.5', state: 'SIRIL_NOT_CONFIGURED', enabled: false };
const ready = { ...unconfigured, state: 'ready', enabled: true, path: 'C:\\Siril\\siril-cli.exe', version: '1.4.5', verified_at: '2026-11-27T00:00:00Z' };

test('connects a unique valid candidate automatically and ignores the GUI program', async () => {
  mocks.get.mockResolvedValue(unconfigured);
  mocks.discover.mockResolvedValue([{ path: ready.path, state: 'ready', version: ready.version },
    { path: 'C:\\Siril\\siril.exe', state: 'SIRIL_GUI_ONLY' }]);
  mocks.save.mockResolvedValue(ready);
  const view = mount(SirilSettings, { global: { plugins: [i18n] } });
  await vi.waitFor(() => expect(view.text()).toContain('Siril has not been configured'));
  expect(view.text()).not.toContain('Siril commands');
  await view.findAll('button').find(b => b.text() === 'Detect and connect Siril')!.trigger('click');
  await vi.waitFor(() => expect(view.text()).toContain('Change program'));
  expect(mocks.save).toHaveBeenCalledWith(ready.path, expect.any(AbortSignal));
  expect(view.find('form').exists()).toBe(false);
  expect(view.text()).not.toContain('siril.exe');
  view.unmount();
});

test('keeps the manually entered path when the file picker is unavailable', async () => {
  mocks.get.mockResolvedValue(unconfigured);
  mocks.picker.mockResolvedValue({ status: 'unavailable', path: null });
  const view = mount(SirilSettings, { global: { plugins: [i18n] } });
  await vi.waitFor(() => expect(view.findAll('button').some(b => b.text() === 'Choose program manually')).toBe(true));
  await view.findAll('button').find(b => b.text() === 'Choose program manually')!.trigger('click');
  await vi.waitFor(() => expect(view.find('input').exists()).toBe(true));
  await view.get('input').setValue('D:\\Siril\\siril-cli.exe');
  await view.findAll('button').find(b => b.text() === 'Browse')!.trigger('click');
  await vi.waitFor(() => expect(view.text()).toContain('Enter the path manually'));
  expect((view.get('input').element as HTMLInputElement).value).toBe('D:\\Siril\\siril-cli.exe');
  view.unmount();
});


test('failed replacement preserves the saved configuration and the entered draft', async () => {
  mocks.get.mockResolvedValue(ready);
  mocks.save.mockRejectedValueOnce(new Error('offline'));
  const view = mount(SirilSettings, { global: { plugins: [i18n] } });
  await vi.waitFor(() => expect(view.text()).toContain('Change program'));
  await view.findAll('button').find(b => b.text() === 'Change program')!.trigger('click');
  await view.findAll('button').find(b => b.text() === 'Choose program manually')!.trigger('click');
  expect((view.get('input').element as HTMLInputElement).value).toBe(ready.path);
  await view.get('input').setValue('D:\\missing\\siril-cli.exe');
  await view.get('form').trigger('submit');
  await vi.waitFor(() => expect(view.find('[role=alert]').exists()).toBe(true));
  expect((view.get('input').element as HTMLInputElement).value).toBe('D:\\missing\\siril-cli.exe');
  expect(view.text()).toContain(ready.path);
  view.unmount();
});

test('does not guess between multiple usable installations', async () => {
  mocks.get.mockResolvedValue(unconfigured);
  mocks.save.mockClear();
  mocks.discover.mockResolvedValue([{ path: ready.path, state: 'ready', version: ready.version },
    { path: 'D:\\Siril\\siril-cli.exe', state: 'ready', version: ready.version }]);
  mocks.save.mockResolvedValue(ready);
  const view = mount(SirilSettings, { global: { plugins: [i18n] } });
  await vi.waitFor(() => expect(view.text()).toContain('Siril has not been configured'));
  await view.findAll('button').find(b => b.text() === 'Detect and connect Siril')!.trigger('click');
  await vi.waitFor(() => expect(view.text()).toContain('Multiple usable Siril'));
  expect(view.text()).toContain('Available');
  expect(view.text()).not.toContain('Siril connected');
  expect(mocks.save).not.toHaveBeenCalled();
  await view.findAll('button').find(b => b.text() === 'Connect')!.trigger('click');
  await vi.waitFor(() => expect(mocks.save).toHaveBeenCalledWith(ready.path, expect.any(AbortSignal)));
  view.unmount();
});

test('shows manual entry when no usable installation is found', async () => {
  mocks.get.mockResolvedValue(unconfigured);
  mocks.save.mockClear();
  mocks.discover.mockResolvedValue([{ path: 'C:\\Siril\\siril.exe', state: 'SIRIL_GUI_ONLY' }]);
  const view = mount(SirilSettings, { global: { plugins: [i18n] } });
  await vi.waitFor(() => expect(view.text()).toContain('Siril has not been configured'));
  await view.findAll('button').find(b => b.text() === 'Detect and connect Siril')!.trigger('click');
  await vi.waitFor(() => expect(view.text()).toContain('No usable Siril found'));
  expect(view.find('input').exists()).toBe(true);
  expect(mocks.save).not.toHaveBeenCalled();
  view.unmount();
});

test('a failed automatic connection preserves the existing configuration and manual draft', async () => {
  mocks.get.mockResolvedValue(ready);
  mocks.discover.mockResolvedValue([{ path: 'E:\\Siril\\siril-cli.exe', state: 'ready', version: '1.4.5' }]);
  mocks.save.mockRejectedValueOnce(new Error('offline'));
  const view = mount(SirilSettings, { global: { plugins: [i18n] } });
  await vi.waitFor(() => expect(view.text()).toContain('Change program'));
  await view.findAll('button').find(b => b.text() === 'Change program')!.trigger('click');
  await view.findAll('button').find(b => b.text() === 'Choose program manually')!.trigger('click');
  await view.get('input').setValue('D:\\my-draft\\siril-cli.exe');
  await view.findAll('button').find(b => b.text() === 'Detect and connect Siril')!.trigger('click');
  await vi.waitFor(() => expect(view.find('[role=alert]').exists()).toBe(true));
  expect((view.get('input').element as HTMLInputElement).value).toBe('D:\\my-draft\\siril-cli.exe');
  expect(view.text()).toContain(ready.path);
  view.unmount();
});

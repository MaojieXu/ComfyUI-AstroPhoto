import { act, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { i18n, normalizeLocale } from '../i18n';
import en from '../i18n/locales/en/main.json';
import zh from '../i18n/locales/zh/main.json';
import { App } from '../app/App';
import { app, preferences } from './hostMock';
import { watchLocale, synchronizeLocale } from '../host/locale';
function keys(value: object, prefix = ''): string[] { return Object.entries(value).flatMap(([key, v]) => typeof v === 'object' ? keys(v, prefix + key + '.') : [prefix + key]).sort(); }
test('all translation keys match', () => expect(keys(en)).toEqual(keys(zh)));
test.each([['zh-CN', 'zh'], ['zh-Hans', 'zh'], ['en-US', 'en'], ['fr', 'en'], [undefined, 'en']])('normalizes %s', (input, expected) => expect(normalizeLocale(input)).toBe(expected));
test('follows host locale even when an old extension preference exists', async () => {
  const container = document.createElement('div'); document.body.appendChild(container);
  const stop = watchLocale(container);
  const view = render(<I18nextProvider i18n={i18n}><App /></I18nextProvider>, { container });
  preferences['AstroPhoto.UI.Language'] = 'zh';
  expect(preferences['AstroPhoto.UI.Language']).toBe('zh');
  preferences['Comfy.Locale'] = 'en'; act(synchronizeLocale);
  await waitFor(() => expect(screen.getByRole('tab', { name: 'Settings' })).toBeVisible());
  preferences['Comfy.Locale'] = 'zh-CN'; act(synchronizeLocale);
  await waitFor(() => expect(screen.getByRole('tab', { name: '设置' })).toBeVisible());
  expect(app.extensionManager.setting.set).not.toHaveBeenCalled();
  stop(); view.unmount(); container.remove();
});

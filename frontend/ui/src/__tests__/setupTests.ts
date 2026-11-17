import '@testing-library/jest-dom';
import { app, preferences, tabs } from './hostMock';
import { definitions, status } from './fixtures';
import { i18n } from '../i18n';
beforeEach(() => {
  preferences['Comfy.Locale'] = 'en'; preferences['AstroPhoto.UI.Language'] = 'auto'; tabs.length = 0;
  void i18n.changeLanguage('en');
  app.api.fetchApi.mockImplementation(async (path: string) => ({ ok: true, json: async () => path === '/object_info' ? definitions : status }));
});

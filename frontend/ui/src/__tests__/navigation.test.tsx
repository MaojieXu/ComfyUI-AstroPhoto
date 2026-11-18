import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { App } from '../app/App';
import { i18n } from '../i18n';
import { modules } from '../features/settings/moduleRegistry';
import { app } from './hostMock';
import { definitions, status } from './fixtures';
const mount = () => render(<I18nextProvider i18n={i18n}><App /></I18nextProvider>);
const openAssets = async () => fireEvent.click(await screen.findByRole('button', { name: 'Assets' }));
beforeEach(() => {
  const source = { ...definitions['vue-basic'], name: 'AstroPhotoFITSSource', display_name: 'AstroPhoto Load Image', category: 'AstroPhoto/Assets' };
  app.api.fetchApi.mockImplementation(async (path: string) => ({ ok: true, json: async () => path === '/object_info'
    ? { ...definitions, AstroPhotoFITSSource: source } : status }));
});
test('assets is default and the tablist separates keyboard focus from selection', async () => {
  mount(); await screen.findByText('The backend reports that asset management is unavailable.');
  const assets = screen.getByRole('tab', { name: 'Assets' });
  const settings = screen.getByRole('tab', { name: 'Settings' });
  expect(assets).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('button', { name: 'Import capture directory' })).toBeDisabled();
  fireEvent.keyDown(assets, { key: 'ArrowRight' });
  expect(settings).toHaveFocus();
  expect(assets).toHaveAttribute('aria-selected', 'true');
  expect(settings).toHaveAttribute('aria-selected', 'false');
  fireEvent.click(settings);
  expect(settings).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('tabpanel')).toHaveAccessibleName('Settings');
  expect(screen.getByRole('button', { name: /^Storage/ })).toBeVisible();
  expect(screen.queryByRole('button', { name: /^General/ })).not.toBeInTheDocument();
  expect(screen.queryByText(/M31/)).toBeNull();
});
test('real node catalog, details, category and query survive switching views', async () => {
  mount(); fireEvent.click(screen.getByRole('tab', { name: 'Nodes' }));
  await openAssets();
  await screen.findByText('AstroPhoto Load Image'); expect(screen.queryByText('Fake')).toBeNull();
  expect(screen.queryByText('Vue Basic')).toBeNull();
  const search = screen.getByRole('searchbox'); fireEvent.change(search, { target: { value: '画板' } });
  await waitFor(() => expect(screen.getByText('AstroPhoto Load Image')).toBeVisible());
  fireEvent.click(screen.getByText('AstroPhoto Load Image')); expect(screen.getByText('CUSTOM_VUE_COMPONENT_BASIC')).toBeVisible();
  fireEvent.click(screen.getByRole('tab', { name: 'Assets' }));
  fireEvent.click(screen.getByRole('tab', { name: 'Nodes' }));
  expect(search).toHaveValue('画板'); expect(screen.getByText('CUSTOM_VUE_COMPONENT_BASIC')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: '← Back' }));
  expect(screen.getByText('AstroPhoto Load Image')).toBeVisible();
});
test.each(modules)('settings module %s opens and returns without fake actions', async id => {
  const title = i18n.t(`modules.${id}.title`);
  mount(); fireEvent.click(screen.getByRole('tab', { name: 'Settings' }));
  await waitFor(() => expect(screen.getByText('Partially implemented')).toBeVisible());
  fireEvent.click(screen.getByText(title));
  expect(screen.getByRole('heading', { name: title })).toBeVisible();
  expect(screen.queryByRole('button', { name: 'Save' })).toBeNull();
  if (id === 'system') expect(screen.getByText('0.0.1')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: '← Back' }));
  expect(within(screen.getByRole('tabpanel')).getByText(title)).toBeVisible();
});
test('node HTTP error is not an empty catalog and retry recovers', async () => {
  app.api.fetchApi.mockResolvedValueOnce({ ok: false, status: 500 });
  mount(); fireEvent.click(screen.getByRole('tab', { name: 'Nodes' }));
  expect(await screen.findByText('Request failed (HTTP 500).')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
  await openAssets();
  expect(await screen.findByText('AstroPhoto Load Image')).toBeVisible();
});
test('header refresh reloads asset service status or the node catalog for the active tab', async () => {
  mount();
  const header = within(screen.getByRole('banner'));
  const requestCount = (url: string) => app.api.fetchApi.mock.calls.filter(([path]) => path === url).length;
  const statusPath = '/astrophoto/v1/status';
  const nodesPath = '/object_info';
  const statusBefore = requestCount(statusPath);
  const nodesBefore = requestCount(nodesPath);

  fireEvent.click(header.getByRole('button', { name: 'Refresh asset service status' }));
  expect(await screen.findByText('The backend reports that asset management is unavailable.')).toBeVisible();
  expect(requestCount(statusPath)).toBe(statusBefore + 1);
  expect(requestCount(nodesPath)).toBe(nodesBefore);

  fireEvent.click(screen.getByRole('tab', { name: 'Nodes' }));
  await openAssets();
  await screen.findByText('AstroPhoto Load Image');
  fireEvent.click(header.getByRole('button', { name: 'Refresh node definitions' }));
  expect(await screen.findByText('AstroPhoto Load Image')).toBeVisible();
  expect(requestCount(nodesPath)).toBe(nodesBefore + 1);
  expect(requestCount(statusPath)).toBe(statusBefore + 1);

  fireEvent.click(screen.getByRole('tab', { name: 'Settings' }));
  expect(header.queryByRole('button')).not.toBeInTheDocument();
});

afterEach(() => {
  localStorage.removeItem('AstroPhoto.Nodes.Sort');
  localStorage.removeItem('AstroPhoto.Assets.Sort');
});

test('nested node folders expand independently and respect category filters, sorting, and search', async () => {
  const example = definitions['vue-basic'];
  app.api.fetchApi.mockResolvedValueOnce({ ok: true, json: async () => ({
    Zulu: { ...example, name: 'Zulu', display_name: 'Zulu', category: 'processing//drawing' },
    Alpha: { ...example, name: 'Alpha', display_name: 'Alpha', category: 'processing//drawing' },
    Beta: { ...example, name: 'Beta', display_name: 'Beta', category: 'calibration' }
  }) });
  mount();
  fireEvent.click(screen.getByRole('tab', { name: 'Nodes' }));
  const panel = within(screen.getByRole('tabpanel', { name: 'Nodes' }));
  const examples = await panel.findByRole('button', { name: 'processing' });
  expect(examples).toHaveAttribute('aria-expanded', 'false');
  expect(panel.queryByRole('button', { name: 'drawing' })).not.toBeInTheDocument();
  fireEvent.keyDown(examples, { key: 'ArrowRight' });
  const drawing = panel.getByRole('button', { name: 'drawing' });
  expect(drawing).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(drawing);
  fireEvent.click(panel.getByRole('button', { name: 'calibration' }));
  const names = () => panel.getAllByRole('button', { name: /^(Zulu|Alpha|Beta)/ })
    .map(button => button.textContent);
  expect(names()).toEqual(['Zulu', 'Alpha', 'Beta']);

  const filter = panel.getByRole('button', { name: 'Filter categories' });
  fireEvent.click(filter);
  const category = panel.getByRole('checkbox', { name: 'processing / drawing' });
  fireEvent.click(category);
  expect(names()).toEqual(['Zulu', 'Alpha']);
  fireEvent.keyDown(category, { key: 'Escape' });
  expect(filter).toHaveFocus();
  expect(filter).toHaveAttribute('aria-expanded', 'false');

  fireEvent.click(panel.getByRole('button', { name: 'Sort' }));
  fireEvent.click(panel.getByRole('radio', { name: 'Alphabetical' }));
  expect(names()).toEqual(['Alpha', 'Zulu']);

  fireEvent.keyDown(drawing, { key: 'ArrowLeft' });
  expect(panel.queryByRole('button', { name: 'Zulu' })).not.toBeInTheDocument();
  fireEvent.change(panel.getByRole('searchbox'), { target: { value: 'Zulu' } });
  expect(await panel.findByRole('button', { name: 'Zulu' })).toBeVisible();
  expect(panel.queryByRole('button', { name: 'Alpha' })).not.toBeInTheDocument();
  fireEvent.change(panel.getByRole('searchbox'), { target: { value: '' } });
  await waitFor(() => expect(drawing).toHaveAttribute('aria-expanded', 'false'));
});

test('asset filters and sorting preferences remain selectable while the service is unavailable', async () => {
  const view = mount();
  expect(await screen.findByText('The backend reports that asset management is unavailable.')).toBeVisible();
  const filter = screen.getByRole('button', { name: 'Frame type' });
  fireEvent.click(filter);
  const flat = screen.getByRole('radio', { name: 'Flat' });
  fireEvent.click(flat);
  expect(flat).toBeChecked();
  fireEvent.keyDown(flat, { key: 'Escape' });

  fireEvent.click(screen.getByRole('button', { name: 'Sort' }));
  fireEvent.click(screen.getByRole('radio', { name: 'Oldest first' }));
  view.unmount();

  mount();
  expect(await screen.findByText('The backend reports that asset management is unavailable.')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Sort' }));
  expect(screen.getByRole('radio', { name: 'Oldest first' })).toBeChecked();
  expect(screen.getByRole('button', { name: 'Import capture directory' })).toBeDisabled();
});

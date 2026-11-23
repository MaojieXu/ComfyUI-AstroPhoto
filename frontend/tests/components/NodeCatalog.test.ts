import { mount } from '@vue/test-utils';
import { afterEach, expect, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import type { NodeCard } from '../../src/api/nodes';
import { DRAG_MIME } from '../../src/host/dragDrop';
import { NodesPage } from '../../src/features/nodes/NodesPage';
import { createFrontendI18n } from '../../src/i18n';
import { app, settings } from '../host';

// Supplement to CASE-02 (02-A/02-B): the React migration moved the node catalog
// into Vue but left the host bookmark setting, sort preference, category filter
// and canvas drop wiring without a component-level regression test.

const sortKey = 'AstroPhoto.Nodes.Sort';
const bookmarkKey = 'Comfy.NodeLibrary.Bookmarks.V2';
const alpha: NodeCard = {
  id: 'AlphaNode', title: 'Alpha', description: 'first frame', category: 'AstroPhoto/Science',
  aliases: [], inputs: [['image_path', 'IMAGE_PATH']], outputs: [['image_path', 'IMAGE_PATH']],
};
const beta: NodeCard = {
  id: 'BetaNode', title: 'Beta', description: 'second frame', category: 'AstroPhoto/Science',
  aliases: [], inputs: [], outputs: [['image_path', 'IMAGE_PATH']],
};

function mountCatalog(data: NodeCard[] = [beta, alpha]) {
  const element = document.createElement('div');
  element.className = 'astrophoto-ui';
  document.body.append(element);
  const wrapper = mount(NodesPage, {
    attachTo: element,
    props: { active: true, resource: { state: 'ready' as const, data }, refresh: () => {} },
    global: { plugins: [createFrontendI18n()] },
  });
  return { wrapper, element };
}

function rows(element: HTMLElement) {
  return [...element.querySelectorAll<HTMLButtonElement>('.ap-resource')].map(row => row.textContent?.trim());
}

function bookmarkButton(element: HTMLElement, title: string) {
  const leaf = [...element.querySelectorAll<HTMLElement>('.ap-tree-leaf')]
    .find(entry => entry.querySelector('.ap-resource')?.textContent?.trim() === title);
  if (!leaf) throw new Error(`missing row ${title}`);
  return leaf.querySelector<HTMLButtonElement>('.ap-tree-bookmark')!;
}

function bookmarkHost(initial: string[]) {
  let stored = initial;
  settings.set(bookmarkKey, initial);
  app.api.fetchApi.mockImplementation(async () => Response.json(stored));
  app.api.storeSetting.mockImplementation(async (_key, next: string[]) => {
    stored = next;
    return new Response(null, { status: 200 });
  });
}

// The tree only expands folders while a search is active, so every catalog case
// searches for a term shared by the fixtures before reading rendered rows.
async function search(element: HTMLElement, term: string) {
  const input = element.querySelector<HTMLInputElement>('input[type="search"]')!;
  input.value = term;
  input.dispatchEvent(new InputEvent('input', { bubbles: true }));
  await expect.poll(() => rows(element).length > 0).toBe(true);
}

afterEach(() => {
  localStorage.removeItem(sortKey);
  delete (app as unknown as Record<string, unknown>).canvas;
  delete (app as unknown as Record<string, unknown>).isGraphReady;
  delete (app as unknown as Record<string, unknown>).clientPosToCanvasPos;
  delete (window as unknown as Record<string, unknown>).LiteGraph;
});

test('02-A: the sort preference is stored locally and reorders the rendered tree', async () => {
  localStorage.removeItem(sortKey);
  const first = mountCatalog();
  await search(first.element, 'a');
  expect(rows(first.element)).toEqual(['Beta', 'Alpha']);

  await page.getByRole('button', { name: 'Sort', exact: true }).click();
  const menu = page.getByRole('radiogroup', { name: 'Sort' });
  await expect.element(page.getByRole('radio', { name: 'Original order' })).toBeChecked();
  await menu.getByText('Alphabetical', { exact: true }).click();
  await expect.poll(() => rows(first.element)).toEqual(['Alpha', 'Beta']);
  expect(localStorage.getItem(sortKey)).toBe('alphabetical');
  first.wrapper.unmount();

  const second = mountCatalog();
  await search(second.element, 'a');
  expect(rows(second.element)).toEqual(['Alpha', 'Beta']);
});

test('CASE-02/04: equally named nodes retain their identities and descriptions render as text', async () => {
  const text = '<em data-test-description>Image metadata</em>';
  const { wrapper, element } = mountCatalog([
    { ...alpha, title: 'Shared name', category: 'AstroPhoto/Science/Deep', description: text },
    { ...beta, title: 'Shared name', category: '', description: '' },
  ]);
  await search(element, 'Shared name');
  await expect.poll(() => rows(element)).toEqual(['Shared name', 'Shared name']);
  const row = (index: number) => wrapper.findAll('.ap-resource')[index];
  await row(0).trigger('click');
  expect(wrapper.get('code').text()).toBe(alpha.id);
  expect(wrapper.text()).toContain(text);
  expect(wrapper.find('[data-test-description]').exists()).toBe(false);
  await wrapper.get('.ap-scroll:not([hidden]) button').trigger('click');
  await row(1).trigger('click');
  expect(wrapper.get('code').text()).toBe(beta.id);
  expect(wrapper.text()).toContain('No description provided by this node.');
});

test('02-A: bookmarking writes the host setting and a rejected write keeps the stored value', async () => {
  bookmarkHost([]);
  const { element } = mountCatalog();
  await search(element, 'a');

  bookmarkButton(element, 'Alpha').click();
  await expect.poll(() => settings.get(bookmarkKey)).toEqual(['AlphaNode']);
  await expect.element(page.getByText('No bookmarked nodes', { exact: true })).not.toBeInTheDocument();
  expect(rows(element)).toEqual(['Alpha', 'Beta', 'Alpha']);
  expect(bookmarkButton(element, 'Alpha').getAttribute('aria-pressed')).toBe('true');

  bookmarkButton(element, 'Alpha').click();
  await expect.poll(() => settings.get(bookmarkKey)).toEqual([]);
  await expect.element(page.getByText('No bookmarked nodes', { exact: true })).toBeInTheDocument();
  expect(rows(element)).toEqual(['Beta', 'Alpha']);

  app.api.storeSetting.mockResolvedValueOnce(new Response(null, { status: 403 }));
  bookmarkButton(element, 'Alpha').click();
  await expect.element(page.getByRole('alert')).toHaveTextContent('Could not save node bookmarks. Try again.');
  expect(settings.get(bookmarkKey)).toEqual([]);
  expect(bookmarkButton(element, 'Alpha').getAttribute('aria-pressed')).toBe('false');
  expect(rows(element)).toEqual(['Beta', 'Alpha']);
  bookmarkButton(element, 'Alpha').click();
  await expect.poll(() => settings.get(bookmarkKey)).toEqual(['AlphaNode']);
  await expect.element(page.getByRole('alert')).not.toBeInTheDocument();
});

test('02-A: a synchronous host setting rejection leaves the catalog unbookmarked and reports it', async () => {
  bookmarkHost([]);
  const { element } = mountCatalog();
  await search(element, 'a');
  app.api.storeSetting.mockImplementationOnce(() => {
    throw new Error('settings-unavailable');
  });

  bookmarkButton(element, 'Alpha').click();
  await expect.element(page.getByRole('alert')).toHaveTextContent('Could not save node bookmarks. Try again.');
  expect(settings.get(bookmarkKey)).toEqual([]);
  expect(bookmarkButton(element, 'Alpha').getAttribute('aria-pressed')).toBe('false');
  expect(rows(element)).toEqual(['Beta', 'Alpha']);
});

test('CASE-06: top-level and folder references are separate and a missing definition returns by ID', async () => {
  bookmarkHost(['AstroPhoto/AlphaNode', 'Favorites/AlphaNode', 'ForeignNode', 'Favorites/']);
  const { wrapper, element } = mountCatalog();
  await search(element, 'a');
  const buttons = () => [...element.querySelectorAll<HTMLButtonElement>('.ap-tree-bookmark')];
  const topShortcut = () => buttons().find(button => button.parentElement?.textContent?.trim() === 'Alpha' &&
    button.getAttribute('aria-pressed') === 'false')!;
  topShortcut().click();
  await expect.poll(() => settings.get(bookmarkKey)).toEqual([
    'AstroPhoto/AlphaNode', 'Favorites/AlphaNode', 'ForeignNode', 'Favorites/', 'AlphaNode',
  ]);
  await expect.poll(() => buttons().filter(button => button.getAttribute('aria-pressed') === 'true').length).toBe(4);
  const folder = [...element.querySelectorAll<HTMLButtonElement>('.ap-tree-folder')]
    .find(button => button.textContent?.trim() === 'AstroPhoto')!;
  folder.parentElement?.querySelector<HTMLButtonElement>('.ap-tree-bookmark')?.click();
  await expect.poll(() => settings.get(bookmarkKey)).toEqual(['Favorites/AlphaNode', 'ForeignNode', 'Favorites/', 'AlphaNode']);
  await wrapper.setProps({ resource: { state: 'ready', data: [beta] } });
  expect(rows(element)).toEqual(['Beta']);
  expect(settings.get(bookmarkKey)).toContain('Favorites/AlphaNode');
  await wrapper.setProps({ resource: { state: 'ready', data: [beta, alpha] } });
  expect(rows(element).filter(row => row === 'Alpha')).toHaveLength(3);
  expect(app.api.storeSetting).toHaveBeenCalledTimes(2);
  expect(app.extensionManager.setting.set).not.toHaveBeenCalled();
});

test('02-A: the category filter narrows the tree and the all-categories choice restores it', async () => {
  const optics: NodeCard = { ...beta, id: 'OpticsNode', title: 'Optics', category: 'AstroPhoto/Optics' };
  const { element } = mountCatalog([beta, alpha, optics]);
  await search(element, 'a');
  expect(new Set(rows(element))).toEqual(new Set(['Beta', 'Optics', 'Alpha']));

  await page.getByRole('button', { name: 'Filter categories', exact: true }).click();
  const group = page.getByRole('group', { name: 'Filter categories' });
  await expect.element(group.getByRole('checkbox', { name: 'All categories' })).toBeChecked();
  await group.getByText('Optics', { exact: true }).click();
  await expect.poll(() => rows(element)).toEqual(['Optics']);

  await group.getByText('Science', { exact: true }).click();
  await expect.poll(() => new Set(rows(element))).toEqual(new Set(['Optics', 'Beta', 'Alpha']));

  await group.getByText('Science', { exact: true }).click();
  await expect.poll(() => rows(element)).toEqual(['Optics']);

  await group.getByText('All categories', { exact: true }).click();
  await expect.poll(() => new Set(rows(element))).toEqual(new Set(['Beta', 'Optics', 'Alpha']));
});

function canvasFixture() {
  const graph = {
    beforeChange: () => {}, afterChange: () => {}, change: () => {},
    add(node: unknown) { (node as { graph: unknown }).graph = graph; return node; },
    remove: () => true,
  };
  const created: string[] = [];
  const surface = document.createElement('canvas');
  document.body.append(surface);
  Object.assign(app, {
    isGraphReady: true,
    clientPosToCanvasPos: () => [12, 34],
    canvas: {
      graph, canvas: surface, read_only: false, selectOnly: false, allow_interaction: true,
      ds: { visible_area: [0, 0, 100, 100] },
      emitBeforeChange: () => {}, emitAfterChange: () => {},
    },
  });
  (window as unknown as Record<string, unknown>).LiteGraph = {
    NODE_TITLE_HEIGHT: 30,
    registered_node_types: { AlphaNode: {}, BetaNode: {} },
    createNode: (id: string) => { created.push(id); return { pos: [0, 0], graph: null }; },
  };
  return { created, graph, surface, replaceSurface: (next: HTMLCanvasElement) => Object.assign(app.canvas, { canvas: next }) };
}

function dragPayload(element: HTMLElement) {
  const source = [...element.querySelectorAll('.ap-resource')].find(row => row.textContent?.trim() === 'Alpha')!;
  const data = new DataTransfer();
  source.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: data }));
  return data;
}

function drop(surface: HTMLElement, data: DataTransfer) {
  const rect = surface.getBoundingClientRect();
  const event = new DragEvent('drop', {
    bubbles: true, cancelable: true, dataTransfer: data,
    clientX: Math.ceil(rect.left), clientY: Math.ceil(rect.top),
  });
  surface.dispatchEvent(event);
  return event.defaultPrevented;
}

test('02-B: canvas drops accept owned node payloads, ignore foreign drags and detach on unmount', async () => {
  const { created, surface } = canvasFixture();
  const { wrapper, element } = mountCatalog();
  await search(element, 'a');

  const payload = dragPayload(element);
  expect(drop(surface, payload)).toBe(true);
  expect(created).toEqual(['AlphaNode']);
  await expect.element(page.getByText('Node created.', { exact: false })).toBeVisible();

  const foreign = new DataTransfer();
  foreign.setData('text/plain', 'AlphaNode');
  expect(drop(surface, foreign)).toBe(false);
  expect(created).toEqual(['AlphaNode']);

  const unknown = dragPayload(element);
  const original = JSON.parse(unknown.getData(DRAG_MIME));
  unknown.setData(DRAG_MIME, JSON.stringify({ ...original, nodeId: 'OtherNode' }));
  expect(drop(surface, unknown)).toBe(true);
  expect(created).toEqual(['AlphaNode']);
  await expect.element(page.getByRole('alert')).toBeVisible();

  wrapper.unmount();
  const afterUnmount = new DataTransfer();
  afterUnmount.setData(DRAG_MIME, JSON.stringify({ v: 1, kind: 'node', nodeId: 'AlphaNode' }));
  drop(surface, afterUnmount);
  expect(created).toEqual(['AlphaNode']);
});

test('02-B: the mounted catalog follows a replacement canvas and ignores the old element', async () => {
  const { created, surface, replaceSurface } = canvasFixture();
  const { wrapper, element } = mountCatalog();
  await search(element, 'a');
  const next = document.createElement('canvas');
  document.body.append(next);
  const stale = dragPayload(element);
  replaceSurface(next);
  expect(drop(next, stale)).toBe(false);
  const payload = dragPayload(element);

  expect(drop(surface, payload)).toBe(false);
  expect(drop(next, payload)).toBe(true);
  expect(created).toEqual(['AlphaNode']);
  wrapper.unmount();
  expect(drop(next, payload)).toBe(false);
});

test('CASE-07: an in-flight drag cannot survive a graph change, refresh or tab change', async () => {
  const { created, surface } = canvasFixture();
  const { wrapper, element } = mountCatalog();
  await search(element, 'a');
  const beforeGraphChange = dragPayload(element);
  surface.dispatchEvent(new CustomEvent('litegraph:set-graph'));
  expect(drop(surface, beforeGraphChange)).toBe(false);

  const beforeRefresh = dragPayload(element);
  await wrapper.setProps({ resource: { state: 'loading' } });
  expect(drop(surface, beforeRefresh)).toBe(false);
  await wrapper.setProps({ resource: { state: 'ready', data: [beta, alpha] } });
  const beforeNavigation = dragPayload(element);
  await wrapper.setProps({ active: false });
  await wrapper.setProps({ active: true });
  expect(drop(surface, beforeNavigation)).toBe(false);
  expect(created).toEqual([]);
});

test('02-C: the node detail adds through the host canvas and reports a rejected insertion', async () => {
  const { created, graph } = canvasFixture();
  const { element } = mountCatalog();
  await search(element, 'a');
  [...element.querySelectorAll<HTMLButtonElement>('.ap-resource')][0].click();
  await expect.element(page.getByRole('heading', { name: 'Beta', exact: true })).toBeVisible();
  expect(document.activeElement?.textContent).toContain('Back');
  await page.getByRole('button', { name: 'Add to canvas', exact: true }).click();
  expect(created).toEqual(['BetaNode']);
  await expect.element(page.getByText('Node created.', { exact: false })).toBeVisible();

  graph.add = () => null;
  await page.getByRole('button', { name: 'Add to canvas', exact: true }).click();
  expect(created).toEqual(['BetaNode', 'BetaNode']);
  await expect.element(page.getByRole('alert')).toBeVisible();
  await page.getByRole('button', { name: '← Back' }).click();
  expect(document.activeElement?.textContent?.trim()).toBe('Beta');
});


test('node canvas actions use host notifications when available', async () => {
  const toast = { success: vi.fn(), error: vi.fn() };
  Object.assign(app.extensionManager, { toast });
  try {
    const { graph } = canvasFixture();
    const { element } = mountCatalog();
    await search(element, 'a');
    [...element.querySelectorAll<HTMLButtonElement>('.ap-resource')][0].click();
    await page.getByRole('button', { name: 'Add to canvas', exact: true }).click();
    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Node created.'), expect.anything());
    graph.add = () => null;
    await page.getByRole('button', { name: 'Add to canvas', exact: true }).click();
    expect(toast.error).toHaveBeenCalled();
    await expect.element(page.getByRole('alert')).not.toBeInTheDocument();
  } finally { Reflect.deleteProperty(app.extensionManager, 'toast'); }
});

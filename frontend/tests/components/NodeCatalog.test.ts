import { mount } from '@vue/test-utils';
import { afterEach, expect, test } from 'vitest';
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

test('02-A: bookmarking writes the host setting and a rejected write keeps the stored value', async () => {
  settings.set(bookmarkKey, []);
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

  app.extensionManager.setting.set.mockImplementationOnce(async () => {
    throw new Error('settings-write-denied');
  });
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
  settings.set(bookmarkKey, []);
  const { element } = mountCatalog();
  await search(element, 'a');
  app.extensionManager.setting.set.mockImplementationOnce(() => {
    throw new Error('settings-unavailable');
  });

  bookmarkButton(element, 'Alpha').click();
  await expect.element(page.getByRole('alert')).toHaveTextContent('Could not save node bookmarks. Try again.');
  expect(settings.get(bookmarkKey)).toEqual([]);
  expect(bookmarkButton(element, 'Alpha').getAttribute('aria-pressed')).toBe('false');
  expect(rows(element)).toEqual(['Beta', 'Alpha']);
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
      emitBeforeChange: () => {}, emitAfterChange: () => {},
    },
  });
  (window as unknown as Record<string, unknown>).LiteGraph = {
    registered_node_types: { AlphaNode: {}, BetaNode: {} },
    createNode: (id: string) => { created.push(id); return { pos: [0, 0], graph: null }; },
  };
  return { created, graph, surface, replaceSurface: (next: HTMLCanvasElement) => Object.assign(app.canvas, { canvas: next }) };
}

function drop(surface: HTMLCanvasElement, data: DataTransfer) {
  const event = new Event('drop', { bubbles: true, cancelable: true });
  for (const [key, value] of Object.entries({ dataTransfer: data, clientX: 40, clientY: 60 }))
    Object.defineProperty(event, key, { value });
  surface.dispatchEvent(event);
  return event.defaultPrevented;
}

test('02-B: canvas drops accept owned node payloads, ignore foreign drags and detach on unmount', async () => {
  const { created, surface } = canvasFixture();
  const { wrapper, element } = mountCatalog();
  await search(element, 'a');

  const payload = new DataTransfer();
  payload.setData(DRAG_MIME, JSON.stringify({ v: 1, kind: 'node', nodeId: 'AlphaNode' }));
  expect(drop(surface, payload)).toBe(true);
  expect(created).toEqual(['AlphaNode']);
  await expect.element(page.getByText('Node created.', { exact: false })).toBeVisible();

  const foreign = new DataTransfer();
  foreign.setData('text/plain', 'AlphaNode');
  expect(drop(surface, foreign)).toBe(false);
  expect(created).toEqual(['AlphaNode']);

  const unknown = new DataTransfer();
  unknown.setData(DRAG_MIME, JSON.stringify({ v: 1, kind: 'node', nodeId: 'OtherNode' }));
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
  replaceSurface(next);
  const payload = new DataTransfer();
  payload.setData(DRAG_MIME, JSON.stringify({ v: 1, kind: 'node', nodeId: 'AlphaNode' }));

  expect(drop(surface, payload)).toBe(false);
  expect(drop(next, payload)).toBe(true);
  expect(created).toEqual(['AlphaNode']);
  wrapper.unmount();
  expect(drop(next, payload)).toBe(false);
});

test('02-C: the node detail adds through the host canvas and reports a rejected insertion', async () => {
  const { created, graph } = canvasFixture();
  const { element } = mountCatalog();
  await search(element, 'a');
  [...element.querySelectorAll<HTMLButtonElement>('.ap-resource')][0].click();
  await expect.element(page.getByRole('heading', { name: 'Beta', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Add to canvas', exact: true }).click();
  expect(created).toEqual(['BetaNode']);
  await expect.element(page.getByText('Node created.', { exact: false })).toBeVisible();

  graph.add = () => null;
  await page.getByRole('button', { name: 'Add to canvas', exact: true }).click();
  expect(created).toEqual(['BetaNode', 'BetaNode']);
  await expect.element(page.getByRole('alert')).toBeVisible();
});

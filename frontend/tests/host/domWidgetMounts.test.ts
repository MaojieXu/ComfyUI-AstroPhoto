import { expect, test, vi } from 'vitest';
import type { ComfyApp } from '../../src/host/comfy';
import { restoreDomWidgetMounts, trackDomWidget } from '../../src/host/domWidgetMounts';

// Supplement to CASE-02/06: Nodes 2.0 keeps one DOM container per widget. After
// Undo/Redo the host builds a new node/widget with the same identity while the
// previous container stays connected, so the extension reattaches only its own
// element. These cases pin that contract without a real host.

const name = 'custom_vue_component_basic';
const owner = (graph: string, node: number, widget = name) => JSON.stringify([graph, node, widget]);
const element = () => {
  const entry = document.createElement('div');
  entry.className = 'astrophoto-drawing-widget';
  return entry;
};
const host = (graph: unknown) => ({ canvas: { graph } }) as unknown as ComfyApp;
const frames = () =>
  new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

function leaf(graphId: string, id: number) {
  const graph = { id: graphId, nodes: [] as unknown[] };
  const node = { id, graph, widgets: [] as unknown[] };
  graph.nodes.push(node);
  return { graph, node };
}

test('trackDomWidget keeps the host onAdded hook and stamps the current owner', () => {
  const graph = { id: 'graph-track' };
  const added = vi.fn();
  const tracked = element();
  const node = { id: 7, graph: undefined as unknown, widgets: [] as unknown[], onAdded: added };
  trackDomWidget({ node, name, element: tracked } as never);
  // No graph yet: the owner is stamped once the host adds the node.
  expect(tracked.dataset.astrophotoWidgetOwner).toBeUndefined();
  node.graph = graph;
  node.onAdded(graph);
  expect(added).toHaveBeenCalledTimes(1);
  expect(tracked.dataset.astrophotoWidgetOwner).toBe(owner('graph-track', 7));
});

test('restoreDomWidgetMounts reattaches the recreated element in place of the stale container', async () => {
  const parent = document.createElement('div');
  const marker = document.createElement('p');
  const stale = element();
  stale.classList.add('dom-widget', 'dp-high');
  parent.append(marker, stale);
  document.body.append(parent);
  const { graph, node } = leaf('graph-undo', 3);
  const staleWidget = { node, name, element: stale };
  trackDomWidget(staleWidget as never);
  expect(stale.dataset.astrophotoWidgetOwner).toBe(owner('graph-undo', 3));

  // The host rebuilds the node after Undo/Redo and keeps the earlier container.
  const recreated = element();
  const recreatedWidget = { node, name, element: recreated };
  trackDomWidget(recreatedWidget as never);
  node.widgets = [recreatedWidget];
  restoreDomWidgetMounts(host(graph));
  await frames();

  expect(recreated.isConnected).toBe(true);
  expect(stale.isConnected).toBe(false);
  expect([...parent.children]).toEqual([marker, recreated]);
  expect(recreated.classList.contains('dom-widget')).toBe(true);
  expect(recreated.classList.contains('dp-high')).toBe(true);
  expect(recreated.dataset.astrophotoWidgetOwner).toBe(owner('graph-undo', 3));
  parent.remove();
});

test('restoreDomWidgetMounts leaves foreign containers, other widgets and missing graphs alone', async () => {
  const foreign = element();
  foreign.dataset.astrophotoWidgetOwner = owner('graph-foreign', 4);
  const stale = element();
  stale.classList.add('dom-widget');
  const parent = document.createElement('div');
  parent.append(foreign, stale);
  document.body.append(parent);
  const { graph, node } = leaf('graph-foreign', 4);
  trackDomWidget({ node, name, element: stale } as never);

  // A different widget on the same node must not capture this container.
  const renamed = element();
  const renamedWidget = { node, name: 'image_path', element: renamed };
  trackDomWidget(renamedWidget as never);
  node.widgets = [renamedWidget];
  restoreDomWidgetMounts(host(graph));
  await frames();
  expect(renamed.isConnected).toBe(false);
  expect([...parent.children]).toEqual([foreign, stale]);

  // Without a recreated element the graph and the container stay untouched.
  node.widgets = [];
  restoreDomWidgetMounts(host(graph));
  await frames();
  expect(stale.isConnected).toBe(true);

  restoreDomWidgetMounts({} as unknown as ComfyApp);
  await frames();
  expect(stale.isConnected).toBe(true);
  parent.remove();
});

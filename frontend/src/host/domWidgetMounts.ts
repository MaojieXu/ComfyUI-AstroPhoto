import type { DOMWidget, LGraphNode } from '@comfyorg/comfyui-frontend-types';
import type { ComfyApp } from './comfy';

const ownedElements = new WeakMap<object, HTMLElement>();
const ownedAnchors = new WeakSet<HTMLElement>();

function owner(node: LGraphNode, name: string) {
  return JSON.stringify([node.graph?.id, node.id, name]);
}

export function trackDomWidget(widget: Pick<DOMWidget<HTMLElement, string | object>, 'node' | 'name' | 'element'>) {
  const { node, element, name } = widget;
  ownedElements.set(widget, element);
  ownedAnchors.add(element);
  const stamp = () => { element.dataset.astrophotoWidgetOwner = owner(node, name); };
  if (node.graph) stamp();
  const onAdded = node.onAdded;
  node.onAdded = function (graph) {
    onAdded?.call(this, graph);
    stamp();
  };
}

export function restoreDomWidgetMounts(host: ComfyApp) {
  // Frontend 1.59.6 WidgetDOM can retain its container after Undo/Redo
  // replaces a host node with the same ID. Reattach only our own DOM element
  // when the native renderer keeps an earlier element with the same owner.
  requestAnimationFrame(() => {
    const graph = host.canvas?.graph;
    if (!graph) return;
    const mounted = new Map<string, HTMLElement>();
    for (const element of document.querySelectorAll<HTMLElement>('[data-astrophoto-widget-owner]')) {
      if (ownedAnchors.has(element)) mounted.set(element.dataset.astrophotoWidgetOwner!, element);
    }
    for (const node of graph.nodes) for (const widget of node.widgets ?? []) {
      const element = ownedElements.get(widget);
      if (!element || element.isConnected) continue;
      const key = owner(node, widget.name);
      const previous = mounted.get(key);
      if (!previous?.isConnected) continue;
      element.dataset.astrophotoWidgetOwner = key;
      // Preserve the sizing classes the host added to the previous element.
      for (const className of previous.classList) element.classList.add(className);
      previous.replaceWith(element);
    }
  });
}

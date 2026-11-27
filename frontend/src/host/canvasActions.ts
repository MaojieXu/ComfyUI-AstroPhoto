import type { LGraph, LGraphNode } from '@comfyorg/comfyui-frontend-types';
import { isRecord } from '../api/client';
import { canvasFactory, createCanvasNode } from './canvas';
import type { ComfyApp } from './comfy';

type Value = string | number | boolean;
type Reference = { node_id: number } | { ref: string };
type Endpoint = Reference & { slot: number };
type Edit =
  | { action: 'add_node'; node_type: string; ref?: string; position?: [number, number] }
  | ({ action: 'set_parameters'; values: Record<string, Value> } & Reference)
  | ({ action: 'remove_node' } & Reference)
  | { action: 'connect'; from: Endpoint; to: Endpoint; replace: boolean }
  | ({ action: 'disconnect'; slot: number } & Reference);

function invalid(): never { throw new Error('INVALID_CANVAS_COMMAND'); }
function integer(value: unknown): value is number { return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0; }
function primitive(value: unknown): value is Value {
  return typeof value === 'boolean' || typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value));
}
function secret(name: string, type: string) { return /password|secret|api.?key|access.?token/i.test(name) || type === 'password'; }
function reference(value: Record<string, unknown>): Reference {
  if (integer(value.node_id) && value.ref === undefined) return { node_id: value.node_id };
  if (value.node_id === undefined && typeof value.ref === 'string' && /^[\w-]{1,48}$/.test(value.ref))
    return { ref: value.ref };
  return invalid();
}
function endpoint(value: unknown): Endpoint {
  if (!isRecord(value) || !integer(value.slot)) return invalid();
  return { ...reference(value), slot: value.slot };
}
function parse(value: unknown): Edit {
  if (!isRecord(value)) return invalid();
  switch (value.action) {
    case 'add_node': {
      const { node_type, position, ref } = value;
      if (typeof node_type !== 'string' || !node_type || node_type.length > 200) return invalid();
      if (ref !== undefined && (typeof ref !== 'string' || !/^[\w-]{1,48}$/.test(ref))) return invalid();
      if (position !== undefined && (!Array.isArray(position) || position.length !== 2 ||
        position.some(item => typeof item !== 'number' || !Number.isFinite(item) || Math.abs(item) > 1e7))) return invalid();
      return { action: 'add_node', node_type, ref, position: position as [number, number] | undefined };
    }
    case 'set_parameters': {
      const { values } = value;
      if (!isRecord(values) || !Object.keys(values).length || Object.keys(values).length > 32 ||
        !Object.values(values).every(primitive)) return invalid();
      return { action: 'set_parameters', ...reference(value), values: values as Record<string, Value> };
    }
    case 'remove_node':
      return { action: 'remove_node', ...reference(value) };
    case 'connect':
      if (value.replace !== undefined && typeof value.replace !== 'boolean') return invalid();
      return { action: 'connect', from: endpoint(value.from), to: endpoint(value.to), replace: value.replace === true };
    case 'disconnect':
      if (!integer(value.slot)) return invalid();
      return { action: 'disconnect', ...reference(value), slot: value.slot };
    default: return invalid();
  }
}

function editableWidgets(node: LGraphNode, values: Record<string, Value>, slots?: Map<number, boolean>) {
  return Object.entries(values).map(([name, value]) => {
    const widget = node.widgets?.find(entry => entry.name === name);
    if (!widget) throw new Error('WIDGET_NOT_FOUND');
    const options = widget.options;
    const standard = ['number', 'slider', 'combo', 'toggle', 'string', 'text', 'customtext'].includes(widget.type);
    const source = name === 'source' && ['AstroPhotoFileSource', 'AstroPhotoFolderSource'].includes(node.comfyClass ?? '');
    const slot = node.inputs?.findIndex(input => input.name === name) ?? -1;
    if ((!standard && !source) || secret(name, widget.type) || widget.disabled || widget.computedDisabled ||
        widget.serialize === false || options?.serialize === false ||
        (slot >= 0 && (slots?.get(slot) ?? node.isInputConnected(slot))) ||
        (widget.type === 'combo' && !Array.isArray(options?.values)))
      throw new Error('WIDGET_NOT_EDITABLE');
    const current = widget.value;
    if (typeof current !== typeof value ||
        (typeof value === 'number' && ((typeof options?.min === 'number' && value < options.min) ||
          (typeof options?.max === 'number' && value > options.max) ||
          (options?.precision === 0 && !Number.isInteger(value)))) ||
        (Array.isArray(options?.values) && !options.values.includes(value as never)))
      throw new Error('INVALID_WIDGET_VALUE');
    return { name, value, widget };
  });
}

export function inputLink(graph: LGraph, node: LGraphNode, slot: number) {
  return [...graph.links.values()].find(link => String(link.target_id) === String(node.id) && link.target_slot === slot);
}

export function describeNode(node: LGraphNode) {
  return {
    id: Number(node.id), node_type: node.comfyClass || node.type, title: node.title,
    position: [...node.pos],
    parameters: Object.fromEntries((node.widgets ?? []).filter(widget =>
      widget.serialize !== false && widget.options?.serialize !== false && primitive(widget.value) && !secret(widget.name, widget.type) &&
      !widget.name.startsWith('astrophoto_')).map(widget => [widget.name, widget.value])),
    inputs: (node.inputs ?? []).map((port, slot) => ({ slot, name: port.name, type: port.type,
      link: node.graph ? inputLink(node.graph, node, slot)?.id ?? null : null })),
    outputs: (node.outputs ?? []).map((port, slot) => ({ slot, name: port.name, type: port.type })),
  };
}

export function editFingerprint(graph: LGraph): string {
  // Keep opaque widget values local. Their changes can still invalidate a pending edit.
  return JSON.stringify([graph.serialize(), graph.nodes.map(node => [describeNode(node), node.mode,
    node.widgets?.filter(widget => widget.serialize !== false && widget.options?.serialize !== false && !widget.name.startsWith('astrophoto_'))
      .map(widget => [widget.name, widget.value])])]);
}

function history(host: ComfyApp, graph: LGraph, change: () => void, node?: LGraphNode) {
  const canvas = host.canvas;
  graph.beforeChange(node);
  try {
    canvas.emitBeforeChange();
    change();
  } finally {
    try {
      graph.change();
      graph.afterChange(node);
    } finally {
      canvas.emitAfterChange();
      canvas.setDirty(true, true);
    }
  }
}

export function applyEdits(host: ComfyApp, graph: LGraph, input: unknown) {
  if (!Array.isArray(input) || !input.length || input.length > 32) return invalid();
  const edits = input.map(parse);
  const factory = canvasFactory();
  if (!factory) throw new Error('CANVAS_UNSUPPORTED');
  const aliases = new Map<string, LGraphNode>();
  const planned = new Set<string>();
  const removed = new Set<number | string>();
  const key = (ref: Reference) => 'ref' in ref ? ref.ref : ref.node_id;
  const resolve = (ref: Reference) => {
    const node = 'ref' in ref ? aliases.get(ref.ref) : graph.nodes.find(item => Number(item.id) === ref.node_id);
    if (!node || node.graph !== graph) throw new Error('NODE_NOT_FOUND');
    return node;
  };
  const preflight = (ref: Reference) => {
    if (removed.has(key(ref))) throw new Error('NODE_NOT_FOUND');
    if ('ref' in ref) {
      if (!planned.has(ref.ref)) throw new Error('NODE_NOT_FOUND');
      return undefined;
    }
    return resolve(ref);
  };
  const checkSlots = (from: LGraphNode | undefined, to: LGraphNode | undefined, edit: Extract<Edit, { action: 'connect' }>) => {
    const output = from?.outputs?.[edit.from.slot];
    const input = to?.inputs?.[edit.to.slot];
    if ((from && !output) || (to && !input)) throw new Error('PORT_NOT_FOUND');
    if (output && input && !factory.isValidConnection(output.type, input.type)) throw new Error('INCOMPATIBLE_PORTS');
  };
  const occupied = new Map<number | string, Map<number, boolean>>();
  for (const edit of edits) {
    switch (edit.action) {
      case 'add_node':
        if (!Object.hasOwn(factory.registered_node_types, edit.node_type)) throw new Error('NODE_NOT_REGISTERED');
        if (edit.ref) {
          if (planned.has(edit.ref)) return invalid();
          planned.add(edit.ref);
        }
        break;
      case 'connect':
      case 'disconnect': {
        const target = edit.action === 'connect' ? edit.to : edit;
        const to = preflight(target);
        if (edit.action === 'connect') checkSlots(preflight(edit.from), to, edit);
        // Dynamic ports can appear only after an earlier connection.
        const slots = occupied.get(key(target)) ?? new Map<number, boolean>();
        const linked = slots.get(target.slot) ?? (to?.inputs?.[target.slot] && to.isInputConnected(target.slot));
        if (edit.action === 'connect' && linked && !edit.replace) throw new Error('INPUT_OCCUPIED');
        slots.set(target.slot, edit.action === 'connect');
        occupied.set(key(target), slots);
        break;
      }
      case 'set_parameters': {
        const node = preflight(edit);
        if (node) editableWidgets(node, edit.values, occupied.get(key(edit)));
        break;
      }
      case 'remove_node':
        preflight(edit);
        removed.add(key(edit));
        break;
    }
  }
  const before = editFingerprint(graph);
  const results: Record<string, unknown>[] = [];
  let added = 0;
  for (const [index, edit] of edits.entries()) {
    try {
      if (host.canvas.graph !== graph || host.configuringGraph) throw new Error('CANVAS_TARGET_CHANGED');
      switch (edit.action) {
        case 'add_node': {
          const area = host.canvas.ds?.visible_area;
          const position = edit.position ?? (area ? [area[0] + area[2] / 2 + added * 36,
            area[1] + area[3] / 2 + added * 36] as [number, number] : undefined);
          const node = createCanvasNode(edit.node_type, undefined, host, factory, undefined, position);
          added++;
          if (edit.ref) aliases.set(edit.ref, node);
          results.push({ index, action: edit.action, node_id: Number(node.id), ref: edit.ref });
          continue;
        }
        case 'set_parameters': {
          const node = resolve(edit);
          const updates = editableWidgets(node, edit.values).filter(({ widget, value }) => widget.value !== value);
          if (updates.length) history(host, graph, () => {
            for (const { name, widget, value } of updates) {
              const previous = widget.value;
              widget.value = value;
              widget.callback?.(value, host.canvas, node, undefined, undefined);
              node.onWidgetChanged?.(name, widget.value, previous, widget);
            }
          }, node);
          results.push({ index, action: edit.action, node_id: Number(node.id),
            values: Object.fromEntries(updates.map(({ name, widget }) => [name, widget.value])) });
          continue;
        }
        case 'remove_node': {
          const node = resolve(edit);
          history(host, graph, () => {
            graph.remove(node);
            if (node.graph === graph) throw new Error('NODE_REMOVE_FAILED');
          }, node);
          break;
        }
        case 'connect': {
          const from = resolve(edit.from);
          const to = resolve(edit.to);
          checkSlots(from, to, edit);
          if (to.isInputConnected(edit.to.slot) && !edit.replace) throw new Error('INPUT_OCCUPIED');
          history(host, graph, () => {
            if (!from.connect(edit.from.slot, to, edit.to.slot)) throw new Error('CONNECT_FAILED');
          }, to);
          break;
        }
        case 'disconnect': {
          const node = resolve(edit);
          if (!node.inputs?.[edit.slot]) throw new Error('PORT_NOT_FOUND');
          if (node.isInputConnected(edit.slot)) history(host, graph, () => {
            if (!node.disconnectInput(edit.slot)) throw new Error('DISCONNECT_FAILED');
          }, node);
          break;
        }
      }
      results.push({ index, action: edit.action });
    } catch (error) {
      return { state: results.length || editFingerprint(graph) !== before ? 'partial' : 'rejected',
        results, failed_index: index, error: errorCode(error) };
    }
  }
  return { state: 'completed', results };
}

export function errorCode(error: unknown) {
  return error instanceof Error && /^[A-Z][A-Z0-9_]{1,79}$/.test(error.message) ? error.message : 'CANVAS_OPERATION_FAILED';
}

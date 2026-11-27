import { shallowRef } from 'vue';
import { isRecord } from '../api/client';
import { applyEdits, describeNode, editFingerprint, errorCode, inputLink } from './canvasActions';
import { canvasFactory } from './canvas';
import type { ComfyApp } from './comfy';
import type { LGraph, SubgraphNode } from '@comfyorg/comfyui-frontend-types';
import type { FrontendBundle } from '../bundles/types';
import { runCanvas } from './canvasRun';
import { workflowAction } from './workflowActions';

export const canvasBridgeStatus = shallowRef<{
  connected: boolean; workflow?: string; modified?: boolean; scope?: string; editable?: boolean;
}>({ connected: false });

export function startCanvasBridge(host: ComfyApp, bundles: readonly FrontendBundle[]) {
  if (typeof host.api.apiURL !== 'function') return;
  const url = new URL(host.api.apiURL('/astrophoto/v1/canvas/socket'), window.location.href);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  let socket: WebSocket | undefined;
  let session = '';
  let reconnect: number | undefined;
  let surface: HTMLCanvasElement | undefined;
  let previous: { graph: unknown; workflow: unknown; target: string; fingerprint?: string; revision?: string } | undefined;
  const invalidate = () => { previous = undefined; };

  function current() {
    const canvas = host.canvasOrUndefined;
    const surfaceNow = canvas?.canvas;
    if (surface !== surfaceNow) {
      surface?.removeEventListener('litegraph:set-graph', invalidate);
      surface = surfaceNow;
      surface?.addEventListener('litegraph:set-graph', invalidate);
      invalidate();
    }
    if (!host.isGraphReady || host.configuringGraph || !canvas?.graph) return undefined;
    const graph = canvas.graph;
    const workflow = host.extensionManager.workflow?.activeWorkflow;
    if (previous?.graph !== graph || previous.workflow !== workflow) {
      previous = { graph, workflow, target: crypto.randomUUID() };
    }
    return {
      graph, identity: previous,
      name: workflow?.filename ?? workflow?.path?.split('/').at(-1) ?? '',
      modified: workflow?.isModified === true,
      scope: graph === host.rootGraph ? 'root' : 'subgraph',
      editable: Boolean(!canvas.read_only && !canvas.selectOnly && canvas.allow_interaction),
    };
  }

  function updateStatus() {
    const target = current();
    const next = { connected: Boolean(session), workflow: target?.name, modified: target?.modified,
      scope: target?.scope, editable: target?.editable };
    if (JSON.stringify(canvasBridgeStatus.value) !== JSON.stringify(next)) canvasBridgeStatus.value = next;
  }

  function revision(target: NonNullable<ReturnType<typeof current>>) {
    const visited = new Set<LGraph>();
    function graphState(graph: LGraph): unknown {
      if (visited.has(graph)) return null;
      visited.add(graph);
      return [editFingerprint(graph), graph.groups.map(group => group.serialize()),
        graph.nodes.flatMap(node => node.isSubgraphNode() ? [graphState(node.subgraph)] : [])];
    }
    const fingerprint = JSON.stringify(graphState(target.graph));
    if (target.identity.fingerprint !== fingerprint) {
      target.identity.fingerprint = fingerprint;
      target.identity.revision = crypto.randomUUID();
    }
    return target.identity.revision;
  }

  async function handle(request: Record<string, unknown>) {
    if (request.action === 'node_search' || request.action === 'node_describe') {
      const definitions = await host.api.getNodeDefs();
      const registered = canvasFactory()?.registered_node_types;
      const source = (item: { python_module?: string }) => item.python_module || 'unknown';
      if (request.action === 'node_describe') {
        const id = request.node_type;
        if (typeof id !== 'string' || !Object.hasOwn(definitions, id)) throw new Error('NODE_NOT_REGISTERED');
        return { state: 'completed', node_type: id, addable: Boolean(registered && Object.hasOwn(registered, id)),
          source: source(definitions[id]), preview_capability: bundles.some(bundle => bundle.supportsNodePreview?.(id)),
          definition: definitions[id] };
      }
      const query = typeof request.query === 'string' ? request.query.trim().toLocaleLowerCase() : '';
      const items = Object.entries(definitions).flatMap(([id, item]) =>
        (request.source === undefined || source(item) === request.source) &&
        [id, item.display_name, item.category, ...(item.search_aliases ?? [])].some(text => text?.toLocaleLowerCase().includes(query))
          ? [{ node_type: id, title: item.display_name, category: item.category,
            source: source(item),
            addable: Boolean(registered && Object.hasOwn(registered, id)) }] : []);
      return { state: 'completed', count: items.length, items: items.slice(0, 50) };
    }
    const target = current();
    if (!target) throw new Error('CANVAS_UNAVAILABLE');
    if (request.target_id !== undefined && request.target_id !== target.identity.target)
      throw new Error('CANVAS_TARGET_CHANGED');
    const meta = { target_id: target.identity.target, workflow_name: target.name, unsaved: target.modified,
      scope: target.scope, editable: target.editable };
    if (request.action === 'inspect' && request.summary === true) return { state: 'completed', ...meta };
    const currentRevision = revision(target);
    const ensureCurrent = (checkRevision = true) => {
      const active = current();
      if (active?.identity.target !== target.identity.target || request.target_id !== target.identity.target)
        throw new Error('CANVAS_TARGET_CHANGED');
      if (checkRevision && request.expected_revision !== undefined && revision(target) !== request.expected_revision)
        throw new Error('GRAPH_CONFLICT');
    };
    if (request.action === 'node_inspect') {
      ensureCurrent();
      const node = target.graph.nodes.find(item => Number(item.id) === request.node_id);
      if (!node) throw new Error('NODE_NOT_FOUND');
      const details = bundles.map(bundle => bundle.inspectNode?.(node)).find(Boolean);
      return { state: 'completed', ...meta, revision: currentRevision, node_id: request.node_id,
        preview_capability: Boolean(details),
        parameters: details ? details.parameters : describeNode(node).parameters,
        ...(details ? { private_source: details.source, private_formal: details.formal_id,
          private_provenance: details.provenance } : {}) };
    }
    if (request.action === 'workflow_run') {
      if (target.scope !== 'root') throw new Error('ROOT_GRAPH_REQUIRED');
      if (typeof request.command_id !== 'string') throw new Error('INVALID_CANVAS_COMMAND');
      const result = await runCanvas(host, request.command_id, ensureCurrent);
      return { ...result, ...(result.reused ? {} : { submitted_revision: currentRevision }) };
    }
    if (typeof request.action === 'string' && request.action.startsWith('workflow_')) {
      if (request.action === 'workflow_save' && target.scope !== 'root') throw new Error('ROOT_GRAPH_REQUIRED');
      const result = await workflowAction(host, request, () => {
        if (request.action === 'workflow_save') ensureCurrent();
        else if (current()?.identity.target !== target.identity.target) throw new Error('CANVAS_TARGET_CHANGED');
      });
      const active = current();
      return { state: 'completed', ...result, ...(active ? { target_id: active.identity.target,
        revision: revision(active), unsaved: active.modified ||
          host.extensionManager.workflow.activeWorkflow?.isTemporary === true } : {}) };
    }
    if (request.action === 'canvas_list_subgraphs' || request.action === 'canvas_open_subgraph') {
      const graphs = [{ graph_id: 'root', name: target.name, scope: 'root' }];
      const instances = new Map<string, SubgraphNode>();
      const collect = (graph: LGraph, parent_id: string) => {
        for (const node of graph.nodes) {
          if (!node.isSubgraphNode()) continue;
          const graph_id = parent_id + '/' + node.id;
          if (graph_id.split('/').length > 24) continue;
          instances.set(graph_id, node);
          graphs.push({ graph_id, parent_id, name: node.title, scope: 'subgraph' } as typeof graphs[number]);
          collect(node.subgraph, graph_id);
        }
      };
      collect(host.rootGraph, 'root');
      if (request.action === 'canvas_list_subgraphs') return { state: 'completed', ...meta, graphs };
      ensureCurrent();
      const id = request.graph_id;
      if (typeof id !== 'string' || (id !== 'root' && !instances.has(id))) throw new Error('SUBGRAPH_NOT_FOUND');
      host.canvas.setGraph(host.rootGraph);
      if (id !== 'root') {
        let parent = 'root';
        for (const part of id.split('/').slice(1)) {
          parent += '/' + part;
          const node = instances.get(parent)!;
          host.canvas.openSubgraph(node.subgraph, node);
        }
      }
      host.extensionManager.workflow.updateActiveGraph();
      const active = current();
      if (!active) throw new Error('CANVAS_UNAVAILABLE');
      return { state: 'completed', target_id: active.identity.target, revision: revision(active), scope: active.scope };
    }
    if (request.action === 'apply') {
      if (!target.editable) throw new Error('CANVAS_READ_ONLY');
      if (request.target_id !== target.identity.target || !currentRevision || currentRevision !== request.expected_revision)
        return { state: 'rejected', error: 'GRAPH_CONFLICT', ...meta, revision: currentRevision };
      const input = document.activeElement?.closest('input,textarea,select,[contenteditable="true"]');
      if (host.canvas.isDragging || (input && (host.canvasContainer?.contains(input) ||
        input.closest('.ap-inspector, .graphdialog'))))
        throw new Error('CANVAS_EDIT_IN_PROGRESS');
      const receipt = applyEdits(host, target.graph, request.commands);
      return { ...receipt, ...meta, revision: revision(target) };
    }
    const query = request.action === 'find' && typeof request.query === 'string' ? request.query.toLocaleLowerCase() : '';
    const nodes = target.graph.nodes.filter(node => request.node_id !== undefined ? Number(node.id) === request.node_id
      : [node.title, node.comfyClass, node.type].some(value => value?.toLocaleLowerCase().includes(query))).map(describeNode);
    const links = target.graph.nodes.flatMap(node => (node.inputs ?? []).flatMap((_port, index) => {
      const link = inputLink(target.graph, node, index);
      return link ? [{ id: link.id, from: { node_id: link.origin_id, slot: link.origin_slot },
        to: { node_id: link.target_id, slot: link.target_slot } }] : [];
    }));
    return { state: 'completed', ...meta, revision: currentRevision, nodes,
      ...(request.action === 'inspect' ? { links } : {}) };
  }

  function connect() {
    const connection = new WebSocket(url);
    socket = connection;
    const mutations = new Set(['apply', 'workflow_new', 'workflow_open', 'workflow_save', 'workflow_rename',
      'workflow_delete', 'workflow_import', 'workflow_run', 'canvas_open_subgraph']);
    let writing = false;
    connection.onmessage = async event => {
      try {
        const request: unknown = JSON.parse(event.data);
        if (!isRecord(request)) return;
        if (typeof request.session_id === 'string') { session = request.session_id; updateStatus(); return; }
        if (!session || typeof request.command_id !== 'string' || connection.readyState !== WebSocket.OPEN) return;
        const command_id = request.command_id;
        let result;
        try {
          if (typeof request.expires_at !== 'number' || Date.now() > request.expires_at) throw new Error('CANVAS_COMMAND_EXPIRED');
          if (typeof request.action === 'string' && mutations.has(request.action)) {
            if (writing) throw new Error('CANVAS_BUSY');
            writing = true;
            try { result = await handle(request); } finally { writing = false; }
          } else {
            result = await handle(request);
          }
        } catch (error) {
          result = { state: 'rejected', error: errorCode(error) };
        }
        if (connection.readyState !== WebSocket.OPEN) return;
        const response = JSON.stringify({ ...result, command_id });
        const limit = request.action === 'workflow_get' ? 4 * 1024 * 1024 - 1 : 240 * 1024;
        connection.send(new TextEncoder().encode(response).length <= limit ? response
          : JSON.stringify({ command_id, state: 'rejected', error: 'CANVAS_RESULT_TOO_LARGE' }));
        updateStatus();
      } catch { /* The broker expires commands without a valid reply. */ }
    };
    connection.onclose = () => {
      session = '';
      invalidate();
      updateStatus();
      reconnect = window.setTimeout(connect, 2000);
    };
  }
  window.addEventListener('pagehide', () => {
    clearTimeout(reconnect);
    if (socket) { socket.onclose = null; socket.close(); }
    session = '';
    invalidate();
    updateStatus();
  });
  window.addEventListener('pageshow', () => {
    if (!socket || socket.readyState >= WebSocket.CLOSING) connect();
  });
  window.setInterval(updateStatus, 1000);
  connect();
}

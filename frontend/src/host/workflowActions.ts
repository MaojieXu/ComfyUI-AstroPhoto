import type { ComfyApp } from './comfy';
import { isRecord } from '../api/client';

const prefix = 'workflows/';
const reserved = /^(?:con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/i;
function safePath(value: unknown, folder = false): string {
  if (typeof value !== 'string' || value.length > 240 || (!folder && !value.endsWith('.json')) ||
      value.split('/').some(part => !part || part.startsWith('.') || /[\\:%<>?"|*]|[ .]$/.test(part) ||
        [...part].some(char => char.charCodeAt(0) < 32) || reserved.test(part))) throw new Error('INVALID_WORKFLOW_PATH');
  return value;
}

function document(value: unknown) {
  if (!isRecord(value) || !Array.isArray(value.nodes) || !value.nodes.every(node =>
    isRecord(node) && (typeof node.id === 'number' || typeof node.id === 'string') && typeof node.type === 'string') ||
    ![0.4, 1].includes(Number(value.version)) ||
    (value.links != null && !Array.isArray(value.links))) throw new Error('INVALID_WORKFLOW_DOCUMENT');
  return value;
}

async function revision(content: string) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(content));
  return Array.from(new Uint8Array(hash), value => value.toString(16).padStart(2, '0')).join('');
}

function check(response: Response) {
  if (response.status === 404) throw new Error('WORKFLOW_NOT_FOUND');
  if (response.status === 409) throw new Error('WORKFLOW_EXISTS');
  if (!response.ok) throw new Error('WORKFLOW_HTTP_ERROR');
  return response;
}

export async function workflowAction(host: ComfyApp, request: Record<string, unknown>, guard: () => void) {
  const store = host.extensionManager.workflow;
  const { action } = request;
  const read = async (path: string) => {
    const content = await check(await host.api.getUserData(prefix + path, { cache: 'no-store' })).text();
    return { path, content, file_revision: await revision(content) };
  };
  if (action === 'workflow_list') {
    const folder = request.folder === undefined ? '' : safePath(request.folder, true) + '/';
    const query = typeof request.query === 'string' ? request.query.toLocaleLowerCase() : '';
    const cursor = typeof request.cursor === 'string' ? request.cursor : '';
    const limit = Math.max(1, Math.min(100, Number(request.limit) || 50));
    const files = await host.api.listUserDataFullInfo('workflows');
    const matching = files.flatMap(file => {
      const path = file.path.replaceAll('\\', '/');
      try { safePath(path); } catch { return []; }
      return path.startsWith(folder) && path > cursor && path.toLocaleLowerCase().includes(query)
        ? [{ path, name: path.split('/').at(-1), modified: file.modified }] : [];
    }).sort((a, b) => a.path < b.path ? -1 : a.path === b.path ? 0 : 1);
    return { items: matching.slice(0, limit), next_cursor: matching.length > limit ? matching[limit - 1].path : null };
  }
  if (action === 'workflow_new') {
    guard();
    const graph = { version: 0.4, last_node_id: 0, last_link_id: 0, nodes: [], links: [], groups: [], config: {}, extra: {} };
    const draft = store.createNewTemporary(undefined, graph);
    await host.loadGraphData(graph, true, true, draft);
    return { unsaved: true };
  }
  const path = safePath(request.path);
  if (action === 'workflow_get') {
    const saved = await read(path);
    return { path, workflow: document(JSON.parse(saved.content)), file_revision: saved.file_revision };
  }
  if (action === 'workflow_open') {
    const existing = store.openWorkflows.find(item => item.path === prefix + path && item.isPersisted);
    if (!existing) await store.syncWorkflows();
    const item = existing ?? store.getWorkflowByPath(prefix + path);
    if (!item?.isPersisted) throw new Error('WORKFLOW_NOT_FOUND');
    if (!store.isActive(item)) {
      const graph = item.activeState ?? document(JSON.parse((await read(path)).content));
      guard();
      await host.loadGraphData(graph as Parameters<ComfyApp['loadGraphData']>[0], true, true, item);
    }
    return { path };
  }
  if (action === 'workflow_save' || action === 'workflow_import') {
    if (request.mode === 'overwrite') throw new Error('WORKFLOW_OVERWRITE_UNAVAILABLE');
    if (action === 'workflow_save') guard();
    const data = action === 'workflow_save' ? host.rootGraph.serialize() : document(request.workflow);
    const content = JSON.stringify(data);
    // Do not switch tabs after saving, so an existing dirty draft stays intact.
    check(await host.api.fetchApi('/astrophoto/v1/canvas/workflows', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-AstroPhoto-Local': '1' },
      body: JSON.stringify({ path, content }),
    }));
    await store.syncWorkflows().catch(() => undefined);
    return { path, file_revision: await revision(content) };
  }
  if (action === 'workflow_rename' || action === 'workflow_delete') {
    const saved = await read(path);
    if (saved.file_revision !== request.expected_file_revision) throw new Error('FILE_CONFLICT');
    const newPath = action === 'workflow_rename' ? safePath(request.new_path) : undefined;
    const open = new Set(store.openWorkflows.filter(item => item.isPersisted)
      .map(item => item.path.normalize('NFC').toLocaleLowerCase()));
    if ([path, ...(newPath ? [newPath] : [])].some(candidate => open.has((prefix + candidate).normalize('NFC').toLocaleLowerCase())))
      throw new Error('WORKFLOW_OPEN');
    if (newPath) {
      check(await host.api.moveUserData(prefix + path, prefix + newPath, { overwrite: false }));
      await store.syncWorkflows().catch(() => undefined);
      return { path: newPath, file_revision: saved.file_revision };
    }
    check(await host.api.deleteUserData(prefix + path));
    await store.syncWorkflows().catch(() => undefined);
    return { path, deleted: true };
  }
  throw new Error('INVALID_CANVAS_COMMAND');
}

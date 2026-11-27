import { isRecord } from '../api/client';
import type { ComfyApp } from './comfy';

type QueueItem = { requestId: number; batchCount: number };
type QueueHost = ComfyApp & { processingQueue: boolean; queueItems: QueueItem[]; nextQueueRequestId: number };

export async function runCanvas(host: ComfyApp, commandId: string, guard: (checkRevision?: boolean) => void) {
  const known = await host.api.fetchApi('/jobs/' + commandId);
  if (known.ok) {
    const job: unknown = await known.json();
    if (!isRecord(job) || job.id !== commandId) throw new Error('WORKFLOW_JOB_LOOKUP_UNAVAILABLE');
    return { state: 'completed', task_id: commandId, reused: true };
  }
  if (known.status !== 404) throw new Error('WORKFLOW_JOB_LOOKUP_UNAVAILABLE');
  guard();

  // ComfyUI 1.59.6 processes a LIFO queue after asynchronous authentication.
  // Observe the host's queue item, rather than associating the next HTTP request.
  const queue = host as QueueHost;
  if (queue.processingQueue) throw new Error('CANVAS_BUSY');
  if (!Array.isArray(queue.queueItems) || !Number.isSafeInteger(queue.nextQueueRequestId))
    throw new Error('CANVAS_UNSUPPORTED');
  const items = queue.queueItems;
  const requestId = queue.nextQueueRequestId;
  const originalPop = items.pop;
  const ownPop = Object.hasOwn(items, 'pop');
  const originalFetch = host.api.fetchApi;
  const originalQueuePrompt = host.api.queuePrompt;
  const originalGraphToPrompt = host.graphToPrompt;
  let active = false;
  let attempted = false;
  let failure: string | undefined;
  let receipt: Record<string, unknown> | undefined;
  let ownedPrompt: Awaited<ReturnType<typeof host.graphToPrompt>> | undefined;
  let capturing = false;

  const pop: typeof items.pop = function (this: QueueItem[]) {
    const item = originalPop.call(this);
    active = item?.requestId === requestId;
    if (active) {
      try {
        // The host invokes widget callbacks immediately after taking this item.
        guard();
      } catch (error) {
        failure = error instanceof Error ? error.message : 'GRAPH_CONFLICT';
        active = false;
        return { ...item!, batchCount: 0 };
      }
    }
    return item;
  };
  items.pop = pop;
  const graphToPrompt: typeof host.graphToPrompt = async graph => {
    if (!active || capturing) return originalGraphToPrompt.call(host, graph);
    capturing = true;
    guard(false);
    const snapshot = JSON.stringify(host.rootGraph.serialize());
    const prompt = await originalGraphToPrompt.call(host, graph);
    guard(false);
    if (JSON.stringify(host.rootGraph.serialize()) !== snapshot) throw new Error('GRAPH_CONFLICT');
    ownedPrompt = prompt;
    return prompt;
  };
  const queuePrompt: typeof host.api.queuePrompt = async (number, data, options) => {
    if (!active || data !== ownedPrompt) return originalQueuePrompt.call(host.api, number, data, options);
    guard(false);
    active = false;
    const intercept: typeof host.api.fetchApi = (route, request) => {
      if (route !== '/prompt') return originalFetch.call(host.api, route, request);
      const body: unknown = typeof request?.body === 'string' ? JSON.parse(request.body) : null;
      if (!isRecord(body)) throw new Error('INVALID_CANVAS_COMMAND');
      attempted = true;
      return originalFetch.call(host.api, route, { ...request, body: JSON.stringify({ ...body, prompt_id: commandId }) });
    };
    let pending: ReturnType<typeof originalQueuePrompt>;
    host.api.fetchApi = intercept;
    try {
      // The native API builds and sends this request synchronously before its first await.
      pending = originalQueuePrompt.call(host.api, number, data, options);
    } finally {
      if (host.api.fetchApi === intercept) host.api.fetchApi = originalFetch;
    }
    try {
      const response = await pending;
      receipt = response.prompt_id === commandId
        ? { state: 'completed', task_id: commandId } : { state: 'unconfirmed' };
      return response;
    } catch (error) {
      if (isRecord(error) && typeof error.status === 'number' && error.status < 500 && isRecord(error.response))
        receipt = { state: 'rejected', error: 'PROMPT_REJECTED', node_errors: error.response.node_errors };
      throw error;
    }
  };
  host.graphToPrompt = graphToPrompt;
  host.api.queuePrompt = queuePrompt;
  try {
    await host.queuePrompt(0, 1);
    return receipt ?? (failure ? { state: 'rejected', error: failure }
      : attempted ? { state: 'unconfirmed' } : { state: 'rejected', error: 'PROMPT_NOT_SUBMITTED' });
  } finally {
    if (host.api.queuePrompt === queuePrompt) host.api.queuePrompt = originalQueuePrompt;
    if (host.graphToPrompt === graphToPrompt) host.graphToPrompt = originalGraphToPrompt;
    if (items.pop === pop) {
      if (ownPop) items.pop = originalPop;
      else delete (items as { pop?: typeof items.pop }).pop;
    }
  }
}

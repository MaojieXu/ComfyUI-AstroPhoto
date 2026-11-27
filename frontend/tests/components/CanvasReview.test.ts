import { expect, test, vi } from 'vitest';
import { applyEdits } from '../../src/host/canvasActions';
import { runCanvas } from '../../src/host/canvasRun';
import type { ComfyApp } from '../../src/host/comfy';

test('an ordered batch can disconnect an input and then edit its widget', () => {
  const litegraph = { registered_node_types: {}, isValidConnection: () => true };
  Object.assign(window, { LiteGraph: litegraph });
  let connected = true;
  const widget = { name: 'width', type: 'number', value: 64, options: {} };
  const node = {
    id: 1, title: 'Image', type: 'test', pos: [0, 0], widgets: [widget],
    inputs: [{ name: 'width', type: 'INT' }], outputs: [], graph: null as unknown,
    isInputConnected: () => connected,
    getInputLink: () => connected ? { id: 7 } : null,
    disconnectInput: () => { connected = false; return true; },
  };
  const graph = { nodes: [node], links: new Map(), serialize: () => ({ connected, width: widget.value }),
    beforeChange: vi.fn(), afterChange: vi.fn(), change: vi.fn() };
  node.graph = graph;
  const canvas = { graph, emitBeforeChange: vi.fn(), emitAfterChange: vi.fn(), setDirty: vi.fn() };
  const host = { canvas, configuringGraph: false } as unknown as ComfyApp;
  const result = applyEdits(host, graph as never, [
    { action: 'disconnect', node_id: 1, slot: 0 },
    { action: 'set_parameters', node_id: 1, values: { width: 96 } },
  ]);
  expect(result.state).toBe('completed');
  expect(connected).toBe(false);
  expect(widget.value).toBe(96);
});

test('workflow execution uses the host queue and its promoted-widget callbacks', async () => {
  let promotedValue = 11;
  const transmitted: Record<string, unknown>[] = [];
  const api = {
    fetchApi: vi.fn(async (path: string, options?: RequestInit) => {
      if (path.startsWith('/jobs/')) return new Response(null, { status: 404 });
      transmitted.push(JSON.parse(String(options?.body)));
      return Response.json({ prompt_id: 'request-1' });
    }),
    async queuePrompt(_number: number, data: { output: unknown }) {
      return (await this.fetchApi('/prompt', { method: 'POST',
        body: JSON.stringify({ prompt: data.output }) })).json();
    },
  };
  const host = {
    api, processingQueue: false, queueItems: [] as { requestId: number; batchCount: number }[], nextQueueRequestId: 1,
    rootGraph: { serialize: () => ({}) },
    graphToPrompt: vi.fn(async () => ({ output: { value: promotedValue }, workflow: {} })),
    queuePrompt: vi.fn(async function (this: { queueItems: { requestId: number; batchCount: number }[];
      nextQueueRequestId: number; graphToPrompt: () => Promise<{ output: unknown }> }) {
      this.queueItems.push({ requestId: this.nextQueueRequestId++, batchCount: 1 });
      this.queueItems.pop();
      // Model the native queue's promoted-widget before/after phases.
      promotedValue++;
      const prompt = await this.graphToPrompt();
      await api.queuePrompt(0, prompt);
      promotedValue++;
      return true;
    }),
  } as unknown as ComfyApp;
  const receipt = await runCanvas(host, 'request-1', vi.fn());
  expect(receipt).toEqual({ state: 'completed', task_id: 'request-1' });
  expect(transmitted).toEqual([{ prompt: { value: 12 }, prompt_id: 'request-1' }]);
  expect(promotedValue).toBe(13);
  expect(host.queuePrompt).toHaveBeenCalledOnce();
});

test('a later native run retains its own ID when the host processes its queue LIFO', async () => {
  let release!: () => void;
  const authentication = new Promise<void>(resolve => { release = resolve; });
  const transmitted: { prompt_id?: string; prompt: number }[] = [];
  const api = {
    fetchApi: vi.fn(async (path: string, options?: RequestInit) => {
      if (path.startsWith('/jobs/')) return new Response(null, { status: 404 });
      const body = JSON.parse(String(options?.body));
      transmitted.push(body);
      return Response.json({ prompt_id: body.prompt_id || 'native-id' });
    }),
    async queuePrompt(_number: number, data: { output: number }) {
      return (await this.fetchApi('/prompt', { method: 'POST',
        body: JSON.stringify({ prompt: data.output }) })).json();
    },
  };
  let currentRequest = 0;
  const host = {
    api, processingQueue: false, queueItems: [] as { requestId: number; batchCount: number }[], nextQueueRequestId: 1,
    rootGraph: { serialize: () => ({}) },
    graphToPrompt: vi.fn(async () => ({ output: currentRequest, workflow: {} })),
    async queuePrompt() {
      this.queueItems.push({ requestId: this.nextQueueRequestId++, batchCount: 1 });
      if (this.processingQueue) return false;
      this.processingQueue = true;
      await authentication;
      while (this.queueItems.length) {
        const item = this.queueItems.pop()!;
        if (!item.batchCount) continue;
        currentRequest = item.requestId;
        const prompt = await this.graphToPrompt();
        await api.queuePrompt(0, prompt);
      }
      this.processingQueue = false;
      return true;
    },
  };
  const run = runCanvas(host as unknown as ComfyApp, 'mcp-id', vi.fn());
  await vi.waitFor(() => expect(host.processingQueue).toBe(true));
  await host.queuePrompt();
  release();
  expect(await run).toEqual({ state: 'completed', task_id: 'mcp-id' });
  expect(transmitted).toEqual([{ prompt: 2 }, { prompt: 1, prompt_id: 'mcp-id' }]);
});

test('a changed graph is rejected before the target queue item runs its callbacks', async () => {
  let release!: () => void;
  const authentication = new Promise<void>(resolve => { release = resolve; });
  let revision = 1;
  let callbacks = 0;
  const api = { fetchApi: vi.fn(async () => new Response(null, { status: 404 })) };
  const host = {
    api, processingQueue: false, queueItems: [] as { requestId: number; batchCount: number }[], nextQueueRequestId: 1,
    rootGraph: { serialize: () => ({ revision }) },
    graphToPrompt: vi.fn(async () => ({})),
    async queuePrompt() {
      this.queueItems.push({ requestId: this.nextQueueRequestId++, batchCount: 1 });
      this.processingQueue = true;
      await authentication;
      const item = this.queueItems.pop()!;
      if (item.batchCount) callbacks++;
      this.processingQueue = false;
      return true;
    },
  };
  const guard = (check = true) => { if (check && revision !== 1) throw new Error('GRAPH_CONFLICT'); };
  const run = runCanvas(host as unknown as ComfyApp, 'mcp-id', guard);
  await vi.waitFor(() => expect(host.processingQueue).toBe(true));
  revision = 2;
  release();
  expect(await run).toEqual({ state: 'rejected', error: 'GRAPH_CONFLICT' });
  expect(callbacks).toBe(0);
});

test('a direct host submission during serialization does not receive the MCP task ID', async () => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  const transmitted: { prompt: string; prompt_id?: string }[] = [];
  const api = {
    fetchApi: vi.fn(async (path: string, options?: RequestInit) => {
      if (path.startsWith('/jobs/')) return new Response(null, { status: 404 });
      const body = JSON.parse(String(options?.body));
      transmitted.push(body);
      return Response.json({ prompt_id: body.prompt_id || 'other-id' });
    }),
    async queuePrompt(_number: number, data: { output: string }) {
      return (await this.fetchApi('/prompt', { method: 'POST',
        body: JSON.stringify({ prompt: data.output }) })).json();
    },
  };
  let serializing = false;
  const host = {
    api, processingQueue: false, queueItems: [] as { requestId: number; batchCount: number }[], nextQueueRequestId: 1,
    rootGraph: { serialize: () => ({}) },
    async graphToPrompt() { serializing = true; await gate; return { output: 'mcp', workflow: {} }; },
    async queuePrompt() {
      this.queueItems.push({ requestId: this.nextQueueRequestId++, batchCount: 1 });
      this.processingQueue = true;
      this.queueItems.pop();
      const prompt = await this.graphToPrompt();
      await api.queuePrompt(0, prompt);
      this.processingQueue = false;
      return true;
    },
  };
  const run = runCanvas(host as unknown as ComfyApp, 'mcp-id', vi.fn());
  await vi.waitFor(() => expect(serializing).toBe(true));
  await api.queuePrompt(0, { output: 'other' });
  release();
  expect(await run).toEqual({ state: 'completed', task_id: 'mcp-id' });
  expect(transmitted).toEqual([{ prompt: 'other' }, { prompt: 'mcp', prompt_id: 'mcp-id' }]);
});

test('a graph edit during asynchronous serialization prevents submission', async () => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  let revision = 1;
  let serializing = false;
  const api = { fetchApi: vi.fn(async () => new Response(null, { status: 404 })), queuePrompt: vi.fn() };
  const host = {
    api, processingQueue: false, queueItems: [] as { requestId: number; batchCount: number }[], nextQueueRequestId: 1,
    rootGraph: { serialize: () => ({ revision }) },
    async graphToPrompt() { serializing = true; await gate; return { output: {}, workflow: {} }; },
    async queuePrompt() {
      this.queueItems.push({ requestId: this.nextQueueRequestId++, batchCount: 1 });
      this.processingQueue = true;
      this.queueItems.pop();
      await this.graphToPrompt();
      await api.queuePrompt();
      return true;
    },
  };
  const run = runCanvas(host as unknown as ComfyApp, 'mcp-id', vi.fn());
  await vi.waitFor(() => expect(serializing).toBe(true));
  revision = 2;
  release();
  await expect(run).rejects.toThrow('GRAPH_CONFLICT');
  expect(api.queuePrompt).not.toHaveBeenCalled();
});

test('a replay whose host job exists keeps the original task ID', async () => {
  const host = { api: { fetchApi: vi.fn(async () => Response.json({ id: 'mcp-id', status: 'completed' })) } };
  expect(await runCanvas(host as unknown as ComfyApp, 'mcp-id', vi.fn()))
    .toEqual({ state: 'completed', task_id: 'mcp-id', reused: true });
});

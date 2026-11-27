import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const url = process.env.COMFYUI_TEST_URL;
assert(url && ['127.0.0.1', 'localhost'].includes(new URL(url).hostname));
const defaultPython = process.platform === 'win32' ? '../../../.venv/Scripts/python.exe' : '../../../.venv/bin/python';
const mcp = spawn(process.env.ASTROPHOTO_TEST_PYTHON || fileURLToPath(new URL(defaultPython, import.meta.url)),
  ['-m', 'astrophoto_mcp', '--comfy-url', url], { stdio: ['pipe', 'pipe', 'inherit'] });
const replies = new Map();
let next = 0;
createInterface({ input: mcp.stdout }).on('line', line => {
  const reply = JSON.parse(line);
  replies.get(reply.id)?.(reply);
});
async function rpc(method, params) {
  const id = ++next;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { replies.delete(id); reject(new Error(method + ' timed out')); }, 20000);
    replies.set(id, reply => {
      clearTimeout(timer);
      replies.delete(id);
      if (reply.error) reject(new Error(JSON.stringify(reply.error)));
      else resolve(reply.result);
    });
    mcp.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
  });
}
async function tool(name, args = {}, raw = false) {
  const result = await rpc('tools/call', { name: 'call_tool', arguments: { name, arguments: args } });
  if (result.isError) throw new Error(result.content[0]?.text);
  if (raw) return result;
  return result.structuredContent ?? JSON.parse(result.content[0].text);
}
async function eventually(fn, predicate) {
  for (let index = 0; index < 35; index++) {
    const result = await fn();
    if (predicate(result)) return result;
    await new Promise(resolve => setTimeout(resolve, 220));
  }
  throw new Error('Expected host state was not observed');
}

let browser;
try {
  await rpc('initialize', { protocolVersion: '2025-11-25', capabilities: {},
    clientInfo: { name: 'astrophoto-canvas-test', version: '1' } });
  mcp.stdin.write('{"jsonrpc":"2.0","method":"notifications/initialized"}\n');
  browser = await chromium.launch();
  const page = await browser.newPage();
  const existing = new Set((await tool('canvas_list_sessions')).sessions.map(row => row.session_id));
  await page.goto(url);
  await page.waitForFunction(() => window.comfyAPI?.app?.app?.isGraphReady);
  await page.evaluate(async nodesTwo => {
    const app = window.comfyAPI.app.app;
    await app.extensionManager.setting.set('Comfy.VueNodes.Enabled', nodesTwo);
    app.rootGraph.clear();
  }, process.argv.includes('--nodes-2'));
  const sessions = await eventually(() => tool('canvas_list_sessions'), result =>
    result.sessions.some(row => !existing.has(row.session_id) && row.state === 'completed'));
  await page.keyboard.press('Escape');
  await page.getByTestId('astrophoto.sidebar-tab-button').evaluate(button => button.click());
  const indicator = page.locator('.ap-agent-canvas-status');
  await indicator.locator('.ap-canvas-details').click();
  const details = page.locator('.ap-canvas-details-panel');
  await details.filter({ hasText: /Canvas connected|画布已连接/ }).waitFor({ state: 'visible' });
  assert.match(await details.innerText(), /Canvas connected|画布已连接/);
  assert.match(await details.innerText(), /Main canvas|主画布/);
  await indicator.locator('.ap-canvas-details').click();
  const { session_id, target_id } = sessions.sessions.find(row => !existing.has(row.session_id) && row.state === 'completed');
  const target = { session_id, target_id };
  const graph = () => tool('canvas_get', target);
  const commands = (revision, edits, command_id = randomUUID()) => tool('canvas_apply', {
    ...target, expected_revision: revision, commands: edits, command_id,
  });
  const node = await tool('node_describe', { session_id, node_type: 'EmptyImage' });
  assert.equal(node.addable, true);
  const initial = await graph();
  const workflowName = `Agent Review ${randomUUID()}.json`;
  const newDraft = await tool('workflow_new', { session_id, request_id: randomUUID() });
  assert.equal(newDraft.state, 'completed', JSON.stringify(newDraft));
  assert(await page.evaluate(() => window.comfyAPI.app.app.extensionManager.workflow.openWorkflows.length >= 2));
  target.target_id = newDraft.target_id;
  const blank = await graph();
  assert.equal(blank.nodes.length, 0);
  const addId = randomUUID();
  const add = [
    { action: 'add_node', ref: 'image', node_type: 'EmptyImage', position: [120, 180] },
    { action: 'set_parameters', ref: 'image', values: { width: 64, height: 64 } },
    { action: 'add_node', ref: 'preview', node_type: 'PreviewImage' },
    { action: 'connect', from: { ref: 'image', slot: 0 }, to: { ref: 'preview', slot: 0 } },
  ];
  const receipt = await commands(blank.revision, add, addId);
  assert.equal(receipt.state, 'completed', JSON.stringify(receipt));
  assert.deepEqual(await commands(blank.revision, add, addId), receipt);
  assert.deepEqual(await tool('canvas_command_status', { command_id: addId }), receipt);
  const found = await tool('canvas_find_nodes', { ...target, query: 'EmptyImage' });
  const image = found.nodes[0];
  assert.deepEqual(image.position, [120, 180]);
  assert.equal(image.parameters.width, 64);
  assert.equal((await graph()).links.length, 1);
  const preview = receipt.results[2].node_id;
  const occupied = await commands(found.revision, [
    { action: 'connect', from: { node_id: image.id, slot: 0 }, to: { node_id: preview, slot: 0 } },
  ]);
  assert.equal(occupied.error, 'INPUT_OCCUPIED');
  assert.equal((await commands(initial.revision, [
    { action: 'set_parameters', node_id: image.id, values: { width: 96 } },
  ])).error, 'GRAPH_CONFLICT');

  const run = async request_id => tool('workflow_run', { ...target,
    expected_revision: (await graph()).revision, request_id });
  await page.evaluate(id => {
    const app = window.comfyAPI.app.app;
    const widget = app.rootGraph.nodes.find(node => Number(node.id) === id).widgets.find(item => item.name === 'height');
    widget.beforeQueued = () => { widget.value = 72; };
    widget.afterQueued = () => { widget.value = 64; };
  }, image.id);
  const firstId = randomUUID();
  const first = await run(firstId);
  assert.equal(first.state, 'completed', JSON.stringify(first));
  assert.deepEqual(await tool('workflow_run', { ...target, expected_revision: first.submitted_revision, request_id: firstId }), first);
  const changed = await commands((await graph()).revision, [
    { action: 'set_parameters', node_id: image.id, values: { width: 96 } },
  ]);
  assert.equal(changed.state, 'completed', JSON.stringify({ changed, browser: await page.evaluate(() => ({
    dragging: window.comfyAPI.app.app.canvas.isDragging,
    focus: document.activeElement?.tagName,
    focusClass: document.activeElement?.className,
  })) }));
  const second = await run(randomUUID());
  assert.equal(second.state, 'completed', JSON.stringify(second));
  assert.equal(first.task_id, firstId);
  assert.match(second.task_id, /^[a-f0-9-]{36}$/i);
  assert.notEqual(first.task_id, second.task_id);
  for (const [id, width] of [[first.task_id, 64], [second.task_id, 96]]) {
    const item = await eventually(async () => {
      const response = await fetch(new URL('history/' + id, url));
      assert(response.ok);
      return (await response.json())[id];
    }, Boolean);
    assert.equal(item.status.status_str, 'success');
    assert.equal(item.prompt[2][image.id].inputs.width, width);
    assert.equal(item.prompt[2][image.id].inputs.height, 72);
    assert(item.outputs[preview]?.images?.length);
    const job = await tool('workflow_status', { request_id: id });
    assert.equal(job.task_id, id);
    assert.equal(job.state, 'completed');
    const artifact = await tool('artifact_get', { artifact_id: job.outputs[0].artifact_id });
    assert.equal(artifact.availability, 'available', JSON.stringify(artifact));
    const stopped = await tool('workflow_cancel', { task_id: id });
    assert.equal(stopped.cancel_requested, false);
  }
  // Evict the broker's bounded receipts, then replay the original request ID.
  for (let index = 0; index < 260; index++) await graph();
  const replay = await tool('workflow_run', { ...target, expected_revision: (await graph()).revision, request_id: firstId });
  assert.equal(replay.state, 'completed', JSON.stringify(replay));
  assert.equal(replay.task_id, firstId);
  assert.equal(replay.reused, true);
  assert.equal(replay.submitted_revision, undefined);
  assert.equal((await tool('workflow_status', { request_id: firstId })).state, 'completed');
  const saved = await tool('workflow_save', { ...target, expected_revision: (await graph()).revision,
    path: workflowName, request_id: randomUUID() });
  assert.equal(saved.state, 'completed', JSON.stringify(saved));
  const readback = await tool('workflow_get', { session_id, path: workflowName });
  assert.equal(readback.workflow.nodes.length, 2);
  assert((await tool('workflow_list', { session_id, query: workflowName })).items.some(row => row.path === workflowName));
  const importedName = `Agent Import ${randomUUID()}.json`;
  const imported = await tool('workflow_import', { session_id, path: importedName,
    workflow: readback.workflow, request_id: randomUUID() });
  assert.equal(imported.state, 'completed', JSON.stringify(imported));
  const moved = await tool('workflow_rename', { session_id, path: importedName, new_path: 'agent-fixtures/' + importedName,
    expected_file_revision: imported.file_revision, request_id: randomUUID() });
  assert.equal(moved.state, 'completed', JSON.stringify(moved));
  assert.equal((await tool('workflow_delete', { session_id, path: moved.path,
    expected_file_revision: moved.file_revision, request_id: randomUUID() })).deleted, true);
  const deleted = await commands((await graph()).revision, [
    { action: 'disconnect', node_id: preview, slot: 0 },
    { action: 'remove_node', node_id: preview },
  ]);
  assert.equal(deleted.state, 'completed');
  assert.equal((await graph()).nodes.length, 1);
  assert.equal((await graph()).links.length, 0);
  const reopened = await tool('workflow_open', { session_id, path: workflowName, request_id: randomUUID() });
  assert.equal(reopened.state, 'completed', JSON.stringify(reopened));
  assert.equal((await tool('canvas_get', { session_id, target_id: reopened.target_id })).nodes.length, 2);
  assert.equal((await tool('canvas_get', { session_id, target_id: initial.target_id })).error, 'CANVAS_TARGET_CHANGED');
  const existingDraft = await tool('workflow_open', { session_id, path: workflowName, request_id: randomUUID() });
  assert.equal(existingDraft.target_id, reopened.target_id);
  await page.evaluate(() => {
    const root = window.comfyAPI.app.app.rootGraph;
    root.convertToSubgraph(new Set(root.nodes));
  });
  const rootTarget = { session_id, target_id: reopened.target_id };
  const subgraphs = await tool('canvas_list_subgraphs', rootTarget);
  assert.equal(subgraphs.graphs.length, 2, JSON.stringify(subgraphs));
  const nested = await tool('canvas_open_subgraph', { ...rootTarget, graph_id: subgraphs.graphs[1].graph_id, request_id: randomUUID() });
  assert.equal(nested.scope, 'subgraph', JSON.stringify(nested));
  assert.equal((await tool('canvas_get', rootTarget)).error, 'CANVAS_TARGET_CHANGED');
  const root = await tool('canvas_open_subgraph', { session_id, target_id: nested.target_id, graph_id: 'root', request_id: randomUUID() });
  assert.equal(root.scope, 'root');
  if (process.env.ASTROPHOTO_AGENT_TEST_FITS) {
    const draft = await tool('workflow_new', { session_id, request_id: randomUUID() });
    target.target_id = draft.target_id;
    const wired = await commands((await graph()).revision, [
      { action: 'add_node', node_type: 'AstroPhotoFileSource', ref: 'source' },
      { action: 'set_parameters', ref: 'source', values: { source: process.env.ASTROPHOTO_AGENT_TEST_FITS } },
      { action: 'add_node', node_type: 'AstroPhotoSirilAutoStretch', ref: 'stretch' },
      { action: 'connect', from: { ref: 'source', slot: 0 }, to: { ref: 'stretch', slot: 0 } },
    ]);
    assert.equal(wired.state, 'completed', JSON.stringify(wired));
    const nodeTarget = { ...target, node_id: wired.results[2].node_id };
    const inspected = await tool('node_inspect', nodeTarget);
    assert.equal(inspected.input_state, 'available', JSON.stringify(inspected));
    const baseline = await tool('node_compare', { ...nodeTarget, input_ref: inspected.input_ref }, true);
    assert.equal(baseline.content.find(item => item.type === 'image')?.mimeType, 'image/png');
    assert.equal(baseline.structuredContent.images[0].side, 'input');
  }
  const anotherPage = await browser.newPage();
  await anotherPage.goto(url);
  await anotherPage.waitForFunction(() => window.comfyAPI?.app?.app?.isGraphReady);
  const twoPages = await eventually(() => tool('canvas_list_sessions'), result =>
    result.sessions.filter(row => row.state === 'completed').length >= 2);
  const secondSession = twoPages.sessions.find(row => row.session_id !== session_id && row.state === 'completed').session_id;
  const snapshots = await Promise.all([session_id, secondSession].map(session => tool('canvas_get', { session_id: session })));
  const simultaneousSave = `Agent Save Race ${randomUUID()}.json`;
  const saveRace = await Promise.all(snapshots.map((snapshot, index) => tool('workflow_save', {
    session_id: [session_id, secondSession][index], target_id: snapshot.target_id,
    expected_revision: snapshot.revision, path: simultaneousSave, request_id: randomUUID(),
  })));
  assert.deepEqual(saveRace.map(item => item.state).sort(), ['completed', 'rejected']);
  assert.equal(saveRace.find(item => item.state === 'rejected').error, 'WORKFLOW_EXISTS');
  const savedRace = await tool('workflow_get', { session_id, path: simultaneousSave });
  assert.equal(savedRace.file_revision, saveRace.find(item => item.state === 'completed').file_revision);
  const concurrentName = `Agent Concurrent ${randomUUID()}.json`;
  const competingGraphs = [readback.workflow, { ...readback.workflow, extra: { marker: 'second' } }];
  const saves = await Promise.all([session_id, secondSession].map((session, index) =>
    tool('workflow_import', { session_id: session, path: concurrentName,
      workflow: competingGraphs[index], request_id: randomUUID() })));
  assert.deepEqual(saves.map(item => item.state).sort(), ['completed', 'rejected']);
  assert.equal(saves.find(item => item.state === 'rejected').error, 'WORKFLOW_EXISTS');
  const actual = await tool('workflow_get', { session_id, path: concurrentName });
  assert.deepEqual(actual.workflow, competingGraphs[saves.findIndex(item => item.state === 'completed')]);
  await anotherPage.close();

  // Exercise the native promoted seed control through both submission entry points.
  const captured = [];
  await page.route('**/prompt', async route => {
    if (route.request().method() !== 'POST') return route.continue();
    const body = route.request().postDataJSON();
    captured.push(body);
    return route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ prompt_id: body.prompt_id || randomUUID(), number: 0, node_errors: {} }) });
  });
  const promoted = await page.evaluate(async () => {
    const app = window.comfyAPI.app.app;
    await app.extensionManager.setting.set('Comfy.WidgetControlMode', 'after');
    app.rootGraph.clear();
    const inner = window.LiteGraph.createNode('RandomNoise');
    app.rootGraph.add(inner);
    const seed = inner.widgets.find(widget => widget.name === 'noise_seed');
    seed.value = 10;
    inner.widgets.find(widget => widget.name === 'control_after_generate').value = 'increment';
    const { node, subgraph } = app.rootGraph.convertToSubgraph(new Set([inner]));
    const nested = subgraph.nodes.find(item => item.type === 'RandomNoise');
    const slot = nested.getSlotFromWidget(nested.widgets.find(widget => widget.name === 'noise_seed'));
    const input = subgraph.addInput('noise_seed', String(slot.type ?? '*'));
    if (!input.connect(slot, nested)) throw new Error('Promotion failed');
    const hostWidget = node.getWidgetFromSlot(node.inputs.find(item => item._subgraphSlot === input));
    if (!hostWidget) throw new Error('Promoted widget unavailable');
    await app.queuePrompt(0, 1);
    const afterNative = hostWidget.value;
    hostWidget.value = 10;
    return { nodeId: node.id, afterNative };
  });
  assert.equal(promoted.afterNative, 11);
  const promotedGraph = await tool('canvas_get', { session_id });
  assert.equal(promotedGraph.state, 'completed', JSON.stringify(promotedGraph));
  const promotedRun = await tool('workflow_run', { session_id, target_id: promotedGraph.target_id,
    expected_revision: promotedGraph.revision, request_id: randomUUID() });
  assert.equal(promotedRun.state, 'completed', JSON.stringify(promotedRun));
  const afterMcp = await page.evaluate(id => {
    const node = window.comfyAPI.app.app.rootGraph.nodes.find(item => item.id === id);
    return node.getWidgetFromSlot(node.inputs[0]).value;
  }, promoted.nodeId);
  assert.equal(afterMcp, 11);
  assert.equal(captured.length, 2);
  const seeds = captured.map(body => Object.values(body.prompt).find(node => node.class_type === 'RandomNoise').inputs.noise_seed);
  assert.deepEqual(seeds, [10, 10]);
  await page.evaluate(() => {
    const app = window.comfyAPI.app.app;
    app.rootGraph.clear();
    const image = window.LiteGraph.createNode('EmptyImage');
    const output = window.LiteGraph.createNode('PreviewImage');
    app.rootGraph.add(image); app.rootGraph.add(output); image.connect(0, output, 0);
  });
  const beforeRace = await tool('canvas_get', { session_id });
  await page.evaluate(() => {
    const app = window.comfyAPI.app.app;
    const otherRun = () => {
      app.api.removeEventListener('promptQueueing', otherRun);
      queueMicrotask(() => void app.queuePrompt(0, 1));
    };
    app.api.addEventListener('promptQueueing', otherRun);
  });
  const raceId = randomUUID();
  const raced = await tool('workflow_run', { session_id, target_id: beforeRace.target_id,
    expected_revision: beforeRace.revision, request_id: raceId });
  assert.equal(raced.state, 'completed', JSON.stringify(raced));
  assert.equal(raced.task_id, raceId);
  assert.equal(captured.length, 4);
  assert.equal(captured[2].prompt_id, undefined);
  assert.equal(captured[3].prompt_id, raceId);
  const beforeEdit = await tool('canvas_get', { session_id });
  await page.evaluate(() => {
    const app = window.comfyAPI.app.app;
    const editBeforeRun = () => {
      app.api.removeEventListener('promptQueueing', editBeforeRun);
      queueMicrotask(() => {
        app.rootGraph.nodes.find(node => node.type === 'EmptyImage')
          .widgets.find(widget => widget.name === 'width').value = 128;
      });
    };
    app.api.addEventListener('promptQueueing', editBeforeRun);
  });
  const conflict = await tool('workflow_run', { session_id, target_id: beforeEdit.target_id,
    expected_revision: beforeEdit.revision, request_id: randomUUID() });
  assert.equal(conflict.state, 'rejected', JSON.stringify(conflict));
  assert.equal(conflict.error, 'GRAPH_CONFLICT');
  assert.equal(captured.length, 4);
  console.log(JSON.stringify({ mode: process.argv.includes('--nodes-2') ? 'Nodes 2.0' : 'classic',
    edits: 'passed', workflow: workflowName, prompt_ids: [first.task_id, second.task_id] }));
} finally {
  try { await browser?.close(); } finally { mcp.kill(); }
}

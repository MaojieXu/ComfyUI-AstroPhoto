import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';

const url = process.env.COMFYUI_TEST_URL;
const baseline = process.env.ASTROPHOTO_BASELINE_WORKFLOW;
const evidence = process.env.ASTROPHOTO_MIGRATION_EVIDENCE;
assert(url && baseline && evidence, 'Set COMFYUI_TEST_URL, ASTROPHOTO_BASELINE_WORKFLOW and ASTROPHOTO_MIGRATION_EVIDENCE');
assert(['localhost', '127.0.0.1'].includes(new URL(url).hostname));
const nodesTwo = process.argv.includes('--nodes-2');
const mode = nodesTwo ? 'nodes-2' : 'classic';
const output = resolve(evidence, mode);
await mkdir(output, { recursive: true });
const original = JSON.parse(await readFile(baseline, 'utf8'));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
const requested = [];
page.on('pageerror', error => errors.push(error.message));
page.on('request', req => { if (req.url().includes('/astrophoto/v1/')) requested.push(req.url()); });
const setting = (key, value) => page.evaluate(([id, next]) => window.comfyAPI.app.app.extensionManager.setting.set(id, next), [key, value]);
const sidebarButton = page.locator('button').filter({ has: page.locator('.astrophoto-sidebar-icon') });
const sidebar = page.locator('.astrophoto-ui').filter({ has: page.locator('#ap-tab-assets') });
const screenshot = name => sidebar.screenshot({ path: join(output, name + '.png') });
const nodesMode = 'Comfy.VueNodes.Enabled';
let preferences;

async function dragOntoCanvas(row) {
  const canvas = page.locator('#graph-canvas');
  const point = await canvas.evaluate(element => {
    const bounds = element.getBoundingClientRect();
    // Nodes 2.0 may place a DOM-rendered node on top of the canvas.
    for (const y of [0.74, 0.62, 0.44, 0.27]) for (const x of [0.82, 0.73, 0.65, 0.56]) {
      if (document.elementFromPoint(bounds.left + bounds.width * x, bounds.top + bounds.height * y) === element) {
        return { x: bounds.width * x, y: bounds.height * y };
      }
    }
    throw new Error('No visible background target in active canvas');
  });
  await row.dragTo(canvas, { targetPosition: point });
}

try {
  await page.goto(url);
  await sidebarButton.waitFor();
  preferences = await page.evaluate(keys => keys.map(key => [key, window.comfyAPI.app.app.extensionManager.setting.get(key)]),
    ['Comfy.Locale', 'Comfy.ColorPalette', nodesMode, 'Comfy.NodeLibrary.Bookmarks.V2']);
  await setting('Comfy.Locale', 'en');
  await setting('Comfy.ColorPalette', 'dark');
  await setting(nodesMode, nodesTwo);
  await page.reload();
  await sidebarButton.waitFor();
  assert.equal(await page.evaluate(key => window.comfyAPI.app.app.extensionManager.setting.get(key), nodesMode), nodesTwo);
  const initialRequests = requested.length;
  if (!(await sidebar.isVisible())) await sidebarButton.click();
  await sidebar.locator('#ap-panel-assets').getByText('The assets page will be available in a future release.').waitFor();
  assert.equal(await sidebar.locator('#ap-tab-assets').getAttribute('aria-selected'), 'true');
  assert.equal(await sidebar.locator('#ap-panel-assets input, #ap-panel-assets button, #ap-panel-assets ul').count(), 0);
  assert.equal(await sidebarButton.count(), 1);
  assert(!requested.slice(initialRequests).some(path => /\/assets(?:[/?]|$)/.test(path)));
  await screenshot('assets');
  await setting('Comfy.Locale', 'zh');
  await sidebar.getByText('素材页将在后续版本提供。').waitFor();
  await screenshot('assets-zh');
  await setting('Comfy.Locale', 'en');
  await sidebar.getByRole('tab', { name: 'Settings', exact: true }).click();
  await screenshot('settings');
  const darkText = await sidebar.evaluate(root => getComputedStyle(root).color);
  await setting('Comfy.ColorPalette', 'light');
  await page.waitForFunction(color => getComputedStyle(document.querySelector('.astrophoto-host-container > .astrophoto-ui')).color !== color, darkText);
  await screenshot('settings-light');
  await setting('Comfy.ColorPalette', 'dark');
  for (const [name, file] of [['Storage', 'storage'], ['Environment', 'environment'], ['Equipment & Optics', 'equipment'], ['Software', 'software']]) {
    await sidebar.locator('.ap-module').getByText(name, { exact: true }).click();
    await sidebar.getByRole('heading', { name, exact: true }).waitFor();
    await screenshot(file);
    await sidebar.getByRole('button', { name: '← Back', exact: true }).first().click();
  }

  for (let i = 0; i < 3; i += 1) {
    await sidebarButton.click();
    await sidebar.waitFor({ state: 'hidden' });
    await sidebarButton.click();
    await sidebar.waitFor();
    assert.equal(await sidebar.count(), 1);
  }

  await page.evaluate(() => window.comfyAPI.app.app.loadGraphData({ last_node_id: 0, last_link_id: 0, nodes: [], links: [], groups: [], config: {}, extra: {}, version: 0.4 }));
  await sidebar.locator('#ap-tab-nodes').click();
  const search = sidebar.locator('input[type=search]');
  await search.fill('AstroPhotoImagePath');
  const row = sidebar.locator('.ap-resource').first();
  await row.waitFor();
  assert.equal(await sidebar.locator('.ap-resource').count(), 1);
  await row.hover();
  await page.locator('.astrophoto-node-preview').waitFor();
  await screenshot('nodes');
  const bookmark = row.locator('..').getByRole('button', { name: 'Bookmark node', exact: true });
  if (await bookmark.count()) {
    await bookmark.click();
    await page.waitForFunction(() => window.comfyAPI.app.app.extensionManager.setting.get('Comfy.NodeLibrary.Bookmarks.V2')?.includes('AstroPhotoImagePath'));
    await sidebar.getByRole('button', { name: 'Remove bookmark', exact: true }).first().click();
  }
  await row.click();
  await page.locator('.astrophoto-node-preview').waitFor({ state: 'detached' });
  const add = sidebar.getByRole('button', { name: /Add.*canvas/ });
  await add.click();
  const count = () => page.evaluate(() => window.comfyAPI.app.app.canvas.graph.nodes.filter(node => node.type === 'AstroPhotoImagePath').length);
  assert.equal(await count(), 1);
  await page.evaluate(() => window.comfyAPI.app.app.extensionManager.command.execute('Comfy.Undo'));
  await page.waitForFunction(() => window.comfyAPI.app.app.canvas.graph.nodes.length === 0);
  await page.evaluate(() => window.comfyAPI.app.app.extensionManager.command.execute('Comfy.Redo'));
  await page.waitForFunction(() => window.comfyAPI.app.app.canvas.graph.nodes.some(node => node.type === 'AstroPhotoImagePath'));

  await sidebar.getByRole('button', { name: '← Back', exact: true }).click();
  await row.waitFor();
  await dragOntoCanvas(row);
  await page.waitForFunction(() => window.comfyAPI.app.app.canvas.graph.nodes.filter(node => node.type === 'AstroPhotoImagePath').length === 2);

  // Keep the same sidebar and search mounted while the host toggles its renderer.
  const canvasChanges = [];
  for (const [enabled, expected] of [[!nodesTwo, 3], [nodesTwo, 4]]) {
    const previousCanvas = await page.evaluateHandle(() => window.comfyAPI.app.app.canvas.canvas);
    await setting(nodesMode, enabled);
    await page.waitForFunction(enabled => window.LiteGraph.vueNodesMode === enabled, enabled);
    assert.equal(await search.inputValue(), 'AstroPhotoImagePath');
    canvasChanges.push(await page.evaluate(previous => window.comfyAPI.app.app.canvas.canvas !== previous, previousCanvas));
    await previousCanvas.dispose();
    await dragOntoCanvas(row);
    await page.waitForFunction(expected => window.comfyAPI.app.app.canvas.graph.nodes
      .filter(node => node.type === 'AstroPhotoImagePath').length === expected, expected);
  }
  await page.evaluate(() => {
    const app = window.comfyAPI.app.app;
    const converted = app.canvas.graph.convertToSubgraph(new Set(app.canvas.graph.nodes));
    app.canvas.openSubgraph(converted.subgraph, converted.node);
  });
  await row.click();
  await add.click();
  assert.equal(await count(), 5);
  assert.equal(await page.evaluate(() => window.comfyAPI.app.app.rootGraph.nodes.length), 1);
  await sidebar.getByRole('button', { name: '← Back', exact: true }).click();
  await dragOntoCanvas(row);
  await page.waitForFunction(() => window.comfyAPI.app.app.canvas.graph.nodes.filter(node => node.type === 'AstroPhotoImagePath').length === 6);

  await page.evaluate(workflow => window.comfyAPI.app.app.handleFile(new File([JSON.stringify(workflow)],
    'AstroPhoto migration baseline.json', { type: 'application/json' })), original);
  const canvas = page.locator('.drawing-board canvas').first();
  await canvas.waitFor();
  assert.equal(await page.locator('.astrophoto-drawing-widget .toolbar').first().evaluate(toolbar => getComputedStyle(toolbar).display), 'flex');
  const litPixel = () => canvas.evaluate(element => element.getContext('2d').getImageData(60, 60, 1, 1).data[0]);
  await page.waitForFunction(() => document.querySelector('.drawing-board canvas')?.getContext('2d').getImageData(60, 60, 1, 1).data[0] === 0);
  assert.equal(await litPixel(), 0);
  const waitForDrawingPixel = expected => page.waitForFunction(value =>
    document.querySelector('.drawing-board canvas')?.getContext('2d').getImageData(190, 190, 1, 1).data[0] === value, expected);
  await waitForDrawingPixel(255);
  await canvas.evaluate(element => {
    const rect = element.getBoundingClientRect();
    for (const [type, offset] of [['mousedown', 170], ['mousemove', 190], ['mousemove', 210], ['mouseup', 210]]) {
      element.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX: rect.left + offset, clientY: rect.top + offset }));
    }
  });
  await waitForDrawingPixel(0);
  await page.evaluate(() => window.comfyAPI.app.app.extensionManager.command.execute('Comfy.Undo'));
  await waitForDrawingPixel(255);
  await page.evaluate(() => window.comfyAPI.app.app.extensionManager.command.execute('Comfy.Redo'));
  await waitForDrawingPixel(0);
  const upload = page.waitForResponse(response => response.url().endsWith('/upload/image') && response.request().method() === 'POST');
  const submitted = await page.evaluate(async () => {
    const app = window.comfyAPI.app.app;
    const prompt = await app.graphToPrompt();
    const node = prompt.workflow.nodes.find(item => item.type === 'vue-basic');
    return { workflow: prompt.workflow, value: prompt.output[node.id].inputs.custom_vue_component_basic };
  });
  const receipt = await upload;
  assert(receipt.ok(), await receipt.text());
  assert.match(submitted.value.image, /^threed\/.+ \[temp\]$/);
  assert(submitted.workflow.nodes.some(item => item.type === 'AstroPhotoFITSSource'));
  assert(submitted.workflow.nodes.some(item => item.type === 'AstroPhotoSirilAutoStretch'));
  await page.evaluate(workflow => window.comfyAPI.app.app.loadGraphData(workflow), submitted.workflow);
  await page.waitForFunction(() => document.querySelector('.drawing-board canvas')?.getContext('2d').getImageData(60, 60, 1, 1).data[0] === 0);
  await waitForDrawingPixel(0);
  await page.screenshot({ path: join(output, 'workflow.png') });
  assert.deepEqual(errors, []);
  await writeFile(join(output, 'report.json'), JSON.stringify({ mode, canvasChanges, requested, errors, pixels: await litPixel(), upload: submitted.value }, null, 2));
  console.log('PASS', mode, 'default Assets, settings, one sidebar, node search/hover/add/undo/drag, workflow pixels and temp PNG reference');
} catch (error) {
  await page.screenshot({ path: join(output, 'failure.png') }).catch(() => {});
  await writeFile(join(output, 'failed.json'), JSON.stringify({ mode, requested, errors, error: String(error) }, null, 2));
  throw error;
} finally {
  if (preferences) for (const pair of preferences) await setting(...pair);
  await browser.close();
}

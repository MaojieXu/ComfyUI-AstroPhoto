// Explicit integration test against an already running host. Isolated browser,
// never changes host packages or writes a workflow to the user's server library.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const url = process.env.COMFYUI_TEST_URL;
if (!url) throw new Error('Set COMFYUI_TEST_URL to opt in to live host verification');
const output = new URL('../../.artifact/react-sidebar/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
const errors = [], evidence = [];
page.on('pageerror', e => errors.push(e.message));
let preferences;
const check = (name, detail) => { evidence.push({ name, detail }); console.log('PASS', name, detail ?? ''); };
try {
  await page.goto(url);
  await page.getByRole('button', { name: 'AstroPhoto', exact: true }).click();
  await page.locator('.astrophoto-ui').waitFor();
  preferences = await page.evaluate(() => {
    const settings = window.comfyAPI.app.app.extensionManager.setting;
    return Object.fromEntries(['Comfy.Locale', 'Comfy.ColorPalette'].map(key => [key, settings.get(key)]));
  });
  await page.evaluate(() => window.comfyAPI.app.app.extensionManager.setting.set('Comfy.Locale', 'en'));
  await page.getByRole('tab', { name: 'Assets', exact: true }).waitFor();
  await page.getByText('The backend reports that asset management is unavailable.').waitFor();
  assert.equal(await page.getByRole('button', { name: 'AstroPhoto', exact: true }).count(), 1);
  assert.equal(await page.getByRole('button', { name: 'Import capture directory' }).isDisabled(), true);
  check('one sidebar, default assets, real unavailable state');
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: 'AstroPhoto', exact: true }).click();
    await page.getByRole('button', { name: 'AstroPhoto', exact: true }).click();
    await page.locator('.astrophoto-ui').waitFor();
    assert.equal(await page.locator('.astrophoto-ui').count(), 1);
  }
  check('close/reopen does not duplicate root');
  await page.getByRole('tab', { name: 'Settings', exact: true }).click();
  assert.equal(await page.getByText('General', { exact: true }).count(), 0);
  for (const title of ['Storage', 'Software', 'Equipment & Optics', 'Observing Sites', 'Knowledge', 'Memory & Privacy', 'Agent Context & MCP', 'System Status']) {
    await page.getByText(title, { exact: true }).click();
    await page.getByRole('heading', { name: title, exact: true }).waitFor();
    await page.getByRole('button', { name: '← Back' }).click();
  }
  check('all eight settings modules, no General');
  await page.evaluate(() => window.comfyAPI.app.app.extensionManager.setting.set('Comfy.Locale', 'zh'));
  await page.getByRole('tab', { name: '设置', exact: true }).waitFor();
  await page.reload();
  await page.getByRole('button', { name: 'AstroPhoto', exact: true }).click();
  await page.getByRole('tab', { name: '设置', exact: true }).click();
  await page.getByText('存储', { exact: true }).waitFor();
  assert.equal(await page.getByText('常规', { exact: true }).count(), 0);
  await page.evaluate(() => window.comfyAPI.app.app.extensionManager.setting.set('Comfy.Locale', 'en'));
  await page.getByRole('tab', { name: 'Settings', exact: true }).waitFor();
  check('follows host language live and after reload');
  const colors = [];
  for (const palette of ['light', 'dark']) {
    await page.evaluate(value => window.comfyAPI.app.app.extensionManager.setting.set('Comfy.ColorPalette', value), palette);
    await page.waitForTimeout(300);
    colors.push(await page.locator('.astrophoto-ui').evaluate(e => getComputedStyle(e).color));
    await page.screenshot({ path: new URL(`sidebar-${palette}.png`, output).pathname.replace(/^\/(.:)/, '$1') });
  }
  assert.notEqual(colors[0], colors[1]); check('native light/dark tokens', colors);
  const geometry = await page.locator('.astrophoto-ui').evaluate(root => {
    const parent = root.parentElement;
    const original = parent.style.cssText;
    const results = [];
    for (const width of [280, 650]) {
      parent.style.width = width + 'px';
      results.push({ width, client: root.clientWidth, scroll: root.scrollWidth });
    }
    parent.style.cssText = original;
    return results;
  });
  assert(geometry.every(g => g.scroll <= g.client)); check('280/650 CSS width overflow check', geometry);
  // Load a temporary empty graph only in this fresh browser context.
  await page.evaluate(async () => {
    const app = window.comfyAPI.app.app;
    await app.loadGraphData({ last_node_id: 0, last_link_id: 0, nodes: [], links: [], groups: [], config: {}, extra: {}, version: 0.4 });
  });
  await page.getByRole('tab', { name: 'Nodes', exact: true }).click();
  await page.locator('.astrophoto-ui').getByRole('button', { name: 'examples', exact: true }).click();
  await page.getByRole('button', { name: 'Add Vue Basic to canvas' }).click();
  await page.getByText('Node created. Save the workflow using ComfyUI.').waitFor();
  const count = () => page.evaluate(() => window.comfyAPI.app.app.canvas.graph.nodes.filter(n => n.type === 'vue-basic').length);
  assert.equal(await count(), 1);
  await page.evaluate(() => window.comfyAPI.app.app.extensionManager.command.execute('Comfy.Undo'));
  await page.waitForFunction(() => window.comfyAPI.app.app.canvas.graph.nodes.length === 0);
  await page.evaluate(() => window.comfyAPI.app.app.extensionManager.command.execute('Comfy.Redo'));
  await page.waitForFunction(() => window.comfyAPI.app.app.canvas.graph.nodes.some(n => n.type === 'vue-basic'));
  check('click add + native Undo/Redo');
  // Use a real browser drag from the resource row to the host canvas.
  const canvas = page.locator('#graph-canvas');
  await page.locator('.ap-resource').first().dragTo(canvas, { targetPosition: { x: 1150, y: 250 } });
  await page.waitForFunction(() => window.comfyAPI.app.app.canvas.graph.nodes.filter(n => n.type === 'vue-basic').length === 2);
  check('HTML5 cross-region drag creates exactly one node');
  const before = await count();
  await page.locator('.ap-resource').first().dragTo(page.locator('.astrophoto-ui header'));
  assert.equal(await count(), before); check('drop outside canvas does not create node');
  await page.evaluate(() => { window.comfyAPI.app.app.canvas.selectOnly = true; });
  await page.getByRole('button', { name: 'Add Vue Basic to canvas' }).click();
  await page.getByRole('alert').filter({ hasText: 'Could not create a node.' }).waitFor();
  assert.equal(await count(), before);
  await page.evaluate(() => { window.comfyAPI.app.app.canvas.selectOnly = false; });
  check('select-only canvas rejects mutation');
  // Existing Vue widget: real DOM Canvas -> serializeValue -> upload -> Python IMAGE.
  const drawing = page.locator('.drawing-board canvas').first();
  await drawing.evaluate(canvas => {
    const rect = canvas.getBoundingClientRect();
    for (const [type, offset] of [['mousedown', 30], ['mousemove', 60], ['mousemove', 100], ['mouseup', 100]]) {
      canvas.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX: rect.left + offset, clientY: rect.top + offset }));
    }
  });
  const pixel = await drawing.evaluate(canvas => Array.from(canvas.getContext('2d').getImageData(60, 60, 1, 1).data));
  assert(pixel[0] < 255);
  if (!process.argv.includes('--skip-image-execution')) {
  const execution = await page.evaluate(async () => {
    const app = window.comfyAPI.app.app;
    const node = app.canvas.graph.nodes.find(n => n.type === 'vue-basic');
    const value = await node.widgets[0].serializeValue(node, 0);
    const prompt = await app.api.queuePrompt(0, { output: {
      '1': { class_type: 'vue-basic', inputs: { custom_vue_component_basic: value } },
      '2': { class_type: 'PreviewImage', inputs: { images: ['1', 0] } }
    }, workflow: (await app.graphToPrompt()).workflow });
    return { value, promptId: prompt.prompt_id };
  });
  assert.match(execution.value.image, /^threed\/.+ \[temp\]$/);
  let history;
  for (let i = 0; i < 100; i++) {
    history = await page.evaluate(async id => (await (await window.comfyAPI.app.app.api.fetchApi('/history/' + id)).json())[id], execution.promptId);
    if (history?.status?.completed || history?.status?.status_str === 'error') break;
    await page.waitForTimeout(100);
  }
  if (history?.status?.status_str === 'success' && history.outputs['2'].images.length > 0) {
    check('Vue drawing / PNG upload / V3 LoadImage / PreviewImage execution', execution);
  } else {
    evidence.push({ name: 'IMAGE execution', result: 'FAIL', detail: history?.status, execution });
    await writeFile(new URL('image-execution-failure.json', output), JSON.stringify(history, null, 2));
    console.error('FAIL existing Python LoadImage path contract; see image-execution-failure.json');
    process.exitCode = 1;
  }
  } else {
    evidence.push({ name: 'IMAGE execution', result: 'SKIP', detail: 'Explicit --skip-image-execution; backend unchanged by user request.' });
    console.log('SKIP IMAGE execution (explicit flag)');
  }
  const saved = await page.evaluate(async () => (await window.comfyAPI.app.app.graphToPrompt()).workflow);
  assert.match(saved.nodes[0].widgets_values[0].canvasDataURL, /^data:image\/png;base64,/);
  await writeFile(new URL('workflow.json', output), JSON.stringify(saved, null, 2));
  await page.evaluate(async workflow => {
    await window.comfyAPI.app.app.handleFile(new File([JSON.stringify(workflow)], 'AstroPhoto-sidebar-test.json', { type: 'application/json' }));
  }, saved);
  assert.equal(await count(), 2); check('native graphToPrompt / handleFile workflow round-trip');
  await page.waitForFunction(() => document.querySelector('.drawing-board canvas')?.getContext('2d').getImageData(60, 60, 1, 1).data[0] === 0);
  const restoredPixel = await drawing.evaluate(canvas => Array.from(canvas.getContext('2d').getImageData(60, 60, 1, 1).data));
  if (restoredPixel[0] === 255) {
    evidence.push({ name: 'Existing Vue pixels restored after workflow reload', result: 'FAIL', detail: { before: pixel, after: restoredPixel } });
    console.error('FAIL existing Vue widget does not restore drawing pixels after reload');
    process.exitCode = 1;
  } else check('Vue drawing pixels restored');
  const subgraph = await page.evaluate(() => {
    const app = window.comfyAPI.app.app;
    const result = app.canvas.graph.convertToSubgraph(new Set(app.canvas.graph.nodes));
    app.canvas.openSubgraph(result.subgraph, result.node);
    return { keys: Object.keys(result), result: result.node?.id };
  });
  check('subgraph conversion setup', subgraph);
  await page.getByRole('button', { name: 'Add Vue Basic to canvas' }).click();
  await page.waitForFunction(() => window.comfyAPI.app.app.canvas.graph.nodes.filter(n => n.type === 'vue-basic').length === 3);
  assert.equal(await page.evaluate(() => window.comfyAPI.app.app.rootGraph.nodes.length), 1);
  check('node added to active Subgraph, not root');
  const extensions = await (await page.request.get(new URL('extensions', url.endsWith('/') ? url : url + '/').href)).json();
  const own = extensions.filter(path => path.includes('ComfyUI_AstroPhoto'));
  assert.equal(own.length, 1); check('one discovered JS entry', own);
  assert.equal((await page.request.get(new URL('extensions/ComfyUI_AstroPhoto/assets/main.css', url.endsWith('/') ? url : url + '/').href)).status(), 200);
  check('CSS HTTP 200');
  assert.deepEqual(errors, []);
} finally {
  if (preferences) await page.evaluate(values => {
    const settings = window.comfyAPI.app.app.extensionManager.setting;
    return Promise.all(Object.entries(values).filter(([, value]) => value !== undefined).map(([key, value]) => settings.set(key, value)));
  }, preferences).catch(() => {});
  await writeFile(new URL('host-evidence.json', output), JSON.stringify({ evidence, errors }, null, 2));
  await browser.close();
}

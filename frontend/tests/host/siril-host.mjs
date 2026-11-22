// Real Windows/macOS/Linux host smoke test. Use a dedicated AstroPhoto Data Root.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, mkdir, realpath, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';

const { COMFYUI_TEST_URL: url, ASTROPHOTO_SIRIL_TEST_CLI: cli,
  ASTROPHOTO_SIRIL_TEST_FITS: fits, ASTROPHOTO_SIRIL_EVIDENCE: evidence } = process.env;
assert(url && cli && fits && evidence, 'Set live host URL, CLI, FITS and evidence directory');
assert(['localhost', '127.0.0.1'].includes(new URL(url).hostname));
await mkdir(evidence, { recursive: true });
const checksum = async path => createHash('sha256').update(await readFile(path)).digest('hex');
const sourceHash = await checksum(fits);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', err => errors.push(err.message));
const api = async (path, data, method = data ? 'POST' : 'GET') => {
  const response = await page.request.fetch(new URL('/astrophoto/v1' + path, url).href, {
    method, data, headers: { 'X-AstroPhoto-Local': '1', 'Sec-Fetch-Site': 'same-origin' },
  });
  assert(response.ok(), path + ': ' + await response.text());
  return response.json();
};
const button = name => page.getByRole('button', { name, exact: true });
const sidebar = page.locator('button').filter({ has: page.locator('.astrophoto-sidebar-icon') });
const mode = 'Comfy.VueNodes.Enabled';
let preferences;
try {
  await page.goto(url);
  await page.waitForFunction(() => window.comfyAPI?.app?.app?.extensionManager?.getSidebarTabs?.().some(tab => tab.id === 'astrophoto.sidebar'));
  preferences = await page.evaluate(keys => keys.map(key => [key, window.comfyAPI.app.app.extensionManager.setting.get(key)]),
    ['Comfy.Locale', 'Comfy.ColorPalette', mode]);
  const setMode = process.argv.includes('--nodes-2');
  await page.evaluate(([key, value]) => window.comfyAPI.app.app.extensionManager.setting.set(key, value), [mode, setMode]);
  await page.reload();
  await sidebar.waitFor();
  assert.equal(await page.evaluate(key => window.comfyAPI.app.app.extensionManager.setting.get(key), mode), setMode);
  try { await sidebar.click({ timeout: 4000 }); }
  catch {
    // ComfyUI opens the template browser on a fresh user profile.
    await page.keyboard.press('Escape');
    await sidebar.click();
  }
  await page.evaluate(() => window.comfyAPI.app.app.extensionManager.setting.set('Comfy.Locale', 'en'));
  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.locator('.ap-module').filter({ hasText: 'Software' }).click();
  await page.locator('.ap-software-open').filter({ has: page.getByText('Siril', { exact: true }) }).click();
  await page.getByRole('heading', { name: 'Siril', exact: true }).waitFor();
  const catalogue = await api('/software/siril/commands');
  const nodesExpected = catalogue.commands.filter(entry => entry.scriptable).map(entry => entry.node_id).sort();
  assert.equal(catalogue.commands.length, 201);
  assert.equal(nodesExpected.length, 183);
  const objectInfo = await page.request.get(new URL('/object_info', url).href);
  assert.deepEqual(Object.keys(await objectInfo.json()).filter(id => id.startsWith('AstroPhotoSiril')).sort(), nodesExpected);
  await button('Siril commands').click();
  await page.getByLabel('Search Siril commands').fill('crop');
  const cropCommand = page.locator('.ap-siril-commands summary').filter({ has: page.getByText('crop', { exact: true }) });
  await cropCommand.click();
  await page.getByText('crop [x y width height]', { exact: true }).waitFor();
  await page.screenshot({ path: join(evidence, 'command-catalogue.png') });
  await button('Siril commands').click();
  console.log('PASS 183 native CLI nodes and searchable full command catalogue');
  if (process.argv.includes('--expect-discovery')) {
    await button('Detect installed Siril').click();
    await page.locator('.ap-software li').filter({ hasText: resolve(cli) }).getByRole('button', { name: 'Select' }).click();
  }
  await page.getByLabel('Siril CLI executable path').fill(resolve(cli));
  await button('Verify and save').click();
  await page.getByText('Siril 1.4.5 · CLI and AutoStretch verified', { exact: true }).waitFor();
  await page.screenshot({ path: join(evidence, 'software-ready.png') });
  await page.getByLabel('Siril CLI executable path').fill(join(evidence, 'missing', 'siril-cli.exe'));
  await button('Verify and save').click();
  await page.getByRole('alert').filter({ hasText: 'Siril CLI was not found' }).waitFor();
  assert.equal((await api('/software/siril')).path, resolve(cli));
  const storage = await api('/storage');
  const secondary = join(await realpath(evidence), 'secondary workspace');
  const existing = storage.workspaces.find(row => row.root_path === secondary || row.path === secondary);
  const workspace = existing ?? await api('/storage/locations', { path: secondary, name: 'Siril integration' });
  await api('/storage/settings', { expected_revision: storage.imports.revision, workspace: { default_workspace_id: workspace.id } }, 'PATCH');
  console.log('PASS verified configuration and rejected bad path');
  await sidebar.click();
  const nodes = await page.evaluate(async () => {
    const app = window.comfyAPI.app.app;
    await app.loadGraphData({ last_node_id: 0, last_link_id: 0, nodes: [], links: [], groups: [], config: {}, extra: {}, version: 0.4 });
    const graph = app.rootGraph;
    const source = window.LiteGraph.createNode('AstroPhotoFITSSource');
    const stretch = window.LiteGraph.createNode('AstroPhotoSirilAutoStretch');
    source.pos = [100, 210]; stretch.pos = [520, 210];
    graph.add(source); graph.add(stretch);
    source.connect(0, stretch, 0);
    app.canvas.ds.scale = 1;
    app.canvas.ds.offset = [0, 0];
    app.canvas.setDirty(true, true);
    return { source: source.id, stretch: stretch.id };
  });
  const picker = page.getByLabel('FITS path on the ComfyUI server');
  await picker.fill(resolve(fits));
  const image = page.locator('.ap-siril-main img');
  await image.waitFor();
  const changes = [['targetbg', 0.32], ['shadowsclip', -2.3]];
  if (!process.argv.includes('--expect-unaligned')) changes.push(['linked', false]);
  for (const [name, value] of changes) {
    const previousPreview = await image.getAttribute('src');
    await page.evaluate(({ id, name, value }) => {
      const app = window.comfyAPI.app.app;
      const node = app.rootGraph.getNodeById(id);
      const widget = node.widgets.find(row => row.name === name);
      const previous = widget.value;
      widget.value = value;
      node.onWidgetChanged?.(name, value, previous, widget);
      app.rootGraph.change();
      app.canvas.setDirty(true, true);
    }, { id: nodes.stretch, name, value });
    await page.waitForFunction(old => {
      const image = document.querySelector('.ap-siril-main img');
      return image?.complete && image.src !== old;
    }, previousPreview);
  }
  assert.equal(await image.count(), 1);
  await button('Open image').click();
  const inspector = page.getByRole('dialog', { name: 'Image comparison' });
  await inspector.waitFor();
  assert.equal(await button('Side by side').getAttribute('aria-pressed'), 'true');
  assert.equal(await inspector.locator('img').count(), 2);
  await page.screenshot({ path: join(evidence, 'inspector-side.png') });
  const pane = await inspector.locator('.ap-inspector-pane').first().boundingBox();
  await page.mouse.move(pane.x + pane.width / 2, pane.y + pane.height / 2);
  await page.mouse.down();
  await page.mouse.move(pane.x + pane.width / 2 + 60, pane.y + pane.height / 2 + 50, { steps: 4 });
  await page.mouse.up();
  const transforms = await inspector.locator('img').evaluateAll(images => images.map(image => getComputedStyle(image).transform));
  assert.equal(transforms[0], transforms[1]);
  assert.match(transforms[0], /60, 50/);
  await button('Fit').click();
  if (process.argv.includes('--expect-unaligned')) {
    assert(await page.evaluate(id => window.comfyAPI.app.app.rootGraph.getNodeById(id).widgets.find(row => row.name === 'linked').disabled, nodes.stretch));
    assert(await button('Sliding divider').isDisabled());
    await inspector.getByText(/Wipe requires aligned images/).waitFor();
  } else {
    await button('Sliding divider').click();
    const divider = inspector.getByRole('slider');
    await divider.press('ArrowRight');
    assert.equal(await divider.getAttribute('aria-valuenow'), '52');
    const marker = await divider.boundingBox();
    await page.mouse.move(marker.x + marker.width / 2, marker.y + marker.height / 2);
    await page.mouse.down();
    await page.mouse.move(marker.x + 125, marker.y + marker.height / 2, { steps: 5 });
    await page.mouse.up();
    assert(Number(await divider.getAttribute('aria-valuenow')) > 55);
    await page.screenshot({ path: join(evidence, 'inspector-wipe.png') });
  }
  await button('Single image').click();
  await button('Before').click();
  assert.equal(await inspector.locator('img').count(), 1);
  await button('Zoom in').click();
  await button('Fit').click();
  await page.screenshot({ path: join(evidence, 'inspector-single.png') });
  const colors = [];
  for (const palette of ['light', 'dark']) {
    await page.evaluate(value => window.comfyAPI.app.app.extensionManager.setting.set('Comfy.ColorPalette', value), palette);
    await page.waitForTimeout(350);
    colors.push(await inspector.evaluate(element => getComputedStyle(element).color));
  }
  assert.notEqual(colors[0], colors[1]);
  await page.evaluate(() => window.comfyAPI.app.app.extensionManager.setting.set('Comfy.Locale', 'zh'));
  await page.getByRole('button', { name: '打开大图', exact: true }).waitFor();
  if (!(await page.getByRole('dialog', { name: '图像对比' }).isVisible())) await button('打开大图').click();
  await button('左右并排').waitFor();
  await page.getByRole('dialog', { name: '图像对比' }).getByRole('button', { name: '关闭', exact: true }).click();
  await page.evaluate(() => window.comfyAPI.app.app.extensionManager.setting.set('Comfy.Locale', 'en'));
  await button('Open image').waitFor();
  console.log('PASS single preview refresh, Inspector, themes and locale');

  const prompt = await page.evaluate(async () => {
    const app = window.comfyAPI.app.app;
    const graphPrompt = await app.graphToPrompt();
    const run = await app.api.queuePrompt(0, graphPrompt);
    return { workflow: graphPrompt.workflow, promptId: run.prompt_id };
  });
  let history;
  for (let i = 0; i < 150; ++i) {
    const response = await page.request.get(new URL('/history/' + prompt.promptId, url).href);
    history = (await response.json())[prompt.promptId];
    if (history?.status?.completed || history?.status?.status_str === 'error') break;
    await page.waitForTimeout(100);
  }
  assert.equal(history?.status?.status_str, 'success', JSON.stringify(history?.status));
  const output = history.outputs[nodes.stretch].astrophoto_output[0];
  const outputPath = join(secondary, 'outputs', output, 'stretched.fit');
  const manifest = JSON.parse(await readFile(join(secondary, 'outputs', output, 'manifest.json'), 'utf-8'));
  assert.equal(manifest.output_id, output);
  assert.equal(manifest.parameters.targetbg, 0.32);
  assert.equal(manifest.parameters.shadowsclip, -2.3);
  assert.equal(manifest.parameters.linked, false);
  assert([-32, 16].includes(manifest.output.bitpix));
  assert.equal(manifest.source_sha256, sourceHash);
  assert.equal(await checksum(fits), sourceHash);
  assert.equal(await checksum(outputPath), manifest.output_sha256);
  await page.locator('.ap-node-preview-badge').filter({ hasText: 'Formal result' }).waitFor();
  assert(!(await api('/library/assets')).items.some(asset => asset.id === output));
  await button('Open image').click();
  await inspector.getByRole('button', { name: 'Add to Assets', exact: true }).click();
  await inspector.getByRole('button', { name: 'Added to Assets', exact: true }).waitFor();
  assert((await api('/library/assets')).items.some(asset => asset.id === output));
  await inspector.getByRole('button', { name: 'Close', exact: true }).click();
  await writeFile(join(evidence, 'workflow.json'), JSON.stringify(prompt.workflow, null, 2));
  await page.evaluate(async workflow => {
    await window.comfyAPI.app.app.handleFile(new File([JSON.stringify(workflow)], 'Siril verification.json', { type: 'application/json' }));
  }, prompt.workflow);
  await image.waitFor();
  assert.equal(await picker.inputValue(), resolve(fits));
  const restored = await page.evaluate(async () => (await window.comfyAPI.app.app.graphToPrompt()).output);
  assert.deepEqual(restored[nodes.stretch].inputs.image_path, [String(nodes.source), 0]);
  assert.equal(restored[nodes.stretch].inputs.targetbg, 0.32);
  assert.equal(restored[nodes.stretch].inputs.shadowsclip, -2.3);
  const cliPrompt = await page.evaluate(async sourcePath => {
    const app = window.comfyAPI.app.app;
    const graph = app.rootGraph;
    const crop = window.LiteGraph.createNode('AstroPhotoSiril_crop');
    const gauss = window.LiteGraph.createNode('AstroPhotoSirilGaussianBlur');
    const negative = window.LiteGraph.createNode('AstroPhotoSirilNegative');
    const path = window.LiteGraph.createNode('AstroPhotoImagePath');
    path.widgets.find(row => row.name === 'image_path').value = sourcePath;
    crop.widgets.find(row => row.name === 'arguments').value = '[0, 0, 32, 32]';
    path.pos = [100, 550]; crop.pos = [520, 550]; gauss.pos = [930, 550]; negative.pos = [1450, 550];
    for (const node of [path, crop, gauss, negative]) graph.add(node);
    path.connect(0, crop, crop.findInputSlot('image_path'));
    crop.connect(0, gauss, 0);
    gauss.connect(0, negative, 0);
    const prompt = await app.graphToPrompt();
    const run = await app.api.queuePrompt(0, prompt);
    return { promptId: run.prompt_id, crop: crop.id, gauss: gauss.id, negative: negative.id };
  }, resolve(fits));
  let cliHistory;
  for (let i = 0; i < 250; ++i) {
    const response = await page.request.get(new URL('/history/' + cliPrompt.promptId, url).href);
    cliHistory = (await response.json())[cliPrompt.promptId];
    if (cliHistory?.status?.completed || cliHistory?.status?.status_str === 'error') break;
    await page.waitForTimeout(100);
  }
  assert.equal(cliHistory?.status?.status_str, 'success', JSON.stringify(cliHistory?.status));
  const cropOutput = cliHistory.outputs[cliPrompt.crop].astrophoto_siril_path[0];
  assert.match(cropOutput, /_astrophoto_current[.]fit$/);
  const gaussId = cliHistory.outputs[cliPrompt.gauss].astrophoto_output[0];
  const negId = cliHistory.outputs[cliPrompt.negative].astrophoto_output[0];
  const gaussManifest = JSON.parse(await readFile(join(secondary, 'outputs', gaussId, 'manifest.json'), 'utf-8'));
  const negManifest = JSON.parse(await readFile(join(secondary, 'outputs', negId, 'manifest.json'), 'utf-8'));
  assert.equal(gaussManifest.command_id, 'gauss');
  assert.equal(negManifest.command_id, 'neg');
  assert.equal(gaussManifest.source_sha256, await checksum(cropOutput));
  assert.equal(negManifest.source_sha256, gaussManifest.output_sha256);
  assert.equal(await checksum(fits), sourceHash);
  await writeFile(join(evidence, 'cli-run.json'), JSON.stringify({ ...cliPrompt, gaussId, negId, cropOutput }, null, 2));
  console.log('PASS native crop → Gaussian Blur → Negative path chain');
  assert.deepEqual(errors, []);
  await writeFile(join(evidence, 'run.json'), JSON.stringify({ ...nodes, sourceHash, promptId: prompt.promptId, output, manifest }, null, 2));
  console.log('PASS formal ComfyUI run, secondary Workspace, source hash, save and reopen', prompt.promptId, output);
} catch (error) {
  await page.screenshot({ path: join(evidence, 'failure.png') }).catch(() => {});
  console.error('Browser errors', errors);
  throw error;
} finally {
  if (preferences) for (const pair of preferences)
    await page.evaluate(([key, value]) => window.comfyAPI.app.app.extensionManager.setting.set(key, value), pair).catch(() => {});
  await browser.close();
}


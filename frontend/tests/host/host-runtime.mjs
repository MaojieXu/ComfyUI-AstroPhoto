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
const libraryMutations = [];
const requestFailures = [];
page.on('pageerror', error => errors.push(error.stack ?? error.message));
page.on('requestfailed', req => requestFailures.push({ url: req.url(), error: req.failure()?.errorText }));
page.on('request', req => {
  if (req.url().includes('/astrophoto/v1/')) requested.push(req.url());
  if (req.url().includes('/astrophoto/v1/library/') && req.method() !== 'GET') libraryMutations.push(req.method());
});
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
  const expected = await canvas.evaluate((element, point) => {
    const rect = element.getBoundingClientRect();
    const app = window.comfyAPI.app.app;
    return app.clientPosToCanvasPos([rect.left + point.x, rect.top + point.y]);
  }, point);
  await row.dragTo(canvas, { targetPosition: point });
  const actual = await page.evaluate(() => [...window.comfyAPI.app.app.canvas.graph.nodes.at(-1).pos]);
  assert(actual.every((value, index) => Math.abs(value - expected[index]) < 3),
    `host Node Library position: expected ${expected}, received ${actual}`);
}

async function expectEditRejected(add, count, initialCount) {
  for (const flag of ['read_only', 'selectOnly']) {
    await page.evaluate(flag => { window.comfyAPI.app.app.canvas[flag] = true; }, flag);
    try {
      await add.click();
      await sidebar.getByText('Could not create a node.', { exact: false }).waitFor();
      assert.equal(await count(), initialCount);
    } finally {
      await page.evaluate(flag => { window.comfyAPI.app.app.canvas[flag] = false; }, flag);
    }
  }
}

async function expectInsertionRolledBack(add, count, initialCount) {
  const allocatedId = () => page.evaluate(() => window.comfyAPI.app.app.canvas.graph.state.lastNodeId);
  const previousNodeId = await allocatedId();
  const restoreAdd = await page.evaluateHandle(() => {
    const graph = window.comfyAPI.app.app.canvas.graph;
    const previousAdd = graph.add;
    graph.add = function (node, options) {
      previousAdd.call(this, node, options);
      throw new Error('test fault after graph insertion');
    };
    return () => { graph.add = previousAdd; };
  });
  try {
    await add.click();
    await sidebar.getByText('Could not create a node.', { exact: false }).waitFor();
    assert.equal(await count(), initialCount);
    assert.equal(await allocatedId(), previousNodeId);
  } finally {
    await restoreAdd.evaluate(restore => restore());
    await restoreAdd.dispose();
  }
}

async function verifyNativeLibrary(expectedBefore) {
  const nativeRow = page.getByRole('treeitem').filter({ hasText: /^AstroPhoto Image Path$/ }).first();
  await nativeRow.waitFor();
  const pointer = await nativeRow.evaluate(element => {
    const rect = element.getBoundingClientRect();
    return window.comfyAPI.app.app.clientPosToCanvasPos([rect.left + rect.width / 2, rect.top + rect.height / 2]);
  });
  const count = () => page.evaluate(() => window.comfyAPI.app.app.canvas.graph.nodes.length);
  assert.equal(await count(), expectedBefore);
  await nativeRow.dblclick();
  assert.equal(await count(), expectedBefore + 1);
  const click = await page.evaluate(() => [...window.comfyAPI.app.app.canvas.graph.nodes.at(-1).pos]);
  assert(click.every((value, index) => Math.abs(value - pointer[index]) < 3),
    `native pointer placement: expected ${pointer}, received ${click}`);
  await dragOntoCanvas(nativeRow);
  assert.equal(await count(), expectedBefore + 2);
  return { click, drop: await page.evaluate(() => [...window.comfyAPI.app.app.canvas.graph.nodes.at(-1).pos]) };
}

async function dispatchSessionDrop(row, mutation, overlay) {
  const transfer = await page.evaluateHandle(() => new DataTransfer());
  try {
    await row.dispatchEvent('dragstart', { dataTransfer: transfer });
    assert(await transfer.evaluate(data => data.types.includes('application/x-astrophoto-resource+json')));
    await mutation();
    if (overlay) {
      await transfer.evaluate((dataTransfer, overlay) => {
        const canvas = document.querySelector('#graph-canvas');
        const pane = canvas.parentElement.querySelector('[data-testid="transform-pane"]');
        const controls = 'button, input, select, textarea, [contenteditable], [role="button"]';
        if (!pane) throw new Error('Missing Nodes 2.0 transform pane');
        const candidates = pane.querySelectorAll(overlay === 'control' ? controls : '*');
        for (const element of candidates) {
          const rect = element.getBoundingClientRect();
          if (rect.width < 2 || rect.height < 2) continue;
          const clientX = rect.left + rect.width / 2;
          const clientY = rect.top + rect.height / 2;
          const target = document.elementFromPoint(clientX, clientY);
          if (!target || !pane.contains(target) || Boolean(target.closest(controls)) !== (overlay === 'control')) continue;
          target.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, clientX, clientY, dataTransfer }));
          return;
        }
        throw new Error(`No visible Nodes 2.0 overlay target: ${overlay}`);
      }, overlay);
      return;
    }
    const canvas = page.locator('#graph-canvas');
    const box = await canvas.boundingBox();
    assert(box);
    await canvas.dispatchEvent('drop', { dataTransfer: transfer, clientX: box.x + box.width * 0.7, clientY: box.y + box.height * 0.5 });
  } finally {
    await transfer.dispose();
  }
}

try {
  await page.goto(url);
  await sidebarButton.waitFor();
  preferences = await page.evaluate(keys => keys.map(key => [key, window.comfyAPI.app.app.extensionManager.setting.get(key)]),
    ['Comfy.Locale', 'Comfy.ColorPalette', nodesMode, 'Comfy.NodeLibrary.Bookmarks.V2']);
  await setting('Comfy.Locale', 'en');
  await setting('Comfy.ColorPalette', 'dark');
  await setting(nodesMode, nodesTwo);
  const projectsRead = page.waitForResponse(response =>
    /\/library\/projects(?:[/?]|$)/.test(response.url()) && response.request().method() === 'GET');
  await page.reload();
  await sidebarButton.waitFor();
  assert.equal(await page.evaluate(key => window.comfyAPI.app.app.extensionManager.setting.get(key), nodesMode), nodesTwo);
  await page.waitForFunction(() => window.comfyAPI.app.app.isGraphReady);
  const readGraphStructure = () => page.evaluate(() => {
    const { nodes, links } = window.comfyAPI.app.app.rootGraph.serialize();
    // Host locale updates presentation labels without changing connection identities.
    return JSON.parse(JSON.stringify({ nodes, links }, (key, value) =>
      key === 'localized_name' ? undefined : value));
  });
  const graphBeforeNavigation = await readGraphStructure();
  if (!(await sidebar.isVisible())) await sidebarButton.click();
  const assets = sidebar.locator('#ap-panel-assets');
  await assets.getByRole('heading', { name: 'Projects', exact: true }).waitFor();
  await assets.getByRole('tab', { name: 'All Assets', exact: true }).waitFor();
  assert.equal(await sidebar.locator('#ap-tab-assets').getAttribute('aria-selected'), 'true');
  assert.equal(await sidebarButton.count(), 1);
  const projectsResponse = await projectsRead;
  assert(projectsResponse.ok(), `Projects read returned ${projectsResponse.status()}`);
  await assets.getByRole('tab', { name: 'All Assets', exact: true }).click();
  await assets.getByRole('heading', { name: 'All Assets', exact: true }).waitFor();
  await assets.getByRole('tab', { name: 'Projects', exact: true }).click();
  await assets.getByRole('heading', { name: 'Projects', exact: true }).waitFor();
  assert.deepEqual(libraryMutations, []);
  await screenshot('assets');
  await setting('Comfy.Locale', 'zh');
  await assets.getByRole('heading', { name: '项目', exact: true }).waitFor();
  await screenshot('assets-zh');
  await setting('Comfy.Locale', 'en');
  await sidebar.getByRole('tab', { name: 'Settings', exact: true }).click();
  await screenshot('settings');
  const darkText = await sidebar.evaluate(root => getComputedStyle(root).color);
  await setting('Comfy.ColorPalette', 'light');
  await page.waitForFunction(color => getComputedStyle(document.querySelector('.astrophoto-host-container > .astrophoto-ui')).color !== color, darkText);
  await screenshot('settings-light');
  await setting('Comfy.ColorPalette', 'dark');
  for (const [name, file] of [['Configuration', 'configuration'], ['Equipment & Optics', 'equipment'], ['Software', 'software']]) {
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
  assert.deepEqual(await readGraphStructure(), graphBeforeNavigation);
  assert.deepEqual(libraryMutations, []);

  await page.evaluate(() => window.comfyAPI.app.app.loadGraphData({ last_node_id: 0, last_link_id: 0, nodes: [], links: [], groups: [], config: {}, extra: {}, version: 0.4 }));
  await sidebar.locator('#ap-tab-nodes').click();
  const search = sidebar.locator('#ap-panel-nodes input[type=search]');
  await search.fill('AstroPhotoImagePath');
  const row = sidebar.locator('.ap-resource').last();
  await row.waitFor();
  assert.equal(await sidebar.locator('.ap-resource').count(), 1);
  await row.hover();
  await page.locator('.astrophoto-node-preview').waitFor();
  await screenshot('nodes');
  await page.keyboard.press('Escape');
  await page.locator('.astrophoto-node-preview').waitFor({ state: 'detached' });
  // Escape retains the search control's own behavior; restore the test query after dismissing.
  await search.fill('AstroPhotoImagePath');
  await row.waitFor();
  {
    const bookmarkKey = 'Comfy.NodeLibrary.Bookmarks.V2';
    const folderReference = 'AstroPhoto/AstroPhotoImagePath';
    const externalReference = 'Other/LoadImage';
    const readPersisted = () => page.evaluate(key => window.comfyAPI.app.app.api.getSetting(key), bookmarkKey);
    await setting(bookmarkKey, [folderReference, externalReference]);
    await page.waitForFunction(([key, ref]) =>
      window.comfyAPI.app.app.extensionManager.setting.get(key)?.includes(ref), [bookmarkKey, folderReference]);
    const searchRow = sidebar.locator('.ap-tree-leaf').last();
    await searchRow.getByRole('button', { name: 'Bookmark node', exact: true }).click();
    await page.waitForFunction(key => window.comfyAPI.app.app.extensionManager.setting.get(key)?.includes('AstroPhotoImagePath'), bookmarkKey);
    assert.deepEqual(await readPersisted(), [folderReference, externalReference, 'AstroPhotoImagePath']);
    await searchRow.getByRole('button', { name: 'Remove bookmark', exact: true }).click();
    await page.waitForFunction(key => !window.comfyAPI.app.app.extensionManager.setting.get(key)?.includes('AstroPhotoImagePath'), bookmarkKey);
    assert.deepEqual(await readPersisted(), [folderReference, externalReference]);

    const catalogRoute = /\/object_info$/;
    const omitNode = async route => {
      const response = await route.fetch();
      const definitions = await response.json();
      delete definitions.AstroPhotoImagePath;
      await route.fulfill({ response, json: definitions });
    };
    const refresh = sidebar.getByRole('button', { name: 'Refresh node definitions' });
    await page.route(catalogRoute, omitNode);
    try {
      await refresh.click();
      await sidebar.getByText('No bookmarked nodes', { exact: true }).waitFor();
      await row.waitFor({ state: 'detached' });
      assert.deepEqual(await readPersisted(), [folderReference, externalReference]);
    } finally {
      await page.unroute(catalogRoute, omitNode);
    }
    await refresh.click();
    await row.waitFor();
    await sidebar.locator('.ap-tree-leaf').first().getByRole('button', { name: 'Remove bookmark', exact: true }).waitFor();

    const route = /\/settings\/Comfy\.NodeLibrary\.Bookmarks\.V2$/;
    let rejected = 0;
    const rejectWrite = async route => {
      if (route.request().method() !== 'POST') return route.continue();
      rejected++;
      return route.fulfill({ status: 403, body: 'test write rejected' });
    };
    await page.route(route, rejectWrite);
    try {
      await searchRow.getByRole('button', { name: 'Bookmark node', exact: true }).click();
      await sidebar.getByRole('alert').filter({ hasText: 'Could not save node bookmarks.' }).waitFor();
      assert.equal(rejected, 1);
      assert.deepEqual(await readPersisted(), [folderReference, externalReference]);
      assert.equal(await searchRow.getByRole('button', { name: 'Bookmark node', exact: true }).getAttribute('aria-pressed'), 'false');
    } finally {
      await page.unroute(route, rejectWrite);
    }
    await setting(bookmarkKey, []);
    await sidebar.getByText('No bookmarked nodes', { exact: true }).waitFor();
    assert.equal(await sidebar.locator('.ap-resource').count(), 1);
  }
  await row.click();
  await page.locator('.astrophoto-node-preview').waitFor({ state: 'detached' });
  const add = sidebar.getByRole('button', { name: /Add.*canvas/ });
  const back = sidebar.getByRole('button', { name: '← Back', exact: true });
  await back.waitFor();
  assert.equal(await back.evaluate(el => document.activeElement === el), true);
  const count = () => page.evaluate(() => window.comfyAPI.app.app.canvas.graph.nodes.filter(node => node.type === 'AstroPhotoImagePath').length);
  await expectEditRejected(add, count, 0);
  const expectedCenter = await page.evaluate(() => {
    const [x, y, width, height] = window.comfyAPI.app.app.canvas.ds.visible_area;
    return [x + width / 2, y + height / 2];
  });
  await add.click();
  assert.equal(await count(), 1);
  const actualCenter = await page.evaluate(() => [...window.comfyAPI.app.app.canvas.graph.nodes.at(-1).pos]);
  assert.deepEqual(actualCenter, expectedCenter);
  await expectInsertionRolledBack(add, count, 1);
  await page.evaluate(() => window.comfyAPI.app.app.extensionManager.command.execute('Comfy.Undo'));
  await page.waitForFunction(() => window.comfyAPI.app.app.canvas.graph.nodes.length === 0);
  await page.evaluate(() => window.comfyAPI.app.app.extensionManager.command.execute('Comfy.Redo'));
  await page.waitForFunction(() => window.comfyAPI.app.app.canvas.graph.nodes.some(node => node.type === 'AstroPhotoImagePath'));

  await sidebar.getByRole('button', { name: '← Back', exact: true }).click();
  await row.waitFor();
  await dragOntoCanvas(row);
  await page.waitForFunction(() => window.comfyAPI.app.app.canvas.graph.nodes.filter(node => node.type === 'AstroPhotoImagePath').length === 2);
  if (nodesTwo) {
    await page.locator('[data-testid="transform-pane"] input').first().waitFor();
    await dispatchSessionDrop(row, async () => {}, 'control');
    assert.equal(await count(), 2);
    await dispatchSessionDrop(row, async () => {}, 'node');
    assert.equal(await count(), 3);
    await page.evaluate(() => window.comfyAPI.app.app.extensionManager.command.execute('Comfy.Undo'));
    await page.waitForFunction(() => window.comfyAPI.app.app.canvas.graph.nodes.filter(node => node.type === 'AstroPhotoImagePath').length === 2);
  }
  await dispatchSessionDrop(row, async () => {
    await sidebar.locator('#ap-tab-assets').click();
    await sidebar.locator('#ap-tab-nodes').click();
    await row.waitFor();
  });
  assert.equal(await count(), 2);

  // Keep the same sidebar and search mounted while the host toggles its renderer.
  const canvasChanges = [];
  for (const [enabled, expected] of [[!nodesTwo, 3], [nodesTwo, 4]]) {
    const previousCanvas = await page.evaluateHandle(() => window.comfyAPI.app.app.canvas.canvas);
    await setting(nodesMode, enabled);
    await page.waitForFunction(enabled => window.LiteGraph.vueNodesMode === enabled, enabled);
    assert.equal(await search.inputValue(), 'AstroPhotoImagePath');
    canvasChanges.push(await page.evaluate(previous => window.comfyAPI.app.app.canvas.canvas !== previous, previousCanvas));
    await previousCanvas.dispose();
    await page.evaluate(() => {
      const canvas = window.comfyAPI.app.app.canvas;
      const { ds } = canvas;
      ds.changeScale(1.15);
      ds.offset[0] += 32;
      ds.offset[1] -= 24;
      ds.onChanged?.(ds.scale, ds.offset);
      canvas.setDirty(true, true);
    });
    await dragOntoCanvas(row);
    await page.waitForFunction(expected => window.comfyAPI.app.app.canvas.graph.nodes
      .filter(node => node.type === 'AstroPhotoImagePath').length === expected, expected);
  }
  await dispatchSessionDrop(row, () => page.evaluate(() => {
    const app = window.comfyAPI.app.app;
    const converted = app.canvas.graph.convertToSubgraph(new Set(app.canvas.graph.nodes));
    app.canvas.openSubgraph(converted.subgraph, converted.node);
  }));
  assert.equal(await count(), 4);
  await row.click();
  await expectEditRejected(add, count, 4);
  await add.click();
  assert.equal(await count(), 5);
  assert.equal(await page.evaluate(() => window.comfyAPI.app.app.rootGraph.nodes.length), 1);
  await sidebar.getByRole('button', { name: '← Back', exact: true }).click();
  await dragOntoCanvas(row);
  await page.waitForFunction(() => window.comfyAPI.app.app.canvas.graph.nodes.filter(node => node.type === 'AstroPhotoImagePath').length === 6);
  await row.click();
  await expectInsertionRolledBack(add, count, 6);
  await back.click();
  await page.evaluate(() => window.comfyAPI.app.app.extensionManager.command.execute('Comfy.Undo'));
  await page.waitForFunction(() => window.comfyAPI.app.app.canvas.graph.nodes.filter(node => node.type === 'AstroPhotoImagePath').length === 5);
  assert.equal(await page.evaluate(() => window.comfyAPI.app.app.rootGraph.nodes.length), 1);
  await page.evaluate(() => window.comfyAPI.app.app.extensionManager.command.execute('Comfy.Redo'));
  await page.waitForFunction(() => window.comfyAPI.app.app.canvas.graph.nodes.filter(node => node.type === 'AstroPhotoImagePath').length === 6);

  const savedComposition = await page.evaluate(() => window.comfyAPI.app.app.rootGraph.serialize());
  await page.evaluate(workflow => window.comfyAPI.app.app.handleFile(new File([JSON.stringify(workflow)],
    'AstroPhoto sidebar subgraph.json', { type: 'application/json' })), savedComposition);
  await page.evaluate(() => {
    const app = window.comfyAPI.app.app;
    const wrapper = app.rootGraph.nodes[0];
    app.canvas.openSubgraph(wrapper.subgraph, wrapper);
  });
  assert.equal(await count(), 6);

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
  const savedPixel = await litPixel();

  // Compare with the default built-in Node Library on the same host version.
  await page.evaluate(() => window.comfyAPI.app.app.loadGraphData({ last_node_id: 0, last_link_id: 0,
    nodes: [], links: [], groups: [], config: {}, extra: {}, version: 0.4 }));
  await page.getByTestId('node-library-tab-button').click();
  await page.getByPlaceholder('Search Nodes...').fill('AstroPhotoImagePath');
  const nativeMain = await verifyNativeLibrary(0);
  await page.evaluate(() => {
    const app = window.comfyAPI.app.app;
    const converted = app.canvas.graph.convertToSubgraph(new Set(app.canvas.graph.nodes));
    app.canvas.openSubgraph(converted.subgraph, converted.node);
  });
  const nativeSubgraph = await verifyNativeLibrary(2);
  assert.equal(await page.evaluate(() => window.comfyAPI.app.app.rootGraph.nodes.length), 1);

  assert.deepEqual(errors, []);
  await writeFile(join(output, 'report.json'), JSON.stringify({ mode, canvasChanges, requested, requestFailures, errors,
    pixels: savedPixel, upload: submitted.value, nativeMain, nativeSubgraph }, null, 2));
  console.log('PASS', mode, 'sidebar, exact bookmarks and HTTP failure, focus, stale drag, main/subgraph add and history, workflow reopen');
} catch (error) {
  await page.screenshot({ path: join(output, 'failure.png') }).catch(() => {});
  await writeFile(join(output, 'failed.json'), JSON.stringify({ mode, requested, requestFailures, errors, error: String(error) }, null, 2));
  throw error;
} finally {
  if (preferences) for (const pair of preferences) await setting(...pair);
  await browser.close();
}

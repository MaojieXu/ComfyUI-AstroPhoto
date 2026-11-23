// Browser/HTTP integration against a declared disposable ComfyUI instance.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { basename, isAbsolute, resolve } from 'node:path';
import { readdir, readFile, stat } from 'node:fs/promises';
import { chromium } from 'playwright';

const host = new URL(process.env.COMFYUI_TEST_URL ?? 'http://invalid.local/');
const root = process.env.ASTROPHOTO_TEST_ASSETS_ROOT;
const source = process.env.ASTROPHOTO_TEST_ASSET_SOURCE;
if (host.protocol !== 'http:' || host.hostname !== '127.0.0.1' ||
    !root || !source || !isAbsolute(root) || !isAbsolute(source)) {
  throw new Error('Set COMFYUI_TEST_URL, ASTROPHOTO_TEST_ASSETS_ROOT and ASTROPHOTO_TEST_ASSET_SOURCE for an isolated loopback host.');
}
const initial = await stat(source);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
page.setDefaultTimeout(12000);
const sidebar = page.locator('.astrophoto-ui');
const library = sidebar.locator('.ap-assets-panel');
const projectName = 'Assets integration ' + randomUUID();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const headers = { 'X-AstroPhoto-Local': '1', 'Sec-Fetch-Site': 'same-origin' };
const api = (path, options = {}) => page.request.fetch(new URL('/astrophoto/v1' + path, host).href, { headers, ...options });
const button = name => library.getByRole('button', { name, exact: !(name instanceof RegExp) });
const tab = name => library.getByRole('tab', { name, exact: true });
let project;
let registered;
let copied;
let settings;
let changedMode = false;
let verifiedIsolation = false;
const copyName = 'test-browser-copy-' + randomUUID() + '.ser';
const syntheticVideo = Buffer.from('AstroPhoto browser Copy verification bytes');

async function select(label, option) {
  await library.getByRole('combobox', { name: label, exact: true }).click();
  await page.getByRole('option', { name: option, exact: true }).click();
}
async function setMode(default_mode) {
  const current = await api('/storage');
  assert.ok(current.ok(), await current.text());
  const { imports } = await current.json();
  if (imports.default_mode === default_mode) return;
  const result = await api('/storage/settings', {
    method: 'PATCH', data: { expected_revision: imports.revision, imports: { default_mode } },
  });
  assert.ok(result.ok(), await result.text());
}
async function managedVideoPath(workspace, asset) {
  const directory = resolve(workspace.root_path, 'objects', 'videos');
  const names = new Set([asset.name.slice(0, -4) + '-' + asset.id + '.ser', asset.id + '.ser']);
  const matches = (await readdir(directory)).filter((name) => names.has(name));
  assert.equal(matches.length, 1);
  return resolve(directory, matches[0]);
}
try {
  const storage = await api('/storage');
  assert.equal(storage.status(), 200, await storage.text());
  settings = await storage.json();
  assert.equal(resolve(settings.data_root.path), resolve(root));
  assert.equal(settings.imports.default_mode, 'reference');
  verifiedIsolation = true;

  await page.goto(host.href);
  await page.waitForFunction(() => window.comfyAPI?.app?.app?.extensionManager?.getSidebarTabs?.()
    .some(tab => tab.id === 'astrophoto.sidebar'));
  const astro = page.locator('button').filter({ has: page.locator('.astrophoto-sidebar-icon') });
  try { await astro.click({ timeout: 4000 }); }
  catch { await page.keyboard.press('Escape'); await astro.click(); }
  await button('New project').click();
  await library.getByRole('textbox', { name: 'Name', exact: true }).fill(projectName);
  await library.getByRole('checkbox', { name: 'Create Raw / Intermediate / Results folders' }).check();
  await button('Save').click();
  await button(new RegExp(projectName)).waitFor();
  const listed = await api('/library/projects?q=' + encodeURIComponent(projectName));
  assert.equal(listed.status(), 200, await listed.text());
  project = (await listed.json()).items.find(item => item.name === projectName);
  assert.ok(project);

  await tab('All Assets').click();
  await button('Import batch').click();
  await library.getByRole('textbox', { name: 'Authorized server path' }).fill(source);
  await button('Add path').click();
  await select('Project', projectName);
  await button('Check selection').click();
  await button('Confirm import').click();
  await library.getByText('Registered 1', { exact: true }).waitFor();
  const included = await api('/library/assets?project_id=' + project.id);
  assert.equal(included.status(), 200, await included.text());
  registered = (await included.json()).items.find(item => item.name === basename(source));
  assert.ok(registered?.available);
  assert.equal(registered.storage_mode, 'external_reference');
  await button('← Back').click();

  const search = library.getByRole('combobox', { name: 'Search assets', exact: true });
  await search.fill(basename(source));
  await button('Calibration Library').click();
  await library.getByRole('heading', { name: 'Calibration Library', exact: true }).waitFor();
  await button('← Back').click();
  assert.equal(await search.inputValue(), basename(source));
  await tab('Projects').click();
  const row = library.getByRole('treeitem', { name: basename(source), exact: true });
  await row.click();
  await button('Edit virtual reference').click();
  await select('Folder', 'Raw');
  await button('Save').click();
  const raw = library.getByRole('treeitem', { name: 'Raw', exact: true });
  await raw.press('ArrowRight');
  await row.waitFor();
  const placements = await api('/library/placements?project_id=' + project.id);
  assert.equal(placements.status(), 200, await placements.text());
  const items = (await placements.json()).items;
  assert.equal(items.length, 1);
  assert.equal(items[0].asset_id, registered.id);
  assert.ok(items[0].folder_id);

  await tab('All Assets').click();
  const sourceRow = button(new RegExp('^' + basename(source).replaceAll('.', '\\.') + '\\b'));
  const projectsTab = tab('Projects');
  const from = await sourceRow.boundingBox();
  const through = await projectsTab.boundingBox();
  assert.ok(from && through);
  await page.evaluate(() => {
    if (!window.__astrophotoDragTrace) window.__astrophotoDragTrace = [];
    for (const kind of ['dragstart', 'dragenter', 'drop', 'dragend']) {
      document.addEventListener(kind, event => {
        const target = event.target instanceof Element ? event.target.closest('button, [role="tab"]') : null;
        window.__astrophotoDragTrace.push([kind, target?.id, target?.textContent?.trim().slice(0, 45), [...event.dataTransfer.types]]);
      }, { capture: true });
    }
  });
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  try {
    await page.mouse.move(from.x + from.width / 2 + 12, from.y + from.height / 2, { steps: 3 });
    await page.mouse.move(through.x + through.width / 2, through.y + through.height / 2, { steps: 20 });
    await page.mouse.move(through.x + through.width / 2 + 2, through.y + through.height / 2);
    try {
      await library.getByRole('treeitem', { name: 'Results', exact: true }).waitFor({ timeout: 3000 });
    } catch (cause) {
      console.error('Drag trace:', await page.evaluate(() => window.__astrophotoDragTrace));
      throw cause;
    }
    const to = await library.getByRole('treeitem', { name: 'Results', exact: true }).boundingBox();
    assert.ok(to);
    await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 20 });
    await page.mouse.move(to.x + to.width / 2 + 1, to.y + to.height / 2, { steps: 2 });
  } finally {
    await page.mouse.up();
  }
  const resultFolder = await api('/library/folders?project_id=' + project.id + '&q=Results');
  assert.ok(resultFolder.ok(), await resultFolder.text());
  const [results] = (await resultFolder.json()).items;
  assert.ok(results);
  // Successful virtual moves are silent. Wait for the authoritative placement.
  await page.waitForFunction(async ({ base, projectId, folderId }) => {
    const response = await fetch(base + '/library/placements?project_id=' + projectId,
      { headers: { 'X-AstroPhoto-Local': '1' } });
    return response.ok && (await response.json()).items.some(row => row.folder_id === folderId);
  }, { base: '/astrophoto/v1', projectId: project.id, folderId: results.id });
  const moved = await api('/library/placements?project_id=' + project.id);
  assert.ok(moved.ok(), await moved.text());
  assert.equal((await moved.json()).items[0].folder_id, results.id);

  changedMode = true;
  await setMode('copy');
  await tab('All Assets').click();
  await button('Import batch').click();
  await button('Choose files').waitFor();
  await library.locator('input[type=file]').first().setInputFiles({ name: copyName, mimeType: 'application/octet-stream', buffer: syntheticVideo });
  await select('Classification', 'Video');
  await select('Project', projectName);
  await button('Check selection').click();
  await button('Confirm import').click();
  await library.getByText('Imported 1 of 1 files', { exact: true }).waitFor();
  const copies = await api('/library/assets?project_id=' + project.id + '&q=' + encodeURIComponent(copyName));
  assert.ok(copies.ok(), await copies.text());
  copied = (await copies.json()).items.find(item => item.name === copyName);
  assert.ok(copied?.available);
  assert.equal(copied.storage_mode, 'managed');
  const workspace = settings.workspaces.find(row => row.id === copied.workspace_id);
  assert.ok(workspace);
  assert.deepEqual(await readFile(await managedVideoPath(workspace, copied)), syntheticVideo);
  assert.deepEqual(errors, []);
  console.log('PASS browser hosted project template, Reference, Copy upload and file bytes, cross-tab native drop, virtual move, tree keyboard and navigation');
} finally {
  if (verifiedIsolation && project) {
    try {
      let target = registered;
      if (!target) {
        const attached = await api('/library/assets?project_id=' + project.id);
        if (attached.ok()) target = (await attached.json()).items.find(item => item.name === basename(source));
      }
      if (target) {
        const clean = await api('/library/assets/' + target.id, { method: 'DELETE', data: { revision: target.revision } });
        assert.ok(clean.ok(), await clean.text());
      }
      if (!copied) {
        const attachedCopy = await api('/library/assets?project_id=' + project.id + '&q=' + encodeURIComponent(copyName));
        if (attachedCopy.ok()) copied = (await attachedCopy.json()).items.find(item => item.name === copyName);
      }
      if (copied) {
        const unlink = await api('/library/placements?project_id=' + project.id + '&asset_id=' + copied.id);
        assert.ok(unlink.ok(), await unlink.text());
        for (const row of (await unlink.json()).items) {
          const removed = await api('/library/placements/' + row.id, { method: 'DELETE', data: { revision: row.revision } });
          assert.ok(removed.ok(), await removed.text());
        }
        const workspace = settings.workspaces.find(row => row.id === copied.workspace_id);
        const path = await managedVideoPath(workspace, copied);
        const clean = await api('/library/assets/' + copied.id + '/delete-file', {
          method: 'POST', data: { revision: copied.revision, confirmed: true },
        });
        assert.ok(clean.ok(), await clean.text());
        await assert.rejects(stat(path), { code: 'ENOENT' });
      }
      const clean = await api('/library/projects/' + project.id, { method: 'DELETE', data: { revision: project.revision, confirmed: true } });
      assert.ok(clean.ok(), await clean.text());
      const after = await stat(source);
      assert.equal(after.size, initial.size);
      assert.equal(after.mtimeMs, initial.mtimeMs);
    } finally {
      try {
        if (changedMode) await setMode(settings.imports.default_mode);
      } finally { await browser.close(); }
    }
  } else await browser.close();
}

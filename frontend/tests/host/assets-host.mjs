// Browser/HTTP integration against a declared disposable ComfyUI instance.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { isAbsolute, resolve } from 'node:path';
import { readFile, stat } from 'node:fs/promises';
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
async function record(kind, name) {
  const response = await api('/catalog/' + kind + '?q=' + encodeURIComponent(name));
  assert.ok(response.ok(), await response.text());
  return (await response.json()).items.find(row => row.name === name);
}

async function openSidebar() {
  const astro = page.getByTestId('astrophoto.sidebar-tab-button');
  try { await astro.click({ timeout: 4000 }); }
  catch { await page.keyboard.press('Escape'); await astro.click(); }
}

try {
  const storage = await api('/storage');
  assert.ok(storage.ok(), await storage.text());
  settings = await storage.json();
  assert.equal(resolve(settings.data_root.path), resolve(root));
  verifiedIsolation = true;
  changedMode = true;
  await setMode('reference');

  await page.route('**/astrophoto/v1/storage/native-picker', route => route.fulfill({
    json: { status: 'selected', path: source },
  }));
  await page.goto(host.href);
  await page.waitForFunction(() => window.comfyAPI?.app?.app?.extensionManager?.getSidebarTabs?.()
    .some(tab => tab.id === 'astrophoto.sidebar'));
  await openSidebar();
  await button('Import Assets').click();
  await button(/^Image Result/).click();
  const name = 'Reference ' + randomUUID();
  await library.getByRole('textbox', { name: 'Name', exact: true }).fill(name);
  await button('Import').click();
  await library.getByText('Registered 1', { exact: true }).waitFor();
  registered = await record('image_result', name);
  assert.equal(registered.external_path, source);
  await button('← Back').click();

  await tab('Projects').click();
  await button('＋ New').click();
  await library.getByRole('textbox', { name: 'Name', exact: true }).fill(projectName);
  await button('Save').click();
  project = await record('projects', projectName);
  await button('＋ Add').click();
  await button('New folder').click();
  await library.getByRole('textbox', { name: 'Folder name' }).fill('Raw');
  await button('Save').click();
  await button('Raw').and(library.locator('.ap-project-row-name')).click();
  await button('＋ Add').click();
  await button('Add existing assets').click();
  await library.getByRole('combobox', { name: 'Asset type' }).selectOption('image_result');
  await library.getByRole('checkbox', { name }).check();
  const added = page.waitForResponse(response => response.url().endsWith('/catalog/projects/' + project.id + '/nodes') &&
    response.status() === 201);
  await button('Add (1)').click();
  await added;
  const path = '/catalog/projects/' + project.id + '?path=' + encodeURIComponent('/Raw/' + name);
  const linked = await api(path);
  assert.ok(linked.ok(), await linked.text());
  assert.equal((await linked.json()).resource.id, registered.id);

  await setMode('copy');
  await page.reload();
  await openSidebar();
  await tab('All Assets').click();
  await button('Import Assets').click();
  const chooser = page.waitForEvent('filechooser');
  await button(/^Video/).click();
  await (await chooser).setFiles({ name: copyName, mimeType: 'application/octet-stream', buffer: syntheticVideo });
  await button('Import').click();
  await library.getByText('Imported 1 of 1 files', { exact: true }).waitFor();
  copied = await record('video', copyName);
  assert.equal(copied.storage_mode, 'managed');
  const workspace = settings.workspaces.find(row => row.id === copied.workspace_id);
  assert.deepEqual(await readFile(resolve(workspace.root_path, copied.relative_path)), syntheticVideo);
  assert.deepEqual(errors, []);
  console.log('PASS reference, copy and project reference on the isolated host');
} finally {
  try {
    if (verifiedIsolation) {
      if (project) {
        const preview = await api('/catalog/projects/' + project.id + '?path=/&view=impact');
        assert.ok(preview.ok(), await preview.text());
        const { revision, impact_token } = await preview.json();
        const removed = await api('/catalog/projects/' + project.id, {
          method: 'DELETE', data: { revision, confirmed: true, impact_token },
        });
        assert.ok(removed.ok(), await removed.text());
      }
      for (const asset of [copied, registered].filter(Boolean)) {
        const details = await api('/library/assets/' + asset.id);
        assert.ok(details.ok(), await details.text());
        const { revision } = await details.json();
        if (asset.storage_mode === 'managed') {
          const deleted = await api('/library/assets/' + asset.id + '/delete-file', {
            method: 'POST', data: { revision, confirmed: true },
          });
          assert.ok(deleted.ok(), await deleted.text());
        }
        const removed = await api('/library/assets/' + asset.id, { method: 'DELETE', data: { revision } });
        assert.ok(removed.ok(), await removed.text());
      }
      const after = await stat(source);
      assert.equal(after.size, initial.size);
      assert.equal(after.mtimeMs, initial.mtimeMs);
    }
  } finally {
    try {
      if (changedMode) await setMode(settings.imports.default_mode);
    } finally { await browser.close(); }
  }
}

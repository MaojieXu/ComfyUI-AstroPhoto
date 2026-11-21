// Opt-in against a loopback ComfyUI instance with a dedicated AstroPhoto data root.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { isAbsolute, join, resolve } from 'node:path';
import { chromium } from 'playwright';

const host = new URL(process.env.COMFYUI_TEST_URL ?? 'http://invalid.local/');
const root = process.env.ASTROPHOTO_TEST_STORAGE_ROOT;
if (host.protocol !== 'http:' || host.hostname !== '127.0.0.1' || !root || !isAbsolute(root)) {
  throw new Error('Set COMFYUI_TEST_URL to the loopback host and ASTROPHOTO_TEST_STORAGE_ROOT to its disposable run directory.');
}

const apiPrefix = '/astrophoto/v1';
const id = randomUUID();
const workspaceName = `Migration verification ${id}`;
const source = join(root, `workspace-${id}`);
const target = join(root, `migration-${id}`);
const cache = join(root, `cache-${id}`);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
let originalLocale;

async function api(path) {
  const reply = await page.request.get(new URL(apiPrefix + path, host).href, { headers: { 'X-AstroPhoto-Local': '1' } });
  assert.equal(reply.ok(), true, `${path} returned HTTP ${reply.status()}`);
  return reply.json();
}

function waitForWrite(path, method = 'POST') {
  return page.waitForResponse(reply => new URL(reply.url()).pathname === '/api' + apiPrefix + path && reply.request().method() === method);
}

function setLocale(locale) {
  return page.evaluate(value => window.comfyAPI.app.app.extensionManager.setting.set('Comfy.Locale', value), locale);
}

const sidebar = page.locator('.astrophoto-ui');
const back = () => sidebar.getByRole('button', { name: '← Back', exact: true }).click();
const openModule = name => sidebar.getByText(name, { exact: true }).click();
const saveIn = section => section.getByRole('button', { name: 'Save', exact: true }).click();
const selectResolution = () => sidebar.getByRole('combobox', { name: 'Preview resolution' });
const resolutionLabel = edge => edge === 0 ? 'Full resolution' : `${edge} px`;

async function openSidebar() {
  await page.locator('button').filter({ has: page.locator('.astrophoto-sidebar-icon') }).click();
  await sidebar.getByRole('tab', { name: 'Settings', exact: true }).click();
}

try {
  const snapshot = await api('/storage');
  assert.equal(resolve(snapshot.data_root.path), resolve(root, 'astrophoto'), 'Storage writes are restricted to the declared disposable host.');
  assert.equal(snapshot.capabilities.write, true);

  await page.goto(host.href);
  await page.waitForFunction(() => Boolean(window.comfyAPI?.app?.app?.extensionManager));
  originalLocale = await page.evaluate(() => window.comfyAPI.app.app.extensionManager.setting.get('Comfy.Locale'));
  await setLocale('en');
  await openSidebar();
  await openModule('System Status');
  await sidebar.getByRole('heading', { name: 'System Status', exact: true }).waitFor();
  const status = await api('/status');
  assert.equal(status.capabilities.storage.available, true);
  await sidebar.getByText(status.extension.version, { exact: true }).waitFor();
  await back();
  await openModule('Storage');
  const defaultWorkspace = snapshot.workspaces.find(workspace => workspace.is_default);
  await sidebar.getByText(defaultWorkspace.root_path, { exact: true }).waitFor();

  const checkedMode = snapshot.imports.default_mode;
  const nextMode = checkedMode === 'copy' ? 'reference' : 'copy';
  const radioNames = { reference: /Index in database only/, copy: /Copy into managed workspace/ };
  assert.equal(await sidebar.getByRole('radio', { name: radioNames[checkedMode] }).isChecked(), true);
  const mode = sidebar.getByRole('radio', { name: radioNames[nextMode] });
  assert.deepEqual(await mode.evaluate(input => [input.offsetWidth, input.offsetHeight]), [16, 16]);
  const modeWrite = waitForWrite('/storage/settings', 'PATCH');
  await mode.press('Space');
  assert.equal((await modeWrite).status(), 200);
  await page.waitForFunction(input => input?.checked, await mode.elementHandle());
  assert.equal(await mode.isChecked(), true);
  assert.equal((await api('/storage')).imports.default_mode, nextMode);

  const add = sidebar.getByRole('button', { name: /Add workspace/ });
  await add.click();
  const form = sidebar.locator('form').filter({ has: page.getByRole('textbox', { name: 'Workspace name', exact: true }) });
  await form.getByRole('textbox', { name: 'Workspace name', exact: true }).fill(workspaceName);
  await form.getByRole('textbox', { name: 'Absolute path on the ComfyUI server', exact: true }).fill(source);
  const addWrite = waitForWrite('/storage/locations');
  await saveIn(form);
  assert.equal((await addWrite).status(), 201);
  const row = sidebar.locator('.ap-workspace-row').filter({ hasText: workspaceName });
  await row.getByText(source, { exact: true }).waitFor();
  const { id: workspaceId } = (await api('/storage')).workspaces.find(workspace => workspace.name === workspaceName);

  // Only a file created by this run is copied, and both versions are checked.
  const payload = Buffer.from(`AstroPhoto migration fixture ${id}`);
  const relativeFile = join('outputs', 'fixture.dat');
  await writeFile(join(source, relativeFile), payload, { flag: 'wx' });
  await row.getByRole('button', { name: `Actions for ${workspaceName}`, exact: true }).click();
  const defaultWrite = waitForWrite(`/storage/locations/${workspaceId}`, 'PATCH');
  await row.getByRole('button', { name: 'Set as default', exact: true }).click();
  assert.equal((await defaultWrite).status(), 200);
  await row.getByText('Default', { exact: true }).waitFor();
  assert.equal((await api('/storage')).default_workspace_id, workspaceId);

  await row.getByRole('button', { name: 'Migrate workspace', exact: true }).click();
  const migrationPath = page.locator('.prompt-dialog-content').getByRole('textbox', { name: 'Absolute path on the ComfyUI server' });
  await migrationPath.fill(target);
  const migrateWrite = waitForWrite('/storage/migrations');
  await migrationPath.press('Enter');
  const accepted = await migrateWrite;
  assert.equal(accepted.status(), 202);
  const { operation_id } = await accepted.json();
  const receipt = sidebar.getByRole('region', { name: 'Storage operation' }).filter({ hasText: operation_id });
  await receipt.getByText('Verification sha256', { exact: true }).waitFor();
  await row.getByText(target, { exact: true }).waitFor();
  assert.equal((await api(`/storage/migrations/${operation_id}`)).phase, 'completed');
  assert.deepEqual(await readFile(join(source, relativeFile)), payload);
  assert.deepEqual(await readFile(join(target, relativeFile)), payload);
  console.log('PASS 03-A real System/Storage readings, keyboard import mode, new default, SHA-256 migration receipt and retained source');

  const cacheSection = sidebar.locator('.ap-storage-group').filter({ has: page.getByRole('heading', { name: 'Cache', exact: true }) });
  await cacheSection.getByRole('textbox', { name: 'Absolute path on the ComfyUI server', exact: true }).fill(cache);
  await cacheSection.getByRole('spinbutton', { name: 'Cache limit (GB)', exact: true }).fill('3');
  const cacheWrite = waitForWrite('/storage/cache/configure');
  await saveIn(cacheSection);
  assert.equal((await cacheWrite).status(), 200);
  const cacheSave = cacheSection.getByRole('button', { name: 'Save', exact: true });
  await page.waitForFunction(button => button?.disabled, await cacheSave.elementHandle());
  const configured = (await api('/storage')).cache;
  assert.equal(configured.path, cache);
  assert.equal(configured.max_size_gb, 3);
  await cacheSection.getByRole('button', { name: 'Clear cache', exact: true }).click();
  const dialog = page.getByRole('dialog').filter({ hasText: 'Remove rebuildable files from the active cache?' });
  await dialog.getByText(cache, { exact: true }).waitFor();
  const [cleared] = await Promise.all([
    waitForWrite('/storage/cache/clear'),
    dialog.getByRole('button', { name: /Delete$/ }).click(),
  ]);
  assert.equal(cleared.status(), 200);
  assert.equal((await cleared.json()).failed, 0);
  await sidebar.getByText(/^Removed \d+ .* Failed 0\.$/).waitFor();
  console.log('PASS 03-A configured isolated cache, confirmed clear and rendered backend receipt');

  await back();
  const before = await api('/previews/settings');
  const edge = before.options.find(option => option !== before.longest_edge);
  assert.notEqual(edge, undefined);
  await openModule('Environment');
  await selectResolution().getByText(resolutionLabel(before.longest_edge), { exact: true }).waitFor();
  await selectResolution().press('Space');
  await page.getByRole('option', { name: resolutionLabel(edge), exact: true }).click();
  const previewWrite = waitForWrite('/previews/settings', 'PUT');
  await saveIn(sidebar);
  assert.equal((await previewWrite).status(), 200);
  await sidebar.getByText('Preview settings saved.', { exact: true }).waitFor();
  const after = await api('/previews/settings');
  assert.equal(after.longest_edge, edge);
  assert.deepEqual(after.canvas, before.canvas);
  const canvasWidth = await page.evaluate(() => document.documentElement.style.getPropertyValue('--astrophoto-canvas-preview-width'));
  assert.equal(canvasWidth, `${before.canvas.width}px`);

  await page.reload();
  await openSidebar();
  await openModule('Environment');
  await selectResolution().getByText(resolutionLabel(edge), { exact: true }).waitFor();
  await back();
  await openModule('Storage');
  await row.getByText(target, { exact: true }).waitFor();
  await row.getByText('Default', { exact: true }).waitFor();
  assert.equal(await mode.isChecked(), true);
  assert.equal(await cacheSection.getByRole('spinbutton', { name: 'Cache limit (GB)', exact: true }).inputValue(), '3');
  assert.deepEqual(errors, []);
  console.log('PASS 03-B legal environment selection, persisted preview width, workspace, cache and mode after reload');
} finally {
  if (originalLocale !== undefined) await setLocale(originalLocale).catch(() => {});
  await browser.close();
}

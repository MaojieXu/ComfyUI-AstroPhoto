// Opt-in against a loopback ComfyUI instance with a dedicated AstroPhoto data root.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { isAbsolute, join, resolve } from 'node:path';
import { chromium } from 'playwright';

const host = new URL(process.env.COMFYUI_TEST_URL ?? 'http://invalid.local/');
const root = process.env.ASTROPHOTO_TEST_STORAGE_ROOT;
if (host.protocol !== 'http:' || host.hostname !== '127.0.0.1' || !root || !isAbsolute(root)) {
  throw new Error('Set COMFYUI_TEST_URL to the loopback host and ASTROPHOTO_TEST_STORAGE_ROOT to its disposable run directory.');
}

const apiPrefix = '/astrophoto/v1';
const id = randomUUID();
const registeredWorkspaces = ['Z archive', 'A archive'].map(name => [`${name} ${id}`, join(root, `${name}-${id}`)]);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
let originalLocale;
const testWorkspaces = [];

async function api(path) {
  const reply = await page.request.get(new URL(apiPrefix + path, host).href, { headers: { 'X-AstroPhoto-Local': '1' } });
  assert.equal(reply.ok(), true, `${path} returned HTTP ${reply.status()}`);
  return reply.json();
}

async function writeApi(path, method, data) {
  const reply = await page.request.fetch(new URL(apiPrefix + path, host).href, {
    method, data, headers: { 'X-AstroPhoto-Local': '1' },
  });
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
  const button = page.locator('button').filter({ has: page.locator('.astrophoto-sidebar-icon') });
  await button.click({ timeout: 5000 }).catch(async error => {
    const overlay = page.locator('[data-slot="dialog-overlay"][data-state="open"]').first();
    if (!await overlay.isVisible()) throw error;
    const dialog = page.locator('[data-slot="dialog-content"][data-state="open"]').first();
    const title = await dialog.innerText({ timeout: 2000 }).catch(() => 'unknown dialog');
    await page.keyboard.press('Escape');
    await overlay.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {
      throw new Error('ComfyUI startup dialog still open: ' + title);
    });
    await button.click();
  });
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
  const status = await api('/status');
  assert.equal(status.capabilities.storage.available, true);
  // D-15 keeps only these three entries on the settings home.
  for (const name of ['Equipment', 'Software', 'Configuration']) {
    await sidebar.getByText(name, { exact: true }).waitFor();
  }
  await openModule('Configuration');
  const defaultWorkspace = snapshot.workspaces.find(workspace => workspace.is_default);
  await sidebar.getByText(defaultWorkspace.name, { exact: true }).waitFor();

  const checkedMode = snapshot.imports.default_mode;
  const nextMode = checkedMode === 'copy' ? 'reference' : 'copy';
  const radioNames = { reference: /Index original files/, copy: /Copy to storage/ };
  assert.equal(await sidebar.getByRole('radio', { name: radioNames[checkedMode] }).isChecked(), true);
  const mode = sidebar.getByRole('radio', { name: radioNames[nextMode] });
  assert.deepEqual(await mode.evaluate(input => [input.offsetWidth, input.offsetHeight]), [16, 16]);
  const modeWrite = waitForWrite('/storage/settings', 'PATCH');
  await mode.press('Space');
  assert.equal((await modeWrite).status(), 200);
  await page.waitForFunction(input => input?.checked, await mode.elementHandle());
  assert.equal(await mode.isChecked(), true);
  assert.equal((await api('/storage')).imports.default_mode, nextMode);

  const add = sidebar.getByRole('button', { name: /Add storage location/ });
  const form = sidebar.locator('form').filter({ has: page.getByRole('textbox', { name: 'Location name', exact: true }) });
  const rows = sidebar.locator('.ap-workspace-row');
  const workspaceIds = snapshot.workspaces.map(workspace => workspace.id);
  for (const [name, path] of registeredWorkspaces) {
    await add.click();
    await form.getByRole('textbox', { name: 'Location name', exact: true }).fill(name);
    await form.getByRole('textbox', { name: 'Local absolute path', exact: true }).fill(path);
    const addWrite = waitForWrite('/storage/locations');
    await saveIn(form);
    const accepted = await addWrite;
    assert.equal(accepted.status(), 201);
    testWorkspaces.push((await accepted.json()).id);
    await rows.nth(workspaceIds.length + testWorkspaces.length - 1).getByText(name, { exact: true }).waitFor();
  }
  assert.deepEqual((await api('/storage')).workspaces.map(workspace => workspace.id), [...workspaceIds, ...testWorkspaces]);
  assert.equal((await api('/storage')).default_workspace_id, defaultWorkspace.id);
  const storagePanel = sidebar.locator('.ap-storage');
  assert.equal(await storagePanel.getByRole('button', { name: /Move AstroPhoto data|Edit quota|Actions for|Migrate workspace|Clear cache/ }).count(), 0);
  assert.equal(await storagePanel.getByRole('heading', { name: 'Cache', exact: true }).count(), 0);
  assert.equal(await storagePanel.getByText(/clears AstroPhoto Cache on exit/).count(), 0);
  console.log('PASS 03-A real System/Storage readings, keyboard import mode and append-only workspace registration');

  const before = await api('/previews/settings');
  const edge = before.options.find(option => option !== before.longest_edge);
  assert.notEqual(edge, undefined);
  await selectResolution().getByText(resolutionLabel(before.longest_edge), { exact: true }).waitFor();
  await selectResolution().press('Space');
  const previewWrite = waitForWrite('/previews/settings', 'PUT');
  await page.getByRole('option', { name: resolutionLabel(edge), exact: true }).click();
  assert.equal((await previewWrite).status(), 200);
  const after = await api('/previews/settings');
  assert.equal(after.longest_edge, edge);
  assert.deepEqual(after.canvas, before.canvas);
  const canvasWidth = await page.evaluate(() => document.documentElement.style.getPropertyValue('--astrophoto-canvas-preview-width'));
  assert.equal(canvasWidth, `${before.canvas.width}px`);

  await page.reload();
  await openSidebar();
  await openModule('Configuration');
  await selectResolution().getByText(resolutionLabel(edge), { exact: true }).waitFor();
  for (const [index, [name]] of registeredWorkspaces.entries()) {
    await rows.nth(workspaceIds.length + index).getByText(name, { exact: true }).waitFor();
  }
  await rows.nth(0).getByText((await api('/storage')).workspaces[0].name, { exact: true }).waitFor();
  await rows.nth(0).getByText('Preferred', { exact: true }).waitFor();
  assert.equal(await mode.isChecked(), true);
  assert.deepEqual(errors, []);
  console.log('PASS 03-B preview settings, workspace order and import mode after reload');
} finally {
  if (testWorkspaces.length) {
    const latest = await api('/storage');
    for (const record of latest.workspaces.filter(workspace => testWorkspaces.includes(workspace.id))) {
      const target = latest.workspaces.find(row => !testWorkspaces.includes(row.id) && row.enabled && row.status === 'online');
      assert.ok(target, 'Cleanup needs an online destination in this isolated fixture.');
      await writeApi('/storage/locations/' + record.id, 'DELETE', {
        expected_revision: record.revision, target_workspace_id: target.id,
      });
    }
    assert.ok(!(await api('/storage')).workspaces.some(workspace => testWorkspaces.includes(workspace.id)));
  }
  if (originalLocale !== undefined) await setLocale(originalLocale).catch(() => {});
  await browser.close();
}

// Playwright against an explicitly isolated, writable ComfyUI test server.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const url = process.env.COMFYUI_TEST_URL;
const run = process.env.ASTROPHOTO_TEST_EQUIPMENT_RUN;
const prepareRestart = process.argv.includes('--prepare-restart');
const verifyRestart = process.argv.includes('--verify-restart');
const verifyDelete = process.argv.includes('--verify-delete');
if (!url || !/^[A-Za-z0-9-]{1,24}$/.test(run ?? ''))
  throw new Error('Set COMFYUI_TEST_URL and ASTROPHOTO_TEST_EQUIPMENT_RUN for a disposable host');
const origin = new URL(url);
if (!['http:', 'https:'].includes(origin.protocol) ||
    !['127.0.0.1', 'localhost', '[::1]'].includes(origin.hostname))
  throw new Error('Equipment tests require an isolated loopback host');
if ((prepareRestart && verifyRestart) || (verifyDelete && !verifyRestart))
  throw new Error('Use --prepare-restart before --verify-restart, optionally with --verify-delete');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
page.setDefaultTimeout(12000);
const sidebar = page.locator('.astrophoto-ui');
const modulePanel = sidebar.locator('.ap-equipment');
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const names = {
  camera: 'Camera ' + run, optics: 'Optics ' + run, reducer: 'Reducer ' + run, barlow: 'Barlow ' + run,
  filter: 'Dual ' + run, quick: 'Extra filter ' + run, train: 'Train ' + run, renamed: 'Renamed ' + run,
};
const button = (name, scope = modulePanel) => scope.getByRole('button', { name, exact: typeof name === 'string' });
const input = (name, scope = modulePanel) => scope.getByRole('textbox', { name });
const tab = (name, scope = modulePanel) => scope.getByRole('tab', { name, exact: true });
const back = () => button('← Back').click();
const confirm = (name = 'Confirm') => page.getByRole('dialog').locator('button').filter({ hasText: new RegExp('^\\s*' + name + '\\s*$') }).click();
const settings = (id, value) => page.evaluate(([id, value]) =>
  window.comfyAPI.app.app.extensionManager.setting.set(id, value), [id, value]);
let preferences;

async function open() {
  await page.goto(url);
  await page.waitForFunction(() => window.comfyAPI?.app?.app?.extensionManager?.getSidebarTabs?.()
    .some(tab => tab.id === 'astrophoto.sidebar'));
  try { await button('AstroPhoto', page).click({ timeout: 4000 }); }
  catch {
    // ComfyUI opens the template browser on a fresh user profile.
    await page.keyboard.press('Escape');
    await button('AstroPhoto', page).click();
  }
  preferences ??= await page.evaluate(() => {
    const settings = window.comfyAPI.app.app.extensionManager.setting;
    return ['Comfy.Locale', 'Comfy.ColorPalette'].map(key => [key, settings.get(key)]);
  });
  await settings('Comfy.Locale', 'en');
  await tab('Settings', sidebar).click();
  await sidebar.getByText('Equipment', { exact: true }).click();
  await tab('My Equipment').waitFor();
}

async function add(type, name, fill = async () => {}) {
  await button('Add equipment').click();
  await modulePanel.getByRole('heading', { name: 'Choose equipment type' }).waitFor();
  await button(type).click();
  await input(/^Product name/).fill(name);
  await input(/^Name/).fill(name);
  await fill();
  await button('Save').click();
  await modulePanel.getByRole('heading', { name, exact: true }).waitFor();
  await back();
}

async function choose(label, name) {
  const trigger = modulePanel.getByRole('combobox', { name: label, exact: true });
  await trigger.click();
  await page.getByRole('option', { name, exact: true }).click();
}

function filters() {
  return modulePanel.getByRole('button', { name: 'Available filters', exact: true });
}

async function assertCurrentConfiguration(camera, notes) {
  const current = button('Current configuration');
  await current.waitFor();
  assert.equal(await current.getAttribute('aria-expanded'), 'true');
  const panelId = await current.getAttribute('aria-controls');
  const currentPanel = page.locator(`[id="${panelId}"]`);
  await currentPanel.getByText(camera, { exact: true }).waitFor();
  await currentPanel.getByText(notes, { exact: true }).waitFor();
  await currentPanel.getByText(names.barlow, { exact: true }).waitFor();
  assert.equal(await currentPanel.getByText(names.reducer, { exact: true }).count(), 0);
  await currentPanel.getByText(new RegExp(`${names.filter}.*${names.quick}|${names.quick}.*${names.filter}`)).waitFor();
}

async function deleteFixture(name, resource) {
  await modulePanel.getByRole('heading', { name, exact: true }).waitFor();
  await button('Delete permanently').click();
  await page.getByRole('dialog').getByText(name, { exact: true }).waitFor();
  const target = new RegExp(`/astrophoto/v1/${resource}/[a-f0-9-]+$`);
  const [receipt] = await Promise.all([
    page.waitForResponse(response => response.request().method() === 'DELETE' &&
      target.test(new URL(response.url()).pathname)),
    confirm('Delete'),
  ]);
  assert.equal(receipt.status(), 204, await receipt.text());
  await button(resource === 'equipment' ? 'Add equipment' : 'Create equipment group').waitFor();
  await button(new RegExp('^' + name + '(?:\\s|$)')).waitFor({ state: 'hidden' });
}


// Exact names include the isolated run ID; never delete by search match alone.
const apiHeaders = { 'Sec-Fetch-Site': 'same-origin', 'X-AstroPhoto-Local': '1' };

async function listRunRecords(resource) {
  const allowed = new Set(resource === 'equipment'
    ? Object.entries(names).filter(([key]) => key !== 'train').map(([, name]) => name)
    : [names.train]);
  const matches = [];
  const search = new URLSearchParams({ q: run, archived: 'all', limit: '100' });
  const collection = new URL('/astrophoto/v1/' + resource, url);
  do {
    collection.search = search.toString();
    const response = await page.request.get(collection.href, { headers: apiHeaders });
    assert.equal(response.status(), 200, await response.text());
    const { items, next } = await response.json();
    matches.push(...items.filter(row => allowed.has(row.name)));
    if (!next) break;
    search.set('after', next);
  } while (true);
  return matches;
}

async function cleanupRun() {
  const failures = [];
  for (const resource of ['optical-trains', 'equipment']) {
    for (const row of await listRunRecords(resource)) {
      const { id } = row;
      const target = new URL('/astrophoto/v1/' + resource + '/' + id, url).href;
      if (resource === 'optical-trains' && row.status !== 'archived') {
        const cleared = await page.request.patch(target, { headers: apiHeaders, data: {
          name: row.name, notes: row.notes,
          camera_id: null, primary_optics_id: null, accessory_id: null, filter_ids: [], other_ids: [],
        } });
        assert.equal(cleared.status(), 200, await cleared.text());
      }
      const receipt = await page.request.delete(target, { headers: apiHeaders, data: {} });
      if (receipt.status() !== 204 || !receipt.headers()['x-request-id'])
        failures.push('DELETE ' + target + ': ' + receipt.status() + ' ' + await receipt.text());
      const after = await page.request.get(target, { headers: apiHeaders });
      if (resource === 'optical-trains') {
        if (after.status() !== 200 || (await after.json()).status !== 'deleted')
          failures.push('Missing equipment-group tombstone ' + target);
      } else if (after.status() !== 404) {
        failures.push('GET after DELETE ' + target + ': ' + after.status());
      }
    }
    const remaining = await listRunRecords(resource);
    if (remaining.length) failures.push(resource + ' still contains: ' + remaining.map(row => row.name).join(', '));
  }
  assert.deepEqual(failures, [], 'Equipment API cleanup failed');
  console.log('PASS API cleanup: test groups hidden and test devices removed');
}

let cleanup = false;
let testError;

try {
  if (verifyRestart) {
    const previous = await listRunRecords('optical-trains');
    assert.equal(previous.length, 1, 'Expected one prepared run; seed it with --prepare-restart');
  } else {
    assert.deepEqual(await listRunRecords('optical-trains'), [], 'Use a new unique run ID');
    assert.deepEqual(await listRunRecords('equipment'), [], 'Use a new unique run ID');
  }
  cleanup = true;
  await open();
  if (verifyRestart) {
    await tab('Equipment Groups').click();
    await button(new RegExp('^' + names.train)).click();
    await assertCurrentConfiguration(names.renamed, 'Second configuration');
    assert.deepEqual(errors, []);
    console.log('PASS real ComfyUI restart: current train configuration and current device name');
    if (verifyDelete) {
      await tab('My Equipment').click();
      await button(new RegExp('^' + names.renamed)).click();
      await button('Delete permanently').click();
      await modulePanel.getByRole('alert').getByRole('button', { name: names.train, exact: true }).click();
      await deleteFixture(names.train, 'optical-trains');
      await tab('My Equipment').click();
      await button(new RegExp('^' + names.renamed)).click();
      await button('Delete permanently').click();
      await modulePanel.getByRole('alert').getByRole('button', { name: names.train, exact: true }).click();
      await modulePanel.getByRole('heading', { name: names.train, exact: true }).waitFor();
      await modulePanel.getByText('Deleted', { exact: true }).waitFor();
      await assertCurrentConfiguration(names.renamed, 'Second configuration');
      assert.deepEqual(errors, []);
      console.log('PASS real ComfyUI deletion: hidden train retains historical configuration and protects linked devices');
    }
  } else {
    await add(/^Camera Imaging/, names.camera);
    await add(/^Telescope \/ lens Telescope/, names.optics);
    await add(/^Optical accessory Reducer/, names.reducer);
    await add(/^Optical accessory Reducer/, names.barlow);
    await add(/^Filter Imaging/, names.filter);
    const search = modulePanel.getByLabel('Search device or product name', { exact: true });
    await search.fill(run);
    await button(new RegExp('^' + names.camera)).waitFor();
    await tab('My Equipment').focus();
    await page.keyboard.press('ArrowRight');
    assert(await tab('Equipment Groups').evaluate(el => el === document.activeElement));
    await page.keyboard.press('Enter');
    await button('Create equipment group').click();
    await input(/^Name/).fill(names.train);
    await input('Notes').fill('Draft note');
    assert.equal(await button('Publish revision').count(), 0);
    await button('Save').click();
    await button('Edit equipment group').click();
    await input('Notes').waitFor();
    assert.equal(await input('Notes').inputValue(), 'Draft note');
    await choose('Imaging camera', names.camera);
    await choose('Primary optics', names.optics);
    await choose('Optical accessories', names.reducer);
    await choose('Optical accessories', names.barlow);
    await filters().click();
    const filterOption = page.getByRole('option', { name: names.filter, exact: true });
    await filterOption.click();
    await filterOption.and(page.locator('[aria-selected="true"]')).waitFor();
    await filterOption.press('Escape');
    await filterOption.waitFor({ state: 'hidden' });
    await button('Add Filter').click();
    await input(/^Product name/).fill(names.quick);
    await input(/^Name/).fill(names.quick);
    await button('Save').click();
    await modulePanel.getByRole('heading', { name: 'Edit equipment group' }).waitFor();
    assert.equal(await input(/^Name/).inputValue(), names.train);
    await filters().click();
    const quickOption = page.getByRole('option', { name: names.quick, exact: true });
    await quickOption.and(page.locator('[aria-selected="true"]')).waitFor();
    await filterOption.and(page.locator('[aria-selected="true"]')).waitFor();
    await quickOption.press('Escape');
    await quickOption.waitFor({ state: 'hidden' });
    await button('Save').click();
    await assertCurrentConfiguration(names.camera, 'Draft note');
    console.log('PASS device entry, incomplete configuration, quick add and single accessory');

    await tab('My Equipment').click();
    assert.equal(await search.inputValue(), run);
    await button(new RegExp('^' + names.camera)).click();
    await button('Edit').click();
    await input(/^Name/).fill(names.renamed);
    await button('Save').click();
    await modulePanel.getByRole('heading', { name: names.renamed }).waitFor();
    await button('Archive').click();
    await button('Restore').waitFor();
    await button('Restore').click();
    await button('Archive').waitFor();
    await tab('Equipment Groups').click();
    await button(new RegExp('^' + names.train)).click();
    await assertCurrentConfiguration(names.renamed, 'Draft note');
    await button('Edit equipment group').click();
    await input('Notes').fill('Second configuration');
    await button('Save').click();
    await modulePanel.getByText('Second configuration', { exact: true }).waitFor();
    assert.equal(await modulePanel.getByText('Revision history', { exact: true }).count(), 0);
    await button('Edit equipment group').click();
    await input(/^Name/).fill('Unsaved candidate');
    await tab('Nodes', sidebar).click();
    await confirm('Cancel');
    assert.equal(await input(/^Name/).inputValue(), 'Unsaved candidate');
    await button('AstroPhoto', page).click();
    await button('AstroPhoto', page).click();
    assert.equal(await input(/^Name/).inputValue(), 'Unsaved candidate');
    assert.equal(await sidebar.count(), 1);
    console.log('PASS equipment edit/archive/restore, single configuration with current device data, local unsaved guard and sidebar reopen');

    const colors = [];
    for (const theme of ['dark', 'light']) {
      await settings('Comfy.ColorPalette', theme);
      await page.waitForFunction(theme => window.comfyAPI.app.app.extensionManager.setting.get('Comfy.ColorPalette') === theme, theme);
      if (colors.length) await page.waitForFunction(color => getComputedStyle(document.querySelector('.astrophoto-ui')).color !== color, colors[0]);
      colors.push(await sidebar.evaluate(el => getComputedStyle(el).color));
    }
    await settings('Comfy.Locale', 'zh');
    await modulePanel.getByRole('button', { name: '保存' }).waitFor();
    assert.equal(await input(/^名称/).inputValue(), 'Unsaved candidate');
    const sizes = await sidebar.evaluate(root => {
      const outer = root.parentElement;
      const shell = root.querySelector('.ap-equipment');
      const previous = outer.style.cssText;
      const result = [];
      for (const [width, zoom] of [[280, 1], [420, 1], [650, 1], [650, 2]]) {
        outer.style.width = width + 'px';
        outer.style.zoom = String(zoom);
        const content = shell.querySelector('[data-current="true"]');
        result.push({ width, zoom, panel: content.clientWidth, body: content.scrollWidth });
      }
      outer.style.cssText = previous;
      return result;
    });
    assert(sizes.every(size => size.panel > 0 && size.body <= size.panel), JSON.stringify(sizes));
    const extensions = await page.request.get(new URL('/extensions', url).href);
    assert.deepEqual((await extensions.json()).filter(entry => entry.includes('/ComfyUI_AstroPhoto/')),
      ['/extensions/ComfyUI_AstroPhoto/main.js']);
    const node = await page.request.get(new URL('/object_info/vue-basic', url).href);
    assert((await node.json())['vue-basic']);
    assert.deepEqual(errors, []);
    console.log('PASS live zh/en and themes, 280/420/650px and 200% layout, single extension script and Vue node registration');
  }
  if (prepareRestart) cleanup = false;
} catch (error) {
  testError = error;
  console.error(await page.getByRole('dialog').allTextContents());
  console.error(await modulePanel.getByRole('alert').allTextContents());
  console.error(await modulePanel.locator(':invalid').evaluateAll(items => items.map(item => [item.name, item.validationMessage])));
  console.error(errors);
  throw error;
} finally {
  try {
    if (cleanup) await cleanupRun();
  } catch (error) {
    if (testError) throw new AggregateError([testError, error], 'Equipment test and API cleanup failed');
    throw error;
  } finally {
    for (const [key, value] of preferences ?? []) {
      if (value !== undefined) await settings(key, value).catch(() => {});
    }
    await browser.close();
  }
}

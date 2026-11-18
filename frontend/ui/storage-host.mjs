// Opt-in Playwright against an isolated ComfyUI instance and disposable data.
import assert from 'node:assert/strict';
import { basename } from 'node:path';
import { chromium } from 'playwright';

const url = process.env.COMFYUI_TEST_URL;
const capture = process.env.ASTROPHOTO_TEST_CAPTURE;
const target = process.env.ASTROPHOTO_TEST_MIGRATION_TARGET;
if (!url || !capture || !target) throw new Error('Set COMFYUI_TEST_URL, ASTROPHOTO_TEST_CAPTURE and ASTROPHOTO_TEST_MIGRATION_TARGET for a disposable host');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
const responses = [];
const errors = [];
page.on('response', response => responses.push({ url: response.url(), status: response.status() }));
page.on('pageerror', error => errors.push(error.message));
const prefix = '/astrophoto/v1/';
let preferences;
const setHostSetting = (key, value) => page.evaluate(([id, setting]) =>
  window.comfyAPI.app.app.extensionManager.setting.set(id, setting), [key, value]);
try {
  await page.goto(url);
  await page.getByRole('button', { name: 'AstroPhoto', exact: true }).click();
  const sidebar = page.locator('.astrophoto-ui');
  preferences = await page.evaluate(() => {
    const settings = window.comfyAPI.app.app.extensionManager.setting;
    return ['Comfy.Locale', 'Comfy.ColorPalette'].map(key => [key, settings.get(key)]);
  });
  await setHostSetting('Comfy.Locale', 'en');
  await sidebar.getByRole('tab', { name: 'Settings' }).click();
  assert.equal(await sidebar.getByText('General', { exact: true }).count(), 0);
  await sidebar.getByText('Storage', { exact: true }).click();
  const mode = sidebar.getByRole('radio', { name: /Copy into managed workspace/ });
  assert.deepEqual(await mode.evaluate(input => [input.offsetWidth, input.offsetHeight]), [16, 16]);
  if (await mode.isChecked()) {
    await sidebar.getByRole('radio', { name: /Index in database only/ }).click();
    await page.waitForFunction(() => document.querySelector('input[name="astrophoto-import-mode"]:checked')?.parentElement.textContent.includes('Index in'));
  }
  const settings = page.waitForResponse(response => response.url().includes(prefix + 'storage/settings') && response.request().method() === 'PATCH');
  await mode.focus();
  await page.keyboard.press('Space');
  assert.equal((await settings).status(), 200);
  await page.waitForFunction(() => document.querySelector('input[name="astrophoto-import-mode"]:checked')?.parentElement.textContent.includes('Copy into'));
  await sidebar.getByRole('tab', { name: 'Assets' }).click();
  await sidebar.getByRole('button', { name: /Import capture directory/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox', { name: /Authorized server paths/ }).fill(capture);
  await dialog.getByRole('button', { name: 'Check files and capacity' }).click();
  await dialog.getByText(/1 candidates/).waitFor();
  const accepted = page.waitForResponse(response => response.url().endsWith(prefix + 'assets/import'));
  await dialog.getByRole('button', { name: 'Start import' }).click();
  const importResponse = await accepted;
  assert.equal(importResponse.status(), 202);
  const { operation_id: importId } = await importResponse.json();
  await sidebar.getByRole('region', { name: 'Storage operation' }).filter({ hasText: importId })
    .getByText('Copied 1', { exact: true }).waitFor();
  await sidebar.getByText(basename(capture), { exact: true }).first().waitFor();
  console.log('PASS keyboard settings, server-path preview, 202, copy receipt and Assets list');

  await sidebar.getByRole('tab', { name: 'Settings' }).click();
  await sidebar.getByRole('button', { name: /^Actions for / }).first().click();
  await sidebar.getByRole('button', { name: 'Migrate workspace', exact: true }).click();
  const migrate = page.locator('.prompt-dialog-content').getByRole('textbox', { name: 'Absolute path on the ComfyUI server' });
  await migrate.fill(target);
  await migrate.press('Enter');
  await sidebar.getByText(target, { exact: true }).waitFor();
  await sidebar.getByText('Verification sha256', { exact: true }).waitFor();
  await sidebar.getByRole('button', { name: '← Back' }).click();
  await setHostSetting('Comfy.ColorPalette', 'dark');
  await page.waitForFunction(() => window.comfyAPI.app.app.extensionManager.setting.get('Comfy.ColorPalette') === 'dark');
  const dark = await sidebar.evaluate(element => getComputedStyle(element).getPropertyValue('--ap-fg'));
  await setHostSetting('Comfy.ColorPalette', 'light');
  await page.waitForFunction(color => getComputedStyle(document.querySelector('.astrophoto-ui')).getPropertyValue('--ap-fg') !== color, dark);
  await setHostSetting('Comfy.Locale', 'zh');
  await sidebar.getByRole('tab', { name: '设置' }).waitFor();
  assert.equal(await sidebar.getByText('常规', { exact: true }).count(), 0);
  await sidebar.getByText('存储', { exact: true }).waitFor();
  await setHostSetting('Comfy.Locale', 'en');
  await sidebar.getByRole('tab', { name: 'Settings' }).waitFor();
  assert.equal(await sidebar.count(), 1);
  console.log('PASS migration receipt and rebind, host light/dark and zh/en, no General module');

  await page.reload();
  await page.getByRole('button', { name: 'AstroPhoto', exact: true }).click();
  await sidebar.getByRole('tab', { name: 'Settings' }).click();
  await sidebar.getByText('Storage', { exact: true }).click();
  await sidebar.getByText(target, { exact: true }).waitFor();
  assert.equal(await mode.isChecked(), true);
  const entries = await page.request.get(new URL('/extensions', url).href);
  assert.deepEqual((await entries.json()).filter(entry => entry.includes('/ComfyUI_AstroPhoto/')),
    ['/extensions/ComfyUI_AstroPhoto/main.js']);
  assert(responses.some(response => response.url.endsWith('/ComfyUI_AstroPhoto/assets/main.css') && response.status === 200));
  const node = await page.request.get(new URL('/object_info/vue-basic', url).href);
  assert((await node.json())['vue-basic']);
  assert.deepEqual(errors, []);
  console.log('PASS reload persistence, single JS, stylesheet HTTP 200, Vue node registration');

  await sidebar.getByRole('tab', { name: 'Nodes' }).click();
  await sidebar.getByRole('button', { name: 'examples', exact: true }).click();
  await sidebar.getByRole('button', { name: 'Add Vue Basic to canvas' }).click();
  const drawing = page.locator('.drawing-board canvas').first();
  await drawing.evaluate(canvas => {
    const rect = canvas.getBoundingClientRect();
    for (const [type, offset] of [['mousedown', 30], ['mousemove', 60], ['mousemove', 100], ['mouseup', 100]]) {
      canvas.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX: rect.left + offset, clientY: rect.top + offset }));
    }
  });
  const serialized = await page.evaluate(async () => {
    const app = window.comfyAPI.app.app;
    const node = app.canvas.graph.nodes.find(node => node.type === 'vue-basic');
    return { value: await node.widgets[0].serializeValue(node, 0), saved: (await app.graphToPrompt()).workflow };
  });
  assert.match(serialized.value.image, /^threed\/.+ \[temp\]$/);
  assert.match(serialized.saved.nodes.find(node => node.type === 'vue-basic').widgets_values[0].canvasDataURL, /^data:image\/png;base64,/);
  await page.evaluate(async workflow => {
    await window.comfyAPI.app.app.handleFile(new File([JSON.stringify(workflow)], 'AstroPhoto-storage-test.json', { type: 'application/json' }));
  }, serialized.saved);
  await page.waitForFunction(() => document.querySelector('.drawing-board canvas')?.getContext('2d').getImageData(60, 60, 1, 1).data[0] === 0);
  assert.deepEqual(errors, []);
  console.log('PASS real Vue drawing, PNG upload, and workflow pixel reload');

} finally {
  for (const [key, value] of preferences ?? []) {
    if (value !== undefined) await setHostSetting(key, value).catch(() => {});
  }
  await browser.close();
}


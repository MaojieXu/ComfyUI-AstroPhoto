import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { chromium } from 'playwright';

const prefix = '/proxy/comfy';
const extension = '/extensions/ComfyUI_AstroPhoto/';
const appSource = `
  export const app = {
    extensions: [],
    registerExtension(extension) { this.extensions.push(extension.name); }
  };
  window.testApp = app;
`;
const js = await readFile(new URL('../../js/main.js', import.meta.url));
const css = await readFile(new URL('../../js/assets/main.css', import.meta.url));
const resources = new Map([
  ['/', ['text/html', `<!doctype html><script type="module" src="${prefix + extension}main.js"></script>`]],
  [extension + 'main.js', ['text/javascript', js]],
  [extension + 'assets/main.css', ['text/css', css]],
  ['/scripts/app.js', ['text/javascript', appSource]],
  ['/scripts/api.js', ['text/javascript', 'export const api = {};']],
]);
const server = createServer((request, response) => {
  const path = request.url?.startsWith(prefix + '/') && request.url.slice(prefix.length);
  const resource = resources.get(path);
  if (!resource) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { 'Content-Type': resource[0] }).end(resource[1]);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
try {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const responses = new Map();
    const errors = [];
    page.on('response', response => responses.set(new URL(response.url()).pathname, response.status()));
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}${prefix}/`);
    await page.waitForFunction(() => window.testApp?.extensions.length === 4);
    assert.deepEqual(await page.evaluate(() => window.testApp.extensions), ['vue-basic', 'AstroPhoto.ScientificNodes', 'AstroPhoto.Sidebar', 'AstroPhoto.Siril']);
    for (const path of resources.keys()) assert.equal(responses.get(prefix + path), 200, path);
    assert(await page.evaluate(() => Array.from(document.styleSheets).some(sheet => sheet.href?.endsWith('/assets/main.css'))));
    assert.deepEqual(errors, []);
    console.log('PASS Chromium fetched the sidebar, Vue widget, and scientific nodes with one stylesheet under /proxy/comfy/');
  } finally {
    await browser.close();
  }
} finally {
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
}


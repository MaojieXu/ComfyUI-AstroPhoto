import { readdir, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const root = new URL('../../js/', import.meta.url);
const files = await readdir(root, { recursive: true });
assert.deepEqual(files.filter(file => file.endsWith('.js')), ['main.js']);
const source = await readFile(new URL('main.js', root), 'utf8');
const css = await readFile(new URL('assets/main.css', root), 'utf8');
const lock = await readFile(new URL('../pnpm-lock.yaml', import.meta.url), 'utf8');
assert(source.includes('../../scripts/app.js'));
assert(source.includes('../../scripts/api.js'));
assert(source.includes('AstroPhoto.Sidebar'));
assert(source.includes('AstroPhoto.ScientificNodes'));
assert(source.includes('AstroPhoto.Siril'));
assert(source.includes('CUSTOM_VUE_COMPONENT_BASIC'));
assert(!source.includes('process.env.NODE_ENV'));
assert(!source.includes('http://127.0.0.1:8188'));
assert(css.includes('.astrophoto-ui'));
assert(!/\b(?:react-dom|react-i18next|primevue|jest-environment-jsdom|@vitejs\/plugin-react)@/m.test(lock));
assert(!source.includes('react-dom') && !source.includes('data-pc-name'));
for (const prefix of ['https://example.test/', 'https://example.test/proxy/comfy/']) {
  const script = new URL('extensions/ComfyUI_AstroPhoto/main.js', prefix);
  assert.equal(new URL('../../scripts/app.js', script).href, prefix + 'scripts/app.js');
  assert.equal(new URL('./assets/main.css', script).href, prefix + 'extensions/ComfyUI_AstroPhoto/assets/main.css');
}
console.log('PASS Vue-only single JS, sidebar and scientific widgets, shared CSS and proxy-relative URLs');

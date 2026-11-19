import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, mkdtemp, realpath } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const root = await realpath(process.cwd());
const frontend = join(root, 'frontend');
const requireFrontend = createRequire(join(frontend,'package.json'));
const vite = pathToFileURL(resolve(requireFrontend.resolve('vite/package.json'), '../dist/node/index.js'));
const { build } = await import(vite);
const out = await realpath(await mkdtemp(join(tmpdir(),'astrophoto-handoff-build-')));
const rel = relative(root, out);
assert(rel.startsWith('..') || isAbsolute(rel), 'Build output must be outside the worktree');
process.chdir(frontend);
await build({ build: { outDir: out, emptyOutDir: false, rollupOptions: { output: { dir: out } } } });
const files = (await readdir(out, {recursive:true})).filter(path => /\.(js|css)$/.test(path));
assert.deepEqual(files.sort(), [join('assets','main.css'), 'main.js']);
for (const path of files) {
  const content = await readFile(resolve(out,path));
  const existing = await readFile(resolve(root,'js',path));
  console.log(path, createHash('sha256').update(content).digest('hex'), 'matches current artifact:', existing.equals(content));
}

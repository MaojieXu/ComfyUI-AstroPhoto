import { expect, test } from 'vitest';
import enSidebar from '../../src/i18n/locales/en/sidebar.json';
import zhSidebar from '../../src/i18n/locales/zh/sidebar.json';
import enDrawing from '../../../locales/en/main.json';
import zhDrawing from '../../../locales/zh/main.json';
import enSiril from '../../../extension/siril/frontend/locales/en/siril.json';
import zhSiril from '../../../extension/siril/frontend/locales/zh/siril.json';
import { createFrontendI18n } from '../../src/i18n';
import { sirilBundle } from '../../../extension/siril/frontend';

// Supplement to CASE-07/10-A: the migration moved the sidebar dictionary into
// frontend/src and the Siril dictionary into the bundle. Only the drawing
// dictionary had a parity test, so a missing Chinese entry could ship as a raw
// key or an English fallback while the interface still looked "translated".

type Catalog = Record<string, unknown>;

function leaves(value: Catalog): Map<string, string> {
  const result = new Map<string, string>();
  const walk = (entry: Catalog, prefix: string) => {
    for (const [key, nested] of Object.entries(entry)) {
      if (nested && typeof nested === 'object' && !Array.isArray(nested))
        walk(nested as Catalog, `${prefix}${key}.`);
      else result.set(`${prefix}${key}`, String(nested));
    }
  };
  walk(value, '');
  return result;
}

function parity(name: string, en: Catalog, zh: Catalog) {
  const english = leaves(en);
  const chinese = leaves(zh);
  expect({
    missing: [...english.keys()].filter(key => !chinese.has(key)),
    extra: [...chinese.keys()].filter(key => !english.has(key)),
    empty: [...chinese.entries()].filter(([, value]) => !value.trim()).map(([key]) => key),
  }).toEqual({ missing: [], extra: [], empty: [] });
  return english;
}

test('07: the sidebar, drawing and Siril dictionaries keep identical Chinese keys', () => {
  const sidebar = parity('sidebar', enSidebar, zhSidebar);
  expect(sidebar.size).toBeGreaterThan(300);
  parity('drawing', enDrawing, zhDrawing);
  parity('siril', enSiril, zhSiril);
});

test('07: the shipped bundle messages merge into both interface locales', () => {
  const i18n = createFrontendI18n([sirilBundle]);
  const en = leaves({ siril: enSiril });
  const zh = leaves({ siril: zhSiril });
  const key = 'siril.purpose';
  expect(en.has(key) && zh.has(key)).toBe(true);
  i18n.global.locale.value = 'en';
  expect(i18n.global.t(key)).toBe(en.get(key));
  expect(i18n.global.t('nav.assets')).toBe(leaves(enSidebar).get('nav.assets'));
  i18n.global.locale.value = 'zh';
  expect(i18n.global.t(key)).toBe(zh.get(key));
  expect(i18n.global.t('nav.assets')).toBe(leaves(zhSidebar).get('nav.assets'));
});

test('07: every literal t() key in the public sources resolves in both locales', () => {
  // Vite exposes the public sources as raw text; bundle sources live outside the
  // frontend root, so a public file that starts using bundle keys fails here.
  const sources = import.meta.glob('/src/**/*.{ts,tsx,vue}', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
  expect(Object.keys(sources).length).toBeGreaterThan(30);
  const en = new Map([...leaves(enDrawing), ...leaves(enSidebar)]);
  const zh = new Map([...leaves(zhDrawing), ...leaves(zhSidebar)]);
  const used = new Set<string>();
  for (const [path, source] of Object.entries(sources))
    if (!path.includes('/vendor/'))
      for (const match of source.matchAll(/\bt\(\s*['"]([\w.]+)['"](?=\s*[,)])/g)) used.add(match[1]);
  expect(used.size).toBeGreaterThan(100);
  const missing = [...used].filter(key => !en.has(key)).sort();
  const untranslated = [...used].filter(key => !zh.has(key)).sort();
  expect({ missing, untranslated }).toEqual({ missing: [], untranslated: [] });
});

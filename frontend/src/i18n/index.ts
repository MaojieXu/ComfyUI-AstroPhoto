import { createI18n } from 'vue-i18n';
import enWidget from '../../../locales/en/main.json';
import zhWidget from '../../../locales/zh/main.json';
import enSidebar from './locales/en/sidebar.json';
import zhSidebar from './locales/zh/sidebar.json';
import type { FrontendBundle } from '../bundles/types';

export function normalizeLocale(value: unknown): 'en' | 'zh' {
  return typeof value === 'string' && /^zh(?:-|_|$)/i.test(value) ? 'zh' : 'en';
}

export function createFrontendI18n(bundles: readonly FrontendBundle[] = []) {
  return createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: Object.assign({}, enWidget, enSidebar, ...bundles.map(bundle => bundle.messages.en)),
      zh: Object.assign({}, zhWidget, zhSidebar, ...bundles.map(bundle => bundle.messages.zh)),
    },
  });
}

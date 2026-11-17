import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/main.json';
import zh from './locales/zh/main.json';
export const i18n = createInstance();
void i18n.use(initReactI18next).init({
  lng: 'en', fallbackLng: 'en', supportedLngs: ['en', 'zh'],
  resources: { en: { translation: en }, zh: { translation: zh } },
  interpolation: { escapeValue: false }, react: { useSuspense: false }, initImmediate: false
});
export function normalizeLocale(value: unknown): 'en' | 'zh' {
  return typeof value === 'string' && /^zh(?:-|_|$)/i.test(value) ? 'zh' : 'en';
}

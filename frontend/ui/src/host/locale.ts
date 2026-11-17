import { app } from './comfy';
import { i18n, normalizeLocale } from '../i18n';
export function synchronizeLocale() {
  const host = app.extensionManager.setting.get<string>('Comfy.Locale');
  const language = normalizeLocale(host || navigator.language || 'en');
  if (i18n.language !== language) void i18n.changeLanguage(language);
}
// No private Pinia subscription. Poll only while the sidebar root is visible;
// dispose on destroy, and catch up on focus/reopening.
export function watchLocale(element: HTMLElement) {
  synchronizeLocale();
  const check = () => { if (element.getClientRects().length && !document.hidden) synchronizeLocale(); };
  const timer = window.setInterval(check, 500);
  window.addEventListener('focus', check);
  return () => { clearInterval(timer); window.removeEventListener('focus', check); };
}

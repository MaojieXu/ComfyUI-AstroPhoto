import type { ComfyApp } from './comfy';
import { normalizeLocale } from '../i18n';

export function watchLocale(host: ComfyApp, element: HTMLElement, setLocale: (locale: 'en' | 'zh') => void) {
  const synchronize = () => setLocale(normalizeLocale(host.extensionManager.setting.get('Comfy.Locale') || navigator.language));
  const check = () => { if (element.getClientRects().length && !document.hidden) synchronize(); };
  synchronize();
  const timer = window.setInterval(check, 500);
  window.addEventListener('focus', check);
  return () => { window.clearInterval(timer); window.removeEventListener('focus', check); };
}

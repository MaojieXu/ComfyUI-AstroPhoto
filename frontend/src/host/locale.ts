import type { ComfyApp } from './comfy';
import { normalizeLocale } from '../i18n';

export function watchLocale(host: ComfyApp, element: HTMLElement, setLocale: (locale: 'en' | 'zh') => void) {
  const synchronize = () => setLocale(normalizeLocale(host.extensionManager.setting.get('Comfy.Locale') || navigator.language));
  const check = () => { if (element.getClientRects().length && !document.hidden) synchronize(); };
  synchronize();
  host.ui.settings.addEventListener('Comfy.Locale.change', synchronize);
  window.addEventListener('focus', check);
  return () => { host.ui.settings.removeEventListener('Comfy.Locale.change', synchronize); window.removeEventListener('focus', check); };
}

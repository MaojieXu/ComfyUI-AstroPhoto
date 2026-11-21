import { createApp, type Component } from 'vue';
import type { FrontendBundle } from '../bundles/types';
import { createFrontendI18n } from '../i18n';
import type { ComfyApp } from './comfy';
import { watchLocale } from './locale';

export function mountWidget(host: ComfyApp, content: HTMLElement, view: Component,
  props: Record<string, unknown>, bundles: readonly FrontendBundle[] = []) {
  const i18n = createFrontendI18n(bundles);
  const stop = watchLocale(host, content, locale => { i18n.global.locale.value = locale; });
  const root = createApp(view, props);
  root.use(i18n).mount(content);
  return () => { stop(); root.unmount(); };
}

import { createApp, type App } from 'vue';
import type { ComfyApp } from './comfy';
import type { FrontendBundle } from '../bundles/types';
import type { EquipmentSession } from '../features/library/pages/EquipmentPage';
import { Sidebar } from '../features/sidebar/Sidebar';
import { createFrontendI18n } from '../i18n';
import { watchLocale } from './locale';

export const SIDEBAR_ID = 'astrophoto.sidebar';

export function registerSidebar(host: ComfyApp, bundles: readonly FrontendBundle[]) {
  if (host.extensionManager.getSidebarTabs().some(tab => tab.id === SIDEBAR_ID)) return;
  const equipmentSession: EquipmentSession = {};
  let root: App | undefined;
  let element: HTMLElement | undefined;
  let hostContainer: HTMLElement | undefined;
  let stopLocale: (() => void) | undefined;

  const destroy = () => {
    stopLocale?.();
    root?.unmount();
    element?.remove();
    hostContainer?.classList.remove('astrophoto-host-container');
    stopLocale = root = element = hostContainer = undefined;
  };

  host.extensionManager.registerSidebarTab({
    id: SIDEBAR_ID, title: 'AstroPhoto', tooltip: 'AstroPhoto', icon: 'astrophoto-sidebar-icon', type: 'custom',
    render(container) {
      if (root && element?.parentElement === container) return;
      destroy();
      hostContainer = container;
      container.classList.add('astrophoto-host-container');
      element = document.createElement('div');
      element.className = 'astrophoto-ui';
      container.appendChild(element);
      const i18n = createFrontendI18n(bundles);
      stopLocale = watchLocale(host, element, locale => { i18n.global.locale.value = locale; });
      root = createApp(Sidebar, { equipmentSession, bundles });
      root.use(i18n).mount(element);
    },
    destroy,
  });
}

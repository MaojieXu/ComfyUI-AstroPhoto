import { createRoot, type Root } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import type { ComfyApp } from './comfy';
import { App } from '../app/App';
import { i18n } from '../i18n';
import { watchLocale } from './locale';
export const SIDEBAR_ID = 'astrophoto.sidebar';
export function registerSidebar(host: ComfyApp) {
  if (host.extensionManager.getSidebarTabs().some(tab => tab.id === SIDEBAR_ID)) return;
  let root: Root | undefined;
  let element: HTMLElement | undefined;
  let hostContainer: HTMLElement | undefined;
  let stop: (() => void) | undefined;
  const destroy = () => {
    stop?.(); stop = undefined;
    root?.unmount(); root = undefined;
    element?.remove(); element = undefined;
    hostContainer?.classList.remove('astrophoto-host-container'); hostContainer = undefined;
  };
  host.extensionManager.registerSidebarTab({
    id: SIDEBAR_ID, title: 'AstroPhoto', tooltip: 'AstroPhoto', icon: 'astrophoto-sidebar-icon', type: 'custom',
    render(container) {
      if (root && element?.parentElement === container) return;
      destroy();
      hostContainer = container;
      hostContainer.classList.add('astrophoto-host-container');
      element = document.createElement('div'); element.className = 'astrophoto-ui';
      container.appendChild(element);
      stop = watchLocale(element);
      root = createRoot(element);
      root.render(<I18nextProvider i18n={i18n}><App /></I18nextProvider>);
    }, destroy
  });
}

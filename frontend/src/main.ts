import './styles/theme.css';
import './styles/utilities.css';
import type { ComfyApp } from './host/comfy';
import type { FrontendBundle } from './bundles/types';
import { registerSidebar } from './host/sidebar';
import { registerDrawing } from './host/drawing';
import { registerFitsSource } from './host/fitsSource';
import { restoreDomWidgetMounts } from './host/domWidgetMounts';
import { getPreviewSettings } from './api/previewSettings';
import { loadStylesheet } from './styles/load';
import { invalidateCanvasDrop } from './host/dragDrop';
import { startCanvasBridge } from './host/canvasBridge';

export function initializeFrontend(host: ComfyApp, bundles: readonly FrontendBundle[]) {
  loadStylesheet(new URL(/* @vite-ignore */ './assets/main.css', import.meta.url));
  registerDrawing(host);
  registerFitsSource(host);
  host.registerExtension({
    name: 'AstroPhoto.Sidebar',
    setup() {
      registerSidebar(host, bundles);
      startCanvasBridge(host, bundles);
      void getPreviewSettings().catch(() => { /* Keep layout defaults until settings are available. */ });
    },
    beforeConfigureGraph() { invalidateCanvasDrop(); },
    afterConfigureGraph() { restoreDomWidgetMounts(host); },
  });
  for (const bundle of bundles) bundle.registerNodes(host, bundles);
}

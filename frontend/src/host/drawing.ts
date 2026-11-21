import { createApp } from 'vue';
import type { ComfyApp } from './comfy';
import { watchLocale } from './locale';
import { createFrontendI18n } from '../i18n';
import VueExampleComponent from '../features/drawing/VueExampleComponent.vue';
import type { DrawingValue } from '../types';
import { trackDomWidget } from './domWidgetMounts';

export function registerDrawing(host: ComfyApp) {
  host.registerExtension({
    name: 'vue-basic',
    getCustomWidgets() {
      return {
        CUSTOM_VUE_COMPONENT_BASIC(node) {
          const element = document.createElement('div');
          element.className = 'astrophoto-drawing-widget';
          const widget = node.addDOMWidget<HTMLElement, DrawingValue>(
            'custom_vue_component_basic', 'vue-basic', element,
            { getMinHeight: () => 460, getHeight: () => 460 },
          );
          trackDomWidget(widget);
          const i18n = createFrontendI18n();
          const stopLocale = watchLocale(host, element, locale => { i18n.global.locale.value = locale; });
          const vueApp = createApp(VueExampleComponent, { widget });
          vueApp.use(i18n).mount(element);
          const originalRemove = widget.onRemove;
          widget.onRemove = () => {
            stopLocale();
            vueApp.unmount();
            originalRemove?.call(widget);
          };
          return { widget };
        },
      };
    },
    nodeCreated(node) {
      if (node.comfyClass !== 'vue-basic') return;
      const [width, height] = node.size;
      node.setSize([Math.max(width, 300), Math.max(height, 520)]);
    },
  });
}

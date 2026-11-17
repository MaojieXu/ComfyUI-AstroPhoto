import { app } from "comfy:app";
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import Aura from '@primevue/themes/aura';
import VueExampleComponent from './components/VueExampleComponent.vue';
import type { DrawingValue } from './types';
import en from '../../locales/en/main.json';
import zh from '../../locales/zh/main.json';

const stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = new URL(/* @vite-ignore */ './assets/main.css', import.meta.url).href;
document.head.appendChild(stylesheet);

app.registerExtension({
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
                const language = String(app.extensionManager.setting.get('Comfy.Locale') || navigator.language);
                const vueApp = createApp(VueExampleComponent, { widget });
                vueApp.use(createI18n({ legacy: false, locale: language.startsWith('zh') ? 'zh' : 'en', fallbackLocale: 'en', messages: { en, zh } }));
                vueApp.use(PrimeVue, { theme: { preset: Aura, options: { prefix: 'astrophoto', darkModeSelector: '.astrophoto-dark' } } });
                vueApp.directive('tooltip', Tooltip);
                vueApp.mount(element);
                const originalRemove = widget.onRemove;
                widget.onRemove = () => {
                    vueApp.unmount();
                    originalRemove?.call(widget);
                };
                return { widget };
            }
        };
    },
    nodeCreated(node) {
        if (node.comfyClass !== 'vue-basic') return;
        const [width, height] = node.size;
        node.setSize([Math.max(width, 300), Math.max(height, 520)]);
    }
});

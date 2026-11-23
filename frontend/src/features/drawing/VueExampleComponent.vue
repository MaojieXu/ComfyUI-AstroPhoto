<template>
  <div>
    <h1>{{ t("vue-basic.title") }}</h1>
    <div>
      <DrawingApp
          ref="drawingAppRef"
          :width="300"
          :height="300"
          @state-save="handleStateSave"
      />
    </div>
    <p v-if="restoreError" role="alert">{{ t('vue-basic.restore-error') }}</p>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, shallowRef, watch} from 'vue'
import { notifyHost } from '../../host/notify';
import DrawingApp from "./DrawingApp.vue";
import {useI18n} from 'vue-i18n'
import { api } from 'comfy:api';
import { app } from 'comfy:app';
import type { DrawingWidget, DrawingValue } from '../../types';

const {t} = useI18n()
const drawingAppRef = ref<InstanceType<typeof DrawingApp> | null>(null);
const canvasDataURL = ref<string | null>(null);

const props = defineProps<{
  widget: DrawingWidget
}>()
// The host owns the widget object. Its callback properties are the widget API.
const widget = props.widget;

const restoreError = ref(false);
watch(restoreError, value => { if (value) notifyHost('error', t('vue-basic.restore-error')); });
const normalizeValue = (value: unknown): DrawingValue => {
  if (!value || typeof value !== 'object') return { image: null };
  const saved = value as Partial<DrawingValue>;
  return { image: typeof saved.image === 'string' ? saved.image : null,
    ...(typeof saved.canvasDataURL === 'string' ? { canvasDataURL: saved.canvasDataURL } : {}) };
};
const savedValue = shallowRef(normalizeValue(widget.value));
// ComfyUI serializes value synchronously for workflow JSON, and uses
// serializeValue separately for API prompts. Use the native DOM Widget hooks.
widget.options ??= {};
widget.options.getValue = () => savedValue.value;
widget.options.setValue = value => { savedValue.value = normalizeValue(value); };
let mounted = false;
let restoration: Promise<void> = Promise.resolve();

function handleStateSave(dataURL: string, edited = false) {
  canvasDataURL.value = dataURL;
  if (!mounted) return;
  const commit = () => {
    restoration = Promise.resolve();
    savedValue.value = { image: null, canvasDataURL: dataURL };
    restoreError.value = false;
  };
  const node = widget.node;
  const graph = node.graph;
  if (!edited || !graph || dataURL === savedValue.value.canvasDataURL) {
    commit();
    return;
  }
  const canvas = app.canvas;
  graph.beforeChange(node);
  canvas?.emitBeforeChange();
  try {
    commit();
    graph.change();
  } finally {
    try { graph.afterChange(node); } finally { canvas?.emitAfterChange(); }
  }
}

async function uploadTempImage(imageData: string, prefix: string) {
  try {
    const blob = await fetch(imageData).then((r) => r.blob())
    const name = `${prefix}_${Date.now()}.png`
    const file = new File([blob], name)

    const body = new FormData()
    body.append('image', file)
    body.append('subfolder', 'threed')
    body.append('type', 'temp')

    const resp = await api.fetchApi('/upload/image', {
      method: 'POST',
      body
    })

    return resp.json()
  } catch (error) {
    console.error('Vue Component: Error uploading image:', error)
    throw error
  }
}

onMounted(() => {
  mounted = true;
  if (!savedValue.value.canvasDataURL && canvasDataURL.value) handleStateSave(canvasDataURL.value);
  watch(() => savedValue.value.canvasDataURL, dataURL => {
    if (!dataURL || dataURL === canvasDataURL.value) return;
    restoration = drawingAppRef.value!.restoreCanvas(dataURL);
    void restoration.catch(() => { restoreError.value = true; });
  }, { immediate: true, flush: 'sync' });
  widget.serializeValue = async () => {
    try {
      await restoration;

      const canvasData = canvasDataURL.value

      if (!canvasData) {
        console.warn('Vue Component: No canvas data available')
        return {image: null}
      }

      const data = await uploadTempImage(canvasData, "test_vue_basic")

      return {
        image: `threed/${data.name} [temp]`
      }
    } catch (error) {
      console.error('Vue Component: Error in serializeValue:', error)
      return {image: null}
    }
  }
})
</script>

<style scoped>
</style>

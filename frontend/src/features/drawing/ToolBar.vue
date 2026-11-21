<template>
  <div class="toolbar">
    <button type="button"
        :title="t('vue-basic.pen-tooltip')"
        :aria-pressed="currentTool === 'pen'"
        :class="{ active: currentTool === 'pen' }"
        @click="setTool('pen')">{{ t("vue-basic.pen") }}
    </button>
    <button type="button" @click="clearCanvas">{{ t("vue-basic.clear-canvas") }}</button>
  </div>

  <div class="color-picker">
    <button v-for="(color, index) in colors"
            :key="index"
            :class="{ 'color-button': true, 'active': currentColor === color }"
            @click="selectColor(color)"
            type="button"
            :title="color" :aria-label="color" :aria-pressed="currentColor === color">
      <span class="color-swatch" :style="{ backgroundColor: color }" aria-hidden="true"></span>
    </button>
  </div>

  <div class="size-slider">
    <label>{{ t("vue-basic.brush-size") }}: {{ brushSize }}px</label>
    <input type="range" min="1" max="50" :value="brushSize" @change="updateBrushSize($event)">
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {useI18n} from "vue-i18n";

const { t } = useI18n()

interface Props {
  colors?: string[];
  initialColor?: string;
  initialBrushSize?: number;
  initialTool?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'tool-change': [tool: string];
  'color-change': [color: string];
  'canvas-clear': [];
  'brush-size-change': [size: number];
}>();

const colors = props.colors || ['#000000', '#ff0000', '#0000ff', '#69a869', '#ffff00', '#ff00ff', '#00ffff'];
const currentColor = ref(props.initialColor || '#000000');
const brushSize = ref(props.initialBrushSize || 5);
const currentTool = ref(props.initialTool || 'pen');

function setTool(tool: string): void {
  currentTool.value = tool;
  emit('tool-change', tool);
}

function selectColor(color: string): void {
  currentColor.value = color;
  emit('color-change', color);
}

function clearCanvas(): void {
  emit('canvas-clear');
}

function updateBrushSize(event: Event): void {
  const target = event.target as HTMLInputElement;
  brushSize.value = Number(target.value);
  emit('brush-size-change', brushSize.value);
}
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

button {
  padding: 8px 16px;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
}

button.active {
  background-color: #2E7D32;
}

.toolbar button {
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  line-height: 21px;
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 15px;
  align-items: center;
}

.color-button {
  background: none;
  border: 2px solid transparent;
  padding: 4px;
  border-radius: 50%;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: outline 0.2s ease, transform 0.2s ease;
  line-height: 1;
}

.color-swatch {
  border-radius: 50%;
  width: 1.8rem;
  height: 1.8rem;
  display: block;
}

.color-button.active {
  outline: 3px solid #0056b3;
  outline-offset: 2px;

}

.color-button:not(.active):hover {
   outline: 2px solid #ddd;
   outline-offset: 2px;
}

.size-slider {
  margin-bottom: 15px;
}

.size-slider label {
  display: block;
  margin-bottom: 5px;
}

.size-slider input {
  width: 100%;
  max-width: 300px;
}
</style>

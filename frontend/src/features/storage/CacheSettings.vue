<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { app } from '../../host/comfy';
import type { Storage } from '../../api/storage';
import { bytes } from './format';

const props = defineProps<{ storage: Storage; disabled: boolean }>();
const emit = defineEmits<{
  change: [path: string, body: Record<string, unknown>];
  clear: [];
}>();
const { t } = useI18n();
const draftPath = ref<string>();
const draftLimit = ref<string | number>();
const path = computed({
  get: () => draftPath.value ?? props.storage.cache.path,
  set: value => { draftPath.value = value.trim() === props.storage.cache.path ? undefined : value; },
});
const limit = computed({
  get: () => draftLimit.value ?? props.storage.cache.max_size_gb,
  set: value => { draftLimit.value = Number(value) === props.storage.cache.max_size_gb ? undefined : value; },
});
const dirty = computed(() => path.value.trim() !== props.storage.cache.path || Number(limit.value) !== props.storage.cache.max_size_gb);

// Clear a draft only after the server has accepted the corresponding value.
watch(() => props.storage.cache.path, current => {
  if (draftPath.value?.trim() === current) draftPath.value = undefined;
});
watch(() => props.storage.cache.max_size_gb, current => {
  if (Number(draftLimit.value) === current) draftLimit.value = undefined;
});

function save() {
  if (props.disabled || !dirty.value) return;
  emit('change', '/storage/cache/configure', {
    path: path.value.trim(), max_size_gb: Number(limit.value), expected_revision: props.storage.imports.revision,
  });
}

async function confirmClear() {
  const confirmed = await app.extensionManager.dialog.confirm({
    key: 'astrophoto.clear-cache', type: 'delete', title: t('storage.clear'),
    message: t('storage.confirmClear'), itemList: [props.storage.cache.path],
  });
  if (confirmed === true) emit('clear');
}
</script>

<template>
  <section class="ap-storage-group">
    <div class="ap-storage-group-heading">
      <h3>{{ t('storage.cache') }}</h3>
      <span class="ap-storage-badge" :data-state="storage.cache.status">{{ t('storage.states.' + storage.cache.status) }}</span>
      <small>{{ t('storage.used') }} {{ bytes(storage.cache.used_bytes) }}</small>
    </div>
    <form @submit.prevent="save">
      <fieldset class="ap-storage-fields" :disabled="disabled">
        <label>{{ t('storage.path') }}<input v-model="path" required /></label>
        <label>{{ t('storage.limit') }}<input v-model="limit" required type="number" step="any" min="0.001" max="100000" /></label>
        <div class="ap-storage-actions">
          <button type="submit" class="ap-storage-button" data-variant="primary" :disabled="!dirty">{{ t('storage.save') }}</button>
          <button type="button" class="ap-storage-button" :disabled="storage.cache.status !== 'online'" @click="confirmClear">
            {{ t('storage.clear') }}
          </button>
        </div>
      </fieldset>
    </form>
  </section>
</template>

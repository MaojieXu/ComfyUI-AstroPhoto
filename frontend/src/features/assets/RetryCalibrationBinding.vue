<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { requestJson } from '../../api/client';
import LibraryError from './LibraryError.vue';

const props = defineProps<{ collectionId: string; masterIds: string[]; newBinding?: boolean }>();
const emit = defineEmits<{ changed: [] }>();
const { t } = useI18n();
const busy = ref(false);
const done = ref(false);
const error = shallowRef<unknown>();
async function retry() {
  busy.value = true;
  error.value = undefined;
  const path = '/astrophoto/v1/catalog/subframe_collection/' + encodeURIComponent(props.collectionId) + '/bindings';
  try {
    const body = { master_ids: props.masterIds };
    await requestJson(path, 'POST', body);
    done.value = true;
    emit('changed');
  } catch (cause) {
    error.value = cause;
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div v-if="!done || newBinding" role="status">
    <p v-if="!newBinding">{{ t('assetLibrary.bindingFailed') }}</p>
    <LibraryError v-if="error" :error="error" />
    <button type="button" :disabled="busy || !masterIds.length" @click="retry">
      {{ t(newBinding ? 'assetLibrary.bindCalibration' : 'assetLibrary.retryBinding') }}
    </button>
  </div>
</template>

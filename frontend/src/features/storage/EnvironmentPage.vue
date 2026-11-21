<script setup lang="ts">
import { computed, onScopeDispose, ref, shallowRef, useId } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiError } from '../../api/client';
import { getPreviewSettings, savePreviewSettings } from '../../api/previewSettings';
import { ComfySingleSelect } from '../../shared/ComfySingleSelect';
import { Feedback } from '../../shared/Feedback';
import { useResource } from '../../shared/useResource';
import './environment.css';

const props = defineProps<{ onSaved: () => void }>();
const { t } = useI18n();
const id = useId();
const { resource, refresh } = useResource(getPreviewSettings);
const saved = shallowRef<Awaited<ReturnType<typeof getPreviewSettings>>>();
const draft = ref<number>();
const saving = ref(false);
const error = shallowRef<unknown>();
const current = computed(() => resource.value.state === 'ready' ? saved.value ?? resource.value.data : undefined);
const edge = computed(() => draft.value ?? current.value?.longest_edge);
const changed = computed(() => edge.value !== current.value?.longest_edge);
const label = computed(() => t('environment.previewResolution'));
const conflict = computed(() => error.value instanceof ApiError && error.value.status === 409);
const options = computed(() => current.value?.options.map(value => ({
  value: String(value),
  label: value === 0 ? t('environment.fullResolution') : t('environment.pixels', { value }),
})) ?? []);
let disposed = false;
onScopeDispose(() => { disposed = true; });

function select(value: string) {
  draft.value = Number(value);
  if (!conflict.value) error.value = undefined;
}

function refreshAfterConflict() {
  saved.value = undefined;
  error.value = undefined;
  refresh();
}

async function save() {
  const settings = current.value;
  const longestEdge = edge.value;
  if (!settings || longestEdge === undefined || !changed.value || saving.value || conflict.value) return;

  error.value = undefined;
  saving.value = true;
  try {
    const result = await savePreviewSettings(longestEdge, settings.canvas, settings.revision);
    if (disposed) return;
    saved.value = result;
    draft.value = undefined;
    props.onSaved();
  } catch (cause) {
    if (!disposed) error.value = cause;
  } finally {
    if (!disposed) saving.value = false;
  }
}
</script>

<template>
  <p v-if="resource.state === 'loading'" role="status">{{ t('states.loading') }}</p>
  <Feedback v-else-if="resource.state === 'error'" :error="resource.error" :retry="refresh" />
  <form v-else class="ap-environment" @submit.prevent="save">
    <label :for="id">{{ label }}</label>
    <ComfySingleSelect :id="id" :label="label" :value="String(edge)" :disabled="saving" :options="options" :on-change="select" />
    <small>{{ t('environment.previewResolutionHelp') }}</small>
    <div class="ap-storage-actions">
      <button class="ap-storage-button" type="submit" :disabled="saving || conflict || !changed">
        {{ t(saving ? 'environment.saving' : 'storage.save') }}
      </button>
    </div>
    <div v-if="conflict" role="alert">
      <p>{{ t('environment.conflict') }}</p>
      <button class="ap-storage-button" type="button" @click="refreshAfterConflict">{{ t('actions.refresh') }}</button>
    </div>
    <Feedback v-else-if="error !== undefined" :error="error" />
    <p v-if="saved && !changed && !saving && error === undefined" role="status">{{ t('environment.saved') }}</p>
  </form>
</template>

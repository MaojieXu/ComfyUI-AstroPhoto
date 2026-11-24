<script setup lang="ts">
import { computed, watch } from 'vue';
import { notifyHost } from '../../host/notify';
import { useI18n } from 'vue-i18n';
import { ApiError, isRecord } from '../../api/client';

const props = withDefaults(defineProps<{ error: unknown; retry?: () => void; notify?: boolean }>(), { notify: true });
const { t } = useI18n();
const code = computed(() => props.error instanceof ApiError ? props.error.code
  : props.error instanceof Error ? props.error.message : 'network');
const locations = computed(() => {
  const entries = props.error instanceof ApiError ? props.error.details?.locations : undefined;
  return Array.isArray(entries) ? entries.filter(isRecord).filter(entry =>
    typeof entry.workspace_id === 'string' && typeof entry.code === 'string') : [];
});
const detail = computed(() => {
  const details = props.error instanceof ApiError ? props.error.details : undefined;
  if (!details) return '';
  if (Array.isArray(details.references)) return details.references.filter((item): item is string => typeof item === 'string').join(', ');
  const fields = details.fields ?? details.differences;
  if (Array.isArray(fields)) return fields.map(field => typeof field === 'string' ? field : '').filter(Boolean).join(', ');
  if (fields && typeof fields === 'object') return Object.keys(fields).join(', ');
  return ['conflicts', 'unknown'].map(key => {
    const entries = details[key];
    return Array.isArray(entries) && entries.length
      ? t('assetLibrary.' + key) + ' · ' + entries.map(field => t('assetLibrary.fields.' + field, String(field))).join(', ')
      : '';
  }).filter(Boolean).join(' · ');
});
watch(() => props.error, error => {
  if (error && props.notify !== false) notifyHost('error', t('assetLibrary.errors.' + code.value, t('storage.errors.' + code.value, t('errors.' + code.value, t('errors.unknown')))) + ' · ' + code.value);
}, { immediate: true });
</script>

<template>
  <div role="alert" class="ap-assets-error">
    <p>{{ t('assetLibrary.errors.' + code, t('storage.errors.' + code, t('errors.' + code, t('errors.unknown')))) }} <code>{{ code }}</code></p>
    <ul v-if="locations.length">
      <li v-for="entry in locations" :key="String(entry.workspace_id)">
        {{ entry.workspace_id }} · {{ t('storage.errors.' + entry.code, String(entry.code)) }}
      </li>
    </ul>
    <p v-if="detail">{{ detail }}</p>
    <button v-if="retry" type="button" @click="retry">{{ t('actions.retry') }}</button>
  </div>
</template>

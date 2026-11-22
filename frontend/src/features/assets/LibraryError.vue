<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiError } from '../../api/client';

const props = defineProps<{ error: unknown; retry?: () => void }>();
const { t } = useI18n();
const code = computed(() => props.error instanceof ApiError ? props.error.code
  : props.error instanceof Error ? props.error.message : 'network');
const detail = computed(() => {
  const details = props.error instanceof ApiError ? props.error.details : undefined;
  if (!details) return '';
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
</script>

<template>
  <div role="alert" class="ap-assets-error">
    <p>{{ t('assetLibrary.errors.' + code, t('errors.' + code, t('errors.unknown'))) }} <code>{{ code }}</code></p>
    <p v-if="detail">{{ detail }}</p>
    <button v-if="retry" type="button" @click="retry">{{ t('actions.retry') }}</button>
  </div>
</template>

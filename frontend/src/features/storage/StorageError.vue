<script setup lang="ts">
import { watch } from 'vue';
import { notifyHost } from '../../host/notify';
import { useI18n } from 'vue-i18n';

const props = withDefaults(defineProps<{ code: string; notify?: boolean }>(), { notify: true });
const { t } = useI18n();
watch(() => props.code, code => { if (code && props.notify !== false) notifyHost('error', t('storage.errors.' + code, t('storage.error')) + ' · ' + code); }, { immediate: true });
</script>

<template>
  <p role="alert" class="ap-storage-error">
    {{ t('storage.errors.' + code, t('storage.error')) }} <code>{{ code }}</code>
  </p>
</template>

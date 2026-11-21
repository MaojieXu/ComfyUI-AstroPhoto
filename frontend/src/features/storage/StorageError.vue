<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{ code: string }>();
const { t } = useI18n();
</script>

<template>
  <p role="alert" class="ap-storage-error">
    {{ t('storage.errors.' + code, t('storage.error')) }} <code>{{ code }}</code>
  </p>
</template>

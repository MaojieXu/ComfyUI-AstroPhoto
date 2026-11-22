<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { listDocuments, type Asset } from '../../api/assets';
import { useResource } from '../../shared/useResource';
import { SearchField } from '../../shared/SearchField';
import LibraryError from './LibraryError.vue';

const props = defineProps<{
  selected?: string[];
  excluded?: string[];
  usage?: string;
}>();
const emit = defineEmits<{ pick: [asset: Asset] }>();
const { t } = useI18n();
const search = ref('');
const load = computed(() => {
  const q = search.value;
  const usage = props.usage;
  return (signal: AbortSignal) => listDocuments('assets', { q, usage, limit: '30' }, signal);
});
const { resource, refresh } = useResource(load);
const candidates = computed(() => resource.value.state === 'ready' ? resource.value.data.items.filter(asset =>
  !props.selected?.includes(asset.id) && !props.excluded?.includes(asset.id)) : []);
</script>

<template>
  <SearchField :label="t('assetLibrary.searchAssets')" :clear-label="t('browse.clear')" @search="search = $event" />
  <p v-if="resource.state === 'loading'" role="status">{{ t('states.loading') }}</p>
  <LibraryError v-else-if="resource.state === 'error'" :error="resource.error" :retry="refresh" />
  <p v-else-if="!candidates.length" role="status">{{ t('assetLibrary.noMatches') }}</p>
  <ul v-else class="ap-assets-list ap-assets-picker-list">
    <li v-for="asset in candidates" :key="asset.id">
      <button type="button" class="ap-assets-truncate" :title="asset.name" @click="emit('pick', asset)">{{ asset.name }}</button>
    </li>
  </ul>
  <small v-if="resource.state === 'ready' && resource.data.next">{{ t('assetLibrary.narrowSearch') }}</small>
</template>

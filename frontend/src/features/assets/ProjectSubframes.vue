<script setup lang="ts">
import { computed, onMounted, onScopeDispose, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiError, getJson } from '../../api/client';
import { readDocument } from '../../api/assets';
import { useResource } from '../../shared/useResource';
import LibraryError from './LibraryError.vue';

type Frame = { id: string; file_name: string; file_path: string | null; size_bytes: number };
type Page = { items: Frame[]; total: number; next: string | null };
const props = defineProps<{ collectionId: string }>();
const emit = defineEmits<{ count: [count: number] }>();
const { t } = useI18n();
const frames = ref<Frame[]>([]);
const cursor = ref<string | null>(null);
const pending = ref(true);
const error = shallowRef<unknown>();
const selected = ref<Frame>();
const sentinel = ref<HTMLElement>();
const controller = new AbortController();

const { resource: file, refresh: refreshFile } = useResource(computed(() => {
  const id = selected.value?.id;
  return (signal: AbortSignal) => id ? readDocument('assets', id, signal) : Promise.resolve(undefined);
}));
const size = computed(() => new Intl.NumberFormat(undefined, { style: 'unit', unit: 'byte' })
  .format(selected.value?.size_bytes ?? 0));

async function load() {
  pending.value = true;
  error.value = undefined;
  const query = new URLSearchParams({ limit: '50' });
  if (cursor.value) query.set('after', cursor.value);
  try {
    const page = await getJson(
      '/astrophoto/v1/catalog/subframe_collection/' + encodeURIComponent(props.collectionId) + '/files?' + query,
      controller.signal,
    ) as Page;
    if (controller.signal.aborted) return;
    frames.value.push(...page.items);
    cursor.value = page.next;
    emit('count', page.total);
  } catch (cause) {
    if (controller.signal.aborted) return;
    if (cause instanceof ApiError && cause.code === 'REVISION_CONFLICT' && cursor.value) {
      frames.value = [];
      cursor.value = null;
      selected.value = undefined;
    }
    error.value = cause;
  } finally {
    if (!controller.signal.aborted) pending.value = false;
  }
}
function loadMore() {
  if (!pending.value && cursor.value) void load();
}
onMounted(load);
onScopeDispose(() => controller.abort());
watch(sentinel, (element, _, cleanup) => {
  if (!element || typeof IntersectionObserver === 'undefined') return;
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) loadMore();
  });
  observer.observe(element);
  cleanup(() => observer.disconnect());
});
</script>

<template>
  <ul class="ap-project-subframes">
    <li v-for="frame in frames" :key="frame.id">
      <button type="button" class="ap-project-frame-name" :title="frame.file_name"
              :aria-expanded="selected?.id === frame.id" @click="selected = selected?.id === frame.id ? undefined : frame">
        {{ frame.file_name }}
      </button>
      <dl v-if="selected?.id === frame.id" class="ap-catalog-facts ap-project-frame-facts">
        <div><dt>{{ t('assetLibrary.filePath') }}</dt><dd>{{ frame.file_path || t('assetLibrary.values.unspecified') }}</dd></div>
        <div><dt>{{ t('assetLibrary.fileSize') }}</dt><dd>{{ size }}</dd></div>
        <div><dt>{{ t('assetLibrary.availability') }}</dt><dd role="status">
          <template v-if="file.state === 'ready' && file.data">{{ t('assetLibrary.values.' + (file.data.available ? 'online' : 'offline')) }}</template>
          <template v-else-if="file.state === 'error'">{{ t('assetLibrary.values.unknown') }}</template>
          <template v-else>{{ t('states.loading') }}</template>
        </dd></div>
      </dl>
      <LibraryError v-if="selected?.id === frame.id && file.state === 'error'" :error="file.error" :retry="refreshFile" :notify="false" />
    </li>
    <li v-if="error"><LibraryError :error="error" :retry="load" :notify="false" /></li>
    <li v-else-if="pending" role="status">{{ t('states.loading') }}</li>
    <li v-else-if="!frames.length" role="status">{{ t('assetLibrary.projectEmptySubframes') }}</li>
    <li v-else-if="cursor">
      <span ref="sentinel" class="ap-project-frame-sentinel" aria-hidden="true"></span>
      <button type="button" class="ap-project-frame-name" @click="loadMore">{{ t('assetLibrary.loadMore') }}</button>
    </li>
  </ul>
</template>

<style scoped>
.ap-project-subframes { width:100%; min-width:0; margin:0; padding:0; list-style:none; }
.ap-project-subframes li { display:block; }
.ap-project-subframes .ap-project-frame-name { display:block; width:100%; overflow:hidden; text-overflow:ellipsis;
  white-space:nowrap; text-align:left; padding:4px 2px; border:0; background:transparent; color:inherit; font-size:12px; }
.ap-project-frame-facts { margin:0 4px 6px; overflow-wrap:anywhere; }
.ap-project-frame-sentinel { display:block; height:1px; }
</style>

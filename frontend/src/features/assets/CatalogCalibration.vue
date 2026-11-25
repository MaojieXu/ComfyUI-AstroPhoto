<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { getJson, requestJson } from '../../api/client';
import type { CalibrationComparison } from '../../api/assets';
import { useResource } from '../../shared/useResource';
import { DetailAccordion } from '../library/components/DetailAccordion';
import LibraryError from './LibraryError.vue';
import RetryCalibrationBinding from './RetryCalibrationBinding.vue';

const props = defineProps<{ id: string }>();
const { t } = useI18n();
const error = shallowRef<unknown>();
const busy = ref(false);
const choosing = ref('');
const path = computed(() => '/astrophoto/v1/catalog/subframe_collection/' + encodeURIComponent(props.id));
type Master = { id: string; name: string; master_type: string };
const { resource, refresh } = useResource(computed(() => {
  const endpoint = path.value;
  return async (signal: AbortSignal) => {
    const collection = await getJson(endpoint, signal) as { frame_type: string; master_ids: string[] };
    const masters: Master[] = [];
    let after = '';
    do {
      const page = await getJson('/astrophoto/v1/catalog/calibration_master?after=' + after, signal) as
        { items: Master[]; next: string | null };
      masters.push(...page.items);
      after = page.next ?? '';
    } while (after);
    const allowed = collection.frame_type === 'light' ? ['dark', 'bias', 'flat'] :
      collection.frame_type === 'flat' ? ['bias', 'dark_flat'] : [];
    const candidates = masters.filter(row => allowed.includes(row.master_type) && !collection.master_ids.includes(row.id));
    const comparisons: CalibrationComparison[] = [];
    for (let start = 0; start < candidates.length; start += 1000) {
      const preview = await requestJson(endpoint + '/bindings', 'POST', { master_ids: candidates.slice(start, start + 1000).map(row => row.id), preview: true }, signal) as { items: CalibrationComparison[] };
      comparisons.push(...preview.items);
    }
    const rank = (item: CalibrationComparison) => Object.values(item.fields).some(field => field.status === 'difference') ? 2 : Object.values(item.fields).some(field => field.status === 'unknown') ? 1 : 0;
    const compared = candidates.map(row => ({ ...row, comparison: comparisons.find(item => item.id === row.id)! })).sort((a, b) => rank(a.comparison) - rank(b.comparison));
    return {
      allowed,
      assigned: masters.filter(row => collection.master_ids.includes(row.id)),
      candidates: compared,
    };
  };
}));
function reload() { choosing.value = ''; refresh(); }
async function unlink(master: string) {
  busy.value = true;
  error.value = undefined;
  try {
    await requestJson(path.value + '/bindings/' + encodeURIComponent(master), 'DELETE');
    reload();
  } catch (cause) {
    error.value = cause;
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <DetailAccordion v-if="resource.state === 'ready'" :title="t('assetLibrary.master')">
    <div v-for="type in resource.data.allowed" :key="type" class="ap-calibration-type">
      <strong>{{ t('assetLibrary.values.' + type) }}</strong>
      <div v-for="row in resource.data.assigned.filter(item => item.master_type === type)" :key="row.id">{{ row.name }} <button type="button" :disabled="busy" @click="unlink(row.id)">{{ t('assetLibrary.remove') }}</button></div>
        <button type="button" @click="choosing = choosing === type ? '' : type">{{ t('assetLibrary.selectCalibration') }}</button>
        <template v-if="choosing === type">
        <p v-if="!resource.data.candidates.some(item => item.master_type === type)" class="ap-catalog-meta">{{ t('assetLibrary.noMatchingMasters') }}</p>
        <div v-for="row in resource.data.candidates.filter(item => item.master_type === type)" :key="row.id">
          <span>{{ row.name }}</span>
          <p class="ap-catalog-meta">{{ Object.values(row.comparison.fields).some(field => field.status === 'difference') ? t('assetLibrary.comparison.difference') : Object.values(row.comparison.fields).some(field => field.status === 'unknown') ? t('assetLibrary.comparison.unknown') : t('assetLibrary.comparison.match') }}</p>
          <div v-for="(field, key) in row.comparison.fields" :key="key" class="ap-catalog-meta"><template v-if="field.status !== 'match'">{{ t('assetLibrary.catalogFields.' + key, key) }}: {{ t('assetLibrary.comparison.' + field.status) }}</template></div>
          <RetryCalibrationBinding :collection-id="id" :master-ids="[row.id]" new-binding @changed="reload" />
        </div>
        </template>
    </div>
    <LibraryError v-if="error" :error="error" />
  </DetailAccordion>
  <LibraryError v-else-if="resource.state === 'error'" :error="resource.error" :retry="refresh" />
</template>

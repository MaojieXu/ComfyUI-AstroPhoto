<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { requestJson } from '../../api/client';
import { fetchOpticalTrains, fetchTrain, type Train } from '../../api/equipment';
import { useResource } from '../../shared/useResource';
import LibraryError from './LibraryError.vue';

type Binding = { revision?: number; equipment_train_id?: string | null; filter_state?: string;
  filter_id?: string | null; equipment_snapshot?: { name?: string } | null };
const props = defineProps<{ endpoint: string; record: Binding }>();
const emit = defineEmits<{ changed: [] }>();
const { t } = useI18n();
const editing = ref(false);
const busy = ref(false);
const trainId = ref('');
const filter = ref('unknown');
const train = shallowRef<Train>();
const trainLoading = ref(false);
const error = shallowRef<unknown>();
const { resource: trains, refresh: refreshTrains } = useResource(async signal => {
  const rows: Train[] = [];
  let after: string | null = null;
  do {
    const page = await fetchOpticalTrains({ after: after ?? undefined }, signal);
    rows.push(...page.items.filter(row => row.status !== 'archived' && row.status !== 'deleted'));
    after = page.next;
  } while (after);
  return rows;
});
const dirty = computed(() => trainId.value !== (props.record.equipment_train_id || '') ||
  filter.value !== (props.record.filter_state === 'selected' ? props.record.filter_id : props.record.filter_state || 'unknown'));
watch(trainId, (id, _old, cleanup) => {
  filter.value = 'unknown';
  train.value = undefined;
  trainLoading.value = !!id;
  if (!id) return;
  const controller = new AbortController();
  cleanup(() => controller.abort());
  void fetchTrain(id, controller.signal).then(row => { train.value = row; }).catch(cause => {
    if (!controller.signal.aborted) error.value = cause;
  }).finally(() => { if (!controller.signal.aborted) trainLoading.value = false; });
}, { flush: 'sync' });
function begin() {
  error.value = undefined;
  trainId.value = props.record.equipment_train_id || '';
  filter.value = props.record.filter_state === 'selected' ? props.record.filter_id || 'unknown' : props.record.filter_state || 'unknown';
  editing.value = true;
}
async function save() {
  if (busy.value || !dirty.value || trainLoading.value || !props.record.revision) return;
  busy.value = true;
  error.value = undefined;
  try {
    await requestJson('/astrophoto/v1/catalog/' + props.endpoint, 'PATCH', {
      revision: props.record.revision, equipment_train_id: trainId.value || null,
      filter_state: ['unknown', 'none'].includes(filter.value) ? filter.value : 'selected',
      filter_id: ['unknown', 'none'].includes(filter.value) ? null : filter.value,
    });
    editing.value = false;
    emit('changed');
  } catch (cause) { error.value = cause; }
  finally { busy.value = false; }
}
</script>

<template>
  <button v-if="!editing" type="button" @click="begin">{{ t('assetLibrary.editEquipmentBinding') }}</button>
  <form v-else class="ap-assets-form" @submit.prevent="save">
    <label>{{ t('assetLibrary.catalogFields.equipment_train_id') }}
      <select v-model="trainId" :disabled="busy || trains.state !== 'ready'">
        <option value="">{{ t('assetLibrary.values.unspecified') }}</option>
        <option v-if="trainId && trains.state === 'ready' && !trains.data.some(item => item.id === trainId)" :value="trainId" disabled>{{ record.equipment_snapshot?.name || trainId }}</option>
        <option v-for="item in trains.state === 'ready' ? trains.data : []" :key="item.id" :value="item.id">{{ item.name }}</option>
      </select>
    </label>
    <LibraryError v-if="trains.state === 'error'" :error="trains.error" :retry="refreshTrains" />
    <label>{{ t('assetLibrary.catalogFields.filter') }}
      <select v-model="filter" :disabled="busy || trainLoading">
        <option value="unknown">{{ t('assetLibrary.values.unknown') }}</option>
        <option value="none">{{ t('assetLibrary.noFilter') }}</option>
        <option v-for="(id, index) in train?.filter_ids ?? []" :key="id" :value="id">{{ train?.components?.find(item => item.id === id)?.name ?? train?.summary.filters[index] ?? id }}</option>
      </select>
    </label>
    <LibraryError v-if="error" :error="error" />
    <div class="ap-assets-toolbar">
      <button type="button" :disabled="busy" @click="editing = false">{{ t('equipment.cancel') }}</button>
      <button type="submit" :disabled="busy || !dirty || trainLoading || trains.state !== 'ready'">{{ t('assetLibrary.save') }}</button>
    </div>
  </form>
</template>

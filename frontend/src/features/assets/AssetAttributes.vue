<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Input from '@comfyorg/design-system/input/Input';
import { computed } from 'vue';
import { fetchOpticalTrains, fetchSelectable, fetchTrain } from '../../api/equipment';
import type { AssetAttribute, Attributes } from '../../api/assets';
import { useResource } from '../../shared/useResource';
import { ComfySingleSelect } from '../../shared/ComfySingleSelect';
import { ComfyMultiSelect } from '../../shared/ComfyMultiSelect';
import { details, numbers, values } from './attributes';
import LibraryError from './LibraryError.vue';
import AssetPicker from './AssetPicker.vue';

const model = defineModel<Attributes>({ required: true });
const props = defineProps<{ id: string; saving?: boolean }>();
const { t } = useI18n();
const { resource: devices, refresh: refreshDevices } = useResource(fetchSelectable);
const { resource: trains, refresh: refreshTrains } = useResource(async signal => {
  let after = '';
  const rows = [];
  do {
    const page = await fetchOpticalTrains({ after }, signal);
    rows.push(...page.items);
    if (!page.next || page.next <= after) return rows;
    after = page.next;
  } while (after);
  return rows;
});
const localizedEmpty = computed(() => ({ value: '', label: t('assetLibrary.values.unspecified') }));
const cameras = computed(() => devices.value.state === 'ready' ? devices.value.data.filter(d => d.equipment_type === 'camera') : []);
const equipment = computed(() => devices.value.state === 'ready'
  ? devices.value.data.map(row => ({ value: row.id, name: row.name })) : []);
const optical = computed(() => trains.value.state === 'ready' ? trains.value.data : []);
const historicalTrain = computed(() => {
  const current = model.value.optical_train_id;
  const missing = typeof current === 'string' && trains.value.state === 'ready' &&
    !trains.value.data.some(row => row.id === current);
  return (signal: AbortSignal) => missing ? fetchTrain(current, signal) : Promise.resolve(null);
});
const { resource: trainHistory } = useResource(historicalTrain);
const historicalOption = computed(() => {
  const history = trainHistory.value.state === 'ready' ? trainHistory.value.data : null;
  if (!history || history.id !== model.value.optical_train_id) return null;
  return {
    value: history.id,
    label: history.name + ' · ' + t('equipment.values.' + history.status),
    disabled: history.status === 'deleted',
  };
});
function set(key: string, value: AssetAttribute) {
  model.value = { ...model.value, [key]: value };
}
function setNumber(key: string, event: Event) {
  const input = event.target as HTMLInputElement;
  set(key, Number.isFinite(input.valueAsNumber) ? input.valueAsNumber : null);
}
function selectOptions(rows: { id: string; name: string }[], key: string) {
  const options: { value: string; label: string; disabled?: boolean }[] =
    [localizedEmpty.value, ...rows.map(row => ({ value: row.id, label: row.name }))];
  const current = model.value[key];
  if (typeof current === 'string' && current && !options.some(option => option.value === current)) {
    options.push((key === 'optical_train_id' && historicalOption.value) || { value: current, label: current });
  }
  return options;
}
</script>

<template>
  <fieldset class="ap-assets-form" :disabled="saving">
    <legend>{{ t('assetLibrary.attributes') }}</legend>
    <label v-for="(options, key) in values" :key="key" class="ap-assets-field" :for="props.id + '-' + key">
      {{ t('assetLibrary.fields.' + key) }}
      <ComfySingleSelect :id="props.id + '-' + key" :value="String(model[key] ?? '')" :label="t('assetLibrary.fields.' + key)"
        :disabled="saving" :options="[localizedEmpty, ...options.map(value => ({ value, label: t('assetLibrary.values.' + value) }))]"
        @change="set(key, $event || null)" />
    </label>
    <label v-for="key in details" :key="key">{{ t('assetLibrary.fields.' + key) }}
      <Input class="ap-native-input" :model-value="String(model[key] ?? '')" @input="set(key, ($event.target as HTMLInputElement).value || null)" />
    </label>
    <label v-for="key in numbers" :key="key">{{ t('assetLibrary.fields.' + key) }}
      <Input class="ap-native-input" type="number" step="any" :model-value="String(model[key] ?? '')" @input="setNumber(key, $event)" />
    </label>
    <label :for="props.id + '-camera'">{{ t('assetLibrary.fields.camera_id') }}</label>
    <ComfySingleSelect :id="props.id + '-camera'" :value="String(model.camera_id ?? '')" :label="t('assetLibrary.fields.camera_id')"
      :disabled="saving" :options="selectOptions(cameras, 'camera_id')" @change="set('camera_id', $event || null)" />
    <LibraryError v-if="devices.state === 'error'" :error="devices.error" :retry="refreshDevices" />
    <ComfyMultiSelect :label="t('assetLibrary.fields.equipment_ids')" :placeholder="t('assetLibrary.fields.equipment_ids')"
      :empty-text="t('assetLibrary.noMatches')" :options="equipment" :value="Array.isArray(model.equipment_ids) ? model.equipment_ids : []"
      :disabled="!!saving" @change="set('equipment_ids', $event)" />
    <label :for="props.id + '-optical'">{{ t('assetLibrary.fields.optical_train_id') }}</label>
  <ComfySingleSelect :key="historicalOption?.label" :id="props.id + '-optical'" :value="String(model.optical_train_id ?? '')" :label="t('assetLibrary.fields.optical_train_id')"
      :disabled="saving" :options="selectOptions(optical, 'optical_train_id')" @change="set('optical_train_id', $event || null)" />
    <LibraryError v-if="trains.state === 'error'" :error="trains.error" :retry="refreshTrains" />
    <template v-if="model.usage === 'flat' && model.calibration_state === 'calibrated'">
      <p>{{ t('assetLibrary.flatRequirements') }}</p>
      <label :for="props.id + '-calibration-source'">{{ t('assetLibrary.calibrationMethod') }}</label>
      <ComfySingleSelect :id="props.id + '-calibration-source'" :value="String(model.calibration_method ?? '')"
        :label="t('assetLibrary.calibrationMethod')" :disabled="saving"
        :options="[localizedEmpty, ...['bias', 'dark_flat'].map(value => ({ value, label: t('assetLibrary.values.' + value) }))]"
        @change="model = { ...model, calibration_method: $event || null, calibration_source_asset_id: null }" />
      <small v-if="model.calibration_source_asset_id">{{ t('assetLibrary.fields.calibration_source_asset_id') }} · {{ model.calibration_source_asset_id }}</small>
      <AssetPicker v-if="typeof model.calibration_method === 'string'" :usage="model.calibration_method" :key="model.calibration_method"
        :selected="typeof model.calibration_source_asset_id === 'string' ? [model.calibration_source_asset_id] : []"
        @pick="set('calibration_source_asset_id', $event.id)" />
    </template>
  </fieldset>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import { useI18n } from 'vue-i18n';
import Input from '@comfyorg/design-system/input/Input';
import { ComfySingleSelect } from '../../shared/ComfySingleSelect';
import { DetailAccordion } from '../library/components/DetailAccordion';

const values = defineModel<Record<string, string | number>>({ required: true });
const { t } = useI18n();
const sensitivityId = useId();
const binningId = useId();
const sensitivity = ref(values.value.iso !== '' && values.value.iso != null && !values.value.gain && !values.value.offset ? 'iso' : 'gain');
const custom = ref(!['', '1', '2', '3', '4'].includes(String(values.value.binning ?? '')));
const binValue = computed(() => custom.value ? 'custom' : String(values.value.binning ?? ''));
const count = computed(() => ['exposure_seconds', 'iso', 'gain', 'offset', 'temperature_c', 'readout_mode'].filter(key => String(values.value[key] ?? '').trim() !== '').length);
const binSummary = computed(() => ['1', '2', '3', '4'].includes(String(values.value.binning ?? '')) ? `${values.value.binning} × ${values.value.binning}` : String(values.value.binning || t('assetLibrary.values.unknown')));
function setBinning(value: string) {
  custom.value = value === 'custom';
  values.value.binning = custom.value ? '' : value;
}
</script>

<template>
  <DetailAccordion :title="t('assetLibrary.captureParameters')" :count="t('assetLibrary.importCompact.filled', { count })">
    <div class="ap-assets-form ap-import-fields">
      <label>{{ t('assetLibrary.catalogFields.exposure_seconds') }}<Input v-model="values.exposure_seconds" class="ap-native-input h-8 px-2 py-1 text-xs" type="number" step="any" /></label>
      <label :for="sensitivityId">{{ t('assetLibrary.importCompact.sensitivity') }}<ComfySingleSelect :id="sensitivityId" :label="t('assetLibrary.importCompact.sensitivity')" :value="sensitivity" :options="[{ value: 'gain', label: t('assetLibrary.importCompact.gainOffset') }, { value: 'iso', label: 'ISO' }, { value: 'unknown', label: t('assetLibrary.values.unknown') }]" @change="sensitivity = $event" /></label>
      <label v-if="sensitivity === 'iso' || values.iso != null && values.iso !== ''">ISO<Input v-model="values.iso" class="ap-native-input h-8 px-2 py-1 text-xs" type="number" step="any" /></label>
      <label v-for="key in ['gain', 'offset']" v-show="sensitivity === 'gain' || values[key] != null && values[key] !== ''" :key="key">{{ t('assetLibrary.catalogFields.' + key) }}<Input v-model="values[key]" class="ap-native-input h-8 px-2 py-1 text-xs" type="number" step="any" /></label>
      <label>{{ t('assetLibrary.catalogFields.temperature_c') }}<Input v-model="values.temperature_c" class="ap-native-input h-8 px-2 py-1 text-xs" type="number" step="any" /></label>
      <DetailAccordion :title="t('assetLibrary.importCompact.more')" :count="binSummary + ' · ' + (values.readout_mode || t('assetLibrary.importCompact.notFilled'))">
        <div class="ap-assets-form ap-import-fields">
          <label :for="binningId">{{ t('assetLibrary.catalogFields.binning') }}<ComfySingleSelect :id="binningId" :label="t('assetLibrary.catalogFields.binning')" :value="binValue" :options="[...['1','2','3','4'].map(value => ({ value, label: `${value} × ${value}` })), { value: '', label: t('assetLibrary.values.unknown') }, { value: 'custom', label: t('assetLibrary.importCompact.custom') }]" @change="setBinning" /></label>
          <label v-if="custom">{{ t('assetLibrary.importCompact.customBinning') }}<Input v-model="values.binning" class="ap-native-input h-8 px-2 py-1 text-xs" type="text" /></label>
          <label>{{ t('assetLibrary.catalogFields.readout_mode') }}<Input v-model="values.readout_mode" class="ap-native-input h-8 px-2 py-1 text-xs" type="text" /></label>
        </div>
      </DetailAccordion>
    </div>
  </DetailAccordion>
</template>

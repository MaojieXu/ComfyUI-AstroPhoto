<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { DetailAccordion } from '../library/components/DetailAccordion';

const values = defineModel<Record<string, string | number>>({ required: true });
const { t } = useI18n();
const sensitivity = ref(values.value.iso !== '' && values.value.iso != null && !values.value.gain && !values.value.offset ? 'iso' : 'gain');
const custom = ref(!['', '1', '2', '3', '4'].includes(String(values.value.binning ?? '')));
const binValue = computed(() => custom.value ? 'custom' : String(values.value.binning ?? ''));
const count = computed(() => ['exposure_seconds', 'iso', 'gain', 'offset', 'temperature_c', 'readout_mode'].filter(key => String(values.value[key] ?? '').trim() !== '').length);
const binSummary = computed(() => ['1', '2', '3', '4'].includes(String(values.value.binning ?? '')) ? `${values.value.binning} × ${values.value.binning}` : String(values.value.binning || t('assetLibrary.values.unknown')));
function setBinning(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  custom.value = value === 'custom';
  values.value.binning = custom.value ? '' : value;
}
</script>

<template>
  <DetailAccordion :title="t('assetLibrary.captureParameters')" :count="t('assetLibrary.importCompact.filled', { count })">
    <div class="ap-assets-form ap-import-fields">
      <label>{{ t('assetLibrary.catalogFields.exposure_seconds') }}<input v-model="values.exposure_seconds" type="number" step="any"></label>
      <label>{{ t('assetLibrary.importCompact.sensitivity') }}<select v-model="sensitivity"><option value="gain">{{ t('assetLibrary.importCompact.gainOffset') }}</option><option value="iso">ISO</option><option value="unknown">{{ t('assetLibrary.values.unknown') }}</option></select></label>
      <label v-if="sensitivity === 'iso' || values.iso != null && values.iso !== ''">ISO<input v-model="values.iso" type="number" step="any"></label>
      <label v-for="key in ['gain', 'offset']" v-show="sensitivity === 'gain' || values[key] != null && values[key] !== ''" :key="key">{{ t('assetLibrary.catalogFields.' + key) }}<input v-model="values[key]" type="number" step="any"></label>
      <label>{{ t('assetLibrary.catalogFields.temperature_c') }}<input v-model="values.temperature_c" type="number" step="any"></label>
      <DetailAccordion :title="t('assetLibrary.importCompact.more')" :count="binSummary + ' · ' + (values.readout_mode || t('assetLibrary.importCompact.notFilled'))">
        <div class="ap-assets-form ap-import-fields">
          <label>{{ t('assetLibrary.catalogFields.binning') }}<select :value="binValue" @change="setBinning"><option value="1">1 × 1</option><option value="2">2 × 2</option><option value="3">3 × 3</option><option value="4">4 × 4</option><option value="">{{ t('assetLibrary.values.unknown') }}</option><option value="custom">{{ t('assetLibrary.importCompact.custom') }}</option></select></label>
          <label v-if="custom">{{ t('assetLibrary.importCompact.customBinning') }}<input v-model="values.binning" type="text"></label>
          <label>{{ t('assetLibrary.catalogFields.readout_mode') }}<input v-model="values.readout_mode" type="text"></label>
        </div>
      </DetailAccordion>
    </div>
  </DetailAccordion>
</template>

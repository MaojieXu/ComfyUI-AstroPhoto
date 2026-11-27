<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui';
import Button from '@comfyorg/design-system/button/Button';
import PopoverContent from '@comfyorg/design-system/popover/PopoverContent';
import { DetailAccordion } from '../library/components/DetailAccordion';
import LibraryError from './LibraryError.vue';
import type { FacetFilters, FacetGroup } from './assetFacets';

defineProps<{ filters: FacetFilters; groups: FacetGroup[]; pending?: boolean; error?: unknown }>();
const emit = defineEmits<{ open: [value: boolean]; change: [key: string, value: string]; clear: [] }>();
const { t } = useI18n();
const open = ref(false);
</script>

<template>
  <PopoverRoot v-model:open="open" :modal="true" @update:open="emit('open', $event)">
    <PopoverTrigger as-child><Button type="button" class="ap-native-button" variant="secondary" size="icon"
      icon="icon-[lucide--list-filter]" :indicator="Object.values(filters).some(values => values.length)"
      :aria-label="t('assetLibrary.filters')" :title="t('assetLibrary.filters')" /></PopoverTrigger>
    <PopoverPortal><div v-if="open" class="ap-assets-filter-dismiss" aria-hidden="true" @pointerdown.stop @click.stop="open = false"></div></PopoverPortal>
      <PopoverContent class="ap-assets-settings-popover ap-assets-filter-popover" side="bottom" align="end" :side-offset="5" :collision-padding="10" @pointer-down-outside.prevent>
        <strong>{{ t('assetLibrary.filters') }}</strong>
        <p v-if="pending" role="status">{{ t('states.loading') }}</p>
        <LibraryError v-else-if="error" :error="error" :retry="() => emit('open', true)" />
        <template v-else><p v-if="!groups.length" role="status">{{ t('assetLibrary.noFilterOptions') }}</p>
          <DetailAccordion v-for="item in groups" :key="item.key" :title="t('assetLibrary.facet.' + item.key)" :count="filters[item.key]?.length ? String(filters[item.key].length) : undefined" :initially-open="item.key === 'asset_type' || item.key === 'frame_type' || item.key === 'master_type' || !!filters[item.key]?.length">
            <div class="ap-facet-options"><button v-for="option in item.options" :key="option.value" type="button" :aria-pressed="!!filters[item.key]?.includes(option.value)" @click="emit('change', item.key, option.value)">{{ option.label }} <small>{{ option.count }}</small></button></div>
          </DetailAccordion>
        </template>
        <button v-if="Object.values(filters).some(values => values.length)" type="button" @click="emit('clear')">{{ t('assetLibrary.clearFilters') }}</button>
      </PopoverContent>
  </PopoverRoot>
</template>

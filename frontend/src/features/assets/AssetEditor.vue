<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiError } from '../../api/client';
import { readDocument, relocateReference, writeDocument, type Asset, type Attributes } from '../../api/assets';
import { deleteAsset } from './deleteAsset';
import { confirmAction, useMutation } from '../library/components/useMutation';
import { bytes } from '../storage/format';
import AssetAttributes from './AssetAttributes.vue';
import LibraryError from './LibraryError.vue';

const props = defineProps<{ asset?: Asset; selected?: Asset[] }>();
const emit = defineEmits<{ changed: []; close: []; notice: [message: string] }>();
const { t } = useI18n();
const current = shallowRef(props.asset);
const attributes = ref<Attributes>({ ...props.asset?.attributes });
const path = ref('');
const changed = computed(() => JSON.stringify(attributes.value) !== JSON.stringify(current.value?.attributes ?? {}));
const { pending, run, error } = useMutation();
const saved = () => {
  emit('changed');
  emit('notice', t('assetLibrary.saved'));
  emit('close');
};

function save() {
  void run(async signal => {
    if (props.selected) {
      let count = 0;
      let first: unknown;
      for (const asset of props.selected) {
        if (signal.aborted) return;
        try {
          await writeDocument('assets', { attributes: { ...asset.attributes, ...attributes.value } }, signal, asset);
          count++;
        } catch (error) {
          first ??= error;
        }
      }
      emit('changed');
      emit('notice', t('assetLibrary.batchResult', { count, failed: props.selected.length - count }));
      if (first) throw first;
      emit('close');
      return;
    }
    if (!current.value) return;
    const result = await writeDocument('assets', { attributes: attributes.value }, signal, current.value);
    if (signal.aborted) return;
    if (result.warnings?.length) {
      emit('changed');
      emit('notice', t('assetLibrary.collectionWarning', { fields: [...new Set(result.warnings.flatMap(row => row.conflicts))]
        .map(field => t('assetLibrary.fields.' + field, field)).join(', ') }));
      emit('close');
    } else saved();
  });
}

function remove() {
  void run(async signal => {
    if (!current.value) return;
    const url = '/astrophoto/v1/library/assets/' + encodeURIComponent(current.value.id);
    if (await deleteAsset(url, t, undefined, signal) && !signal.aborted) saved();
  });
}

function relocate() {
  void run(async signal => {
    if (!current.value || !path.value.trim()) return;
    await relocateReference(current.value.id, path.value.trim(), signal);
    const latest = await readDocument('assets', current.value.id, signal);
    if (signal.aborted) return;
    current.value = latest;
    path.value = '';
    emit('changed');
    emit('notice', t('assetLibrary.saved'));
  });
}

async function discardDraft() {
  if (pending.value) return;
  if (!changed.value || await confirmAction(t('assetLibrary.discard'), t('assetLibrary.discardConfirm'))) emit('close');
}
function reload() {
  void run(async signal => {
    if (!current.value || !await confirmAction(t('actions.refresh'), t('assetLibrary.discardConfirm'))) return;
    const latest = await readDocument('assets', current.value.id, signal);
    if (signal.aborted) return;
    current.value = latest;
    attributes.value = { ...latest.attributes };
  });
}
defineExpose({ discardDraft });
</script>

<template>
  <section class="ap-assets-dialog-content">
    <dl v-if="current" class="ap-assets-summary">
      <div><dt>{{ t('assetLibrary.storage') }}</dt><dd>{{ t('assetLibrary.values.' + current.storage_mode) }}</dd></div>
      <div><dt>{{ t('assetLibrary.fileSize') }}</dt><dd>{{ bytes(current.size_bytes) }}</dd></div>
      <div><dt>{{ t('assetLibrary.availability') }}</dt><dd>{{ t('assetLibrary.values.' + (current.available ? 'online' : 'offline')) }}</dd></div>
    </dl>
    <form class="ap-assets-form" @submit.prevent="save">
      <p v-if="selected">{{ t('assetLibrary.bulkConfirm', { count: selected.length }) }}</p>
      <AssetAttributes id="ap-edit-asset" v-model="attributes" :saving="pending" />
      <LibraryError v-if="error" :error="error" :retry="current && error instanceof ApiError && error.code === 'REVISION_CONFLICT' ? reload : undefined" />
      <div class="ap-assets-toolbar">
        <button type="submit" :disabled="pending || ((current || selected) && !changed)">{{ t('assetLibrary.save') }}</button>
        <button type="button" :disabled="pending" @click="discardDraft">{{ t('storage.cancel') }}</button>
      </div>
    </form>
    <form v-if="current && !current.available && current.storage_mode === 'external_reference'" class="ap-assets-form" @submit.prevent="relocate">
      <label>{{ t('assetLibrary.relocate') }}<input v-model="path" :disabled="pending" /></label>
      <button type="submit" :disabled="pending || !path.trim()">{{ t('assetLibrary.relocate') }}</button>
    </form>
    <div v-if="current" class="ap-assets-toolbar">
      <button type="button" class="ap-assets-danger" :disabled="pending" @click="remove()">{{ t('assetLibrary.deleteMaterial') }}</button>
    </div>
  </section>
</template>

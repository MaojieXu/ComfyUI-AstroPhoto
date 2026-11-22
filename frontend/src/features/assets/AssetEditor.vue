<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiError } from '../../api/client';
import { deleteManagedFile, readDocument, relocateReference, removeDocument, writeDocument, type Asset, type Attributes, type Project } from '../../api/assets';
import { ComfySingleSelect } from '../../shared/ComfySingleSelect';
import { confirmAction, useMutation } from '../library/components/useMutation';
import { bytes } from '../storage/format';
import AssetAttributes from './AssetAttributes.vue';
import LibraryError from './LibraryError.vue';

const props = defineProps<{ asset?: Asset; selected?: Asset[]; projects: Project[] }>();
const emit = defineEmits<{ changed: []; close: []; notice: [message: string] }>();
const { t } = useI18n();
const current = shallowRef(props.asset);
const attributes = ref<Attributes>({ ...props.asset?.attributes });
const path = ref('');
const outputId = ref('');
const project = ref('');
const outputFields = ['source_asset_id', 'source_collection_id', 'node', 'workflow'];
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
      if (!await confirmAction(t('assetLibrary.bulkEdit'), t('assetLibrary.bulkConfirm', { count: props.selected.length }))) return;
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
    const fields: Record<string, unknown> = { attributes: attributes.value };
    if (!current.value) {
      fields.output_id = outputId.value.trim();
      if (project.value) fields.project_id = project.value;
    }
    const result = await writeDocument('assets', fields, signal, current.value);
    if (signal.aborted) return;
    if (result.warnings?.length) {
      emit('changed');
      emit('notice', t('assetLibrary.collectionWarning', { fields: [...new Set(result.warnings.flatMap(row => row.conflicts))]
        .map(field => t('assetLibrary.fields.' + field, field)).join(', ') }));
      emit('close');
    } else saved();
  });
}

function remove(physical = false) {
  void run(async signal => {
    if (!current.value || !await confirmAction(
      t('assetLibrary.' + (physical ? 'physicalDelete' : 'unregister')),
      t('assetLibrary.' + (physical ? 'physicalDeleteConfirm' : 'unregisterConfirm')),
      current.value.name, 'delete',
    )) return;
    if (physical) await deleteManagedFile(current.value, signal);
    else await removeDocument('assets', current.value, signal);
    if (!signal.aborted) saved();
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
      <template v-if="!current && !selected">
        <label>{{ t('assetLibrary.outputId') }}<input v-model.trim="outputId" :disabled="pending" required /></label>
        <label for="ap-output-project">{{ t('assetLibrary.project') }}</label>
        <ComfySingleSelect id="ap-output-project" :value="project" :disabled="pending" :label="t('assetLibrary.project')"
          :options="[{ value: '', label: t('assetLibrary.values.unspecified') }, ...projects.map(row => ({ value: row.id, label: row.name }))]"
          @change="project = $event" />
        <label v-for="key in outputFields" :key="key">{{ t('assetLibrary.fields.' + key) }}
          <input :value="String(attributes[key] ?? '')" :disabled="pending"
            @input="attributes[key] = ($event.target as HTMLInputElement).value.trim() || null" />
        </label>
      </template>
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
      <button type="button" class="ap-assets-danger" :disabled="pending" @click="remove()">{{ t('assetLibrary.unregister') }}</button>
      <button v-if="current.storage_mode === 'managed'" type="button" class="ap-assets-danger" :disabled="pending || !current.available" @click="remove(true)">
        {{ t('assetLibrary.physicalDelete') }}
      </button>
    </div>
  </section>
</template>

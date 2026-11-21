<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { app } from '../../host/comfy';
import type { Workspace } from '../../api/storage';
import { bytes } from './format';

type Action = 'rename' | 'relocate' | 'migrate';
const props = defineProps<{ workspace: Workspace; busy: boolean; settingsRevision: number }>();
const emit = defineEmits<{
  change: [path: string, body: Record<string, unknown>, method?: string];
  migration: [id: string, path: string, key: string];
}>();
const { t } = useI18n();
const expanded = ref(false);
const actionsId = useId();
const more = useTemplateRef<HTMLButtonElement>('workspace-more');
let migrationKey: { path: string; key: string } | undefined;

function locationPath(id: string) {
  return `/storage/locations/${encodeURIComponent(id)}`;
}

function close(event: KeyboardEvent) {
  if (!expanded.value) return;
  event.stopPropagation();
  expanded.value = false;
  more.value?.focus();
}

function setEnabled() {
  const { id, revision, enabled } = props.workspace;
  emit('change', locationPath(id), { expected_revision: revision, enabled: !enabled }, 'PATCH');
}

async function edit(action: Action) {
  const { id, name, revision } = props.workspace;
  const value = (await app.extensionManager.dialog.prompt({
    title: t('storage.' + action),
    message: t(action === 'rename' ? 'storage.name' : 'storage.path'),
    defaultValue: action === 'rename' ? name : undefined,
  }))?.trim();
  if (!value) return;

  const path = locationPath(id);
  switch (action) {
    case 'rename':
      emit('change', path, { expected_revision: revision, name: value }, 'PATCH');
      break;
    case 'relocate':
      emit('change', path + '/relocate', { new_path: value });
      break;
    case 'migrate':
      if (migrationKey?.path !== value) migrationKey = { path: value, key: crypto.randomUUID() };
      emit('migration', id, value, migrationKey.key);
      break;
  }
}

async function remove() {
  const { id, name, revision } = props.workspace;
  const confirmed = await app.extensionManager.dialog.confirm({
    key: 'astrophoto.remove-workspace', type: 'delete', title: t('storage.remove'),
    message: t('storage.removeHelp'), itemList: [name],
  });
  if (confirmed === true) emit('change', locationPath(id), { expected_revision: revision }, 'DELETE');
}
</script>

<template>
  <li class="ap-workspace-row" @keydown.esc="close">
    <div class="ap-workspace-summary">
      <div class="ap-workspace-info">
        <div class="ap-storage-meta">
          <strong>{{ workspace.name }}</strong>
          <span v-if="workspace.is_default" class="ap-storage-badge">{{ t('storage.default') }}</span>
        </div>
        <p class="ap-storage-path">{{ workspace.root_path }}</p>
        <p class="ap-storage-meta">
          <span class="ap-storage-badge" :data-state="workspace.status">{{ t('storage.states.' + workspace.status) }}</span>
          <small>{{ t('storage.free') }} {{ bytes(workspace.free_bytes) }}</small>
        </p>
      </div>
      <button ref="workspace-more" type="button" class="ap-workspace-more" :aria-expanded="expanded" :aria-controls="actionsId"
        :aria-label="t('storage.workspaceActions', { name: workspace.name })"
        :title="t('storage.workspaceActions', { name: workspace.name })" @click="expanded = !expanded">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" />
        </svg>
      </button>
    </div>
    <div :id="actionsId" class="ap-storage-actions" :hidden="!expanded">
      <button type="button" class="ap-storage-button" :disabled="busy || workspace.status === 'migrating'"
        @click="emit('change', locationPath(workspace.id) + '/validate', {})">{{ t('storage.validate') }}</button>
      <button type="button" class="ap-storage-button" :disabled="busy || workspace.is_default || workspace.status !== 'online'"
        @click="emit('change', locationPath(workspace.id), { expected_revision: settingsRevision, default: true }, 'PATCH')">
        {{ t('storage.setDefault') }}
      </button>
      <button type="button" class="ap-storage-button"
        :disabled="busy || (workspace.enabled && workspace.is_default) || workspace.status === 'migrating'" @click="setEnabled">
        {{ t(workspace.enabled ? 'storage.disable' : 'storage.enable') }}
      </button>
      <button type="button" class="ap-storage-button" :disabled="busy || workspace.status === 'migrating'" @click="edit('rename')">
        {{ t('storage.rename') }}
      </button>
      <button type="button" class="ap-storage-button"
        :disabled="busy || !['offline', 'identity_mismatch', 'disabled'].includes(workspace.status)" @click="edit('relocate')">
        {{ t('storage.relocate') }}
      </button>
      <button type="button" class="ap-storage-button" :disabled="busy || workspace.status !== 'online'" @click="edit('migrate')">
        {{ t('storage.migrate') }}
      </button>
      <button type="button" class="ap-storage-button" :disabled="busy || workspace.is_default || workspace.status === 'migrating'" @click="remove">
        {{ t('storage.remove') }}
      </button>
    </div>
  </li>
</template>

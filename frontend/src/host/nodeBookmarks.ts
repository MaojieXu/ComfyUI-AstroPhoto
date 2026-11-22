import { ApiError, getJson } from '../api/client';
import { app } from './comfy';

const setting = 'Comfy.NodeLibrary.Bookmarks.V2';
const settingPath = `/settings/${encodeURIComponent(setting)}`;

export function readNodeBookmarks(): string[] {
  const value = app.extensionManager.setting.get<unknown>(setting);
  return Array.isArray(value) ? value.filter((path): path is string => typeof path === 'string') : [];
}

async function persistedBookmarks(): Promise<string[]> {
  const value = await getJson(settingPath, undefined, 'no-store');
  if (value === null) return [];
  if (!Array.isArray(value) || !value.every((path): path is string => typeof path === 'string'))
    throw new ApiError('schema');
  return value;
}

export async function setNodeBookmark(path: string, enabled: boolean, allowed: () => boolean): Promise<void> {
  // In Frontend 1.59.6 the legacy UI getter exposes the live host setting store.
  // The public setter persists optimistically and does not expose its HTTP response.
  const shared = app.ui?.settings?.settingsValues;
  if (!shared || typeof app.api.storeSetting !== 'function') throw new ApiError('bookmarkUnsupported');
  const before = await persistedBookmarks();
  if (!allowed()) return;
  if (before.includes(path) === enabled) {
    shared[setting] = before;
    return;
  }

  const next = enabled ? [...before, path] : before.filter(item => item !== path);
  try {
    const receipt = await app.api.storeSetting(setting, next);
    if (!receipt.ok) throw new ApiError('bookmark', receipt.status);
    shared[setting] = next;
  } catch (error) {
    // A failed response does not establish the persisted state.
    try { shared[setting] = await persistedBookmarks(); }
    catch { /* Leave the last known shared state intact if read-back also fails. */ }
    throw error;
  }
}

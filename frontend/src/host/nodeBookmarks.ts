import { ApiError } from '../api/client';
import { app } from './comfy';

export const bookmarkSetting = 'Comfy.NodeLibrary.Bookmarks.V2';

export function readNodeBookmarks(): string[] {
  const value = app.extensionManager.setting.get<unknown>(bookmarkSetting);
  return Array.isArray(value) ? value.filter((path): path is string => typeof path === 'string') : [];
}

export async function setNodeBookmark(
  path: string,
  enabled: boolean,
  allowed: () => boolean,
  observe: (persisted: string[]) => void,
): Promise<void> {
  const setting = app.extensionManager?.setting;
  if (!setting || typeof setting.set !== 'function') throw new ApiError('bookmarkUnsupported');
  if (!allowed()) return;
  const before = await readPersistedNodeBookmarks();
  if (!allowed()) return;
  observe(before);
  if (before.includes(path) === enabled) return;
  const next = enabled ? [...before, path] : before.filter(item => item !== path);
  await setting.set(bookmarkSetting, next);
  // The host setter updates memory before saving and can resolve on HTTP errors.
  let persisted: string[];
  try {
    persisted = await readPersistedNodeBookmarks();
  } catch {
    throw new ApiError('bookmarkUnverified');
  }
  observe(persisted);
  if (persisted.includes(path) !== enabled) throw new ApiError('bookmark');
}

export async function readPersistedNodeBookmarks(): Promise<string[]> {
  const value = (await app.api.getSetting(bookmarkSetting)) ?? [];
  if (!Array.isArray(value) || !value.every(item => typeof item === 'string')) throw new ApiError('bookmark');
  return value;
}

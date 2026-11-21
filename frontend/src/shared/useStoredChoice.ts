import { shallowRef } from 'vue';

export function useStoredChoice<T extends string>(key: string, choices: readonly [T, ...T[]]) {
  const value = shallowRef<T>(choices[0]);
  try {
    const stored = localStorage.getItem(key);
    value.value = choices.find(choice => choice === stored) ?? choices[0];
  } catch { /* Keep the default for this session. */ }

  return [value, (next: T) => {
    value.value = next;
    try { localStorage.setItem(key, next); }
    catch { /* Keep the selection for this session. */ }
  }] as const;
}

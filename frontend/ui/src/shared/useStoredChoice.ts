import { useState } from 'react';

export function useStoredChoice<T extends string>(key: string, choices: readonly [T, ...T[]]) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return choices.find(choice => choice === stored) ?? choices[0];
    } catch {
      return choices[0];
    }
  });
  return [value, (next: T) => {
    setValue(next);
    try { localStorage.setItem(key, next); }
    catch { /* Keep the selection for the current session if storage is unavailable. */ }
  }] as const;
}

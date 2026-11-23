import { afterEach, expect, test, vi } from 'vitest';
import { transferDirectFiles } from '../../src/features/assets/directTransfer';
import type { DirectEntry, DirectJob } from '../../src/api/directImport';
import { app } from '../host';

afterEach(() => app.api.fetchApi.mockReset());

test('one writer per disk, idle disk steals whole frames and a rejected reassignment falls back once', async () => {
  const entries: DirectEntry[] = ['slow', 'fast', 'slow', 'slow', 'slow'].map((lane, index) => ({
    id: 'entry-' + index, index, name: index + '.fit', size_bytes: 1, last_modified_ms: 1,
    workspace_id: lane, lane, status: 'pending', error: null,
  }));
  const active = new Set<string>();
  const attempts: [number, string][] = [];
  let release!: () => void;
  const slow = new Promise<void>(resolve => { release = resolve; });
  app.api.fetchApi.mockImplementation(async (route: string) => {
    const url = new URL(route, 'http://localhost');
    const entry = entries.find(row => url.pathname.endsWith('/' + row.id))!;
    const target = url.searchParams.get('workspace_id') || entry.workspace_id;
    expect(active.has(target)).toBe(false);
    active.add(target);
    attempts.push([entry.index, target]);
    if (entry.index === 0) await slow;
    active.delete(target);
    if (entry.index === 2 && target === 'fast')
      return Response.json({ error: { code: 'INSUFFICIENT_DISK_SPACE' } }, { status: 507 });
    if (entry.index === 4) release();
    return Response.json({ id: entry.id, status: 'copied', workspace_id: target });
  });
  const files = new Map(entries.map(row => [row.index, new File(['1'], row.name, { lastModified: 1 })]));
  const job: DirectJob = { id: 'job', group_id: 'group', phase: 'importing', entries };
  const updates = vi.fn();
  expect(await transferDirectFiles(job, files, new AbortController().signal, updates)).toBeUndefined();
  expect(updates).toHaveBeenCalledTimes(5);
  expect(attempts).toEqual([[0, 'slow'], [1, 'fast'], [2, 'fast'], [3, 'fast'], [4, 'fast'], [2, 'slow']]);
});

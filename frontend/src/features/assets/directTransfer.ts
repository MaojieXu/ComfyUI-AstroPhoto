import { ApiError, isRecord } from '../../api/client';
import { writeDirectFile, type DirectEntry, type DirectJob, type ImportTicket } from '../../api/directImport';

const ticketKey = 'astrophoto.directImport.v1';
export function savedTicket(): ImportTicket | undefined {
  try {
    const data: unknown = JSON.parse(sessionStorage.getItem(ticketKey) || 'null');
    if (isRecord(data) && typeof data.preview_id === 'string' && typeof data.idempotency_key === 'string')
      return { preview_id: data.preview_id, idempotency_key: data.idempotency_key };
  } catch { /* Private browser sessions can disable storage. */ }
}
export function saveTicket(ticket?: ImportTicket) {
  try {
    if (ticket) sessionStorage.setItem(ticketKey, JSON.stringify(ticket));
    else sessionStorage.removeItem(ticketKey);
  } catch { /* The current form still retains the ticket in memory. */ }
}

export function matchesFile(entry: DirectEntry, file: File) {
  return entry.name === file.name && entry.size_bytes === file.size &&
    (entry.last_modified_ms == null || entry.last_modified_ms === file.lastModified);
}

// A lane represents a physical disk, potentially shared by several workspaces.
export async function transferDirectFiles(job: DirectJob, files: Map<number, File>, signal: AbortSignal,
    update: (entry: DirectEntry, status: 'copied' | 'failed', target: string, error?: string) => void) {
  const lanes = new Map<string, { target: string; queue: DirectEntry[] }>();
  for (const entry of job.entries) {
    let lane = lanes.get(entry.lane);
    if (!lane) {
      lane = { target: entry.workspace_id, queue: [] };
      lanes.set(entry.lane, lane);
    }
    if (entry.status !== 'copied' && files.has(entry.index)) lane.queue.push(entry);
  }
  const workers = [...lanes.values()];
  for (const worker of workers) worker.queue.reverse();
  const fallback: DirectEntry[] = [];
  const unavailable = new Set<string>();
  let firstError: unknown;
  async function write(entry: DirectEntry, workspace: string, allowFallback: boolean) {
    try {
      const file = files.get(entry.index)!;
      if (!matchesFile(entry, file)) throw new ApiError('SOURCE_CHANGED');
      const actual = await writeDirectFile(job.id, entry, file, workspace, signal);
      if (!signal.aborted) update(entry, 'copied', actual);
    } catch (error) {
      if (signal.aborted) return;
      if (error instanceof ApiError && ['WORKSPACE_OFFLINE', 'WORKSPACE_DISABLED', 'WORKSPACE_READ_ONLY',
        'WORKSPACE_IDENTITY_MISMATCH', 'WORKSPACE_NOT_FOUND', 'DIRECT_IMPORT_REPLAN_REQUIRED'].includes(error.code)) unavailable.add(workspace);
      if (allowFallback && error instanceof ApiError && [404, 409, 423, 507].includes(error.status || 0)) {
        fallback.push(entry);
        return;
      }
      firstError ??= error;
      update(entry, 'failed', entry.workspace_id, error instanceof ApiError ? error.code : 'network');
    }
  }
  await Promise.all(workers.map(async worker => {
    while (!signal.aborted) {
      if (unavailable.has(worker.target)) return;
      const own = worker.queue.pop();
      // Files are claimed synchronously before awaiting the upload.
      const entry = own || workers.find(other => other.queue.length)?.queue.pop();
      if (!entry) return;
      await write(entry, own ? entry.workspace_id : worker.target, !own);
    }
  }));
  // A lane may have finished when another disk rejects a reassignment.
  await Promise.all([...lanes.keys()].map(async lane => {
    for (const entry of fallback.filter(item => item.lane === lane)) {
      if (signal.aborted) return;
      if (unavailable.has(entry.workspace_id)) continue;
      await write(entry, entry.workspace_id, false);
    }
  }));
  return firstError;
}

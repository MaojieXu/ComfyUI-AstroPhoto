import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { expect, test, vi } from 'vitest';
import TaskPanel from '../../src/features/tasks/TaskPanel.vue';
import { clearTaskError, reportTaskError, stopTaskTracking, taskReceipts } from '../../src/features/tasks/taskState';
import { createFrontendI18n } from '../../src/i18n';
import { app } from '../host';

test('tracks import and migration across views, restores state and clears only finished entries', async () => {
  sessionStorage.clear();
  const success = vi.fn();
  const error = vi.fn();
  Object.assign(app.extensionManager, { toast: { success, error, warning: vi.fn() } });
  const migration = { operation_id: 'migration-test', kind: 'migration', phase: 'copying',
    effective_import_mode: null, error: null, receipt: { processed: 1, total: 3 } };
  const imported = { operation_id: 'import-test', kind: 'import', phase: 'importing',
    effective_import_mode: 'copy', error: null, receipt: { processed: 2, total: 4, direct_import: true } };
  let operations = [migration, imported];
  app.api.fetchApi.mockImplementation(async (path: string) => {
    expect(path).toBe('/astrophoto/v1/storage/operations');
    return Response.json({ operations });
  });
  const options = { attachTo: document.body, global: { plugins: [createFrontendI18n()] } };
  const panel = mount(TaskPanel, options);
  await expect.poll(() => panel.findAll('.ap-task-item')).toHaveLength(2);
  expect(panel.get('.ap-task-toggle').attributes('aria-expanded')).toBe('false');
  await panel.get('.ap-task-toggle').trigger('click');
  expect(panel.findAll('progress').map(item => item.attributes('value'))).toEqual(['1', '2']);
  expect(panel.findAll('.ap-task-dismiss')).toHaveLength(0);
  await panel.get('.ap-task-retry').trigger('click');
  expect(panel.emitted('resume')).toEqual([['import-test']]);
  reportTaskError('import-test', 'SOURCE_CHANGED', 'Asset import encountered an error.');
  await nextTick();
  expect(panel.text()).toContain('SOURCE_CHANGED');
  expect(error).toHaveBeenCalledTimes(1);
  clearTaskError('import-test');
  panel.unmount();
  operations = [{ ...migration, phase: 'completed', receipt: { processed: 3, total: 3 } }, imported];
  await expect.poll(() => success.mock.calls.length, { timeout: 5000 }).toBe(1);
  const reopened = mount(TaskPanel, options);
  await nextTick();
  expect(reopened.get('.ap-task-toggle').attributes('aria-expanded')).toBe('true');
  expect(reopened.text()).toContain('Data migration');
  await reopened.get('.ap-task-dismiss').trigger('click');
  expect(reopened.findAll('.ap-task-item')).toHaveLength(1);
  reopened.unmount();
  stopTaskTracking();
  taskReceipts.value = [];
  sessionStorage.clear();
});

test('paused direct imports can resume or dismiss and cancelled imports retain frame errors', async () => {
  sessionStorage.clear();
  const operation = { operation_id: 'paused-test', kind: 'import', phase: 'paused',
    effective_import_mode: 'copy', error: null, receipt: { processed: 1, total: 2, direct_import: true,
      errors: [{ entry: 2, code: 'SOURCE_CHANGED' }] } };
  let operations = [operation];
  app.api.fetchApi.mockImplementation(async () => Response.json({ operations }));
  const panel = mount(TaskPanel, { attachTo: document.body, global: { plugins: [createFrontendI18n()] } });
  try {
    await expect.poll(() => panel.findAll('.ap-task-item')).toHaveLength(1);
    await panel.get('.ap-task-toggle').trigger('click');
    expect(panel.text()).toContain('Waiting to resume');
    expect(panel.get('li').text()).toContain('#2');
    expect(panel.findAll('.ap-task-dismiss')).toHaveLength(1);
    await panel.get('.ap-task-retry').trigger('click');
    expect(panel.emitted('resume')).toEqual([['paused-test']]);
    operations = [{ ...operation, phase: 'cancelled' }];
    await expect.poll(() => panel.findAll('.ap-task-retry'), { timeout: 5000 }).toHaveLength(0);
    expect(panel.get('li').text()).toContain('#2');
    await panel.get('.ap-task-dismiss').trigger('click');
    expect(panel.find('.ap-task-item').exists()).toBe(false);
  } finally {
    panel.unmount();
    stopTaskTracking();
    sessionStorage.clear();
  }
});

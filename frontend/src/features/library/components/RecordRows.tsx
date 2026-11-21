import type { VNodeChild } from 'vue';

export function RecordRows<T>({ records, recordKey, renderRecord, renderEmpty }: {
  records: readonly T[];
  recordKey: (record: T) => string;
  renderRecord: (record: T) => VNodeChild;
  renderEmpty: () => VNodeChild;
}) {
  return records.length > 0
    ? <ul class="ap-equipment-list">{records.map(record => <li key={recordKey(record)}>{renderRecord(record)}</li>)}</ul>
    : <>{renderEmpty()}</>;
}
RecordRows.props = ['records', 'recordKey', 'renderRecord', 'renderEmpty'];

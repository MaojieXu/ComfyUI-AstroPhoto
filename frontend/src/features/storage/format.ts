export function bytes(value: number | null | undefined) {
  if (value == null) return '—';
  if (value < 1024) return `${value} B`;
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value / 1024 ** 3) + ' GiB';
}

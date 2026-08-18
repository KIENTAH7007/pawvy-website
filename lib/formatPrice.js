// Shared price formatting helper.
// Keeps the "S$" currency prefix consistent everywhere prices are displayed,
// so it only ever needs to change in one place.

export function formatPrice(value) {
  if (value === null || value === undefined) return '';
  const num = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(num)) return '';
  return `S$${num.toFixed(2)}`;
}

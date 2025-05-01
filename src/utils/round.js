export function round(num, ops = {}) {
  const decimalPlaces = ops.decimalPlaces ?? 2;

  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}

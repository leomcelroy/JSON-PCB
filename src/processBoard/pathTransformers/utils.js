export function pointsEqual(a, b) {
  if (!a || !b) return false;
  return Math.abs(a[0] - b[0]) < 1e-6 && Math.abs(a[1] - b[1]) < 1e-6;
}

export function magnitude(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

export function normalize(v) {
  const mag = magnitude(v);
  if (mag < 1e-9) return [0, 0];
  return [v[0] / mag, v[1] / mag];
}

export function dot(v1, v2) {
  return v1[0] * v2[0] + v1[1] * v2[1];
}

export function cross(v1, v2) {
  return v1[0] * v2[1] - v1[1] * v2[0];
}

export function parsePercentage(str) {
  if (typeof str === "string" && str.endsWith("%")) {
    const value = parseFloat(str.substring(0, str.length - 1));
    if (!isNaN(value)) {
      return value / 100;
    }
  }
  return null;
}

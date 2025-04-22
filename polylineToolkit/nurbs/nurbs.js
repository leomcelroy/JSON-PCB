import { nurbs as nurbsLib } from "./nurbsLib.js";

export function nurbs(points, ops = {}) {
  const degree = ops.degree ?? 2;
  const steps = ops.steps ?? 100;
  const boundary = isClosed(points) ? "closed" : "clamped";

  if (boundary === "closed" && points.length > 3) {
    points.pop();
  }

  var curve = nurbsLib({
    points,
    degree,
    boundary,
  });

  const pl = [];
  const domain = curve.domain[0];
  const range = domain[1] - domain[0];
  const stepSize = range / steps;

  let i = domain[0];
  while (i <= domain[1]) {
    const pt = curve.evaluate([], i);
    pl.push(pt);

    i += stepSize;
  }

  if (i !== domain[1]) {
    const pt = curve.evaluate([], domain[1]);
    pl.push(pt);
  }

  return pl;

  function isClosed(polyline, epsilon = 1e-3) {
    let start = polyline[0];
    let end = polyline[polyline.length - 1];
    return (
      Math.abs(start[0] - end[0]) < epsilon &&
      Math.abs(start[1] - end[1]) < epsilon
    );
  }
}

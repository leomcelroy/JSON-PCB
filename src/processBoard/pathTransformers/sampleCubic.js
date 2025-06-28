export function sampleCubic(coords, segment, steps) {
  for (let t = 1 / steps; t <= 1; t += 1 / steps) {
    const x = cubicBezier(
      t,
      segment.p0[0],
      segment.p1[0],
      segment.p2[0],
      segment.p3[0]
    );
    const y = cubicBezier(
      t,
      segment.p0[1],
      segment.p1[1],
      segment.p2[1],
      segment.p3[1]
    );
    coords.push([x, y]);
  }
}

function cubicBezier(t, p0, p1, p2, p3) {
  const mt = 1 - t;
  return (
    mt * mt * mt * p0 +
    3 * mt * mt * t * p1 +
    3 * mt * t * t * p2 +
    t * t * t * p3
  );
}

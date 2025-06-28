import { pointsEqual } from "./utils.js";

export function sampleArc(coords, segment, steps) {
  const { center, radius, t1, t2, sweepDirection } = segment;

  const startVector = [t1[0] - center[0], t1[1] - center[1]];
  const endVector = [t2[0] - center[0], t2[1] - center[1]];

  let startAngle = Math.atan2(startVector[1], startVector[0]);
  let endAngle = Math.atan2(endVector[1], endVector[0]);

  let totalAngle;
  if (sweepDirection > 0) {
    while (endAngle <= startAngle) {
      endAngle += 2 * Math.PI;
    }
    totalAngle = endAngle - startAngle;
  } else {
    while (startAngle <= endAngle) {
      startAngle += 2 * Math.PI;
    }
    totalAngle = endAngle - startAngle;
  }

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const currentAngle = startAngle + totalAngle * t;
    const x = center[0] + radius * Math.cos(currentAngle);
    const y = center[1] + radius * Math.sin(currentAngle);
    if (i === 0 && pointsEqual(coords.at(-1), [x, y])) {
      continue;
    }
    coords.push([x, y]);
  }

  const lastPushed = coords.length > 0 ? coords[coords.length - 1] : null;
  if (!lastPushed || !pointsEqual(lastPushed, t2)) {
    coords.push(t2);
  }
}

const overlap = (p1, p2) => length(p1, p2) < 0.000001;
const length = ([x1, y1], [x2, y2]) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
const magDiff = (p0, p1) =>
  Math.sqrt((p1[0] - p0[0]) ** 2 + (p1[1] - p0[1]) ** 2);
const normDiff = (p0, p1) => {
  const m = magDiff(p0, p1);

  return [(p1[0] - p0[0]) / m, (p1[1] - p0[1]) / m];
};

const norm = (vec) => {
  const mag = Math.sqrt(vec[0] ** 2 + vec[1] ** 2);

  return [vec[0] / mag, vec[1] / mag];
};

export function getStartEndCenter(prevPt, pt, nextPt, radius) {
  if (
    overlap(pt, prevPt) ||
    overlap(pt, nextPt) ||
    overlap(prevPt, nextPt) ||
    radius <= 0
  )
    return null;

  const prevNorm = normDiff(pt, prevPt);
  const nextNorm = normDiff(pt, nextPt);

  let angle = Math.acos(prevNorm[0] * nextNorm[0] + prevNorm[1] * nextNorm[1]);

  let dist = radius / Math.tan(angle / 2);

  const maxStartDist = length(prevPt, pt);
  const maxEndDist = length(nextPt, pt);

  dist = Math.min(maxStartDist, maxEndDist, dist);

  radius = Math.min(dist * Math.tan(angle / 2), radius);

  const start = [pt[0] + prevNorm[0] * dist, pt[1] + prevNorm[1] * dist];

  const end = [pt[0] + nextNorm[0] * dist, pt[1] + nextNorm[1] * dist];

  const midNorm = norm([prevNorm[0] + nextNorm[0], prevNorm[1] + nextNorm[1]]);

  const midDist = Math.sqrt(dist ** 2 + radius ** 2);

  const midPt = [pt[0] + midNorm[0] * midDist, pt[1] + midNorm[1] * midDist];

  return [start, end, midPt, radius];
}

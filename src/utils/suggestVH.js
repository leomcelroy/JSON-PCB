export function suggestVH(points, newPoint, tolerance) {
  const [newX, newY] = newPoint;

  let suggestedX = newX;
  let suggestedY = newY;

  points.forEach(([x, y], index) => {
    if (Math.abs(x - newX) <= tolerance) {
      suggestedX = x;
    }

    if (Math.abs(y - newY) <= tolerance) {
      suggestedY = y;
    }
  });

  return [suggestedX, suggestedY];
}

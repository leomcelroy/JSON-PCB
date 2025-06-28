import { handleStraightCorner } from "./handleStraightCorner";
import { magnitude, normalize, dot, cross, parsePercentage } from "./utils.js";

export function handleFilletCorner(
  currentCoords,
  prevCoords,
  nextCoords,
  cornerValue
) {
  const vIn = [
    currentCoords[0] - prevCoords[0],
    currentCoords[1] - prevCoords[1],
  ];
  const vOut = [
    nextCoords[0] - currentCoords[0],
    nextCoords[1] - currentCoords[1],
  ];

  const lenIn = magnitude(vIn);
  const lenOut = magnitude(vOut);

  // Handle degenerate cases (e.g., duplicate points)
  if (lenIn < 1e-9 || lenOut < 1e-9) {
    return handleStraightCorner(currentCoords);
  }

  const vInNorm = normalize(vIn);
  const vOutNorm = normalize(vOut);

  const dotProd = dot(vInNorm, vOutNorm);
  const clampedDotProd = Math.max(-1, Math.min(1, dotProd));
  const angle = Math.acos(clampedDotProd);

  // Check if the segments are collinear or form a cusp
  if (Math.abs(angle) < 1e-6 || Math.abs(angle - Math.PI) < 1e-6) {
    return handleStraightCorner(currentCoords);
  }

  let radius = cornerValue;

  const tanHalfInteriorAngle = Math.tan((Math.PI - angle) / 2);
  if (Math.abs(tanHalfInteriorAngle) < 1e-9) {
    return handleStraightCorner(currentCoords);
  }
  let dist = radius / tanHalfInteriorAngle;
  dist = Math.min(dist, lenIn / 2, lenOut / 2);
  radius = dist * tanHalfInteriorAngle;

  if (radius < 1e-6) {
    return handleStraightCorner(currentCoords);
  }

  const t1 = [
    currentCoords[0] - vInNorm[0] * dist,
    currentCoords[1] - vInNorm[1] * dist,
  ];
  const t2 = [
    currentCoords[0] + vOutNorm[0] * dist,
    currentCoords[1] + vOutNorm[1] * dist,
  ];

  const sinHalfInteriorAngle = Math.sin((Math.PI - angle) / 2);
  if (Math.abs(sinHalfInteriorAngle) < 1e-9) {
    return handleStraightCorner(currentCoords);
  }
  const centerDist = radius / sinHalfInteriorAngle;
  const bisectorDirection = normalize([
    vOutNorm[0] - vInNorm[0],
    vOutNorm[1] - vInNorm[1],
  ]);
  const center = [
    currentCoords[0] + bisectorDirection[0] * centerDist,
    currentCoords[1] + bisectorDirection[1] * centerDist,
  ];

  const sweepDirection = cross(vIn, vOut);

  return { type: "arc", t1, t2, center, radius, sweepDirection };
}

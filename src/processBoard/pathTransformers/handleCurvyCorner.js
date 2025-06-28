import { magnitude } from "./utils.js";
import { handleStraightCorner } from "./handleStraightCorner.js";

/**
 * Handles calculating the segment for a curvy (cubic Bezier) corner.
 */
export function handleCurvyCorner(
  currentCoords,
  prevCoords,
  nextCoords,
  cornerValue
) {
  // Default to 0.5 if cornerValue is undefined for curvy
  let corner = cornerValue !== undefined ? cornerValue : 0.5;

  const vIn = [
    currentCoords[0] - prevCoords[0],
    currentCoords[1] - prevCoords[1],
  ];
  const vOut = [
    nextCoords[0] - currentCoords[0],
    nextCoords[1] - currentCoords[1],
  ];

  // If vectors are zero length (duplicate points), treat as straight
  if (magnitude(vIn) < 1e-9 || magnitude(vOut) < 1e-9) {
    return handleStraightCorner(currentCoords);
  }

  const p0 = [
    currentCoords[0] - vIn[0] * corner,
    currentCoords[1] - vIn[1] * corner,
  ];
  const p3 = [
    currentCoords[0] + vOut[0] * corner,
    currentCoords[1] + vOut[1] * corner,
  ];
  const kappa = 0.5522847498307936; // Kappa for approximating a circle
  const p1 = [
    p0[0] + (currentCoords[0] - p0[0]) * kappa,
    p0[1] + (currentCoords[1] - p0[1]) * kappa,
  ];
  const p2 = [
    p3[0] + (currentCoords[0] - p3[0]) * kappa,
    p3[1] + (currentCoords[1] - p3[1]) * kappa,
  ];
  return { type: "cubic", p0, p1, p2, p3 };
}

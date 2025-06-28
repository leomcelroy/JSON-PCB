import { handleStraightCorner } from "./handleStraightCorner";
import { magnitude, normalize, dot, cross, parsePercentage } from "./utils.js";

const EPS = 1e-9;

export function handleBiarcCorner(
  currentCoords,
  prevCoords,
  nextCoords,
  cornerValue
) {
  const P = currentCoords;
  const A = prevCoords;
  const B = nextCoords;
  const d = cornerValue;

  const vIn = sub(P, A);
  const vOut = sub(B, P);
  const L1 = magnitude(vIn);
  const L2 = magnitude(vOut);

  if (L1 < EPS || L2 < EPS) {
    return [handleStraightCorner(P)];
  }

  // Normalize the vectors
  const vInNorm = normalize(vIn);
  const vOutNorm = normalize(vOut);

  // Calculate dot product to check if vectors are parallel
  const dotProduct = dot(vInNorm, vOutNorm);

  // If vectors are parallel (dot product close to 1 or -1)
  if (Math.abs(Math.abs(dotProduct) - 1) < EPS) {
    return [handleStraightCorner(P)];
  }

  const t1 = sub(P, scale(vIn, d));
  const t2 = add(P, scale(vOut, d));

  const F = incenter(P, t1, t2);

  const P1_line1 = F;
  const P2_line1 = add(F, rot90(vIn));
  const M1 = scale(add(F, t1), 0.5);
  const P1_line2 = M1;
  const P2_line2 = add(M1, rot90(sub(F, t1)));
  const c1 = intersectParamLines(P1_line1, P2_line1, P1_line2, P2_line2);

  const P3_line1 = F;
  const P4_line1 = add(F, rot90(vOut));
  const M2 = scale(add(F, t2), 0.5);
  const P3_line2 = M2;
  const P4_line2 = add(M2, rot90(sub(F, t2)));
  const c2 = intersectParamLines(P3_line1, P4_line1, P3_line2, P4_line2);

  const r1 = Math.sqrt(sqDist(c1, t1));
  const r2 = Math.sqrt(sqDist(c2, t2));

  const sweep1 = cross(sub(t1, c1), sub(F, c1));
  const sweep2 = cross(sub(F, c2), sub(t2, c2));

  // console.log({ c1, F, c2, sweep1, sweep2, t1, t2 });

  return [
    {
      type: "arc",
      t1,
      t2: F,
      center: c1,
      radius: r1,
      sweepDirection: sweep1,
    },
    {
      type: "arc",
      t1: F,
      t2,
      center: c2,
      radius: r2,
      sweepDirection: sweep2,
    },
  ];
}

function rot90(vec) {
  return [vec[1], -vec[0]];
}

function sub(A, B) {
  return [A[0] - B[0], A[1] - B[1]];
}

function add(A, B) {
  return [A[0] + B[0], A[1] + B[1]];
}

function scale(v, s) {
  return [v[0] * s, v[1] * s];
}

function sqDist(A, B) {
  const dx = A[0] - B[0];
  const dy = A[1] - B[1];
  return dx * dx + dy * dy;
}

function intersectParamLines(P1a, P1b, P2a, P2b) {
  const O1 = P1a;
  const D1 = sub(P1b, P1a);
  const O2 = P2a;
  const D2 = sub(P2b, P2a);

  const dx = O2[0] - O1[0];
  const dy = O2[1] - O1[1];
  const det = D1[0] * D2[1] - D1[1] * D2[0];

  if (Math.abs(det) < EPS) {
    return null;
  }

  const t2 = (D1[0] * dy - D1[1] * dx) / det;
  const intersection = add(O2, scale(D2, t2));
  return intersection;
}

function incenter(A, B, C) {
  const vBC = sub(C, B);
  const a = magnitude(vBC);
  const vCA = sub(A, C);
  const b = magnitude(vCA);
  const vAB = sub(B, A);
  const c = magnitude(vAB);

  if (a < EPS || b < EPS || c < EPS) return null;

  const area = Math.abs(cross(vAB, vCA));
  if (area < EPS) return null;

  const w = a + b + c;
  return [
    (a * A[0] + b * B[0] + c * C[0]) / w,
    (a * A[1] + b * B[1] + c * C[1]) / w,
  ];
}

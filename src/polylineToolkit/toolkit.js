import { boolean } from "./boolean.js";
import { cut, cover } from "./cutCover.js";
import { pointInPolylines } from "./pointInPolylines.js";
import { iteratePolylines } from "./iteratePolylines.js";
import { mergePolylines } from "./mergePolylines.js";
import { scale, rotate, translate } from "./affineTransformations.js";
import { rand, randInRange, randIntInRange, setRandSeed } from "./rand.js";
import { noise } from "./noise.js";
import { getAngleAtT } from "./getAngleAtT.js";
import { getPointAtT } from "./getPointAtT.js";
import { getNormalAtT } from "./getNormalAtT.js";
import { resamplePolylines } from "./resamplePolylines.js";
import { simplify as simplifyPolyline } from "./simplify.js";
import { trimPolylines } from "./trimPolylines.js";
import { flattenSVG } from "./flatten-svg/index.js";
import { transform } from "./transform.js";
import { bounds } from "./bounds.js";
import { catmullRom } from "./catmullRom.js";
import { nurbs } from "./nurbs/nurbs.js";
import { offset } from "./offset.js";

// Helper function to ensure input is in polylines format [[[x,y],...], ...]
function normalizeInput(arg) {
  if (
    Array.isArray(arg) &&
    arg.length > 0 &&
    Array.isArray(arg[0]) &&
    // Check if the first element is a point [x, y] rather than a polyline [[x,y], ...]
    typeof arg[0][0] === "number" &&
    typeof arg[0][1] === "number" // Add a check for y coordinate for robustness
  ) {
    // Input looks like a single polyline [[x,y], [x,y], ...]
    return [arg];
  }
  // Assume input is already polylines [[[x,y],...], ...] or empty []
  return arg;
}

export const toolkit = {
  union: (polylines0, polylines1, ops = {}) =>
    boolean(
      normalizeInput(polylines0),
      normalizeInput(polylines1),
      "union",
      ops
    ),
  intersection: (polylines0, polylines1, ops = {}) =>
    boolean(
      normalizeInput(polylines0),
      normalizeInput(polylines1),
      "intersection",
      ops
    ),
  difference: (polylines0, polylines1, ops = {}) =>
    boolean(
      normalizeInput(polylines0),
      normalizeInput(polylines1),
      "difference",
      ops
    ),
  xor: (polylines0, polylines1, ops = {}) =>
    boolean(normalizeInput(polylines0), normalizeInput(polylines1), "xor", ops),
  offset: (polylines, ...args) => offset(normalizeInput(polylines), ...args),
  outline: (polylines) =>
    offset(normalizeInput(polylines), 0, { endType: "closedPolygon" }),
  iteratePoints: (polylines, ...args) =>
    iteratePolylines(normalizeInput(polylines), ...args),
  transform: (polylines, ...args) =>
    transform(normalizeInput(polylines), ...args),
  bounds: (polylines, ...args) => bounds(normalizeInput(polylines), ...args),
  cut: (polylines0, polylines1, ops = {}) =>
    cut(normalizeInput(polylines0), normalizeInput(polylines1), ops),
  cover: (polylines0, polylines1, ops = {}) =>
    cover(normalizeInput(polylines0), normalizeInput(polylines1), ops),
  pointInside: (polylines, point, ops = {}) =>
    pointInPolylines(normalizeInput(polylines), point, ops),
  scale: (polylines, ...args) => scale(normalizeInput(polylines), ...args),
  rotate: (polylines, ...args) => rotate(normalizeInput(polylines), ...args),
  translate: (polylines, ...args) =>
    translate(normalizeInput(polylines), ...args),
  catmullRom,
  nurbs,
  originate(polylines) {
    const pls = normalizeInput(polylines);
    const cc = bounds(pls).cc;
    translate(pls, [0, 0], cc);
    return polylines;
  },
  rand,
  randInRange,
  randIntInRange,
  setRandSeed,
  noise,
  getAngle: (polylines, t) => getAngleAtT(normalizeInput(polylines), t),
  getPoint: (polylines, t) => getPointAtT(normalizeInput(polylines), t),
  getNormal: (polylines, t) => getNormalAtT(normalizeInput(polylines), t),
  resample: (polylines, ...args) =>
    resamplePolylines(normalizeInput(polylines), ...args),
  simplify(polylines, tolerance, hq = true) {
    const pls = normalizeInput(polylines);
    pls.forEach((pl) => {
      const newPl = simplifyPolyline(pl, tolerance, hq);
      while (pl.length > 0) pl.pop();

      while (newPl.length > 0) {
        pl.push(newPl.shift());
      }
    });

    return polylines;
  },
  trim: (polylines, ...args) =>
    trimPolylines(normalizeInput(polylines), ...args),
  merge: (polylines, ...args) =>
    mergePolylines(normalizeInput(polylines), ...args),
  svgToPolylines(svgString) {
    // undoced
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgString, "image/svg+xml");
      const svg = doc.querySelector("svg");
      const polylines = flattenSVG(svg, { maxError: 0.001 }).map(
        (pl) => pl.points
      );

      return polylines;
    } catch (err) {
      throw new Error("SVGs can not be parsed in web workers.");
    }
  },
  join() {
    const normalizedArgs = Array.from(arguments).map(normalizeInput);

    const [first, ...rest] = normalizedArgs;
    if (!first) return [];
    if (!rest || rest.length === 0) return first;

    rest.forEach((pls) => {
      if (pls) {
        pls.forEach((pl) => {
          first.push(pl);
        });
      }
    });

    return first;
  },
  copy: (obj) => JSON.parse(JSON.stringify(obj)),
};

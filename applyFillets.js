// import { findTangentPointsLineLine } from "./findTangentPointsLineLine.js";
import { getStartEndCenter } from "./getStartEndCenter.js";

const length = (shape) => {
  const dx = shape.end[0] - shape.start[1];
  const dy = shape.end[1] - shape.start[1];

  return Math.sqrt(dx ** 2 + dy ** 2);
};
export function applyFillets(shapes, filletIndices) {
  const newShapes = [...shapes];

  let addedCount = 0;

  filletIndices.forEach(({ index0, index1, radius, type }) => {
    const adjustedIndex0 = index0 + addedCount;
    const adjustedIndex1 = index1 + addedCount;

    const prevShape = newShapes[adjustedIndex0];
    const currentShape = newShapes[adjustedIndex1];

    if (radius === 0) return;

    if (!prevShape || !currentShape) {
      console.log("Invalid shapes at index", {
        index0,
        index1,
        adjustedIndex0,
        adjustedIndex1,
        prevShape,
        currentShape,
      });
      return;
    }

    if (prevShape.type === "arc" || currentShape.type === "arc") {
      return;
    }

    const result = findTangentPoints(prevShape, currentShape, radius);
    if (result === null) return;

    const { tangentPt1, tangentPt2, center, anticlockwise, adjustedRadius } =
      result;

    prevShape.end = tangentPt1;
    currentShape.start = tangentPt2;

    if (type === "fillet") {
      newShapes.splice(adjustedIndex1, 0, {
        type: "arc",
        center: center,
        radius: adjustedRadius,
        start: tangentPt1,
        end: tangentPt2,
        startAngle: Math.atan2(
          tangentPt1[1] - center[1],
          tangentPt1[0] - center[0],
        ),
        endAngle: Math.atan2(
          tangentPt2[1] - center[1],
          tangentPt2[0] - center[0],
        ),
        anticlockwise: anticlockwise,
      });

      // TODO: remove zero length lines
    } else if (type === "chamfer") {
      newShapes.splice(adjustedIndex1, 0, {
        type: "line",
        start: tangentPt1,
        end: tangentPt2,
      });
    }

    addedCount++;
  });

  return newShapes;
}

function findTangentPoints(prevShape, currentShape, radius) {
  // Depending on the types of shapes, calculate the tangent points
  if (prevShape.type === "line" && currentShape.type === "line") {
    return findTangentPointsLineLine(prevShape, currentShape, radius);
  } else if (prevShape.type === "line" && currentShape.type === "arc") {
    throw new Error("can not yet fillet line and arc");
    // return findTangentPointsLineArc(prevShape, currentShape, radius);
  } else if (prevShape.type === "arc" && currentShape.type === "line") {
    throw new Error("can not yet fillet arc and line");
    // return findTangentPointsArcLine(prevShape, currentShape, radius);
  } else if (prevShape.type === "arc" && currentShape.type === "arc") {
    throw new Error("can not yet fillet arc and arc");
    // return findTangentPointsArcArc(prevShape, currentShape, radius);
  } else {
    throw new Error("Unsupported shape combination.");
  }
}

function findTangentPointsLineLine(line1, line2, radius) {
  const p1 = line1.start;
  const p2 = line1.end;
  const p3 = line2.end;

  const result = getStartEndCenter(p1, p2, p3, radius);

  if (result === null) return null;

  const [start, end, center, adjustedRadius] = result;

  return {
    tangentPt1: start,
    tangentPt2: end,
    center: center,
    adjustedRadius,
    anticlockwise: isAnticlockwiseFn(p1, p2, p3),
  };
}

function isAnticlockwiseFn(p1, p2, p3) {
  const v1 = [p1[0] - p2[0], p1[1] - p2[1]];
  const v2 = [p3[0] - p2[0], p3[1] - p2[1]];
  const cross = v1[0] * v2[1] - v1[1] * v2[0];
  return cross > 0;
}

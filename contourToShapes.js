import { applyFillets } from "./applyFillets.js";
import { getFilletChamferIndices } from "./getFilletChamferIndices.js";
import { computeArc } from "./computeArc.js";

export function contourToShapes(contour) {
  if (!contour) {
    return [];
  }

  let currentPos = [0, 0];
  let lastAngle = 0;
  // let bounds = {
  //   xMin: Infinity,
  //   xMax: -Infinity,
  //   yMin: Infinity,
  //   yMax: -Infinity,
  // };

  const shapes = [];
  const controlPoints = [];
  const controlAngles = [];
  const filletChamferIndices = [];

  contour.forEach((instruction, i) => {
    const [command, ...params] = instruction;

    switch (command) {
      case "start": {
        const [x, y, ops] = params;
        const corner = ops?.corner || null;

        if (corner) {
          filletChamferIndices.push({
            index0: i - 1,
            index1: i,
            type: corner[0],
            radius: corner[1],
          });
        }

        const endPoint = [x, y];
        currentPos = endPoint;
        controlPoints.push(currentPos);
        lastAngle = 0;
        controlAngles.push(lastAngle);
        break;
      }
      case "lineTo": {
        const [x, y, ops] = params;
        const corner = ops?.corner || null;

        if (corner) {
          filletChamferIndices.push({
            index0: i - 1,
            index1: i,
            type: corner[0],
            radius: corner[1],
          });
        }

        const endPoint = [x, y];
        shapes.push({
          type: "line",
          start: currentPos,
          end: endPoint,
        });
        lastAngle = getAngle(currentPos, endPoint);
        controlAngles.push(lastAngle);
        currentPos = endPoint;
        controlPoints.push(currentPos);
        break;
      }
      case "lineBy": {
        const [stepX, stepY, ops] = params;
        const corner = ops?.corner || null;

        if (corner) {
          filletChamferIndices.push({
            index0: i - 1,
            index1: i,
            type: corner[0],
            radius: corner[1],
          });
        }

        const newPoint = [currentPos[0] + stepX, currentPos[1] + stepY];
        shapes.push({
          type: "line",
          start: currentPos,
          end: newPoint,
        });
        lastAngle = getAngle(currentPos, newPoint);
        controlAngles.push(lastAngle);
        currentPos = newPoint;
        controlPoints.push(currentPos);
        break;
      }
      case "linePolarTo": {
        let [targetAngle, distance, ops] = params;
        const corner = ops?.corner || null;

        if (corner) {
          filletChamferIndices.push({
            index0: i - 1,
            index1: i,
            type: corner[0],
            radius: corner[1],
          });
        }

        const newPoint = [
          currentPos[0] + distance * Math.cos((targetAngle / 180) * Math.PI),
          currentPos[1] + distance * Math.sin((targetAngle / 180) * Math.PI),
        ];

        shapes.push({
          type: "line",
          start: currentPos,
          end: newPoint,
        });
        lastAngle = getAngle(currentPos, newPoint);
        controlAngles.push(lastAngle);
        currentPos = newPoint;
        controlPoints.push(currentPos);
        break;
      }
      case "linePolarBy": {
        let [turnAngle, distance, ops] = params;
        const corner = ops?.corner || null;

        if (corner) {
          filletChamferIndices.push({
            index0: i - 1,
            index1: i,
            type: corner[0],
            radius: corner[1],
          });
        }

        const newPoint = [
          currentPos[0] +
            distance * Math.cos((turnAngle / 180) * Math.PI + lastAngle),
          currentPos[1] +
            distance * Math.sin((turnAngle / 180) * Math.PI + lastAngle),
        ];

        shapes.push({
          type: "line",
          start: currentPos,
          end: newPoint,
        });
        lastAngle = getAngle(currentPos, newPoint);
        controlAngles.push(lastAngle);
        currentPos = newPoint;
        controlPoints.push(currentPos);
        break;
      }
      case "arcTo": {
        let [x, y, ops] = params;
        let sweepAngleDegrees = ops?.sweepAngle || null;
        let endPoint = [x, y];
        const arc = computeArc(
          currentPos,
          lastAngle,
          endPoint,
          sweepAngleDegrees,
        );
        shapes.push(arc);
        lastAngle =
          arc.type === "arc"
            ? arc.endAngle + (arc.anticlockwise ? -Math.PI / 2 : Math.PI / 2)
            : getAngle(arc.end, arc.start);
        controlAngles.push(lastAngle);
        currentPos = endPoint;
        controlPoints.push(currentPos);
        break;
      }
      case "arcBy": {
        let [stepX, stepY, ops] = params;
        let sweepAngleDegrees = ops?.sweepAngle || null;

        const endPoint = [currentPos[0] + stepX, currentPos[1] + stepY];
        const arc = computeArc(
          currentPos,
          lastAngle,
          endPoint,
          sweepAngleDegrees,
        );
        shapes.push(arc);
        lastAngle =
          arc.type === "arc"
            ? arc.endAngle + (arc.anticlockwise ? -Math.PI / 2 : Math.PI / 2)
            : getAngle(arc.end, arc.start);
        controlAngles.push(lastAngle);
        currentPos = endPoint;
        controlPoints.push(currentPos);
        break;
      }
      case "arcPolarTo": {
        let [targetAngle, distance, ops] = params;
        let sweepAngleDegrees = ops?.sweepAngle || null;

        const endPoint = [
          currentPos[0] + distance * Math.cos((targetAngle / 180) * Math.PI),
          currentPos[1] + distance * Math.sin((targetAngle / 180) * Math.PI),
        ];
        const arc = computeArc(
          currentPos,
          lastAngle,
          endPoint,
          sweepAngleDegrees,
        );
        shapes.push(arc);
        lastAngle =
          arc.type === "arc"
            ? arc.endAngle + (arc.anticlockwise ? -Math.PI / 2 : Math.PI / 2)
            : getAngle(arc.end, arc.start);

        controlAngles.push(lastAngle);
        currentPos = endPoint;
        controlPoints.push(currentPos);
        break;
      }
      case "arcPolarBy": {
        let [turnAngle, distance, ops] = params;
        let sweepAngleDegrees = ops?.sweepAngle || null;

        const endPoint = [
          currentPos[0] +
            distance * Math.cos((turnAngle / 180) * Math.PI + lastAngle),
          currentPos[1] +
            distance * Math.sin((turnAngle / 180) * Math.PI + lastAngle),
        ];
        const arc = computeArc(
          currentPos,
          lastAngle,
          endPoint,
          sweepAngleDegrees,
        );
        shapes.push(arc);
        lastAngle =
          arc.type === "arc"
            ? arc.endAngle + (arc.anticlockwise ? -Math.PI / 2 : Math.PI / 2)
            : getAngle(arc.end, arc.start);
        controlAngles.push(lastAngle);
        currentPos = endPoint;
        controlPoints.push(currentPos);
        break;
      }
      // case "circle": { break; }
      // closeArc?
      case "close": {
        const startPoint = shapes[0].start;
        shapes.push({
          type: "line",
          start: currentPos,
          end: startPoint,
        });

        lastAngle = getAngle(currentPos, startPoint);
        currentPos = startPoint;
        break;
      }
      default:
        console.log(`Unknown command: ${command}`);
    }
  });

  if (
    filletChamferIndices.length > 0 &&
    filletChamferIndices[0].index0 === -1 &&
    contour.at(-1)[0] === "close"
  )
    filletChamferIndices[0].index0 = contour.length - 2;

  const finalShapes = applyFillets(shapes, filletChamferIndices);

  return { shapes: finalShapes, controlPoints, controlAngles };
}

function getAngle(point0, point1) {
  var deltaY = point1[1] - point0[1];
  var deltaX = point1[0] - point0[0];
  return Math.atan2(deltaY, deltaX);
}

export function renderCanvas(board, canvas) {
  console.log(board, canvas);

  const bb = canvas.getBoundingClientRect();
  canvas.width = bb.width;
  canvas.height = bb.height;
  const ctx = canvas.getContext("2d");

  const { regions } = board;

  console.log(regions);
  regions.forEach((region) => {
    const { contour } = region;

    drawContour(canvas, contour);
  });
}

function drawContour(canvas, contour) {
  if (!canvas || !contour) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.log("Failed to get canvas context");
    return;
  }

  // Begin the path
  ctx.beginPath();

  let currentPos = [0, 0];
  let lastAngle = 0;
  let startPoint = [0, 0];

  // Iterate over each command in the contour array
  contour.forEach((instruction) => {
    // moveTo, moveBy, moveStep, moveSlide
    // move | line | arc
    // to | by | toPolar | byPolar | PolarBy | PolarTo
    // movePolarBy, moveByPolar
    // step (dx, dy), slide (angle, distance)
    // add turnForward
    // add turtle arc
    // circle
    // arc (end, center, sweepDirection)
    // arc (end, radius)
    // fillet
    // chamfer
    // bezier? this has to be approximated with arcs or line segments
    // polarTo could mean absolute polar, or absolute angle and relative distance
    // polarBy is turn from current angle
    // true absolute polar isn't that useful

    const [command, ...params] = instruction;
    switch (command) {
      case "moveTo": {
        const [x, y] = params;
        const endPoint = [x, y];
        ctx.moveTo(...endPoint);
        lastAngle = 0;
        currentPos = endPoint;
        startPoint = endPoint;
        break;
      }
      case "moveBy": {
        const [stepX, stepY] = params;
        const newPoint = [currentPos[0] + stepX, currentPos[1] + stepY];
        ctx.moveTo(...newPoint);
        lastAngle = getAngle(currentPos, newPoint);
        currentPos = newPoint;
        break;
      }
      case "movePolarTo": {
        let [targetAngle, distance] = params;

        const endPoint = [
          currentPos[0] + distance * Math.cos((targetAngle / 180) * Math.PI),
          currentPos[1] + distance * Math.sin((targetAngle / 180) * Math.PI),
        ];

        ctx.moveTo(...endPoint);
        lastAngle = getAngle(currentPos, endPoint);
        currentPos = endPoint;
        break;
      }
      case "movePolarBy": {
        let [turnAngle, distance] = params;

        const endPoint = [
          currentPos[0] +
            distance * Math.cos((turnAngle / 180) * Math.PI + lastAngle),
          currentPos[1] +
            distance * Math.sin((turnAngle / 180) * Math.PI + lastAngle),
        ];

        ctx.moveTo(...endPoint);
        lastAngle = getAngle(currentPos, endPoint);
        currentPos = endPoint;
        break;
      }
      case "lineTo":
        const [x, y] = params;
        const endPoint = [x, y];
        ctx.lineTo(...endPoint);
        lastAngle = getAngle(currentPos, endPoint);
        currentPos = endPoint;
        break;
      case "lineBy": {
        const [stepX, stepY] = params;
        const newPoint = [currentPos[0] + stepX, currentPos[1] + stepY];
        ctx.lineTo(...newPoint);
        lastAngle = getAngle(currentPos, newPoint);
        currentPos = newPoint;
        break;
      }
      case "linePolarTo": {
        let [targetAngle, distance] = params;

        const endPoint = [
          currentPos[0] + distance * Math.cos((targetAngle / 180) * Math.PI),
          currentPos[1] + distance * Math.sin((targetAngle / 180) * Math.PI),
        ];

        ctx.lineTo(...endPoint);
        lastAngle = getAngle(currentPos, endPoint);
        currentPos = endPoint;
        break;
      }
      case "linePolarBy": {
        let [turnAngle, distance] = params;

        const endPoint = [
          currentPos[0] +
            distance * Math.cos((turnAngle / 180) * Math.PI + lastAngle),
          currentPos[1] +
            distance * Math.sin((turnAngle / 180) * Math.PI + lastAngle),
        ];

        ctx.lineTo(...endPoint);
        lastAngle = getAngle(currentPos, endPoint);
        currentPos = endPoint;
        break;
      }
      case "arcTo": {
        let [x, y, sweepAngleDegrees] = params;
        let endPoint = [x, y];

        if (sweepAngleDegrees === undefined) {
          const tanCir = findCircle(
            ...currentPos,
            (lastAngle / Math.PI) * 180,
            ...endPoint,
          );
          if (tanCir === undefined) {
            ctx.lineTo(...endPoint);
            lastAngle = getAngle(currentPos, endPoint);
            currentPos = endPoint;
            break;
          }
          const startAngle = Math.atan2(
            currentPos[1] - tanCir.centerY,
            currentPos[0] - tanCir.centerX,
          );
          const endAngle = Math.atan2(
            endPoint[1] - tanCir.centerY,
            endPoint[0] - tanCir.centerX,
          );

          const quadrant = analyzeLineAndPoint(currentPos, lastAngle, endPoint);
          const anticlockwise = {
            true_true: true,
            true_false: false,
            false_true: false,
            false_false: true,
          }[`${quadrant.isAbove}_${quadrant.isRight}`];

          ctx.arc(
            tanCir.centerX,
            tanCir.centerY,
            tanCir.radius,
            startAngle,
            endAngle,
            anticlockwise,
          );
          lastAngle = endAngle + (anticlockwise ? -Math.PI / 2 : Math.PI / 2);
          currentPos = endPoint;
          break;
        }

        if (Math.abs(sweepAngleDegrees) < 0.00000001) {
          ctx.lineTo(...endPoint);
          lastAngle = getAngle(currentPos, endPoint);
          currentPos = endPoint;
          break;
        }

        const anticlockwise = sweepAngleDegrees < 0;
        sweepAngleDegrees = Math.abs(sweepAngleDegrees % 360);

        // Convert sweep angle from degrees to radians
        const sweepAngleRadians = (sweepAngleDegrees * Math.PI) / 180;

        // Calculate the chord length
        const dx = endPoint[0] - currentPos[0];
        const dy = endPoint[1] - currentPos[1];

        const chordLength = Math.sqrt(dx * dx + dy * dy);
        // Calculate radius using the sweep angle
        const radius = chordLength / (2 * Math.sin(sweepAngleRadians / 2));
        // Calculate the midpoint of the chord
        const midX = (currentPos[0] + endPoint[0]) / 2;
        const midY = (currentPos[1] + endPoint[1]) / 2;
        // Calculate the distance from midpoint to the circle center
        const midToCenterDist = Math.sqrt(
          radius * radius - (chordLength / 2) * (chordLength / 2),
        );
        // Adjust angle for center point calculation based on sweep direction and angle size
        const angleOffset = anticlockwise ? Math.PI / 2 : -Math.PI / 2;
        const centerOffsetDirection = sweepAngleDegrees > 180 ? 1 : -1; // This determines on which side of the midpoint the center lies

        // Calculate angle from current position to endpoint
        const angle = Math.atan2(dy, dx);

        // Calculate center of the circle
        const centerX =
          midX +
          centerOffsetDirection *
            midToCenterDist *
            Math.cos(angle + angleOffset);
        const centerY =
          midY +
          centerOffsetDirection *
            midToCenterDist *
            Math.sin(angle + angleOffset);
        // Determine start and end angles for the arc
        const startAngle = Math.atan2(
          currentPos[1] - centerY,
          currentPos[0] - centerX,
        );
        const endAngle = Math.atan2(
          endPoint[1] - centerY,
          endPoint[0] - centerX,
        );
        ctx.arc(centerX, centerY, radius, startAngle, endAngle, anticlockwise);
        lastAngle = endAngle + (anticlockwise ? -Math.PI / 2 : Math.PI / 2);
        currentPos = endPoint; // Update current position to endpoint
        break;
      }
      case "arcBy": {
        let [stepX, stepY, sweepAngleDegrees] = params;

        const endPoint = [currentPos[0] + stepX, currentPos[1] + stepY];

        if (sweepAngleDegrees === undefined) {
          const tanCir = findCircle(
            ...currentPos,
            (lastAngle / Math.PI) * 180,
            ...endPoint,
          );
          if (tanCir === undefined) {
            ctx.lineTo(...endPoint);
            lastAngle = getAngle(currentPos, endPoint);
            currentPos = endPoint;
            break;
          }
          const startAngle = Math.atan2(
            currentPos[1] - tanCir.centerY,
            currentPos[0] - tanCir.centerX,
          );
          const endAngle = Math.atan2(
            endPoint[1] - tanCir.centerY,
            endPoint[0] - tanCir.centerX,
          );

          const quadrant = analyzeLineAndPoint(currentPos, lastAngle, endPoint);
          const anticlockwise = {
            true_true: true,
            true_false: false,
            false_true: false,
            false_false: true,
          }[`${quadrant.isAbove}_${quadrant.isRight}`];

          ctx.arc(
            tanCir.centerX,
            tanCir.centerY,
            tanCir.radius,
            startAngle,
            endAngle,
            anticlockwise,
          );
          lastAngle = endAngle + (anticlockwise ? -Math.PI / 2 : Math.PI / 2);
          currentPos = endPoint;
          break;
        }

        if (Math.abs(sweepAngleDegrees) < 0.00000001) {
          ctx.lineTo(...endPoint);
          lastAngle = getAngle(currentPos, endPoint);
          currentPos = endPoint;
          break;
        }

        const anticlockwise = sweepAngleDegrees < 0;
        sweepAngleDegrees = Math.abs(sweepAngleDegrees % 360);

        // Convert sweep angle from degrees to radians
        const sweepAngleRadians = (sweepAngleDegrees * Math.PI) / 180;

        // Calculate the chord length
        const dx = endPoint[0] - currentPos[0];
        const dy = endPoint[1] - currentPos[1];

        const chordLength = Math.sqrt(dx * dx + dy * dy);
        // Calculate radius using the sweep angle
        const radius = chordLength / (2 * Math.sin(sweepAngleRadians / 2));
        // Calculate the midpoint of the chord
        const midX = (currentPos[0] + endPoint[0]) / 2;
        const midY = (currentPos[1] + endPoint[1]) / 2;
        // Calculate the distance from midpoint to the circle center
        const midToCenterDist = Math.sqrt(
          radius * radius - (chordLength / 2) * (chordLength / 2),
        );
        // Adjust angle for center point calculation based on sweep direction and angle size
        const angleOffset = anticlockwise ? Math.PI / 2 : -Math.PI / 2;
        const centerOffsetDirection = sweepAngleDegrees > 180 ? 1 : -1; // This determines on which side of the midpoint the center lies

        // Calculate angle from current position to endpoint
        const angle = Math.atan2(dy, dx);

        // Calculate center of the circle
        const centerX =
          midX +
          centerOffsetDirection *
            midToCenterDist *
            Math.cos(angle + angleOffset);
        const centerY =
          midY +
          centerOffsetDirection *
            midToCenterDist *
            Math.sin(angle + angleOffset);
        // Determine start and end angles for the arc
        const startAngle = Math.atan2(
          currentPos[1] - centerY,
          currentPos[0] - centerX,
        );
        const endAngle = Math.atan2(
          endPoint[1] - centerY,
          endPoint[0] - centerX,
        );
        ctx.arc(centerX, centerY, radius, startAngle, endAngle, anticlockwise);
        lastAngle = endAngle + (anticlockwise ? -Math.PI / 2 : Math.PI / 2);
        currentPos = endPoint; // Update current position to endpoint

        break;
      }
      case "arcPolarBy": {
        let [turnAngle, distance, sweepAngleDegrees] = params;

        const endPoint = [
          currentPos[0] +
            distance * Math.cos((turnAngle / 180) * Math.PI + lastAngle),
          currentPos[1] +
            distance * Math.sin((turnAngle / 180) * Math.PI + lastAngle),
        ];

        if (sweepAngleDegrees === undefined) {
          const tanCir = findCircle(
            ...currentPos,
            (lastAngle / Math.PI) * 180,
            ...endPoint,
          );
          if (tanCir === undefined) {
            ctx.lineTo(...endPoint);
            lastAngle = getAngle(currentPos, endPoint);
            currentPos = endPoint;
            break;
          }
          const startAngle = Math.atan2(
            currentPos[1] - tanCir.centerY,
            currentPos[0] - tanCir.centerX,
          );
          const endAngle = Math.atan2(
            endPoint[1] - tanCir.centerY,
            endPoint[0] - tanCir.centerX,
          );

          const quadrant = analyzeLineAndPoint(currentPos, lastAngle, endPoint);
          const anticlockwise = {
            true_true: true,
            true_false: false,
            false_true: false,
            false_false: true,
          }[`${quadrant.isAbove}_${quadrant.isRight}`];

          ctx.arc(
            tanCir.centerX,
            tanCir.centerY,
            tanCir.radius,
            startAngle,
            endAngle,
            anticlockwise,
          );
          lastAngle = endAngle + (anticlockwise ? -Math.PI / 2 : Math.PI / 2);
          currentPos = endPoint;
          break;
        }

        if (Math.abs(sweepAngleDegrees) < 0.00000001) {
          ctx.lineTo(...endPoint);
          lastAngle = getAngle(currentPos, endPoint);
          currentPos = endPoint;
          break;
        }

        const anticlockwise = sweepAngleDegrees < 0;
        sweepAngleDegrees = Math.abs(sweepAngleDegrees % 360);

        // Convert sweep angle from degrees to radians
        const sweepAngleRadians = (sweepAngleDegrees * Math.PI) / 180;

        // Calculate the chord length
        const dx = endPoint[0] - currentPos[0];
        const dy = endPoint[1] - currentPos[1];

        const chordLength = Math.sqrt(dx * dx + dy * dy);
        // Calculate radius using the sweep angle
        const radius = chordLength / (2 * Math.sin(sweepAngleRadians / 2));
        // Calculate the midpoint of the chord
        const midX = (currentPos[0] + endPoint[0]) / 2;
        const midY = (currentPos[1] + endPoint[1]) / 2;
        // Calculate the distance from midpoint to the circle center
        const midToCenterDist = Math.sqrt(
          radius * radius - (chordLength / 2) * (chordLength / 2),
        );
        // Adjust angle for center point calculation based on sweep direction and angle size
        const angleOffset = anticlockwise ? Math.PI / 2 : -Math.PI / 2;
        const centerOffsetDirection = sweepAngleDegrees > 180 ? 1 : -1; // This determines on which side of the midpoint the center lies

        // Calculate angle from current position to endpoint
        const angle = Math.atan2(dy, dx);

        // Calculate center of the circle
        const centerX =
          midX +
          centerOffsetDirection *
            midToCenterDist *
            Math.cos(angle + angleOffset);
        const centerY =
          midY +
          centerOffsetDirection *
            midToCenterDist *
            Math.sin(angle + angleOffset);
        // Determine start and end angles for the arc
        const startAngle = Math.atan2(
          currentPos[1] - centerY,
          currentPos[0] - centerX,
        );
        const endAngle = Math.atan2(
          endPoint[1] - centerY,
          endPoint[0] - centerX,
        );
        ctx.arc(centerX, centerY, radius, startAngle, endAngle, anticlockwise);
        lastAngle = endAngle + (anticlockwise ? -Math.PI / 2 : Math.PI / 2);
        currentPos = endPoint; // Update current position to endpoint

        break;
      }
      case "arcPolarTo": {
        let [targetAngle, distance, sweepAngleDegrees] = params;

        const endPoint = [
          currentPos[0] + distance * Math.cos((targetAngle / 180) * Math.PI),
          currentPos[1] + distance * Math.sin((targetAngle / 180) * Math.PI),
        ];

        if (sweepAngleDegrees === undefined) {
          const tanCir = findCircle(
            ...currentPos,
            (lastAngle / Math.PI) * 180,
            ...endPoint,
          );
          if (tanCir === undefined) {
            ctx.lineTo(...endPoint);
            lastAngle = getAngle(currentPos, endPoint);
            currentPos = endPoint;
            break;
          }
          const startAngle = Math.atan2(
            currentPos[1] - tanCir.centerY,
            currentPos[0] - tanCir.centerX,
          );
          const endAngle = Math.atan2(
            endPoint[1] - tanCir.centerY,
            endPoint[0] - tanCir.centerX,
          );

          const quadrant = analyzeLineAndPoint(currentPos, lastAngle, endPoint);
          const anticlockwise = {
            true_true: true,
            true_false: false,
            false_true: false,
            false_false: true,
          }[`${quadrant.isAbove}_${quadrant.isRight}`];

          ctx.arc(
            tanCir.centerX,
            tanCir.centerY,
            tanCir.radius,
            startAngle,
            endAngle,
            anticlockwise,
          );
          lastAngle = endAngle + (anticlockwise ? -Math.PI / 2 : Math.PI / 2);
          currentPos = endPoint;
          break;
        }

        if (Math.abs(sweepAngleDegrees) < 0.00000001) {
          ctx.lineTo(...endPoint);
          lastAngle = getAngle(currentPos, endPoint);
          currentPos = endPoint;
          break;
        }

        const anticlockwise = sweepAngleDegrees < 0;
        sweepAngleDegrees = Math.abs(sweepAngleDegrees % 360);

        // Convert sweep angle from degrees to radians
        const sweepAngleRadians = (sweepAngleDegrees * Math.PI) / 180;

        // Calculate the chord length
        const dx = endPoint[0] - currentPos[0];
        const dy = endPoint[1] - currentPos[1];

        const chordLength = Math.sqrt(dx * dx + dy * dy);
        // Calculate radius using the sweep angle
        const radius = chordLength / (2 * Math.sin(sweepAngleRadians / 2));
        // Calculate the midpoint of the chord
        const midX = (currentPos[0] + endPoint[0]) / 2;
        const midY = (currentPos[1] + endPoint[1]) / 2;
        // Calculate the distance from midpoint to the circle center
        const midToCenterDist = Math.sqrt(
          radius * radius - (chordLength / 2) * (chordLength / 2),
        );
        // Adjust angle for center point calculation based on sweep direction and angle size
        const angleOffset = anticlockwise ? Math.PI / 2 : -Math.PI / 2;
        const centerOffsetDirection = sweepAngleDegrees > 180 ? 1 : -1; // This determines on which side of the midpoint the center lies

        // Calculate angle from current position to endpoint
        const angle = Math.atan2(dy, dx);

        // Calculate center of the circle
        const centerX =
          midX +
          centerOffsetDirection *
            midToCenterDist *
            Math.cos(angle + angleOffset);
        const centerY =
          midY +
          centerOffsetDirection *
            midToCenterDist *
            Math.sin(angle + angleOffset);
        // Determine start and end angles for the arc
        const startAngle = Math.atan2(
          currentPos[1] - centerY,
          currentPos[0] - centerX,
        );
        const endAngle = Math.atan2(
          endPoint[1] - centerY,
          endPoint[0] - centerX,
        );
        ctx.arc(centerX, centerY, radius, startAngle, endAngle, anticlockwise);
        lastAngle = endAngle + (anticlockwise ? -Math.PI / 2 : Math.PI / 2);
        currentPos = endPoint; // Update current position to endpoint

        break;
      }
      case "close": {
        const nextPoint = startPoint;
        ctx.lineTo(...nextPoint);
        lastAngle = getAngle(currentPos, nextPoint);
        currentPos = nextPoint;
        break;
      }
      default:
        console.log(`Unknown command: ${command}`);
    }
  });

  // Stroke the path to draw it on the canvas
  ctx.stroke();
}

function getAngle(point0, point1) {
  // Calculate the difference in coordinates
  var deltaY = point1[1] - point0[1];
  var deltaX = point1[0] - point0[0];

  // Calculate the angle using atan2
  var angle = Math.atan2(deltaY, deltaX);

  // Return the angle
  return angle;
}

function findCircle(x1, y1, angleDegrees, x2, y2) {
  // Convert angle from degrees to radians
  const angleRadians = (angleDegrees * Math.PI) / 180;

  // Normal to the tangent
  const dxNormal = Math.cos(angleRadians + Math.PI / 2);
  const dyNormal = Math.sin(angleRadians + Math.PI / 2);

  // Midpoint of A and B
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  // Direction vector from A to B
  const dxAB = x2 - x1;
  const dyAB = y2 - y1;

  // Perpendicular to AB
  const dxPerp = -dyAB;
  const dyPerp = dxAB;

  // Parameter t for the line equation from A in the direction of the normal
  // A + t * Normal = Midpoint + s * Perpendicular
  // Solving for t and s will give us the intersection point
  // x1 + t * dxNormal = midX + s * dxPerp
  // y1 + t * dyNormal = midY + s * dyPerp

  // Solving the system of linear equations
  const denominator = dxNormal * dyPerp - dyNormal * dxPerp;
  if (Math.abs(denominator) < 1e-10) {
    console.log(
      "The calculations lead to parallel lines, check inputs and angle.",
    );
    return undefined;
  }

  const t = ((midX - x1) * dyPerp - (midY - y1) * dxPerp) / denominator;

  // Circle center coordinates
  const centerX = x1 + t * dxNormal;
  const centerY = y1 + t * dyNormal;

  // Calculate radius
  const radius = Math.sqrt((centerX - x1) ** 2 + (centerY - y1) ** 2);

  return {
    centerX: centerX,
    centerY: centerY,
    radius: radius,
  };
}

function analyzeLineAndPoint(point1, angleRadians, point2) {
  const [x1, y1] = point1;
  const [x2, y2] = point2;

  // Convert angle from degrees to radians
  // const angleRadians = angleDegrees * Math.PI / 180;

  // Calculate the slope and y-intercept of the line
  const slope = Math.tan(angleRadians);
  const intercept = y1 - slope * x1;

  // Determine the expected y value at x2 on the line
  const yOnLine = slope * x2 + intercept;

  // Check if point2 is above the line
  const isAbove = y2 < yOnLine;

  // Determine if the line is pointing to the right or left
  // Positive slope or angle in first & third quadrants means right, otherwise left
  const isRight = Math.cos(angleRadians) > 0;

  return {
    isAbove: isAbove,
    isRight: isRight,
  };
}

// const dx = endPoint[0] - currentPos[0];
// const dy = endPoint[1] - currentPos[1];
// const dist = Math.sqrt(dx * dx + dy * dy);
// console.log(dist, radius*2);
// if (radius*2 < dist) {
//   ctx.lineTo(...endPoint);
//   currentPos = endPoint;
//   break;
// }
// const midX = (currentPos[0] + endPoint[0]) / 2;
// const midY = (currentPos[1] + endPoint[1]) / 2;
// const midToCenterDist = Math.sqrt(radius * radius - (dist / 2) * (dist / 2));
// const angle = Math.atan2(dy, dx);
// const angleOffset = anticlockwise ? (Math.PI / 2) : (-Math.PI / 2);
// const centerX = midX + midToCenterDist * Math.cos(angle + angleOffset);
// const centerY = midY + midToCenterDist * Math.sin(angle + angleOffset);

// const startAngle = Math.atan2(currentPos[1] - centerY, currentPos[0] - centerX);
// const endAngle = Math.atan2(endPoint[1] - centerY, endPoint[0] - centerX);

// ctx.arc(centerX, centerY, radius, startAngle, endAngle, anticlockwise === "-");
// currentPos = endPoint; // Update current position to endpoint
// break;

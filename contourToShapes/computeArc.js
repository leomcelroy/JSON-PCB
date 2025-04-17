export function computeArc(currentPos, lastAngle, endPoint, sweepAngleDegrees) {
  console.log("compute arc");
  if (sweepAngleDegrees === null) {
    const tanCir = findCircle(
      ...currentPos,
      (lastAngle / Math.PI) * 180,
      ...endPoint,
    );

    if (tanCir === null) {
      return { type: "line", start: currentPos, end: endPoint };
    }

    const startAngle = Math.atan2(
      currentPos[1] - tanCir.centerY,
      currentPos[0] - tanCir.centerX,
    );
    const endAngle = Math.atan2(
      endPoint[1] - tanCir.centerY,
      endPoint[0] - tanCir.centerX,
    );

    const anticlockwise = determineAnticlockwise(
      currentPos,
      lastAngle,
      endPoint,
    );

    // console.log({ anticlockwise, currentPos, endPoint });

    const { centerX, centerY, radius } = tanCir;
    return {
      type: "arc",
      center: [centerX, centerY],
      radius: radius,
      startAngle,
      endAngle,
      start: [
        centerX + radius * Math.cos(startAngle),
        centerY + radius * Math.sin(startAngle),
      ],
      end: [
        centerX + radius * Math.cos(endAngle),
        centerY + radius * Math.sin(endAngle),
      ],
      anticlockwise,
    };
  }

  if (Math.abs(sweepAngleDegrees) < 0.0001) {
    // Increased threshold to avoid issues
    return { type: "line", start: currentPos, end: endPoint };
  }

  const anticlockwise = sweepAngleDegrees < 0;
  sweepAngleDegrees = Math.abs(sweepAngleDegrees % 360);

  const sweepAngleRadians = (sweepAngleDegrees * Math.PI) / 180;

  const dx = endPoint[0] - currentPos[0];
  const dy = endPoint[1] - currentPos[1];
  const chordLength = Math.sqrt(dx * dx + dy * dy);

  const radius = chordLength / (2 * Math.sin(sweepAngleRadians / 2));

  const midX = (currentPos[0] + endPoint[0]) / 2;
  const midY = (currentPos[1] + endPoint[1]) / 2;

  const midToCenterDist = Math.sqrt(
    radius * radius - (chordLength / 2) * (chordLength / 2),
  );

  const angleOffset = anticlockwise ? Math.PI / 2 : -Math.PI / 2;

  // Fix: Instead of using fixed centerOffsetDirection, derive it from the angle and sweep
  const centerOffsetDirection =
    sweepAngleDegrees <= 180 === anticlockwise ? 1 : -1;

  const angle = Math.atan2(dy, dx);

  const centerX =
    midX +
    centerOffsetDirection * midToCenterDist * Math.cos(angle + angleOffset);
  const centerY =
    midY +
    centerOffsetDirection * midToCenterDist * Math.sin(angle + angleOffset);

  const startAngle = Math.atan2(
    currentPos[1] - centerY,
    currentPos[0] - centerX,
  );
  const endAngle = Math.atan2(endPoint[1] - centerY, endPoint[0] - centerX);

  // Handle full rotations if sweep angle > 360 degrees
  const wrappedEndAngle = anticlockwise
    ? endAngle - Math.floor(sweepAngleDegrees / 360) * 2 * Math.PI
    : endAngle + Math.floor(sweepAngleDegrees / 360) * 2 * Math.PI;

  return {
    type: "arc",
    center: [centerX, centerY],
    radius,
    startAngle,
    endAngle: wrappedEndAngle, // Wrap the end angle for full rotations
    start: [
      centerX + radius * Math.cos(startAngle),
      centerY + radius * Math.sin(startAngle),
    ],
    end: [
      centerX + radius * Math.cos(wrappedEndAngle),
      centerY + radius * Math.sin(wrappedEndAngle),
    ],
    anticlockwise,
  };
}

function findCircle(x1, y1, angleDegrees, x2, y2) {
  const angleRadians = (angleDegrees * Math.PI) / 180;
  const dxNormal = Math.cos(angleRadians + Math.PI / 2);
  const dyNormal = Math.sin(angleRadians + Math.PI / 2);

  const deltaX = x1 - x2;
  const deltaY = y1 - y2;

  const numerator = -(deltaX * deltaX + deltaY * deltaY);
  let denominator = 2 * (deltaX * dxNormal + deltaY * dyNormal);

  if (Math.abs(denominator) < 1e-8) {
    denominator += 0.00000001;
  }

  const t = numerator / denominator;

  const centerX = x1 + t * dxNormal;
  const centerY = y1 + t * dyNormal;
  const radius = Math.sqrt((centerX - x1) ** 2 + (centerY - y1) ** 2);

  return {
    centerX,
    centerY,
    radius,
  };
}

function determineAnticlockwise(point1, angleRadians, point2) {
  const [x1, y1] = point1;
  const [x2, y2] = point2;
  const slope = Math.tan(angleRadians);
  const intercept = y1 - slope * x1;
  const yOnLine = slope * x2 + intercept;
  const isAbove = y2 < yOnLine;
  const isRight = Math.cos(angleRadians) > 0;

  // Consistent anticlockwise determination based on relative positions
  return (isAbove && isRight) || (!isAbove && !isRight);
}

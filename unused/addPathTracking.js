export function addPathTracking(canvas, board, ops = {}) {
  let onHover = ops.onHover || null;
  let onClick = ops.onClick || null;
  let onExit = ops.onExit || null;
  let margin = ops.margin || 10;
  let ptTransform = ops.ptTransform || null;

  let mousePos = { x: 0, y: 0 };
  let hovered = null;
  let [shapes, cmds] = getShapesFromBoard(board);

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    if (ptTransform) {
      const newPt = ptTransform(x, y);
      x = newPt[0];
      y = newPt[1];
    }

    mousePos.x = x;
    mousePos.y = y;

    const newHovered = findHoveredContour(mousePos.x, mousePos.y);
    if (newHovered !== hovered && onExit) {
      onExit(hovered);
    }

    hovered = newHovered;

    if (hovered && onHover) {
      onHover(hovered);
    }
  });

  canvas.addEventListener("mousedown", (e) => {
    if (hovered === null) return;

    const rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    if (ptTransform) {
      const newPt = ptTransform(x, y);
      x = newPt[0];
      y = newPt[1];
    }

    if (onClick) onClick(hovered, x, y);
  });

  function findHoveredContour(mx, my) {
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      for (let segment of shape.flat()) {
        if (segment.type === "line") {
          if (isPointNearLine(mx, my, segment.start, segment.end, margin)) {
            return cmds[i];
          }
        } else if (segment.type === "arc") {
          if (
            isPointNearArc(
              mx,
              my,
              segment.center,
              segment.radius,
              segment.startAngle,
              segment.endAngle,
              margin,
            )
          ) {
            return cmds[i];
          }
        }
      }
    }
    return null;
  }

  return {
    setBoard(newBoard) {
      const shapesCmds = getShapesFromBoard(newBoard);
      shapes = shapesCmds[0];
      cmds = shapesCmds[1];
    },
    setCallbacks(ops = {}) {
      if (ops.onHover) onHover = ops.onHover;
      if (ops.onClick) onClick = ops.onClick;
      if (ops.onExit) onExit = ops.onExit;
    },
  };
}

function isPointNearLine(px, py, start, end, margin) {
  const dist = pointLineDistance(px, py, start, end);
  return dist <= margin;
}

// Check if a point is near an arc
function isPointNearArc(px, py, center, radius, startAngle, endAngle, margin) {
  const distToCenter = Math.hypot(px - center[0], py - center[1]);

  // Calculate the angle from the center to the point
  let angleToPoint = Math.atan2(py - center[1], px - center[0]);

  // Normalize the angles to [0, 2 * Math.PI] range
  if (angleToPoint < 0) angleToPoint += 2 * Math.PI;
  if (startAngle < 0) startAngle += 2 * Math.PI;
  if (endAngle < 0) endAngle += 2 * Math.PI;

  // Check if the point is close to the arc's radius
  const withinRadius = Math.abs(distToCenter - radius) <= margin;

  // Handle cases where the arc spans across the 2π boundary
  let withinAngle = false;
  if (startAngle <= endAngle) {
    // Normal case: no wrapping around 2π
    withinAngle = angleToPoint >= startAngle && angleToPoint <= endAngle;
  } else {
    // Wrapping case: the arc crosses the 0/2π boundary
    withinAngle = angleToPoint >= startAngle || angleToPoint <= endAngle;
  }

  return withinRadius && withinAngle;
}

// Helper to calculate distance from point to line
function pointLineDistance(px, py, start, end) {
  const A = px - start[0];
  const B = py - start[1];
  const C = end[0] - start[0];
  const D = end[1] - start[1];

  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  const param = len_sq !== 0 ? dot / len_sq : -1;

  let xx, yy;

  if (param < 0) {
    xx = start[0];
    yy = start[1];
  } else if (param > 1) {
    xx = end[0];
    yy = end[1];
  } else {
    xx = start[0] + param * C;
    yy = start[1] + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

function getShapesFromBoard(board) {
  let shapesList = [];
  let sourceList = [];

  board.traces.forEach((trace) => {
    shapesList.push(trace.shapes);
    sourceList.push(trace);
  });

  board.regions.forEach((region) => {
    shapesList.push(region.shapes);
    sourceList.push(region);
  });

  return [shapesList, sourceList];
}

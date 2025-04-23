// Translate a point by a given vector
export function translatePoint(point, translation, origin = [0, 0]) {
  return [
    point[0] - origin[0] + translation[0],
    point[1] - origin[1] + translation[1],
  ];
}

export function translateShapes(shapes, translation, origin = [0, 0]) {
  return shapes.map((shape) => {
    if (shape.type === "arc") {
      return {
        ...shape,
        center: translatePoint(shape.center, translation, origin),
        start: translatePoint(shape.start, translation, origin),
        end: translatePoint(shape.end, translation, origin),
      };
    } else if (shape.type === "line") {
      return {
        ...shape,
        start: translatePoint(shape.start, translation, origin),
        end: translatePoint(shape.end, translation, origin),
      };
    }
  });
}

// Rotate a point around a given origin by a certain angle (in radians)
export function rotatePoint(point, angle, origin) {
  const [px, py] = point;
  const [ox, oy] = origin;
  const cosTheta = Math.cos(angle);
  const sinTheta = Math.sin(angle);

  const dx = px - ox;
  const dy = py - oy;

  return [
    cosTheta * dx - sinTheta * dy + ox,
    sinTheta * dx + cosTheta * dy + oy,
  ];
}

export function rotateShapes(shapes, angle, origin = [0, 0]) {
  angle = (angle / 180) * Math.PI;
  return shapes.map((shape) => {
    if (shape.type === "arc") {
      return {
        ...shape,
        center: rotatePoint(shape.center, angle, origin),
        start: rotatePoint(shape.start, angle, origin),
        end: rotatePoint(shape.end, angle, origin),
        startAngle: shape.startAngle + angle,
        endAngle: shape.endAngle + angle,
      };
    } else if (shape.type === "line") {
      return {
        ...shape,
        start: rotatePoint(shape.start, angle, origin),
        end: rotatePoint(shape.end, angle, origin),
      };
    }
  });
}

export function flipPoint(point, origin, axis = "horizontal") {
  const translatedPoint = [point[0] - origin[0], point[1] - origin[1]];

  let flippedPoint;
  if (axis === "horizontal") {
    flippedPoint = [-translatedPoint[0], translatedPoint[1]];
  } else if (axis === "vertical") {
    flippedPoint = [translatedPoint[0], -translatedPoint[1]];
  }

  return [flippedPoint[0] + origin[0], flippedPoint[1] + origin[1]];
}

export function flipShapes(shapes, axis = "horizontal", origin = [0, 0]) {
  return shapes.map((shape) => {
    if (shape.type === "arc") {
      return {
        ...shape,
        center: flipPoint(shape.center, origin, axis),
        start: flipPoint(shape.start, origin, axis),
        end: flipPoint(shape.end, origin, axis),
        // Flip the angle for the arc depending on the axis
        startAngle:
          axis === "horizontal"
            ? Math.PI - shape.startAngle
            : -shape.startAngle,
        endAngle:
          axis === "horizontal" ? Math.PI - shape.endAngle : -shape.endAngle,
        anticlockwise: !shape.anticlockwise, // Reverse the arc direction when flipping
      };
    } else if (shape.type === "line") {
      return {
        ...shape,
        start: flipPoint(shape.start, origin, axis),
        end: flipPoint(shape.end, origin, axis),
      };
    }
  });
}

export function translateBoundingBox(bbox, translate, origin = [0, 0]) {
  const [ox, oy] = origin;
  const [dx, dy] = translate;

  return {
    xMin: bbox.xMin + dx - ox,
    xMax: bbox.xMax + dx - ox,
    yMin: bbox.yMin + dy - oy,
    yMax: bbox.yMax + dy - oy,
  };
}

export function rotateBoundingBox(bbox, theta, origin = [0, 0]) {
  const [ox, oy] = origin;

  // Function to rotate a single point (x, y)
  function rotatePoint(x, y, theta, ox, oy) {
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    const newX = cosTheta * (x - ox) - sinTheta * (y - oy) + ox;
    const newY = sinTheta * (x - ox) + cosTheta * (y - oy) + oy;
    return { x: newX, y: newY };
  }

  // Rotate all four corners of the bounding box
  const topLeft = rotatePoint(bbox.xMin, bbox.yMin, theta, ox, oy);
  const topRight = rotatePoint(bbox.xMax, bbox.yMin, theta, ox, oy);
  const bottomLeft = rotatePoint(bbox.xMin, bbox.yMax, theta, ox, oy);
  const bottomRight = rotatePoint(bbox.xMax, bbox.yMax, theta, ox, oy);

  // Calculate new bounding box
  const xMin = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
  const xMax = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
  const yMin = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
  const yMax = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);

  return {
    xMin,
    xMax,
    yMin,
    yMax,
  };
}

export function flipBoundingBox(bbox, axis = "horizontal") {
  if (axis === "horizontal") {
    // Swap xMin and xMax for horizontal flip
    return {
      xMin: -bbox.xMax,
      xMax: -bbox.xMin,
      yMin: bbox.yMin,
      yMax: bbox.yMax,
    };
  } else if (axis === "vertical") {
    // Swap yMin and yMax for vertical flip
    return {
      xMin: bbox.xMin,
      xMax: bbox.xMax,
      yMin: -bbox.yMax,
      yMax: -bbox.yMin,
    };
  } else {
    throw new Error("Invalid axis for flip");
  }
}

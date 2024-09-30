

export function createCompassRuler(initialCommands = []) {

  let commands = [...initialCommands];

  const result = {
    moveTo,
    moveBy,
    movePolar,
    lineTo,
    lineBy,
    linePolar,
    arcTo,
    arcBy,
    arcPolar,
    filletTo,
    filletBy,
    filletPolar,
    close,
    getPolylines() {
      // calculate polylines here maybe?
      // if i fillet the first point and close I won't know point geometry till after I close
      let polylines = [];

      let position = [0, 0];
      let lastAngle = 0;
      let startPoint = [0, 0];

      const cmds = makeCommands({
        moveTo(x, y) {
          if (polylines.length === 0) polylines.push([]);

          const endPoint = [x, y];

          const lastPolyline = polylines.at(-1);

          if (lastPolyline.length === 0) {
            lastPolyline.push(endPoint);
          } else if (lastPolyline.length === 1) {
            const lastPoint = lastPolyline.at(-1);
            lastPoint[0] = x;
            lastPoint[1] = y;
          } else {
            polylines.push([ [endPoint] ]);
          }

          lastAngle = 0;
          currentPos = endPoint;
          startPoint = endPoint;
        },
        lineTo(x, y) {
          if (polylines.length === 0) polylines.push([0, 0]);
          const lastPolyline = polylines.at(-1);

          const endPoint = [x, y];
          lastPolyline.push(endPoint);
          lastAngle = getAngle(currentPos, endPoint);
          currentPos = endPoint;
        },
        filletTo() {

        },
        arc(cx, cy, radius, startAngle, endAngle, counterClockwise) {

        }
      })

      return polylines;
    },
    getConstruction() {
      let construction = [];

      let currentPoint = [ 0, 0 ];
      let currentAngle = 0;

      return construction;
    },
    getCommands() {
      return commands;
    }
  }

  return result;

  function moveTo(x, y) {
    commands.push([ "moveTo", x, y ]);
    return result;
  }

  function moveBy(dx, dy) {
    commands.push([ "moveBy", dx, dy ]);
    return result;
  }

  function movePolar(localAngle, length) {
    commands.push([ "movePolar", localAngle, length ]);
    return result;
  }

  function lineTo(x, y) {
    commands.push([ "lineTo", x, y ]);
    return result;
  }

  function lineBy(dx, dy) {
    commands.push([ "lineBy", dx, dy ]);

    return result;
  }

  function linePolar(localAngle, length) {
    commands.push([ "linePolar", localAngle, length ]);
    return result;
  }

  function arcTo(x, y, sweepAngle) {
    commands.push([ "arcTo", x, y, sweepAngle ]);
    return result;
  }

  function arcBy(dx, dy, sweepAngle) {
    commands.push([ "arcBy", dx, dy, sweepAngle ]);
    return result;
  }

  function arcPolar(localAngle, length, sweepAngle) {
    commands.push([ "arcPolar", localAngle, length, sweepAngle ]);
    return result;
  }

  function filletTo(x, y, radius) {
    commands.push([ "filletTo", x, y, radius ]);
    return result;
  }

  function filletBy(dx, dy, radius) {
    commands.push([ "filletBy", dx, dy, radius ]);
    return result;
  }

  function filletPolar(localAngle, length, radius) {
    commands.push([ "filletPolar", localAngle, length, radius ]);
    return result;
  }

  function close() {
    commands.push([ "close" ]);
    return result;
  }


  return result;
}


const makeCommands = ({ 
  moveTo, 
  lineTo, 
  filletTo,
  arc, 
  getPosition, 
  getLastAngle, 
  getStartPoint, 
}) => ({
  moveTo(x, y) {
    moveTo(x, y);
  },
  moveBy(dx, dy) {
    const [x, y] = getPosition();

    moveTo(x+dx, y+dy);
  },
  movePolar(localAngle, length) {
    const [x, y] = getPosition();
    const lastAngle = getLastAngle();

    moveTo(
      x + length * Math.cos((localAngle / 180) * Math.PI + lastAngle),
      y + length * Math.sin((localAngle / 180) * Math.PI + lastAngle),
    )
  },
  lineTo(x, y) {
    lineTo(x, y);
  },
  lineBy(dx, dy) {
    const [x, y] = getPosition();

    lineTo(x+dx, y+dy);
  },
  linePolar(localAngle, length) {
    const [x, y] = getPosition();
    const lastAngle = getLastAngle();

    lineTo(
      x + length * Math.cos((localAngle / 180) * Math.PI + lastAngle),
      y + length * Math.sin((localAngle / 180) * Math.PI + lastAngle),
    )
  },
  arcTo(x, y, sweepAngle) {

  },
  arcBy(dx, dy, sweepAngle) {

  },
  arcPolar(localAngle, length, sweepAngle) {

  },
  filletTo(x, y, radius) {

  },
  filletBy(dx, dy, radius) {

  },
  filletPolar(localAngle, length, radius) {

  },
  close() {
    const [x, y] = getStartPoint();
    lineTo(x, y);
  },
  circle(cx, cy, radius) {
    moveTo(cx, cy);
    // arc
  }
});

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
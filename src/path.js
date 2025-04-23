export function path(...cmds) {
  // this function takes commands and returns a list of polylines
  // cmds -> [ [ [x, y]... ] ]
  // this function takes these commands
  // "moveTo" | "mt" x y: start a new polyline at x, y
  // "moveBy" | "mb" dx dy: start a new polyline at dx, dy
  // "lineTo" | "lt" x y: continue current polyline at x, y
  // "lineBy" | "lb" dx dy: continue current polyline at dx, dy
  // "polarBy" | "pb" angle distance: turn angle (in degrees) from orientation of last line and move distance in that direction
  // "polarTo" | "pt" angle distance: same as above but absolute angle
  // "close" | "z" go back to last move point

  const polylines = [];
  let currentPolyline = null;
  let startPoint = null;
  let currentX = 0;
  let currentY = 0;
  let currentAngle = 0; // Angle in degrees, 0 = positive X-axis

  for (const cmd of cmds) {
    const [type, ...args] = cmd;

    switch (type) {
      case "moveTo":
      case "mt": {
        const [x, y] = args;
        if (currentPolyline && currentPolyline.length > 0) {
          polylines.push(currentPolyline);
        }
        currentPolyline = [[x, y]];
        startPoint = [x, y];
        currentX = x;
        currentY = y;
        currentAngle = 0;
        break;
      }
      case "moveBy":
      case "mb": {
        const [dx, dy] = args;
        const startX = currentX + dx;
        const startY = currentY + dy;
        if (currentPolyline && currentPolyline.length > 0) {
          polylines.push(currentPolyline);
        }
        currentPolyline = [[startX, startY]];
        startPoint = [startX, startY];
        currentX = startX;
        currentY = startY;
        currentAngle = 0;
        break;
      }
      case "lineTo":
      case "lt": {
        if (!currentPolyline)
          throw new Error(
            "Cannot lineTo before starting a polyline with moveTo or moveBy."
          );
        const [x, y] = args;
        const dx = x - currentX;
        const dy = y - currentY;
        currentPolyline.push([x, y]);
        currentAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
        currentX = x;
        currentY = y;
        break;
      }
      case "lineBy":
      case "lb": {
        if (!currentPolyline)
          throw new Error(
            "Cannot lineBy before starting a polyline with moveTo or moveBy."
          );
        const [dx, dy] = args;
        const newX = currentX + dx;
        const newY = currentY + dy;
        currentPolyline.push([newX, newY]);
        currentAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
        currentX = newX;
        currentY = newY;
        break;
      }
      case "polarTo":
      case "pt": {
        if (!currentPolyline)
          throw new Error(
            "Cannot polarTo before starting a polyline with moveTo or moveBy."
          );
        const [angle, distance] = args;
        const angleRad = (angle * Math.PI) / 180;
        const newX = currentX + distance * Math.cos(angleRad);
        const newY = currentY + distance * Math.sin(angleRad);
        currentPolyline.push([newX, newY]);
        currentAngle = angle;
        currentX = newX;
        currentY = newY;
        break;
      }
      case "polarBy":
      case "pb": {
        if (!currentPolyline)
          throw new Error(
            "Cannot polarBy before starting a polyline with moveTo or moveBy."
          );
        const [angle, distance] = args;
        const newAngle = currentAngle + angle;
        const newAngleRad = (newAngle * Math.PI) / 180;
        const newX = currentX + distance * Math.cos(newAngleRad);
        const newY = currentY + distance * Math.sin(newAngleRad);
        currentPolyline.push([newX, newY]);
        currentAngle = newAngle;
        currentX = newX;
        currentY = newY;
        break;
      }
      case "close":
      case "z": {
        if (!currentPolyline)
          throw new Error(
            "Cannot close before starting a polyline with moveTo or moveBy."
          );
        if (!startPoint) {
          throw new Error("Cannot close path without a start point.");
        }
        if (
          currentPolyline.length > 0 &&
          (currentPolyline[currentPolyline.length - 1][0] !== startPoint[0] ||
            currentPolyline[currentPolyline.length - 1][1] !== startPoint[1])
        ) {
          currentPolyline.push(startPoint);
          currentX = startPoint[0];
          currentY = startPoint[1];
          // Closing doesn't inherently set an angle, keep the last one
        }
        break;
      }
      default:
        console.warn(`Unknown command type: ${type}`);
    }
  }

  if (currentPolyline && currentPolyline.length > 0) {
    polylines.push(currentPolyline);
  }

  return polylines;
}

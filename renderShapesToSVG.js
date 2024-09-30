import { svg } from "lit-html";

export function shapesToPathData(shapes) {
  let pathData = ""; // This will store the SVG path data

  shapes.forEach((shape, i) => {
    if (i === 0) {
      // Move to the starting point of the first shape
      pathData += `M ${shape.start[0]} ${shape.start[1]} `;
    }

    switch (shape.type) {
      case "line": {
        // Draw a line to the end point
        const { end } = shape;
        pathData += `L ${end[0]} ${end[1]} `;
        break;
      }
      case "arc": {
        const {
          center,
          radius,
          startAngle,
          endAngle,
          anticlockwise,
          start,
          end,
        } = shape;
        const startX = start[0];
        const startY = start[1];
        const endX = end[0];
        const endY = end[1];

        const startAngleCalc = Math.atan2(
          startY - center[1],
          startX - center[0],
        );
        const endAngleCalc = Math.atan2(endY - center[1], endX - center[0]);
        let deltaAngle = endAngleCalc - startAngleCalc;

        if (anticlockwise && deltaAngle > 0) {
          deltaAngle -= 2 * Math.PI;
        } else if (!anticlockwise && deltaAngle < 0) {
          deltaAngle += 2 * Math.PI;
        }
        deltaAngle = Math.abs(deltaAngle);

        const largeArcFlag = deltaAngle > Math.PI ? 1 : 0;

        const sweepFlag = anticlockwise ? 0 : 1;

        pathData += `A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY} `;
        break;
      }
      default:
        console.log(`Unknown shape type: ${shape.type}`);
    }
  });

  return pathData;
}

export function renderShapesToSVG(shapes, ops = {}) {
  const strokeWidth = ops.strokeWidth || 0;
  const stroke = ops.stroke || "none";
  const fill = ops.fill || "none";
  const className = ops.class || "";

  let pathData = shapesToPathData(shapes);

  // Return the SVG path element
  return svg`<path 
    d=${pathData} 
    fill=${fill} 
    stroke=${stroke} 
    stroke-width=${strokeWidth} 
    stroke-linecap="round" 
    stroke-linejoin="round" 
    class=${className}
    />`;
}

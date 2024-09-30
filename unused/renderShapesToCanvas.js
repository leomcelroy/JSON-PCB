export function renderShapesToCanvas(shapes, canvas, ops = {}) {
  const strokeWidth = ops.strokeWidth || 0;
  const stroke = ops.stroke || "none";
  const fill = ops.fill || "none";

  const ctx = canvas.getContext("2d");

  ctx.beginPath();
  shapes.forEach((shape, i, arr) => {
    if (i === 0) ctx.moveTo(...shape.start);
    switch (shape.type) {
      case "line": {
        const { end } = shape;
        ctx.lineTo(end[0], end[1]);
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
        ctx.arc(
          center[0],
          center[1],
          radius,
          startAngle,
          endAngle,
          anticlockwise,
        );
        break;
      }
      default:
        console.log(`Unknown shape type: ${shape.type}`);
    }
  });

  if (stroke !== "none" && strokeWidth > 0) {
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = stroke;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  if (fill !== "none") {
    ctx.fillStyle = fill;
    ctx.fill();
  }
}

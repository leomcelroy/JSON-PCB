export function polylineToCanvas(polyline, canvas, ops = {}) {
  const strokeWidth = ops.strokeWidth || 0;
  const stroke = ops.stroke || "none";
  const fill = ops.fill || "none";

  const ctx = canvas.getContext("2d");

  ctx.beginPath();
  polyline.forEach((pt, i, arr) => {
    if (i === 0 && arr.length > 1) ctx.moveTo(...pt);
    else ctx.lineTo(...pt);
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

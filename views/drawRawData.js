export function drawRawData({
  rawData,
  tracesRegions,
  color,
  tempCanvas,
  canvas,
  scale,
  x,
  y,
}) {
  const ctx = canvas.getContext("2d");
  const tempCtx = tempCanvas.getContext("2d");

  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

  tempCtx.setTransform(scale, 0, 0, -scale, x, y);

  const { positive, negative } = tracesRegions;

  tempCtx.globalCompositeOperation = "source-over";
  positive.regions.forEach((regionIndex) => {
    const region = rawData.regions[regionIndex];

    renderPolylineToCanvas(region.contour, tempCanvas, { fill: color });
  });

  positive.traces.forEach((traceIndex) => {
    const trace = rawData.traces[traceIndex];
    renderPolylineToCanvas(trace.track, tempCanvas, {
      stroke: color,
      strokeWidth: trace.diameter,
    });
  });

  tempCtx.globalCompositeOperation = "destination-out";
  negative.regions.forEach((regionIndex) => {
    const region = rawData.regions[regionIndex];
    renderPolylineToCanvas(region.contour, tempCanvas, { fill: color });
  });

  negative.traces.forEach((traceIndex) => {
    const trace = rawData.traces[traceIndex];
    renderPolylineToCanvas(trace.track, tempCanvas, {
      stroke: color,
      strokeWidth: trace.diameter,
    });
  });

  rawData.routes.forEach((route) => {
    renderPolylineToCanvas(route.track, tempCanvas, {
      stroke: color,
      strokeWidth: route.diameter,
    });
  });

  const dpr = window.devicePixelRatio ?? 1;

  ctx.setTransform(1 * dpr, 0, 0, 1 * dpr, 0, 0);

  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(tempCanvas, 0, 0);
}

function renderPolylineToCanvas(polyline, canvas, ops = {}) {
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

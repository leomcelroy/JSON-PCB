import { renderShapesToCanvas } from "./renderShapesToCanvas.js";

export function drawLayer({
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

  // tempCtx.globalCompositeOperation = "source-over";
  positive.regions.forEach((x) => {
    const shapes = x.shapes;
    renderShapesToCanvas(shapes, tempCanvas, { fill: color });
  });

  positive.traces.forEach((trace) => {
    const shapes = trace.shapes;
    renderShapesToCanvas(shapes, tempCanvas, {
      stroke: color,
      strokeWidth: trace.thickness,
    });
  });

  // tempCtx.globalCompositeOperation = "destination-out";
  negative.regions.forEach((x) => {
    const shapes = x.shapes;
    renderShapesToCanvas(shapes, tempCanvas, { fill: color });
  });

  negative.traces.forEach((trace) => {
    const shapes = trace.shapes;
    renderShapesToCanvas(shapes, tempCanvas, {
      stroke: color,
      strokeWidth: trace.thickness,
    });
  });

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(tempCanvas, 0, 0);
}

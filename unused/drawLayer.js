import { renderShapesToCanvas } from "./renderShapesToCanvas.js";

export function drawLayer(tracesRegions, color, tempCanvas, canvas) {
  const ctx = canvas.getContext("2d");
  const tempCtx = tempCanvas.getContext("2d");

  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

  const scale = canvas.panZoomFns.scale();
  const pointX = canvas.panZoomFns.x();
  const pointY = canvas.panZoomFns.y();

  tempCtx.setTransform(scale, 0, 0, scale, pointX, pointY);

  const { positive, negative } = tracesRegions;

  tempCtx.globalCompositeOperation = "source-over";
  positive.regions.forEach((x) => {
    const shapes = x.shapes;
    shapes.forEach((shape) => {
      renderShapesToCanvas(shape, tempCanvas, { fill: color });
    });
  });

  positive.traces.forEach((trace) => {
    const shapes = trace.shapes;
    shapes.forEach((shape) => {
      renderShapesToCanvas(shape, tempCanvas, {
        stroke: color,
        strokeWidth: trace.thickness,
      });
    });
  });

  tempCtx.globalCompositeOperation = "destination-out";
  negative.regions.forEach((x) => {
    const shapes = x.shapes;
    shapes.forEach((shape) => {
      renderShapesToCanvas(shape, tempCanvas, { fill: color });
    });
  });

  negative.traces.forEach((trace) => {
    const shapes = trace.shapes;
    shapes.forEach((shape) => {
      renderShapesToCanvas(shape, tempCanvas, {
        stroke: color,
        strokeWidth: trace.thickness,
      });
    });
  });

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tempCanvas, 0, 0);

  ctx.setTransform(scale, 0, 0, scale, pointX, pointY);
}

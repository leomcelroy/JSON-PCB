import { renderShapesToCanvas } from "./renderShapesToCanvas.js";
import { polylineToCanvas } from "./polylineToCanvas.js";

export function drawLayer({
  tracesRegions,
  drills,
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
  positive.regions.forEach((region) => {
    renderRegion(region, tempCanvas, { fill: color });
  });

  positive.traces.forEach((trace) => {
    renderTrace(trace, tempCanvas, {
      stroke: color,
      strokeWidth: trace.diameter,
    });
  });

  tempCtx.globalCompositeOperation = "destination-out";
  negative.regions.forEach((region) => {
    renderRegion(region, tempCanvas, { fill: color });
  });

  negative.traces.forEach((trace) => {
    renderTrace(trace, tempCanvas, {
      stroke: color,
      strokeWidth: trace.diameter,
    });
  });

  // DRAW drillS
  drills.forEach((drill) => {
    polylineToCanvas([drill.position], tempCanvas, {
      stroke: color,
      strokeWidth: drill.diameter,
    });
  });

  const dpr = window.devicePixelRatio ?? 1;

  ctx.setTransform(1 * dpr, 0, 0, 1 * dpr, 0, 0);

  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(tempCanvas, 0, 0);
}

function renderTrace(trace, tempCanvas, { stroke, strokeWidth }) {
  renderShapesToCanvas(trace.shapes, tempCanvas, {
    stroke,
    strokeWidth,
  });

  // polylineToCanvas(trace.polyline, tempCanvas, {
  //   stroke,
  //   strokeWidth,
  // });
}

function renderRegion(region, tempCanvas, { fill }) {
  renderShapesToCanvas(region.shapes, tempCanvas, {
    fill,
  });

  // polylineToCanvas(region.polyline, tempCanvas, { fill });
}

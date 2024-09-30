export function drawTraces(traces, colorMap, canvas) {
  const ctx = canvas.getContext("2d");

  traces.forEach((trace) => {
    const shapes = trace.shapes;
    shapes.forEach((shape) => {
      renderShapesToCanvas(shape, canvas, {
        stroke: colorMap[trace.layer],
        strokeWidth: trace.thickness,
      });
    });
  });
}

function drawTraces(traces, colorMap, canvas) {
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

export function drawRegions(regions, colorMap, tempCanvas, canvas) {
  const ctx = canvas.getContext("2d");

  const tempCtx = tempCanvas.getContext("2d");

  const groupedRegions = groupByPolarityAndLayer(regions);

  Object.entries(groupedRegions).forEach(([layer, contours]) => {
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Render positive contours on the temp canvas
    tempCtx.globalCompositeOperation = "source-over"; // Default composite operation
    contours.positive.forEach((x) => {
      const shapes = x.shapes;
      shapes.forEach((shape) =>
        renderShapesToCanvas(shape, tempCanvas, { fill: colorMap[layer] }),
      );
    });

    // Use destination-out for the negative contours on the temp canvas
    tempCtx.globalCompositeOperation = "destination-out";
    contours.negative.forEach((x) => {
      const shapes = x.shapes;
      shapes.forEach((shape) =>
        renderShapesToCanvas(shape, tempCanvas, { fill: colorMap[layer] }),
      );
    });

    // Now composite the result from tempCanvas onto the main canvas
    ctx.globalCompositeOperation = "source-over"; // Ensure it's just layering the result
    ctx.drawImage(tempCanvas, 0, 0);
  });
}

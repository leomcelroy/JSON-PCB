import { isOutline } from "./isOutline.js";

export function getLayerData(layers, flatten = false) {
  const newLayers = {};
  const apertures = [];
  const outlineApertureSize = 0;
  const outline = {
    positive: { regions: [], traces: [] },
    negative: { regions: [], traces: [] },
  };

  function getApertureIndex(traceThickness) {
    let currentIndex = apertures.indexOf(traceThickness);
    if (currentIndex === -1) {
      currentIndex = apertures.length;
      apertures.push(traceThickness);
    }

    return currentIndex;
  }

  for (const layerId in layers) {
    const layer = layers[layerId];

    const positive = { regions: [], traces: [] };
    const negative = { regions: [], traces: [] };

    let empty = true;

    layer.negative.traces.forEach((trace) => {
      const shapes = flatten ? flattenShapes(trace.shapes) : trace.shapes;
      if (isOutline(layerId)) {
        const apertureIndex = getApertureIndex(outlineApertureSize);
        outline.negative.traces.push({
          shapes,
          apertureIndex,
        });
        return;
      }

      empty = false;

      const apertureIndex = getApertureIndex(trace.diameter);

      negative.traces.push({ shapes, apertureIndex });
    });

    layer.positive.traces.forEach((trace) => {
      const shapes = flatten ? flattenShapes(trace.shapes) : trace.shapes;
      if (isOutline(layerId)) {
        const apertureIndex = getApertureIndex(outlineApertureSize);
        outline.positive.traces.push({
          shapes,
          apertureIndex,
        });
        return;
      }

      empty = false;

      const apertureIndex = getApertureIndex(trace.diameter);

      positive.traces.push({ shapes, apertureIndex });
    });

    layer.negative.regions.forEach((region) => {
      const shapes = flatten ? flattenShapes(region.shapes) : region.shapes;

      if (isOutline(layerId)) {
        const apertureIndex = getApertureIndex(outlineApertureSize);
        outline.negative.traces.push({
          shapes,
          apertureIndex,
        });
        return;
      }

      empty = false;

      negative.regions.push({ shapes });
    });

    layer.positive.regions.forEach((region) => {
      const shapes = flatten ? flattenShapes(region.shapes) : region.shapes;

      if (isOutline(layerId)) {
        const apertureIndex = getApertureIndex(outlineApertureSize);
        outline.positive.traces.push({
          shapes,
          apertureIndex,
        });
        return;
      }

      empty = false;

      positive.regions.push({ shapes });
    });

    if (empty) {
      continue;
    }

    newLayers[layerId] = { positive, negative };
  }

  return { layers: newLayers, apertures, outline };
}

function flattenShapes(shapes) {
  const segmentNumber = 64; // number of line segments per arc
  const flattened = [];

  shapes.forEach((shape) => {
    if (shape.type === "line") {
      flattened.push(shape);
      return;
    }

    if (shape.type === "arc") {
      let {
        center: [cx, cy],
        radius,
        startAngle,
        endAngle,
        anticlockwise,
      } = shape;

      // TODO: why do I have to do this?, maybe because coordinate system is flipped over x
      anticlockwise = !anticlockwise;

      // We want to travel from startAngle to endAngle:
      // - If anticlockwise is true, angles should go up
      // - If anticlockwise is false, angles should go down
      //
      // Basic difference
      let dAngle = endAngle - startAngle;

      // If anticlockwise, but dAngle < 0, add 2π to go the "long way" around
      // Or do the opposite if you want the "minor" arc.
      // Usually for arcs in typical geometry libraries:
      //   anticlockwise = true => endAngle might be greater than startAngle
      //   anticlockwise = false => endAngle < startAngle
      // If your data might cross a 2π boundary, handle that here:
      if (anticlockwise && dAngle < 0) {
        dAngle += 2 * Math.PI;
      } else if (!anticlockwise && dAngle > 0) {
        dAngle -= 2 * Math.PI;
      }

      // Step for each segment
      const angleStep = dAngle / segmentNumber;

      // Build angles array
      const angles = [];
      for (let i = 0; i <= segmentNumber; i++) {
        angles.push(startAngle + i * angleStep);
      }

      // Convert each angle to an (x,y) point
      const points = angles.map((angle) => [
        cx + radius * Math.cos(angle),
        cy + radius * Math.sin(angle),
      ]);

      // Turn each pair of consecutive points into a line
      for (let i = 0; i < points.length - 1; i++) {
        flattened.push({
          type: "line",
          start: points[i],
          end: points[i + 1],
        });
      }
    }
  });

  return flattened;
}

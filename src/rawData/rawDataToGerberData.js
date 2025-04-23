import { isOutline } from "../gerber/isOutline.js";

export function rawDataToGerberData(rawData) {
  const apertures = [];
  const layers = {};
  const drills = [];
  const outline = {
    positive: { regions: [], traces: [] },
    negative: { regions: [], traces: [] },
  };

  rawData.regions.forEach((region) => {
    const shapes = polylineToLines(region.contour, true);
    const polarity = region.polarity === "+" ? "positive" : "negative";
    region.layers.forEach((layerStr) => {
      if (isOutline(layerStr)) {
        const apertureIndex = getApertureIndex(0);

        outline.positive.traces.push({
          shapes,
          apertureIndex,
        });
        return;
      }

      const layer = getLayer(layerStr);
      layer[polarity].regions.push({
        shapes,
      });
    });
  });

  rawData.traces.forEach((trace) => {
    const shapes = polylineToLines(trace.track, false);
    const polarity = trace.polarity === "+" ? "positive" : "negative";
    const apertureIndex = getApertureIndex(trace.diameter);

    trace.layers.forEach((layerStr) => {
      const layer = getLayer(layerStr);
      layer[polarity].traces.push({
        shapes,
        apertureIndex,
      });
    });
  });

  rawData.routes.forEach((route) => {
    const [x, y] = route.track[0];

    drills.push({
      ...route,
      x,
      y,
    });
  });

  return {
    apertures,
    layers,
    outline,
    drills,
  };

  function getLayer(layerStr) {
    if (layerStr in layers) return layers[layerStr];

    layers[layerStr] = {
      positive: { regions: [], traces: [] },
      negative: { regions: [], traces: [] },
    };

    return layers[layerStr];
  }

  function getApertureIndex(diameter) {
    const index = apertures.indexOf(diameter);
    if (index === -1) {
      apertures.push(diameter);
      return apertures.length - 1;
    } else {
      return index;
    }
  }
}

function polylineToLines(polyline, closed = false) {
  const lines = [];
  if (!polyline || polyline.length < 2) return lines;

  for (let i = 0; i < polyline.length - 1; i++) {
    const start = polyline[i];
    const end = polyline[i + 1];

    if (
      !Array.isArray(start) ||
      start.length !== 2 ||
      !Array.isArray(end) ||
      end.length !== 2
    ) {
      console.warn("Invalid points in polyline:", start, end);
      continue;
    }

    lines.push({
      type: "line",
      start,
      end,
    });
  }

  if (closed && polyline.length > 1) {
    const firstPoint = polyline[0];
    const lastPoint = polyline[polyline.length - 1];
    if (
      Array.isArray(firstPoint) &&
      firstPoint.length === 2 &&
      Array.isArray(lastPoint) &&
      lastPoint.length === 2
    ) {
      if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
        lines.push({
          type: "line",
          start: lastPoint,
          end: firstPoint,
        });
      }
    }
  }

  return lines;
}

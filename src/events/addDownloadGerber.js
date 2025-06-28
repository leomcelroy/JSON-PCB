import { createListener } from "../utils/createListener";
import { processedBoardToGerberData } from "../gerber/downloadGerber";
import { downloadGerber } from "../gerber/downloadGerber";
import { scaleGerberModal } from "../modals/scaleGerberModal";

export function addDownloadGerber(el, state) {
  const listener = createListener(el);

  listener("click", "[download-gerber-btn], [download-gerber-btn] *", () => {
    clickDownloadBoardGerber(state);
  });
}

function clickDownloadBoardGerber(state) {
  const board = state.processedBoard;
  Object.entries(board.layers).forEach(([layer, layerData]) => {
    const { positive, negative } = layerData;

    positive.regions.forEach((region) => {
      region.shapes = polylineToLines(region.polyline, true);
    });
    positive.traces.forEach((trace) => {
      trace.shapes = polylineToLines(trace.polyline, false);
    });
    negative.regions.forEach((region) => {
      region.shapes = polylineToLines(region.polyline, true);
    });
    negative.traces.forEach((trace) => {
      trace.shapes = polylineToLines(trace.polyline, false);
    });
  });

  const bbox = board.boardBoundingBox;
  const currentWidth = bbox.xMax - bbox.xMin;
  const currentHeight = bbox.yMax - bbox.yMin;

  scaleGerberModal({
    currentWidth,
    currentHeight,
    outputUnitLabel: "mm",
    initialConversionFactor: 1.0,
    layerOrder: state.layerOrder,
    onDownload: ({ conversionFactor, filename }) => {
      const gerberData = processedBoardToGerberData(board);

      console.log({ gerberData, board });

      downloadGerber(gerberData, conversionFactor, filename);
    },
  });
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

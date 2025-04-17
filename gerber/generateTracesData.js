import { formatGerberCoordinate } from "./formatGerberCoordinate.js";
import { lineData } from "./lineData.js";
import { arcData } from "./arcData.js";

export function generateTracesData(traces, unitConversionFactor) {
  const gerberData = [];
  traces.forEach((trace) => {
    if (trace.shapes.length === 0) return;

    const dCode = 10 + trace.apertureIndex;
    gerberData.push(`D${dCode}*`);

    trace.shapes.forEach((shape, idx) => {
      if (idx === 0) {
        const xStart = formatGerberCoordinate(
          shape.start[0],
          unitConversionFactor,
        );
        const yStart = formatGerberCoordinate(
          shape.start[1],
          unitConversionFactor,
        );

        gerberData.push(`X${xStart}Y${yStart}D02*`);
      }

      if (shape.type === "line") {
        gerberData.push(...lineData(shape, unitConversionFactor));
      } else if (shape.type === "arc") {
        gerberData.push(...arcData(shape, unitConversionFactor));
      }
    });
  });

  return gerberData;
}

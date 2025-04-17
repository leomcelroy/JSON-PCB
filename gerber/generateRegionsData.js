import { formatGerberCoordinate } from "./formatGerberCoordinate.js";
import { lineData } from "./lineData.js";
import { arcData } from "./arcData.js";

export function generateRegionsData(regions, unitConversionFactor) {
  const gerberData = [];
  regions.forEach((region) => {
    region.shapes.forEach((shape, idx, arr) => {
      if (idx === 0) {
        gerberData.push("G36*");

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

      if (idx === arr.length - 1) gerberData.push("G37*");
    });
  });

  return gerberData;
}

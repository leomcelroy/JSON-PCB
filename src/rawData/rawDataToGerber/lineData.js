import { formatGerberCoordinate } from "./formatGerberCoordinate.js";

export function lineData(shape, unitConversionFactor) {
  const gerberData = [];

  const xStart = formatGerberCoordinate(shape.start[0], unitConversionFactor);
  const yStart = formatGerberCoordinate(shape.start[1], unitConversionFactor);
  const xEnd = formatGerberCoordinate(shape.end[0], unitConversionFactor);
  const yEnd = formatGerberCoordinate(shape.end[1], unitConversionFactor);

  gerberData.push(`G01*`);

  gerberData.push(`X${xEnd}Y${yEnd}D01*`);

  return gerberData;
}

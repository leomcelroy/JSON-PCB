import { formatGerberCoordinate } from "./formatGerberCoordinate.js";

export function arcData(shape, unitConversionFactor) {
  const gerberData = [];

  const xStart = formatGerberCoordinate(shape.start[0], unitConversionFactor);
  const yStart = formatGerberCoordinate(shape.start[1], unitConversionFactor);
  const xEnd = formatGerberCoordinate(shape.end[0], unitConversionFactor);
  const yEnd = formatGerberCoordinate(shape.end[1], unitConversionFactor);

  // The offset is (center - start), i.e. how far from the START point to the center
  const iOffset = shape.center[0] - shape.start[0];
  const jOffset = shape.center[1] - shape.start[1];

  const iGerber = formatGerberCoordinate(iOffset, unitConversionFactor);
  const jGerber = formatGerberCoordinate(jOffset, unitConversionFactor);

  // TODO: why negate
  // G02 = clockwise, G03 = counterclockwise
  const arcCommand = !shape.anticlockwise ? "G03*" : "G02*";
  gerberData.push(arcCommand);

  // Multi-quadrant arc
  gerberData.push("G75*");

  // Then draw the arc from start to end with I/J offsets (D01 = draw)
  gerberData.push(`X${xEnd}Y${yEnd}I${iGerber}J${jGerber}D01*`);

  return gerberData;
}

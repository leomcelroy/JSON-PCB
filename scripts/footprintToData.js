import { translateShapes } from "../shapeTransformations.js";
import { kicadParse } from "../kicadParse-1.js";
import { contourToShapes } from "../contourToShapes.js";
import { shapesToPathData } from "../renderShapesToSVG.js";
import { getShapesBoundingBox } from "../getShapesBoundingBox.js";

export function footprintToData(kicadMod) {
  const footprint = kicadParse(kicadMod);
  const allShapes = [];

  footprint.pads.forEach((pad) => {
    const pos = pad.position ?? [0, 0];

    pad?.traces?.forEach((trace) => {
      const shapes = contourToShapes(trace.contour).shapes;
      const translatedShapes = translateShapes(shapes, pos);
      trace.shapes = translatedShapes;
      trace.polarity = trace.polarity === undefined ? "+" : trace.polarity;

      allShapes.push(translatedShapes);
    });

    pad?.regions?.forEach((region) => {
      const shapes = contourToShapes(region.contour).shapes;
      const translatedShapes = translateShapes(shapes, pos);
      region.shapes = translatedShapes;
      region.polarity = region.polarity === undefined ? "+" : region.polarity;

      allShapes.push(translatedShapes);
    });
  });

  let d = "";
  allShapes.forEach((shapes) => {
    d += shapesToPathData(shapes);
  });

  const pathData = d;
  const boundingBox = getShapesBoundingBox(allShapes.flat());

  return { pathData, boundingBox };
}

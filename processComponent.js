import {
  translateShapes,
  rotateShapes,
  flipShapes,
} from "./shapeTransformations.js";
import { getShapesBoundingBox } from "./getShapesBoundingBox.js";
import { shapesToPathData } from "./renderShapesToSVG.js";

export function processComponent(comp, board) {
  const footprint = board.footprints.find((fp) => fp.id === comp.footprint);

  if (footprint === undefined) {
    console.log("component missing footprint", comp);
    return comp;
  }

  const translate = comp.translate ?? [0, 0];
  const rotate = comp.rotate ?? 0;
  const flip = comp.flip ?? false;

  const pads = [];
  const compBoundingBox = {
    xMin: Infinity,
    xMax: -Infinity,
    yMin: Infinity,
    yMax: -Infinity,
  };

  footprint.pads.forEach((pad) => {
    const newPad = {};

    const traces = [];
    const shapesForBoundingBox = [];

    pad?.traces?.forEach((trace) => {
      const shapes = trace.shapes;
      const newShapes = pipe(
        shapes,
        (x) => (flip ? flipShapes(x, "horizontal") : x),
        (x) => translateShapes(x, translate),
        (x) => rotateShapes(x, rotate, translate),
      );

      shapesForBoundingBox.push(...newShapes);

      const newTrace = { ...trace };
      newTrace.track = copy(trace.track);
      newTrace.shapes = newShapes;
      newTrace.pathData = shapesToPathData(newShapes);
      const layer = newTrace.layer;

      traces.push({
        ...newTrace,
        layer: flip ? swapFB(layer) : layer,
      });
    });

    const regions = [];
    pad?.regions?.forEach((region) => {
      const shapes = region.shapes;
      const newShapes = pipe(
        shapes,
        (x) => (flip ? flipShapes(x, "horizontal") : x),
        (x) => translateShapes(x, translate),
        (x) => rotateShapes(x, rotate, translate),
      );

      shapesForBoundingBox.push(...newShapes);

      const newRegion = { ...region };
      newRegion.contour = copy(region.contour);
      newRegion.shapes = newShapes;
      newRegion.pathData = shapesToPathData(newShapes);
      const layer = newRegion.layer;
      regions.push({
        ...newRegion,
        layer: flip ? swapFB(layer) : layer,
      });
    });

    newPad.traces = traces;
    newPad.regions = regions;

    const padBBox = getShapesBoundingBox(shapesForBoundingBox);

    if (padBBox.xMin < compBoundingBox.xMin)
      compBoundingBox.xMin = padBBox.xMin;
    if (padBBox.xMax > compBoundingBox.xMax)
      compBoundingBox.xMax = padBBox.xMax;
    if (padBBox.yMin < compBoundingBox.yMin)
      compBoundingBox.yMin = padBBox.yMin;
    if (padBBox.yMax > compBoundingBox.yMax)
      compBoundingBox.yMax = padBBox.yMax;

    newPad.boundingBox = padBBox;

    newPad.position = [
      (padBBox.xMin + padBBox.xMax) / 2,
      (padBBox.yMin + padBBox.yMax) / 2,
    ];

    newPad.id = pad.id;

    if (pad.drill) newPad.drill = pad.drill;

    pads.push(newPad);
  });

  comp.pads = pads;
  comp.boundingBox = compBoundingBox;
  comp.translate = translate;

  return comp;
}

function swapFB(inputString) {
  const result = inputString
    .replace(/F\./g, "TEMP")
    .replace(/B\./g, "F.")
    .replace(/TEMP/g, "B.");
  return result;
}

function pipe(initialValue, ...fns) {
  return fns.reduce((value, fn) => fn(value), initialValue);
}

function copy(json) {
  return JSON.parse(JSON.stringify(json));
}

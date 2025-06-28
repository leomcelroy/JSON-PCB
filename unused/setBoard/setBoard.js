import {
  translateShapes,
  rotateShapes,
  flipShapes,
  translatePoint,
  rotatePoint,
  flipPoint,
  translateBoundingBox,
  rotateBoundingBox,
  flipBoundingBox,
} from "../shapeTransformations.js";
import { getShapesBoundingBox } from "../boardHelpers/getShapesBoundingBox.js";
import { getBoardBoundingBox } from "../boardHelpers/getBoardBoundingBox.js";
import { processComponent } from "./processComponent.js";
import { getLayers } from "../boardHelpers/getLayers.js";
import { contourToShapes } from "../contourToShapes/contourToShapes.js";
import { shapesToPathData } from "../../unused/dom/renderShapesToSVG.js";
import { reorderList } from "./reorderList.js";
import { getHoverablePaths } from "./getHoverablePaths.js";

export function setBoard(newBoard) {
  /* PROCESS FOOTPRINTS */

  // console.time("SET BOARD");

  newBoard.footprints.forEach((footprint) => {
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

    footprint.pathData = d;
    footprint.boundingBox = getShapesBoundingBox(allShapes.flat());
  });

  /* PROCESS COMPONENTS */

  newBoard.components.forEach((comp) => processComponent(comp, newBoard));

  /* PROCESS REGIONS */

  newBoard?.regions?.forEach((region) => {
    const shapes = contourToShapes(region.contour).shapes;
    region.pathData = shapesToPathData(shapes);
    region.shapes = shapes;
    region.polarity = region.polarity === undefined ? "+" : region.polarity;
  });

  /* PROCESS TRACES */

  newBoard?.traces?.forEach((trace) => {
    const shapes = contourToShapes(trace.track).shapes;
    trace.pathData = shapesToPathData(shapes);
    trace.shapes = shapes;
    trace.polarity = trace.polarity === undefined ? "+" : trace.polarity;
  });

  /* BOUNDING BOX */

  newBoard.boundingBox = getBoardBoundingBox(newBoard);

  /* PROCESS LAYERS */

  STATE.layers = getLayers(newBoard);
  const oldLayers = STATE.layerOrder;
  const newLayers = Object.keys(STATE.layers);

  const MINIMUM_LAYERS = ["F.Cu", "B.Cu", "outline"];

  MINIMUM_LAYERS.forEach((l) => {
    if (newLayers.includes(l)) return;

    newLayers.push(l);
  });

  newLayers.forEach((layer) => {
    if (!(layer in STATE.colorMap)) {
      STATE.colorMap[layer] = "#000000ff";
    }
  });

  STATE.layerOrder = reorderList(newLayers, oldLayers);

  /* PROCESS HOVERABLE PATHS */

  STATE.hoverablePaths = getHoverablePaths(newBoard);

  /* RENDER */

  STATE.board = newBoard;

  // console.timeEnd("SET BOARD");

  render(STATE);
}

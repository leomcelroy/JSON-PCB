import { html, svg, render as r } from "lit-html";
import { testPCB } from "./testPCB.js";
import { getLayers } from "./getLayers.js";
import { contourToShapes } from "./contourToShapes.js";
import { shapesToPathData } from "./renderShapesToSVG.js";

import { view } from "./view.js";
import {
  translateShapes,
  rotateShapes,
  flipShapes,
  translatePoint,
  rotatePoint,
  flipPoint,
} from "./shapeTransformations.js";
import { getShapesBoundingBox } from "./getShapesBoundingBox.js";

export const STATE = {
  colorMap: {
    "F.Cu": "#0000ffff",
    "B.Cu": "#ff0000ff",
  },
  layerOrder: ["F.Cu", "B.Cu"],
  layerNotVisible: new Set(),
  board: null,
  layers: null,
  hoverablePaths: { regions: [], traces: [] },
  editPath: {
    editing: false,
    data: null,
    editMode: "SELECT",
    selectedPoints: new Set(),
  },
  editModal: {
    open: false,
    type: "", // "components", "traces", "regions"
    id: null, // index or string
  },
  panZoomFns: null,
  heldKeys: new Set(),
};

window.STATE = STATE;

export function setBoard(newBoard) {
  STATE.board = newBoard;

  /* PROCESS FOOTPRINTS */

  newBoard.footprints.forEach((footprint) => {
    const allShapes = [];

    footprint.pads.forEach((pad) => {
      const pos = pad.position;

      pad.traces.forEach((trace) => {
        const shapes = contourToShapes(trace.contour).shapes;
        const translatedShapes = translateShapes(shapes, pos);
        trace.shapes = translatedShapes;

        allShapes.push(translatedShapes);
      });

      pad.regions.forEach((region) => {
        const shapes = contourToShapes(region.contour).shapes;
        const translatedShapes = translateShapes(shapes, pos);
        region.shapes = translatedShapes;

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

  newBoard.components.forEach((comp) => {
    const footprint = newBoard.footprints.find(
      (fp) => fp.id === comp.footprint,
    );

    if (footprint === undefined) {
      console.log("component missing footprint", comp);
      return;
    }

    const translate = comp.translate ?? [0, 0];
    const rotate = comp.rotate ?? 0;
    const flip = comp.flip ?? false;

    const pads = [];
    const componentBoundingBox = {
      xMin: Infinity,
      xMax: -Infinity,
      yMin: Infinity,
      yMax: -Infinity,
    };

    footprint.pads.forEach((pad) => {
      const newPad = {};

      const traces = [];
      const shapesForBoundingBox = [];

      pad.traces.forEach((trace) => {
        const shapes = trace.shapes;
        const newShapes = pipe(
          shapes,
          (x) => (flip ? flipShapes(x, "horizontal") : x),
          (x) => translateShapes(x, translate),
          (x) => rotateShapes(x, rotate, translate),
        );

        shapesForBoundingBox.push(...newShapes);

        const newTrace = copy(trace);
        newTrace.shapes = newShapes;

        pad.layers.forEach((layer) => {
          traces.push({
            ...newTrace,
            layer: flip ? swapFB(layer) : layer,
          });
        });
      });

      const regions = [];
      pad.regions.forEach((region) => {
        const shapes = region.shapes;
        const newShapes = pipe(
          shapes,
          (x) => (flip ? flipShapes(x, "horizontal") : x),
          (x) => translateShapes(x, translate),
          (x) => rotateShapes(x, rotate, translate),
        );

        shapesForBoundingBox.push(...newShapes);

        const newRegion = copy(region);
        newRegion.shapes = newShapes;

        pad.layers.forEach((layer) => {
          regions.push({
            ...newRegion,
            layer: flip ? swapFB(layer) : layer,
          });
        });
      });

      newPad.traces = traces;
      newPad.regions = regions;

      const padBBox = getShapesBoundingBox(shapesForBoundingBox);

      newPad.position = [
        (padBBox.xMin + padBBox.xMax) / 2,
        (padBBox.yMin + padBBox.yMax) / 2,
      ];

      newPad.id = pad.id;

      pads.push(newPad);
    });

    comp.pads = pads;
    comp.boundingBox = componentBoundingBox;
    comp.translate = translate;
  });

  /* PROCESS REGIONS */

  newBoard.regions.forEach((region) => {
    const shapes = contourToShapes(region.contour).shapes;
    region.shapes = shapes;
  });

  /* PROCESS TRACES */

  newBoard.traces.forEach((trace) => {
    const shapes = contourToShapes(trace.track).shapes;
    trace.shapes = shapes;
  });

  /* PROCESS LAYERS */

  STATE.layers = getLayers(newBoard);

  /* PROCESS HOVERABLE PATHS */

  STATE.hoverablePaths = getHoverablePaths(newBoard);

  /* RENDER */

  render(STATE);
}

export function patchState(fn = null) {
  if (fn) fn(STATE);

  render(STATE);
}

function render(state) {
  window.requestAnimationFrame(() => {
    r(view(state), document.body);
  });
}

function getHoverablePaths(board) {
  let hoverablePaths = { regions: [], traces: [] };

  board.traces.forEach((trace, i) => {
    hoverablePaths.traces.push({
      shapes: trace.shapes,
      type: "traces",
      index: i,
    });
  });

  board.regions.forEach((region, i) => {
    hoverablePaths.regions.push({
      shapes: region.shapes,
      type: "regions",
      index: i,
    });
  });

  return hoverablePaths;
}

function copy(json) {
  return JSON.parse(JSON.stringify(json));
}

function pipe(initialValue, ...fns) {
  return fns.reduce((value, fn) => fn(value), initialValue);
}

function swapFB(inputString) {
  const result = inputString
    .replace(/F\./g, "TEMP")
    .replace(/B\./g, "F.")
    .replace(/TEMP/g, "B.");
  return result;
}

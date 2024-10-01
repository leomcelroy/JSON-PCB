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
  translateBoundingBox,
  rotateBoundingBox,
  flipBoundingBox,
} from "./shapeTransformations.js";
import { getShapesBoundingBox } from "./getShapesBoundingBox.js";
import { getBoardBoundingBox } from "./getBoardBoundingBox.js";

export const STATE = {
  colorMap: {
    "F.Cu": "#0000ffff",
    "B.Cu": "#ff0000ff",
  },
  layerOrder: [],
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
  currentPoint: [0, 0],
  lastPoint: null,
  PROGRAM_SCALE: 1,
};

window.STATE = STATE;

export function setBoard(newBoard) {
  /* PROCESS FOOTPRINTS */

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
      pad?.regions?.forEach((region) => {
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

      newPad.drill = pad.drill;

      pads.push(newPad);
    });

    comp.pads = pads;
    comp.boundingBox = compBoundingBox;
    // comp.boundingBox = pipe(
    //   footprint.boundingBox,
    //   (x) => (flip ? flipBoundingBox(x, "horizontal") : x),
    //   (x) => translateBoundingBox(x, translate),
    //   (x) => rotateBoundingBox(x, rotate, translate),
    // );
    // console.log(footprint.boundingBox, comp.boundingBox);
    comp.translate = translate;
  });

  /* PROCESS REGIONS */

  newBoard?.regions?.forEach((region) => {
    const shapes = contourToShapes(region.contour).shapes;
    region.shapes = shapes;
    region.polarity = region.polarity === undefined ? "+" : region.polarity;
  });

  /* PROCESS TRACES */

  newBoard?.traces?.forEach((trace) => {
    const shapes = contourToShapes(trace.track).shapes;
    trace.shapes = shapes;
    trace.polarity = trace.polarity === undefined ? "+" : trace.polarity;
  });

  /* BOUNDING BOX */

  newBoard.boundingBox = getBoardBoundingBox(newBoard);

  /* PROCESS LAYERS */

  STATE.layers = getLayers(newBoard);
  const oldLayers = STATE.layerOrder;
  const newLayers = Object.keys(STATE.layers);

  // TODO: try to match current layer order

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

function reorderList(list1, list2) {
  // Create a Map to store indices of elements in list2
  const orderMap = new Map(list2.map((item, index) => [item, index]));

  // Sort list1 based on the order in list2
  const sortedList = [...list1].sort((a, b) => {
    const indexA = orderMap.has(a) ? orderMap.get(a) : Infinity;
    const indexB = orderMap.has(b) ? orderMap.get(b) : Infinity;
    return indexA - indexB;
  });

  // Add items from list2 that are not in list1
  const result = [
    ...sortedList,
    ...list2.filter((item) => !list1.includes(item)),
  ];

  return result;
}

/* SET JSON */

//   const editor = document.querySelector(".code-editor");

//   const view = editor.cm;

//   const newText = JSON.stringify(
//     newBoard,
//     (key, value) => {
//       if (key === "shapes") return undefined;
//       if (key === "boundingBox") return undefined;
//       if (key === "pathData") return undefined;

//       return value;
//     },
//     2,
//   );

//   console.time();
//   setContent(view, newText);
//   console.timeEnd();

// function setContent(view, newContent) {
//   view.dispatch({
//     changes: { from: 0, to: view.state.doc.length, insert: newContent },
//   });
// }

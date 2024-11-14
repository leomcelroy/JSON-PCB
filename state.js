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
import { drawLayer } from "./drawLayer.js";
import { drawComponents } from "./drawComponents.js";
import { processComponent } from "./processComponent.js";

export const STATE = {
  colorMap: {
    "F.Cu": "#f7a614ff",
    "B.Cu": "#ff0000ff",
    outline: "#1f6f1eff",
    "F.Mask": "#000000ff",
    "B.Mask": "#000000ff",
    "F.Paste": "#000000ff",
  },
  layerOrder: ["F.Cu", "B.Cu", "outline", "F.Mask", "B.Mask", "F.Paste"],
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

export function patchState(fn = null) {
  if (fn) fn(STATE);

  render(STATE);
}

export const renderLoop = () => {
  requestAnimationFrame(renderLoop);
  renderToCanvas(STATE);
};

function render(state) {
  window.requestAnimationFrame(() => {
    r(view(state), document.body);

    // render canvas
    // renderToCanvas(state);
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

function removeExtraData(key, value) {
  if (key === "shapes") return undefined;
  if (key === "boundingBox") return undefined;
  if (key === "pathData") return undefined;

  return value;
}

function strBoard(board) {
  return JSON.stringify(board, removeExtraData);
}

function renderToCanvas(state) {
  const canvas = document.querySelector(".workarea-canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const { layers, colorMap, layerOrder, layerNotVisible, panZoomFns, board } =
    state;

  if (layers) {
    // Sort layers based on the order in layerOrder string
    Object.entries(layers)
      .sort(([layerA], [layerB]) => {
        const indexA = layerOrder.indexOf(layerA);
        const indexB = layerOrder.indexOf(layerB);
        return indexB - indexA;
      })
      .forEach(([layer, tracesRegions]) => {
        if (layerNotVisible.has(layer)) return;
        drawLayer({
          tracesRegions,
          color: colorMap[layer],
          tempCanvas: document.querySelector(".workarea-canvas-temp"),
          canvas,
          scale: panZoomFns.scale(),
          x: panZoomFns.x(),
          y: panZoomFns.y(),
        });
      });

    drawComponents({
      state,
      components: board.components,
      colorMap,
      tempCanvas: document.querySelector(".workarea-canvas-temp"),
      canvas,
      scale: panZoomFns.scale(),
      x: panZoomFns.x(),
      y: panZoomFns.y(),
    });
  }
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

import { html, svg, render as r } from "lit-html";
import { drawRawDataToCanvas } from "./rawData/drawRawDataToCanvas.js";

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
  show: {
    handles: false,
    componentLabels: false,
    padLabels: false,
  },
  rawData: {
    layers: [], // Map(layerName, { positive: [], negative: [] })
    regions: [],
    traces: [],
    routes: [],
  },
};

window.STATE = STATE;

export function patchState(fn = null) {
  if (fn) fn(STATE);

  render(STATE);
}

function render(state) {
  window.requestAnimationFrame(() => {
    r(view(state), document.body);
    drawRawDataToCanvas(STATE);
  });
}

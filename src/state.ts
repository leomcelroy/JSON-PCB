import { html, svg, render as r } from "lit-html";
import { drawBoard } from "./canvas/drawBoard.js";
import { view } from "./views/view.js";
import { Board } from "./types/Board.js";
import { ProcessedBoard } from "./types/ProcessedBoard.js";

export type State = {
  colorMap: Record<string, string>;
  layerOrder: string[];
  layerNotVisible: Set<string>;
  board: Board | null;
  processedBoard: ProcessedBoard | null;
  selectedComponents: Set<string>;
  selectedPaths: Set<string>;
  panZoomFns: any;
  heldKeys: Set<string>;
  codePanel: "board" | "script";
  currentPoint: [number, number];
  script: string;
  // lastPoint: [number, number] | null;
  show: {
    handles: boolean;
    componentLabels: boolean;
    padLabels: boolean;
  };
};

export const STATE: State = {
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
  processedBoard: null,
  selectedComponents: new Set(),
  selectedPaths: new Set(),
  codePanel: "board",
  script: "setBoard(board);",
  // layers: null,
  // hoverablePaths: { regions: [], traces: [] },
  // editPath: {
  //   editing: false,
  //   data: null,
  //   editMode: "SELECT",
  //   selectedPoints: new Set(),
  // },
  // editModal: {
  //   open: false,
  //   type: "", // "components", "traces", "regions"
  //   id: null, // index or string
  // },
  panZoomFns: null,
  heldKeys: new Set(),
  currentPoint: [0, 0],
  // lastPoint: null,
  show: {
    handles: true,
    componentLabels: true,
    padLabels: true,
  },
  // rawData: {
  //   layers: [], // Map(layerName, { positive: [], negative: [] })
  //   regions: [],
  //   traces: [],
  //   routes: [],
  // },
};

export function patchState(fn: (state: State) => void | undefined) {
  if (fn) fn(STATE);

  render();
}

export function render() {
  window.requestAnimationFrame(() => {
    r(view(STATE), document.body);
    drawBoard(STATE);
  });
}

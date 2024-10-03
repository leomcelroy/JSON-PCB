import { STATE, setBoard, patchState, renderLoop } from "./state.js";
import { addPanZoom } from "./addPanZoom.js";
import { addPointDragging } from "./addPointDragging.js";
import { addComponentDragging } from "./addComponentDragging.js";
import { addComponentAdding } from "./addComponentAdding.js";
import { addLayerReordering } from "./addLayerReordering.js";
import { addPathCreation } from "./addPathCreation.js";
import { addDropUpload } from "./addDropUpload.js";

import { initCodeEditor } from "./initCodeEditor.js";

import { view } from "./view.js";
import { render as r } from "lit-html";
import { testPCB } from "./testPCB.js";
import { contourToShapes } from "./contourToShapes.js";
import { kicadParse } from "./kicadParse-1.js";

function init(state) {
  // render app immediately
  r(view(state), document.body);

  resizeCanvas();
  renderLoop();

  const svg = document.querySelector(".workarea-svg");

  addPointDragging(svg);
  addComponentDragging(svg);
  addPathCreation(svg);
  addComponentAdding(document.body);
  addLayerReordering(document.body);
  addDropUpload(document.body, {
    onDrop: ({ name, text }) => {
      console.log(name, text);

      const extension = name.split(".").at(-1);
      if (extension === "kicad_mod") {
        const sParsed = kicadParse(text);

        const oldBoard = state.board;
        const newBoard = oldBoard.footprints.push(sParsed);
        setBoard(state.board);
      }

      if (extension === "json") {
        setBoard(JSON.parse(text));
      }
    },
  });

  const panZoomFns = addPanZoom(svg);

  svg.panZoomFns = panZoomFns;
  state.panZoomFns = panZoomFns;

  setBoard(JSON.parse(JSON.stringify(testPCB)));

  const board = state.board;
  const boundingBox = board.boundingBox;

  svg.panZoomFns.setScaleXY({
    x: [boundingBox.xMin, boundingBox.xMax],
    y: [boundingBox.yMin, boundingBox.yMax],
  });

  window.addEventListener("keydown", (e) => {
    state.heldKeys.add(e.key);

    if (e.key === "Backspace") {
      if (e.target.matches("input")) return;
      const deleteBtn = document.querySelector(".delete-button");
      if (deleteBtn) deleteBtn.click();
    }

    if (e.metaKey && e.key === "a") {
      document.querySelector("[add-trace-btn]").click();
      e.preventDefault();
    }
  });

  window.addEventListener("keyup", (e) => {
    state.heldKeys.delete(e.key);
  });

  const listenSVG = createListener(svg);
  const listenBody = createListener(document.body);

  listenSVG("mousedown", ".hoverable-path", (e) => {
    const type = e.target.dataset.type;
    const index = Number(e.target.dataset.index);
    const traceOrRegion = state.board[type][index];
    const trackOrContour = traceOrRegion.track || traceOrRegion.contour;
    const trackOrContourData = contourToShapes(trackOrContour);

    patchState((s) => {
      s.editPath = {
        editing: true,
        data: {
          type,
          index,
          trackOrContourData,
        },
        editMode: "SELECT",
        selectedPoints: new Set(),
      };

      s.editModal = {
        open: true,
        type,
        id: index,
      };
    });
  });

  listenBody(
    "mousedown",
    "[footprint-delete-btn], [footprint-delete-btn] *",
    (e) => {
      const btn = e.target.closest("[footprint-delete-btn]");
      const id = btn.footprintId;

      if (state.board.components.some((comp) => comp.footprint === id)) {
        alert("Can't delete footprint which is in use.");
        return;
      }

      patchState((s) => {
        s.board.footprints = s.board.footprints.filter((x) => x.id !== id);
        setBoard(s.board);
      });
    },
  );

  listenBody("mousedown", "[footprint-id-btn]", (e) => {
    const newId = prompt("Please provide a new footprint ID.");
    if (!newId || newId === "") return;

    // TODO: add validation

    const currentId = e.target.dataset.id;

    const footprint = state.board.footprints.find((x) => x.id === currentId);
    footprint.id = newId;

    setBoard(state.board);
  });
}

const trigger = (e) => e.composedPath()[0];
const matchesTrigger = (e, selectorString) =>
  trigger(e).matches(selectorString);
// create on listener
const createListener = (target) => (eventName, selectorString, event) => {
  // focus doesn't work with this, focus doesn't bubble, need focusin
  target.addEventListener(eventName, (e) => {
    e.trigger = trigger(e); // Do I need this? e.target seems to work in many (all?) cases
    if (selectorString === "" || matchesTrigger(e, selectorString)) event(e);
  });
};

window.addEventListener("DOMContentLoaded", (e) => {
  init(STATE);
});

function resizeCanvas() {
  const canvas = document.querySelector(".workarea-canvas");
  const canvasBB = canvas.getBoundingClientRect();
  canvas.width = canvasBB.width;
  canvas.height = canvasBB.height;
  patchState();
}

window.addEventListener("resize", resizeCanvas);

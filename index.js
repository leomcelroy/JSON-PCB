import { STATE, setBoard, patchState } from "./state.js";
import { addPanZoom } from "./addPanZoom.js";
import { addPointDragging } from "./addPointDragging.js";
import { addComponentDragging } from "./addComponentDragging.js";
import { addComponentAdding } from "./addComponentAdding.js";
import { addLayerReordering } from "./addLayerReordering.js";
import { addPathCreation } from "./addPathCreation.js";
import { initCodeEditor } from "./initCodeEditor.js";

import { view } from "./view.js";
import { render as r } from "lit-html";
import { testPCB } from "./testPCB.js";
import { contourToShapes } from "./contourToShapes.js";

function init(state) {
  // render app immediately
  r(view(state), document.body);

  const svg = document.querySelector(".workarea-svg");

  addPointDragging(svg);
  addComponentDragging(svg);
  addPathCreation(svg);
  addComponentAdding(document.body);
  addLayerReordering(document.body);

  // initCodeEditor(document.querySelector(".code-editor"));

  const panZoomFns = addPanZoom(svg);

  svg.panZoomFns = panZoomFns;
  state.panZoomFns = panZoomFns;

  setBoard(testPCB);

  window.addEventListener("keydown", (e) => {
    state.heldKeys.add(e.key);
  });

  window.addEventListener("keyup", (e) => {
    state.heldKeys.delete(e.key);
  });

  const listenSVG = createListener(svg);
  const listenBody = createListener(document.body);

  listenSVG("mousedown", ".hoverable-path", (e) => {
    const type = e.target.type;
    const index = e.target.index;
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

  listenBody("mousedown", "[footprint-delete-btn]", (e) => {
    const id = e.target.footprintId;

    patchState((s) => {
      s.board.footprints = s.board.footprints.filter((x) => x.id !== id);
      setBoard(s.board);
    });
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

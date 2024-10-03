import { patchState, setBoard } from "./state.js";
import { processComponent } from "./processComponent.js";
import { getLayers } from "./getLayers.js";

function round(num, ops = {}) {
  const decimalPlaces = ops.decimalPlaces ?? 2;

  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}

export function addComponentDragging(el) {
  function getPoint(e) {
    let rect = el.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    return el.panZoomFns.getPoint(x, y);
  }

  const listener = createListener(el);

  let dragging = false;
  let mousedownPoint = [0, 0];
  let clickedId = "";

  listener("mousedown", "[component-control-pt]", (e) => {
    mousedownPoint = getPoint(e);

    clickedId = e.target.dataset.componentId;

    patchState((s) => {
      s.editPath.editing = false;
      s.editModal = {
        open: true,
        type: "components",
        id: clickedId,
      };
    });

    dragging = true;
    el.panZoomFns.togglePanZoom(true);
  });

  listener("mousemove", "", (e) => {
    if (dragging === false) return;

    let currentPoint = getPoint(e);

    patchState((s) => {
      const comp = s.board.components.find((x) => x.id === clickedId);
      comp.translate = currentPoint.map(round);

      // is there a way to do less here
      // i need to update the component
      // and the bounding box of the component
      // and layers
      // setBoard(s.board);
      const newComp = processComponent(comp, s.board);
      const index = s.board.components.findIndex((x) => x.id === clickedId);
      s.board.components[index] = newComp;
      s.layers = getLayers(s.board);
    });
  });

  listener("mouseup", "", (e) => {
    if (dragging === false) return;

    let currentPoint = getPoint(e);
    const dx = currentPoint[0] - mousedownPoint[0];
    const dy = currentPoint[1] - mousedownPoint[1];

    if (dx < 5 && dy < 5) {
    }

    dragging = false;
    el.panZoomFns.togglePanZoom(false);
  });
}

const trigger = (e) => e.composedPath()[0];
const matchesTrigger = (e, selectorString) =>
  trigger(e).matches(selectorString);
const createListener = (target) => (eventName, selectorString, event) => {
  target.addEventListener(eventName, (e) => {
    if (selectorString === "" || matchesTrigger(e, selectorString)) event(e);
  });
};

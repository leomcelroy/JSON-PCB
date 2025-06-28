import { patchState } from "../state";
import { createListener } from "../utils/createListener";
import { setBoard } from "../setBoard";
import { round } from "../utils/round";

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
      s.selectedComponents = new Set([clickedId]);
    });

    dragging = true;
    el.panZoomFns.togglePanZoom(true);
  });

  listener("mousemove", "", (e) => {
    if (dragging === false) return;

    let currentPoint = getPoint(e);

    patchState((s) => {
      const comp = s.board.components.find((x) => x.id === clickedId);
      comp.position = currentPoint.map(round);
      setBoard(s.board);
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

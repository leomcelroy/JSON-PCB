import { patchState, STATE } from "../state.js";
import { contourToShapes } from "../contourToShapes/contourToShapes.js";
import { createListener } from "../utils/createListener.js";
import { suggestVH } from "../utils/suggestVH.js";
import { setBoard } from "../setBoard/setBoard.js";

export function addPathCreation(el) {
  function getPoint(e) {
    let rect = el.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    return el.panZoomFns.getPoint(x, y);
  }

  const listener = createListener(el);

  let currentPoint = [0, 0];

  let metaPressed = false;

  const isMetaPressed = () => metaPressed;

  const getTool = () => STATE.editPath.editMode;
  const selectedPoints = () => STATE.editPath.selectedPoints;

  window.addEventListener("keydown", (e) => {
    if (e.key === "Meta") {
      metaPressed = true;
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === "Meta") {
      metaPressed = false;
    }
  });

  listener("mousedown", "", (e) => {
    if (getTool() !== "DRAW") return;

    const { type, index } = STATE.editPath.data;
    const traceOrRegion = STATE.board[type][index];
    const trackOrContour =
      traceOrRegion[type === "traces" ? "track" : "contour"];

    const [x, y] = currentPoint;
    let closed = false;
    if (trackOrContour.length === 0) {
      trackOrContour.push(["start", x, y]);
    } else {
      const start = trackOrContour[0];
      const [_, startX, startY] = start;
      const dx = startX - x;
      const dy = startY - y;
      if (Math.sqrt(dx ** 2 + dy ** 2) < 10 / STATE?.panZoomFns?.scale()) {
        trackOrContour.push(["close"]);
        closed = true;
      } else {
        trackOrContour.push(["lineTo", x, y]);
      }
    }

    const newData = contourToShapes(trackOrContour);
    traceOrRegion.shapes = newData.shapes;

    patchState((s) => {
      if (closed) s.editPath.editMode = "SELECT";
      s.editPath.data.trackOrContourData = newData;
    });

    setBoard(STATE.board);
  });

  listener("mousemove", "", (e) => {
    if (getTool() !== "DRAW") return;
    currentPoint = getPoint(e);

    let controlPoints = null;
    if (STATE?.editPath?.data?.trackOrContourData) {
      controlPoints = STATE?.editPath?.data?.trackOrContourData.controlPoints;
    }

    if (!isMetaPressed() && controlPoints !== null)
      currentPoint = suggestVH(
        controlPoints,
        currentPoint,
        10 / STATE?.panZoomFns?.scale()
      );

    patchState((s) => {
      s.currentPoint = currentPoint;
      let lastPoint = null;
      if (s?.editPath?.data?.trackOrContourData) {
        const controlPoints =
          s?.editPath?.data?.trackOrContourData.controlPoints;
        if (controlPoints.length > 0) lastPoint = controlPoints.at(-1);
      }
      s.lastPoint = lastPoint;
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      patchState((s) => {
        s.editPath.editMode = "SELECT";
      });
    }
  });
}

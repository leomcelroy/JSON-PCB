import { patchState, STATE } from "../state.js";
import { setBoard } from "../setBoard/setBoard.js";
import { contourToShapes } from "../contourToShapes/contourToShapes.js";
import { createListener } from "../utils/createListener.js";
import { suggestVH } from "../utils/suggestVH.js";

export function addPointDragging(el) {
  function getPoint(e) {
    let rect = el.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    return el.panZoomFns.getPoint(x, y);
  }

  const listener = createListener(el);

  let dragging = false;
  let mousedownPoint = [0, 0];
  let clickedPtIdx = "";
  let ogControlPoints = null;
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

  listener("mousedown", "[path-control-point]", (e) => {
    if (getTool() !== "SELECT") return;

    const idx = Number(e.target.dataset.pointIdx);
    clickedPtIdx = idx;

    ogControlPoints = JSON.parse(
      JSON.stringify(STATE.editPath.data.trackOrContourData.controlPoints)
    );

    patchState((state) => {
      selectedPoints().add(idx);
    });

    dragging = e.detail === 1;
    if (dragging) el.panZoomFns.togglePanZoom(true);
    mousedownPoint = ogControlPoints[idx];
  });

  listener("mousedown", "", (e) => {
    if (getTool() !== "SELECT") return;
    if (e.target.matches("[path-control-point]")) return;

    if (e.detail === 2) {
      patchState((s) => {
        s.editPath.selectedPoints = new Set();
      });
    }
  });

  listener("mousemove", "", (e) => {
    if (dragging === false) return;

    const controlPoints = STATE.editPath.data.trackOrContourData.controlPoints;

    let currentPoint = getPoint(e);
    if (!isMetaPressed())
      currentPoint = suggestVH(
        controlPoints.filter((x, i) => !selectedPoints().has(i)),
        currentPoint,
        10 / STATE?.panZoomFns?.scale()
      );

    // const dx = round(currentPoint[0] - mousedownPoint[0]);
    // const dy = round(currentPoint[1] - mousedownPoint[1]);

    const dx = currentPoint[0] - mousedownPoint[0];
    const dy = currentPoint[1] - mousedownPoint[1];

    const { type, index } = STATE.editPath.data;
    const traceOrRegion = STATE.board[type][index];
    const trackOrContour =
      traceOrRegion[type === "traces" ? "track" : "contour"];
    selectedPoints().forEach((idx) => {
      const [cmd] = trackOrContour[idx];
      const [x, y] = ogControlPoints[idx];

      if (cmd.includes("start")) {
        trackOrContour[idx][0] = "start";
        trackOrContour[idx][1] = x + dx;
        trackOrContour[idx][2] = y + dy;
      }

      if (cmd.includes("line")) {
        trackOrContour[idx][0] = "lineTo";
        trackOrContour[idx][1] = x + dx;
        trackOrContour[idx][2] = y + dy;
      }

      if (cmd.includes("arc")) {
        trackOrContour[idx][0] = "arcTo";
        trackOrContour[idx][1] = x + dx;
        trackOrContour[idx][2] = y + dy;
      }
    });

    const newData = contourToShapes(trackOrContour);
    traceOrRegion.shapes = newData.shapes;

    patchState((s) => {
      s.editPath.data.trackOrContourData = newData;
    });

    patchState();
  });

  listener("mouseup", "", (e) => {
    if (dragging === false) return;

    setBoard(STATE.board);

    if (selectedPoints().size === 1) {
      patchState((state) => {
        state.editPath.selectedPoints = new Set();
      });
    }

    dragging = false;
    el.panZoomFns.togglePanZoom(false);
  });

  listener("mouseup", "[path-control-point]", (e) => {
    if (getTool() !== "SELECT") return;

    const idx = Number(e.target.dataset.pointIdx);

    const currentPoint = getPoint(e);

    const dx = currentPoint[0] - mousedownPoint[0];
    const dy = currentPoint[1] - mousedownPoint[1];

    if (dx ** 2 + dy ** 2 < 0.1 / STATE?.panZoomFns?.scale()) {
      selectedPoints().add(idx);
      if (e.detail === 2) selectedPoints().delete(idx);
      patchState();
    }
  });
}

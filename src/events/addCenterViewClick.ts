import { createListener } from "../utils/createListener";

export function addCenterViewClick(el, state) {
  const listener = createListener(el);

  listener("click", "[center-view-btn]", () => {
    const board = state.processedBoard;
    const boundingBox = board.boardBoundingBox;
    state.panZoomFns.setScaleXY({
      x: [boundingBox.xMin, boundingBox.xMax],
      y: [boundingBox.yMin, boundingBox.yMax],
    });
  });
}

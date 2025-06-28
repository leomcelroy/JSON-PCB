function addDefaultViewWindow(el) {
  const board = state.board;
  const boundingBox = board.boundingBox;

  if (boundingBox.xMin === Infinity) boundingBox.xMin = 0;
  if (boundingBox.xMax === -Infinity) boundingBox.xMax = 1;
  if (boundingBox.yMin === Infinity) boundingBox.yMin = 0;
  if (boundingBox.yMax === -Infinity) boundingBox.yMax = 1;

  panZoomFns.setScaleXY({
    x: [boundingBox.xMin, boundingBox.xMax],
    y: [boundingBox.yMin, boundingBox.yMax],
  });
}

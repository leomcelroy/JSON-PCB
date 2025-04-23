import { getShapesBoundingBox } from "./getShapesBoundingBox.js";

export function getBoardBoundingBox(board) {
  const boardBBox = {
    xMin: Infinity,
    xMax: -Infinity,
    yMin: Infinity,
    yMax: -Infinity,
  };

  board.components.forEach((comp) => {
    const compBoundingBox = comp.boundingBox;

    if (compBoundingBox.xMin < boardBBox.xMin)
      boardBBox.xMin = compBoundingBox.xMin;
    if (compBoundingBox.xMax > boardBBox.xMax)
      boardBBox.xMax = compBoundingBox.xMax;
    if (compBoundingBox.yMin < boardBBox.yMin)
      boardBBox.yMin = compBoundingBox.yMin;
    if (compBoundingBox.yMax > boardBBox.yMax)
      boardBBox.yMax = compBoundingBox.yMax;
  });

  const allShapes = [];

  board.traces.forEach((trace) => {
    allShapes.push(...trace.shapes);
  });

  board.regions.forEach((region) => {
    allShapes.push(...region.shapes);
  });

  const shapesBBox = getShapesBoundingBox(allShapes);

  if (shapesBBox.xMin < boardBBox.xMin) boardBBox.xMin = shapesBBox.xMin;
  if (shapesBBox.xMax > boardBBox.xMax) boardBBox.xMax = shapesBBox.xMax;
  if (shapesBBox.yMin < boardBBox.yMin) boardBBox.yMin = shapesBBox.yMin;
  if (shapesBBox.yMax > boardBBox.yMax) boardBBox.yMax = shapesBBox.yMax;

  return boardBBox;
}

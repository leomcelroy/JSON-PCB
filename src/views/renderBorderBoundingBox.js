import { svg } from "lit-html";

export function renderBoardBoundingBox(state) {
  if (!state.processedBoard) return "";

  const { xMin, xMax, yMin, yMax } = state.processedBoard.boardBoundingBox;
  const boxWidth = xMax - xMin;
  const boxHeight = yMax - yMin;

  return svg`
    <rect 
      x="${xMin}" 
      y="${-yMax}" 
      width="${boxWidth}" 
      height="${boxHeight}" 
      fill="none" 
      stroke="red" 
      vector-effect="non-scaling-stroke"
      stroke-dasharray="5, 5"/>
    `;
}

import { svg } from "lit-html";

export function renderTempLine(state) {
  if (state.editPath.editMode !== "DRAW") return;
  if (state.editPath.editing === false) return;
  if (state.currentPoint === null) return;

  const { currentPoint, lastPoint } = state;

  const result = [];

  if (lastPoint !== null) {
    result.push(svg`
      <line 
        x1="${lastPoint[0]}" 
        y1="${-lastPoint[1]}" 
        x2="${currentPoint[0]}" 
        y2="${-currentPoint[1]}" 
        stroke="black" 
        stroke-width="2"
        vector-effect="non-scaling-stroke"
        stroke-dasharray="5, 5" 
      />
    `);
  }

  result.push(svg`
    <circle 
      cx="${currentPoint[0]}" 
      cy="${-currentPoint[1]}" 
      r="${5 / (state?.panZoomFns?.scale() ?? 1)}" 
      fill="white"
      stroke="black"
      vector-effect="non-scaling-stroke"
      stroke-width="2"
    />
  `);

  return result;
}

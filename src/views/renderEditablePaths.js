import { svg } from "lit-html";
import { shapesToPathData } from "../shapesToPathData";

export function renderEditablePath(state) {
  if (state.selectedPaths.size !== 1) {
    return "";
  }

  const pathIndex = [...state.selectedPaths][0];

  const path = state.processedBoard.paths[pathIndex];

  // const type = pathKey[0];
  // const index = Number(pathKey[1]);

  const shapes = path.shapes;
  const controlPoints = path.controlPoints;

  // let d = shapesToPathData(shapes);

  let d = controlPoints.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x} ${y}`;
    return `${acc} L ${x} ${y}`;
  }, "");

  /*
    ?selected-control-pt=${state.editPath.selectedPoints.has(i)}
    data-pointIdx=${i}
    data-type=${type}
    data-index=${index}
  */

  const points = controlPoints.map(
    (pt, i) =>
      svg`<circle 
        path-control-point 
        r="${5 / (state?.panZoomFns?.scale() ?? 1)}" 
        cx=${pt[0]} 
        cy=${-pt[1]} 
        fill="white"
        stroke="black"
        vector-effect="non-scaling-stroke"
        stroke-width="2"
      />`
  );

  return svg`
    <path 
      d=${d} 
      stroke="black" 
      stroke-width="7" 
      vector-effect="non-scaling-stroke"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      fill="none" 
      transform="scale(1 -1)"
      />
    <path 
      d=${d} 
      stroke="white" 
      stroke-width="3" 
      vector-effect="non-scaling-stroke"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      fill="none" 
      transform="scale(1 -1)"
      />
    ${points}

  `;
}

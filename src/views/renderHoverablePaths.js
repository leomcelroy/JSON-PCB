import { svg } from "lit-html";
import { shapesToPathData } from "../shapesToPathData";

export function renderHoverablePaths(state) {
  if (!state?.processedBoard?.paths) return "";
  const view = [];

  state.processedBoard.paths.forEach((x) => {
    let d = shapesToPathData(x.shapes);

    // d = x.polyline.reduce((acc, [x, y], i) => {
    //   if (i === 0) return `M ${x} ${y}`;
    //   return `${acc} L ${x} ${y}`;
    // }, "");

    view.push(
      svg`<path 
        data-path-index=${x.index}
        data-path-key=${x.pathKey.join(",")}
        d=${d} 
        fill="none"
        stroke="#00000000" 
        stroke-width=${8 / (state?.panZoomFns?.scale() ?? 1)} 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        class="hoverable-path"
        data-type=${x.type}
        data-index=${x.index}
        transform="scale(1 -1)"
        />`
    );
  });

  return view;
}

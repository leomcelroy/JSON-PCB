import { renderShapesToSVG } from "./renderShapesToSVG.js";
import { svg } from "lit-html";

export function renderLayer(tracesRegions, layer, color) {
  const { positive, negative } = tracesRegions;

  const subject = [];
  const maskContent = [];

  // Build subject (positive shapes)
  positive.regions.forEach((x) => {
    const shapes = x.shapes;
    subject.push(renderShapesToSVG(shapes, { fill: color }));
  });

  positive.traces.forEach((trace) => {
    const shapes = trace.shapes;
    subject.push(
      renderShapesToSVG(shapes, {
        stroke: color,
        strokeWidth: trace.thickness,
      }),
    );
  });

  // Mask out the negative shapes by filling them with black
  negative.regions.forEach((x) => {
    const shapes = x.shapes;
    const newPath = renderShapesToSVG(shapes, { fill: "black" }); // Black will mask out this area
    maskContent.push(newPath);
  });

  negative.traces.forEach((trace) => {
    const shapes = trace.shapes;
    const newPath = renderShapesToSVG(shapes, {
      stroke: "black", // Black will mask out this area
      strokeWidth: trace.thickness,
    });
    maskContent.push(newPath);
  });

  return svg`
    <defs>
      <mask id="mask-${layer}">
        <use href="#bg-mask" />
        ${maskContent}
      </mask>
    </defs>
    <g mask="url(#mask-${layer})">
      ${subject}
    </g>
  `;
}

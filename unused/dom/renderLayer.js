import { renderShapesToSVG, renderPathDataToSVG } from "./renderShapesToSVG.js";
import { svg } from "lit-html";

export function renderLayer(tracesRegions, layer, color) {
  const { positive, negative } = tracesRegions;

  const subject = [];
  const maskContent = [];

  // Build subject (positive shapes)
  positive.regions.forEach((x) => {
    // const shapes = x.shapes;
    // subject.push(renderShapesToSVG(shapes, { fill: color }));

    subject.push(renderPathDataToSVG(x.pathData, { fill: color }));
  });

  positive.traces.forEach((x) => {
    // const shapes = trace.shapes;
    // subject.push(
    //   renderShapesToSVG(shapes, {
    //     stroke: color,
    //     strokeWidth: trace.thickness,
    //   }),
    // );

    subject.push(
      renderPathDataToSVG(x.pathData, {
        stroke: color,
        strokeWidth: x.thickness,
      })
    );
  });

  // Mask out the negative shapes by filling them with black
  negative.regions.forEach((x) => {
    // const shapes = x.shapes;
    // const newPath = renderShapesToSVG(shapes, { fill: "black" }); // Black will mask out this area
    // maskContent.push(newPath);
    maskContent.push(renderPathDataToSVG(x.pathData, { fill: "black" }));
  });

  negative.traces.forEach((trace) => {
    // const shapes = trace.shapes;
    // const newPath = renderShapesToSVG(shapes, {
    //   stroke: "black", // Black will mask out this area
    //   strokeWidth: trace.thickness,
    // });
    // maskContent.push(newPath);

    maskContent.push(
      renderPathDataToSVG(x.pathData, {
        stroke: "black",
        strokeWidth: x.thickness,
      })
    );
  });

  return svg`
    <defs>
      <mask id="mask-${layer}">
        <use href="#bg-mask" />
        ${maskContent}
      </mask>
    </defs>
    <g mask="url(#mask-${layer})" transform="scale(1 -1)">
      ${subject}
    </g>
  `;
}

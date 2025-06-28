import { html, svg } from "lit-html";

export function renderComponents(state) {
  const components = state?.processedBoard?.components;
  if (!components) return "";

  const scale = () => state?.panZoomFns?.scale() ?? 1;

  let result = [];

  components.forEach((component) => {
    const { id, position, boundingBox } = component;

    if (
      state.selectedComponents.has(id) &&
      state.selectedComponents.size === 1
    ) {
      const { xMin, xMax, yMin, yMax } = boundingBox;
      const boxWidth = xMax - xMin;
      const boxHeight = yMax - yMin;

      result.push(svg`
        <rect 
          x="${xMin}" 
          y="${-yMax}" 
          width="${boxWidth}" 
          height="${boxHeight}" 
          fill="none"
          stroke-width="7" 
          stroke="black" 
          vector-effect="non-scaling-stroke"
          stroke-dasharray="5, 5"/>
        <rect 
          x="${xMin}" 
          y="${-yMax}" 
          width="${boxWidth}" 
          height="${boxHeight}" 
          fill="none"
          stroke-width="3" 
          stroke="white" 
          vector-effect="non-scaling-stroke"
          stroke-dasharray="5, 5"/>
        `);
    }

    if (state.show.handles)
      result.push(svg`
      <circle 
        component-control-pt
        data-componentId=${id}
        cx="${position[0]}" 
        cy="${-position[1]}" 
        r="${5 / scale()}" 
        fill="white"
        stroke="black"
        vector-effect="non-scaling-stroke"
        stroke-width="2"
        />
    `);
  });

  return result;
}

import { html, svg } from "lit-html";

export function renderComponents(state) {
  const components = state?.board?.components;
  if (!components) return "";

  let result = [];

  components.forEach((component) => {
    const { id, translate, pads, boundingBox } = component;

    if (
      state?.editModal?.open &&
      state?.editModal?.type === "components" &&
      state?.editModal.id === id
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
          stroke="red" 
          vector-effect="non-scaling-stroke"
          stroke-dasharray="5, 5"/>
        `);
    }

    pads.forEach((pad) => {
      const { id: padId, position, drill } = pad;

      if (drill) {
        result.push(svg`
          <circle 
            cx="${position[0]}" 
            cy="${-position[1]}" 
            r=${drill ? drill.diameter / 2 : 0} 
            fill="white"/>
          `);
      }

      result.push(svg`
        <circle 
          class="hidden"
          cx="${position[0]}" 
          cy="${-position[1]}" 
          r="${5 / (state?.panZoomFns?.scale() ?? 1)}" 
          fill="red"/>
        <text 
          x="${position[0]}" 
          y="${-position[1]}" 
          font-size="${13 / (state?.panZoomFns?.scale() ?? 1)}" 
          fill="lightgreen"
          opacity=".95"
          stroke="black" 
          stroke-width="${0.5 / (state?.panZoomFns?.scale() ?? 1)}"
          text-anchor="middle"
          dominant-baseline="middle">${padId}</text>
      `);
    });

    result.push(svg`
      <circle 
        component-control-pt
        .componentId=${id}
        cx="${translate[0]}" 
        cy="${-translate[1]}" 
        r="${5 / (state?.panZoomFns?.scale() ?? 1)}" 
        fill="black"/>
      <text 
        x="${translate[0]}" 
        y="${-(translate[1] + 15 / (state?.panZoomFns?.scale() ?? 1))}" 
        font-size="${12 / (state?.panZoomFns?.scale() ?? 1)}" 
        fill="black"
        text-anchor="middle"
        dominant-baseline="middle">${id}</text>
    `);
  });

  return result;
}

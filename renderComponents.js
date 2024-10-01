import { html, svg } from "lit-html";

export function renderComponents(state) {
  const components = state?.board?.components;
  if (!components) return "";

  let result = [];

  components.forEach((component) => {
    const { id, translate, pads } = component;

    result.push(svg`
      <circle 
        component-control-pt
        .componentId=${id}
        cx="${translate[0]}" 
        cy="${translate[1]}" 
        r="5" 
        fill="black"/>
      <text 
        x="${translate[0]}" 
        y="${translate[1] - 15}" 
        font-size="12" 
        fill="black"
        text-anchor="middle"
        dominant-baseline="middle">${id}</text>
    `);

    pads.forEach((pad) => {
      const { id: padId, position, drill } = pad;

      result.push(svg`
        <circle 
          class="hidden"
          cx="${position[0]}" 
          cy="${position[1]}" 
          r="5" 
          fill="red"/>
        <circle 
          cx="${position[0]}" 
          cy="${position[1]}" 
          r=${drill ? drill.diameter / 2 : 0} 
          fill="white"/>
        <text 
          x="${position[0]}" 
          y="${position[1]}" 
          font-size="13" 
          fill="lightgreen"
          opacity=".95"
          stroke="black" 
          stroke-width=".5"
          text-anchor="middle"
          dominant-baseline="middle">${padId}</text>
      `);
    });
  });

  return result;
}

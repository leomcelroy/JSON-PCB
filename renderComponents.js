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
      const { id: padId, position } = pad;

      result.push(svg`
        <circle 
          class="hidden"
          cx="${position[0]}" 
          cy="${position[1]}" 
          r="5" 
          fill="red"/>
        <text 
          x="${position[0]}" 
          y="${position[1]}" 
          font-size="12" 
          fill="yellow"
          text-anchor="middle"
          dominant-baseline="middle">${padId}</text>
      `);
    });
  });

  return result;
}

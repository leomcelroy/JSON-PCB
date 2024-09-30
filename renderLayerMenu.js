import { html } from "lit-html";
import { patchState } from "./state.js";

export function renderLayerMenu(state) {
  const { colorMap, layerOrder, layerNotVisible } = state;

  const renderLayerItem = (layer, i) => {
    const visible = !layerNotVisible.has(layer);
    const color = colorMap[layer];

    const onColorChange = (e) => {
      colorMap[layer] = e.detail.value;

      // TODO: some bug with how this updates
      patchState();
    };

    const onVisibilityChange = (e) => {
      const shiftHeld = [...state.heldKeys].some((key) =>
        key.includes("Shift"),
      );

      patchState((s) => {
        if (shiftHeld) {
          s.layerNotVisible = new Set(layerOrder);
          s.layerNotVisible.delete(layer);
          e.target.checked = true;
        } else {
          if (!e.target.checked) {
            s.layerNotVisible.add(layer);
          } else {
            s.layerNotVisible.delete(layer);
          }
        }
      });
    };

    const colorInput = visible
      ? html`
          <color-picker
            @colorChange=${onColorChange}
            value=${color}
            class="color-picker"
          ></color-picker>
        `
      : "";

    return html`
      <div
        class="layer-item ${!visible ? "layer-not-visible" : ""}"
        .data=${{
          index: i,
          layers: layerOrder,
        }}
      >
        <div class="layer-grabber">≡</div>
        <div class="layer-name">
          <input
            @input=${onVisibilityChange}
            type="checkbox"
            .checked=${visible}
          />
          <span>${layer}</span>
        </div>
        ${colorInput}
      </div>
    `;
  };

  return layerOrder.map(renderLayerItem);
}

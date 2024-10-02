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
        <div class="layer-name">
          <label style="display: flex; align-items: center;">
            <i
              style="color: #666161;"
              class="fa-sm fa-solid ${visible ? "fa-eye" : "fa-eye-slash"}"
            ></i>
            <input
              class="hidden"
              @input=${onVisibilityChange}
              type="checkbox"
              .checked=${visible}
            />
          </label>
          <span>${layer}</span>
        </div>
        ${colorInput}
        <div class="layer-grabber">≡</div>
      </div>
    `;
  };

  return html`
    <div class="layer-menu-container">
      ${layerOrder.map(renderLayerItem)}
      <div class="bg-item">
        <div class="layer-name">Background</div>
        <color-picker
          @colorChange=${(e) => {
            const newColor = e.detail.value;
            document.documentElement.style.setProperty("--svg-bg", newColor);
          }}
          value=${getComputedStyle(document.body).getPropertyValue("--svg-bg")}
          class="color-picker"
        ></color-picker>
      </div>
    </div>
  `;
}

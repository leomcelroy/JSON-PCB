import { html } from "lit-html";
import { renderFootprintMenu } from "./renderFootprintMenu";
import { renderLayerMenu } from "./renderLayerMenu";
import { State } from "../state";

export function renderRightToolbar(state: State) {
  return html`
    <div class="right-toolbar">
      ${renderFootprintMenu(state)}
      <div class="hidden">Edit Netlist</div>

      <div class="menu-header menu-title">Layers</div>
      ${renderLayerMenu(state)}

      <div class="menu-buttons-container">
        <div draw-trace-region-btn class="menu-button">Draw Trace/Region</div>
      </div>
    </div>
  `;
}

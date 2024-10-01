import { html, svg } from "lit-html";
import { renderShapesToSVG, shapesToPathData } from "./renderShapesToSVG.js";
import { renderLayer } from "./renderLayer.js";
import { renderLayerMenu } from "./renderLayerMenu.js";
import { renderFootprintMenu } from "./renderFootprintMenu.js";
import { renderComponents } from "./renderComponents.js";
import { renderEditModal } from "./renderEditModal.js";
import { addAndEditPath } from "./addAndEditPath.js";

export function view(state) {
  const { layers, colorMap, hoverablePaths, layerOrder, layerNotVisible } =
    state;

  const layersView = [];

  if (layers) {
    // Sort layers based on the order in layerOrder string
    Object.entries(layers)
      .sort(([layerA], [layerB]) => {
        const indexA = layerOrder.indexOf(layerA);
        const indexB = layerOrder.indexOf(layerB);
        return indexB - indexA;
      })
      .forEach(([layer, tracesRegions]) => {
        if (layerNotVisible.has(layer)) return;

        const layerView = renderLayer(tracesRegions, layer, colorMap[layer]);
        layersView.push(layerView);
      });
  }

  return html`
    <div class="root">
      <div class="left-toolbar">
        <div class="code-editor"></div>
      </div>
      <div class="top-menu">
        <div>Save</div>
        <div class="dropdown">
          <div>Export</div>
          <div class="dropdown-items">
            <div>PNG</div>
            <div>Gerber</div>
          </div>
        </div>
        <div>Edit JSON</div>
        <div>New File</div>
        <div class="dropdown">
          <div>Examples</div>
          <div class="dropdown-items"></div>
        </div>
        <div>Center View</div>
      </div>
      <div class="right-toolbar">
        ${renderFootprintMenu(state)}
        <div class="hidden">Edit Netlist</div>
        <div class="menu-buttons-container">
          <div
            class="menu-button"
            @click=${() => {
              addAndEditPath("traces");
            }}
          >
            Add Trace
          </div>
          <div
            class="menu-button"
            @click=${() => {
              addAndEditPath("regions");
            }}
          >
            Add Region
          </div>
        </div>
        <div class="menu-header menu-title">Layers</div>
        ${renderLayerMenu(state)}
      </div>
      <div class="workarea no-select">
        <svg class="workarea-svg">
          <rect
            id="bg-mask"
            x="-10000"
            y="-10000"
            width="20000"
            height="20000"
            fill="lightgrey"
          />

          <g class="transform-group">
            <circle r="5" x="0" y="0" fill="red" />
            ${layersView} ${renderHoverablePaths(state)}
            ${renderComponents(state)} ${renderTempLine(state)}
            ${renderEditablePath(state)}
          </g>
        </svg>
        ${renderEditModal(state)}
      </div>
    </div>
  `;
}

function renderTempLine(state) {
  if (state.editPath.editMode !== "DRAW") return;
  if (state.editPath.editing === false) return;
  if (state.currentPoint === null) return;

  const { currentPoint, lastPoint } = state;

  const result = [];

  if (lastPoint !== null) {
    result.push(svg`
      <line 
        x1="${lastPoint[0]}" 
        y1="${lastPoint[1]}" 
        x2="${currentPoint[0]}" 
        y2="${currentPoint[1]}" 
        stroke="blue" 
        stroke-width="2"
        stroke-dasharray="5, 5" 
      />
    `);
  }

  result.push(svg`
    <circle 
      cx="${currentPoint[0]}" 
      cy="${currentPoint[1]}" 
      r="5" 
      fill="green"
    />
  `);

  return result;
}

function renderHoverablePaths(state) {
  const view = [];

  const addToView = (x, i, type) => {
    if (
      state?.editPath?.editing &&
      state?.editPath?.data?.index === i &&
      state?.editPath?.data?.type === type
    )
      return;
    let d = shapesToPathData(x.shapes);

    view.push(
      svg`<path 
          d=${d} 
          fill="none"
          stroke="#00000000" 
          stroke-width=${8 / state?.panZoomFns?.scale()} 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          class="hoverable-path"
          .type=${x.type}
          .index=${x.index}
          />`,
    );
  };

  state.hoverablePaths.regions.forEach((x, i) => addToView(x, i, "regions"));
  state.hoverablePaths.traces.forEach((x, i) => addToView(x, i, "traces"));

  return view;
}

function renderEditPanel(state) {
  if (!state.editPath.editing) return "";
}

function renderEditablePath(state) {
  if (!state.editPath.editing) return "";

  const { data, type, index } = state.editPath;
  const { shapes, controlPoints, controlAngles } = data.trackOrContourData;

  let d = shapesToPathData(shapes);

  const points = controlPoints.map(
    (pt, i) =>
      svg`<circle 
        path-control-point
        ?selected-control-pt=${state.editPath.selectedPoints.has(i)} 
        .pointIdx=${i}
        .type=${type}
        .index=${index}
        r="5" 
        cx=${pt[0]} 
        cy=${pt[1]} 
        fill="purple"
      />`,
  );

  return svg`
    <path 
      d=${d} 
      stroke="black" 
      stroke-width="5" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      fill="none" />
    ${points}

  `;
}

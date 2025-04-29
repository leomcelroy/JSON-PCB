import { html, svg } from "lit-html";
import {
  renderShapesToSVG,
  shapesToPathData,
} from "./views/renderShapesToSVG.js";
// import { renderLayer } from "./renderLayer.js";
import { renderLayerMenu } from "./views/renderLayerMenu.js";
import { renderFootprintMenu } from "./views/renderFootprintMenu.js";
import { renderComponents } from "./views/renderComponents.js";
import { renderEditModal } from "./views/renderEditModal.js";
import { addAndEditPath } from "./events/addAndEditPath.js";

import { drawTopBar } from "./views/drawTopBar.js";

import { runCode } from "./runCode/runCode.js";
import { formatCode } from "./formatCode.js";

export function view(state) {
  // const { layers, colorMap, hoverablePaths, layerOrder, layerNotVisible } =
  //   state;

  const layersView = [];

  // if (layers) {
  //   // Sort layers based on the order in layerOrder string
  //   Object.entries(layers)
  //     .sort(([layerA], [layerB]) => {
  //       const indexA = layerOrder.indexOf(layerA);
  //       const indexB = layerOrder.indexOf(layerB);
  //       return indexB - indexA;
  //     })
  //     .forEach(([layer, tracesRegions]) => {
  //       if (layerNotVisible.has(layer)) return;

  //       const layerView = renderLayer(tracesRegions, layer, colorMap[layer]);
  //       layersView.push(layerView);
  //     });
  // }

  return html`
    <div class="root">
      <div class="left-toolbar">
        <div class="code-editor"></div>
        <div
          @click=${(e) => {
            const editorContainer = document.querySelector(".code-editor");
            const code = editorContainer.cm.state.doc.toString();
            const formattedCoded = formatCode(code);
            editorContainer.cm.dispatch({
              changes: {
                from: 0,
                to: editorContainer.cm.state.doc.length,
                insert: formattedCoded,
              },
            });
          }}
          class="absolute top-0 right-14 px-2 py-1 m-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-500"
        >
          Format
        </div>
        <div
          run-code-trigger
          @click=${(e) => {
            const editorContainer = document.querySelector(".code-editor");
            const code = editorContainer.cm.state.doc.toString();
            runCode(code, state);
          }}
          class="absolute top-0 right-0 px-2 py-1 m-2 bg-green-600 text-white rounded cursor-pointer hover:bg-green-500"
        >
          Run
        </div>
      </div>
      ${drawTopBar(state)}
      <div class="right-toolbar">
        ${renderFootprintMenu(state)}
        <div class="hidden">Edit Netlist</div>

        <div class="menu-header menu-title">Layers</div>
        ${renderLayerMenu(state)}

        <div class="menu-buttons-container">
          <div
            add-trace-btn
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
      </div>
      <div class="workarea no-select">
        <canvas class="workarea-canvas-temp invisible"></canvas>
        <canvas class="workarea-canvas"></canvas>
        <svg class="workarea-svg">
          <rect
            class="hidden"
            id="bg-mask"
            x="-10000"
            y="-10000"
            width="20000"
            height="20000"
            fill="white"
          />
          <rect
            class="hidden"
            x="-10000"
            y="-10000"
            width="20000"
            height="20000"
            fill="var(--svg-bg)"
          />
          ${drawTransformGroup(state)};
        </svg>
        ${renderEditModal(state)}
      </div>
    </div>
  `;
}

function drawTransformGroup(state) {
  return svg`
    <g class="transform-group">
      <g stroke="black" stroke-width="${2 / (state?.panZoomFns?.scale() ?? 1)}">
        <!-- Horizontal line -->
        <line
          x1="${-5 / (state?.panZoomFns?.scale() ?? 1)}"
          y1="0"
          x2="${5 / (state?.panZoomFns?.scale() ?? 1)}"
          y2="0"
        />
        <!-- Vertical line -->
        <line
          x1="0"
          y1="${-5 / (state?.panZoomFns?.scale() ?? 1)}"
          x2="0"
          y2="${5 / (state?.panZoomFns?.scale() ?? 1)}"
        />
      </g>
      ${renderBoardBBox(state)} ${renderHoverablePaths(state)}
      ${renderComponents(state)} ${renderTempLine(state)}
      ${renderEditablePath(state)}
    </g>
  `;
}

function renderBoardBBox(state) {
  if (!state.board) return "";

  const { xMin, xMax, yMin, yMax } = state.board.boundingBox;
  const boxWidth = xMax - xMin;
  const boxHeight = yMax - yMin;

  return svg`
    <rect 
      x="${xMin}" 
      y="${-yMax}" 
      width="${boxWidth}" 
      height="${boxHeight}" 
      fill="none" 
      stroke="red" 
      vector-effect="non-scaling-stroke"
      stroke-dasharray="5, 5"/>
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
        y1="${-lastPoint[1]}" 
        x2="${currentPoint[0]}" 
        y2="${-currentPoint[1]}" 
        stroke="black" 
        stroke-width="2"
        vector-effect="non-scaling-stroke"
        stroke-dasharray="5, 5" 
      />
    `);
  }

  result.push(svg`
    <circle 
      cx="${currentPoint[0]}" 
      cy="${-currentPoint[1]}" 
      r="${5 / (state?.panZoomFns?.scale() ?? 1)}" 
      fill="white"
      stroke="black"
      vector-effect="non-scaling-stroke"
      stroke-width="2"
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
          stroke-width=${8 / (state?.panZoomFns?.scale() ?? 1)} 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          class="hoverable-path"
          data-type=${x.type}
          data-index=${x.index}
          transform="scale(1 -1)"
          />`
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
        data-pointIdx=${i}
        data-type=${type}
        data-index=${index}
        r="${5 / (state?.panZoomFns?.scale() ?? 1)}" 
        cx=${pt[0]} 
        cy=${-pt[1]} 
        fill="white"
        stroke="black"
        vector-effect="non-scaling-stroke"
        stroke-width="2"
      />`
  );

  return svg`
    <path 
      d=${d} 
      stroke="black" 
      stroke-width="7" 
      vector-effect="non-scaling-stroke"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      fill="none" 
      transform="scale(1 -1)"
      />
    <path 
      d=${d} 
      stroke="white" 
      stroke-width="3" 
      vector-effect="non-scaling-stroke"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      fill="none" 
      transform="scale(1 -1)"
      />
    ${points}

  `;
}

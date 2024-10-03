import { html, svg } from "lit-html";
import { renderShapesToSVG, shapesToPathData } from "./renderShapesToSVG.js";
import { renderLayer } from "./renderLayer.js";
import { renderLayerMenu } from "./renderLayerMenu.js";
import { renderFootprintMenu } from "./renderFootprintMenu.js";
import { renderComponents } from "./renderComponents.js";
import { renderEditModal } from "./renderEditModal.js";
import { addAndEditPath } from "./addAndEditPath.js";
import { jsonPopUp } from "./jsonPopUp.js";
import { setBoard, patchState } from "./state.js";
import { formatCode } from "./formatCode.js";
import { getBoardBoundingBox } from "./getBoardBoundingBox.js";
import { testPCB } from "./testPCB.js";
import { downloadPNG } from "./downloadPNG.js";
import { downloadText } from "./downloadText.js";

export function view(state) {
  const { layers, colorMap, hoverablePaths, layerOrder, layerNotVisible } =
    state;

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
      </div>
      <div class="top-menu">
        <div class="menu-item hidden">Save</div>

        <div class="menu-item dropdown">
          <div class="dropdown-toggle">Export</div>
          <div class="dropdown-items">
            <div
              class="dropdown-item"
              @click=${() => {
                const data = JSON.parse(JSON.stringify(state.board));

                data.components.forEach((comp) => {
                  delete comp.pads;
                });

                function removeExtraData(key, value) {
                  if (key === "shapes") return undefined;
                  if (key === "boundingBox") return undefined;
                  if (key === "pathData") return undefined;

                  return value;
                }

                const newText = formatCode(
                  JSON.stringify(data, removeExtraData),
                );

                let name = prompt("Please name your board.");
                if (!name) name = "anon";

                downloadText(`${name}.pcb.json`, newText);
              }}
            >
              JSON
            </div>
            <div
              class="dropdown-item"
              @click=${(e) => {
                let name = prompt("Please name your PNG.");
                if (!name) name = "anon";
                downloadPNG(state, name);
                patchState();
              }}
            >
              PNG
            </div>
            <div class="hidden dropdown-item">Gerber</div>
          </div>
        </div>

        <div
          class="menu-item"
          @click=${(e) => {
            const data = JSON.parse(JSON.stringify(state.board));

            data.components.forEach((comp) => {
              delete comp.pads;
            });

            function removeExtraData(key, value) {
              if (key === "shapes") return undefined;
              if (key === "boundingBox") return undefined;
              if (key === "pathData") return undefined;

              return value;
            }

            const newText = formatCode(JSON.stringify(data, removeExtraData));

            jsonPopUp({
              text: newText,
              onSave: (newJSON) => {
                const newBoard = JSON.parse(newJSON);
                setBoard(newBoard);
              },
            });
          }}
        >
          Edit JSON
        </div>
        <div
          class="menu-item"
          @click=${(e) => {
            state.editPath = {
              editing: false,
              data: null,
              editMode: "SELECT",
              selectedPoints: new Set(),
            };
            state.editModal = {
              open: false,
              type: "",
              id: null,
            };

            setBoard(JSON.parse(JSON.stringify(testPCB)));
            document.querySelector("[center-view-btn]").click();
          }}
        >
          New File
        </div>

        <div class="hidden menu-item dropdown">
          <div class="dropdown-toggle">Examples</div>
          <div class="dropdown-items"></div>
        </div>

        <div
          center-view-btn
          class="menu-item"
          @click=${(e) => {
            const board = state.board;
            board.boundingBox = getBoardBoundingBox(board);
            const svg = document.querySelector(".workarea-svg");
            const boundingBox = board.boundingBox;

            svg.panZoomFns.setScaleXY({
              x: [boundingBox.xMin, boundingBox.xMax],
              y: [boundingBox.yMin, boundingBox.yMax],
            });
          }}
        >
          Center View
        </div>
        <div
          style="height: 100%; flex: 1; text-align: right; display: flex; justify-content: flex-end;"
        >
          <a
            class="menu-item"
            target="_blank"
            href="https://github.com/leomcelroy/JSON-PCB/blob/main/README.md"
            >Help/GitHub</a
          >
        </div>
      </div>
      <div class="right-toolbar">
        ${renderFootprintMenu(state)}
        <div class="hidden">Edit Netlist</div>

        <div class="menu-header menu-title">Layers</div>
        ${renderLayerMenu(state)}

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
      </div>
      <div class="workarea no-select">
        <canvas class="workarea-canvas-temp"></canvas>
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

          <g class="transform-group">
            <g
              stroke="black"
              stroke-width="${2 / (state?.panZoomFns?.scale() ?? 1)}"
            >
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
            ${layersView} ${renderBoardBBox(state)}
            ${renderHoverablePaths(state)} ${renderComponents(state)}
            ${renderTempLine(state)} ${renderEditablePath(state)}
          </g>
        </svg>
        ${renderEditModal(state)}
      </div>
    </div>
  `;
}

function renderBoardBBox(state) {
  return "";
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
      />`,
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

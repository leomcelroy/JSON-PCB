import { html } from "lit-html";
import { getBoardBoundingBox } from "../boardHelpers/getBoardBoundingBox.js";
import { testPCB } from "../testPCB.js";
import { jsonPopUp } from "../modals/jsonPopUp.js";
import { setBoard, patchState } from "../state.js";
import { formatCode } from "../formatCode.js";
import { downloadPNG } from "../download/downloadPNG.js";
import { downloadText } from "../download/downloadText.js";
import { downloadGerber } from "../gerber/downloadGerber.js";
import { downloadRawDataSVG } from "../rawData/downloadSVG.js";
import { scaleSvgModal } from "../modals/scaleSvgModal.js";
import { getRawDataBoundingBox } from "../rawData/downloadSVG.js";

export function drawTopBar(state) {
  return html`
    <div class="top-menu">
      <div class="menu-item hidden">Save</div>

      <div class="menu-item dropdown">
        <div class="dropdown-toggle">Export</div>
        <div class="dropdown-items">
          <div class="dropdown-item" @click=${(e) => clickDownloadJSON(state)}>
            JSON
          </div>
          <div class="dropdown-item" @click=${(e) => clickDownloadPNG(state)}>
            PNG
          </div>
          <div
            class="dropdown-item"
            @click=${(e) => clickDownloadGerber(state)}
          >
            Gerber
          </div>
          <div class="hidden dropdown-item">Gerber</div>
        </div>
      </div>

      <div class="menu-item dropdown">
        <div class="dropdown-toggle">Raw Data</div>
        <div class="dropdown-items">
          <div
            class="dropdown-item"
            @click=${(e) => clickDownloadRawDataSVG(state)}
          >
            Download SVG
          </div>
        </div>
      </div>

      <div class="menu-item" @click=${(e) => clickEditJSON(state)}>
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
          // document.querySelector("[center-view-btn]").click();
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
  `;
}

function clickDownloadJSON(state) {
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

  let name = prompt("Please name your board.");
  if (!name) name = "anon";

  downloadText(`${name}.pcb.json`, newText);
}

function clickDownloadPNG(state) {
  let name = prompt("Please name your PNG.");
  if (!name) name = "anon";
  downloadPNG(state, name);
  patchState();
}

function clickEditJSON(state) {
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
}

function clickDownloadGerber(state) {
  downloadGerber(state);
}

function clickDownloadRawDataSVG(state) {
  console.log("clickDownloadRawDataSVG called");
  const bbox = getRawDataBoundingBox(state.rawData);
  const currentWidth = bbox.width;
  const currentHeight = bbox.height;

  scaleSvgModal({
    currentWidth,
    currentHeight,
    layerOrder: state.layerOrder,
    onDownload: ({ targetWidth, targetHeight, filename, layerOrder }) => {
      downloadRawDataSVG(state.rawData, state.colorMap, layerOrder, {
        targetWidth,
        targetHeight,
        filename,
      });
    },
  });
}

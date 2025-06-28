import { STATE } from "./state";
import { render as r } from "lit-html";

import { initCodeEditor } from "./initCodeEditor";
import { view } from "./views/view";

import { addCanvasResize } from "./events/addCanvasResize";
import { addNewFileClick } from "./events/addNewFileClick";
import { addFootprintDeletion } from "./events/addFootprintDeletion";
import { addFootprintIdEditing } from "./events/addFootprintIdEditing";
import { addComponentAdding } from "./events/addComponentAdding";
import { addCenterViewClick } from "./events/addCenterViewClick";
import { addCodeFormatting } from "./events/addCodeFormatting";
import { addDownloadJSON } from "./events/addDownloadJSON";
import { addDownloadPNG } from "./events/addDownloadPNG";
import { addDownloadGerber } from "./events/addDownloadGerber";
import { addCodeCaching } from "./events/addCodeCaching";
import { addNumberScrubbing } from "./events/addNumberScrubbing";
import { addDropUpload } from "./events/addDropUpload";
import { addLayerReordering } from "./events/addLayerReordering";
import { addPanZoom } from "./events/addPanZoom";
import { addRunCode } from "./events/addRunCode";
import { addComponentDragging } from "./events/addComponentDragging";
import { addSwitchCodePanel } from "./events/addSwitchCodePanel";
import { addPathSelection } from "./events/addPathSelection";

// import { addPointDragging } from "./events/addPointDragging";
// import { addPathCreation } from "./events/addPathCreation";

import { testPCB2 } from "./blankBoard";
import { setBoard, setBoardAsync } from "./setBoard";

function init(state) {
  console.log("init");
  // render app immediately
  r(view(state), document.body);

  const savedBoard = window.sessionStorage.getItem("JSON-PCB-BOARD");
  if (savedBoard) {
    setBoardAsync(JSON.parse(savedBoard)).then(() => {
      document.querySelector("[center-view-btn]")?.click();
    });
  } else {
    setBoardAsync(testPCB2).then(() => {
      document.querySelector("[center-view-btn]")?.click();
    });
  }

  setTimeout(() => {
    document.querySelector("[center-view-btn]")?.click();
  }, 1000);

  addCanvasResize();

  const editor = document.querySelector(".code-editor");
  if (!editor) return;
  initCodeEditor(editor);
  addCodeCaching(editor);
  addNumberScrubbing(document.body, editor.cm);

  const svg = document.querySelector(".workarea-svg");

  // addPointDragging(svg);
  addComponentDragging(svg);
  // addPathCreation(svg);

  addComponentAdding(document.body);
  addLayerReordering(document.body);

  const panZoomFns = addPanZoom(svg);
  svg.panZoomFns = panZoomFns;
  state.panZoomFns = panZoomFns;

  addLayerReordering(document.body);
  addRunCode(document.body, state);
  addDownloadJSON(document.body, state);
  addDownloadPNG(document.body, state);
  addDownloadGerber(document.body, state);
  addCenterViewClick(document.body, state);
  addCodeFormatting(document.body, state);
  addFootprintDeletion(document.body, state);
  addFootprintIdEditing(document.body, state);
  addNewFileClick(document.body, state);
  addDropUpload(document.body, state);
  addSwitchCodePanel(document.body, state);
  addPathSelection(document.body, state);
}

window.addEventListener("DOMContentLoaded", (e) => {
  init(STATE);
  window.state = STATE;
});

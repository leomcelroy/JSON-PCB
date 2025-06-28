import { html, svg } from "lit-html";
import { shapesToPathData } from "../../unused/dom/renderShapesToSVG";
import { renderComponents } from "./renderComponents";
import { renderEditModal } from "./renderEditModal";
import { renderTopBar } from "./renderTopBar";
import { renderRightToolbar } from "./renderRightToolbar";
import { renderLeftToolbar } from "./renderLeftToolbar";
import { renderBoardBoundingBox } from "./renderBorderBoundingBox";
import { renderHoverablePaths } from "./renderHoverablePaths";
import { renderTempLine } from "./renderTempLine";
import { renderEditablePath } from "./renderEditablePaths";
import { renderComponentModal } from "./renderComponentModal";

export function view(state) {
  return html`
    <div class="root">
      ${renderTopBar(state)}
      <!-- new line -->
      ${renderLeftToolbar(state)}
      <!-- new line -->
      ${renderRightToolbar(state)}
      <!-- new line -->
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
        ${renderComponentModal(state)}
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
      ${renderBoardBoundingBox(state)} 
      ${renderComponents(state)} 
      ${renderHoverablePaths(state)}
      ${false ? renderTempLine(state) : ""}
      ${renderEditablePath(state)}
    </g>
  `;
}

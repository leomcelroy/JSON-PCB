import { html } from "lit-html";

export function renderTopBar(state) {
  return html`
    <div class="top-menu">
      <div class="menu-item hidden">Save</div>

      <div class="menu-item dropdown">
        <div class="dropdown-toggle">Export</div>
        <div class="dropdown-items">
          <div download-json-btn class="dropdown-item">JSON</div>
          <div download-png-btn class="dropdown-item">PNG</div>
          <div download-gerber-btn class="dropdown-item">Gerber</div>
        </div>
      </div>

      <div new-file-btn class="menu-item">New File</div>

      <div class="hidden menu-item dropdown">
        <div class="dropdown-toggle">Examples</div>
        <div class="dropdown-items"></div>
      </div>

      <div center-view-btn class="menu-item">Center View</div>
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

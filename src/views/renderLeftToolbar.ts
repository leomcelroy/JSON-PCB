import { html } from "lit-html";

export function renderLeftToolbar(state) {
  return html`
    <div class="left-toolbar p-2 bg-[#a4a4a4] flex flex-col h-full">
      <div class="code-editor bg-gray-100 flex-grow"></div>
      <div class="flex flex-row justify-between items-center mt-2">
        <!-- make these look like tabs -->
        <div class="flex flex-row space-x-1">
          <div
            switch-code-panel-board
            ?data-active=${state.codePanel === "board"}
            class="bg-gray-500 px-4 py-2 data-active:bg-gray-200 text-gray-800 hover:bg-gray-400 hover:text-white rounded-md cursor-pointer"
          >
            Board JSON
          </div>
          <div
            switch-code-panel-script
            ?data-active=${state.codePanel === "script"}
            class="bg-gray-500 px-4 py-2 data-active:bg-gray-200 text-gray-800 hover:bg-gray-400 hover:text-white rounded-md cursor-pointer"
          >
            Script
          </div>
        </div>

        <!--these should be buttons to the bottom right -->
        <div class="flex flex-row">
          <div
            format-code-btn
            class="px-2 py-1 m-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-500"
          >
            Format
          </div>
          <div
            run-code-btn
            class="px-2 py-1 m-2 bg-green-600 text-white rounded cursor-pointer hover:bg-green-500"
          >
            Run
          </div>
        </div>
      </div>
    </div>
  `;
}

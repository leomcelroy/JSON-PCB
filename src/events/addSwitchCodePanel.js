import { createListener } from "../utils/createListener";
import { setBoardJSON } from "../setBoardJSON";
import { render } from "../state";

export function addSwitchCodePanel(el, state) {
  const listener = createListener(el);

  listener("click", "[switch-code-panel-board]", () => {
    state.codePanel = "board";
    setBoardJSON(state.board);

    render();
  });

  listener("click", "[switch-code-panel-script]", () => {
    state.codePanel = "script";
    const editorView = document.querySelector(".code-editor")?.cm;
    if (!editorView) return;

    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: state.script,
      },
    });
    render();
  });
}

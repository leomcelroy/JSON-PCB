import { createListener } from "../utils/createListener";
import { runCodeSync } from "../runCode/runCodeSync";
import { setBoard } from "../setBoard";
import { patchState } from "../state";
export function addRunCode(el, state) {
  const listener = createListener(el);

  listener("click", "[run-code-btn]", () => {
    const editorContainer: any = document.querySelector(".code-editor");
    if (!editorContainer) return;
    const code = editorContainer.cm.state.doc.toString();

    if (state.codePanel === "board") {
      setBoard(JSON.parse(code));
    }

    if (state.codePanel === "script") {
      runCodeSync(code, state.board);
    }

    patchState((s) => {
      s.selectedComponents = new Set();
    });
  });
}

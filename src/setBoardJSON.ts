import { Board } from "./types/Board";
import { formatCode } from "./utils/formatCode";

export function setBoardJSON(board: Board) {
  const data = formatCode(JSON.stringify(board));

  const editorView = document.querySelector(".code-editor")?.cm;
  if (!editorView) return;

  editorView.dispatch({
    changes: {
      from: 0,
      to: editorView.state.doc.length,
      insert: data,
    },
  });
}

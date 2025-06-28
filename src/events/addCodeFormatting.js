import { createListener } from "../utils/createListener";
import { formatCode } from "../utils/formatCode";

export function addCodeFormatting(el, state) {
  const listener = createListener(el);

  listener("click", "[format-code-btn], [format-code-btn] *", () => {
    const editorContainer = document.querySelector(".code-editor");
    if (!editorContainer) return;
    const code = editorContainer.cm.state.doc.toString();
    const formattedCoded = formatCode(code);
    editorContainer.cm.dispatch({
      changes: {
        from: 0,
        to: editorContainer.cm.state.doc.length,
        insert: formattedCoded,
      },
    });
  });
}

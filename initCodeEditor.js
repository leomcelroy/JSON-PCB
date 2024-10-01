import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
// import { testPCB } from "./testPCB.js";

export function initCodeEditor(editorContainer) {
  // Initialize the editor
  let editor = new EditorView({
    state: EditorState.create({
      doc: "",
      extensions: [basicSetup],
    }),
    parent: editorContainer,
  });

  editorContainer.cm = editor;

  editorContainer.addEventListener("keydown", (e) => {
    e.stopPropagation();
  });
}

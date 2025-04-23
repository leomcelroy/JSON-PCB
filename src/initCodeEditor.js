import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands"; // Import indent command
import { keymap } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript"; // Import javascript language support

export function initCodeEditor(editorContainer) {
  let editor = new EditorView({
    state: EditorState.create({
      doc: "",
      extensions: [basicSetup, keymap.of([indentWithTab]), javascript()],
    }),
    parent: editorContainer,
  });

  editorContainer.cm = editor;

  editorContainer.addEventListener("keydown", (e) => {
    e.stopPropagation();
  });
}

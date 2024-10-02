import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands"; // Import indent command

export function jsonPopUp(ops) {
  const text = ops.text ?? "";
  const onSave = ops.onSave ?? null;
  const onCancel = ops.onCancel ?? null; // Optional cancel callback

  // Create the container element
  const el = document.createElement("div");
  el.className = "codemirror-popup";

  // HTML structure with string template
  el.innerHTML = `
    <style>
      .codemirror-popup {
          position: absolute;
          top: 50px;
          left: 50%;
          transform: translate(-50%, 0%);
          background-color: #f4eeee;
          border: 1px solid #ccc;
          padding: 5px;
          box-shadow: 0px 0px 8px 0px #0000006e;
          z-index: 1000;
          width: 70%;
          border-radius: 8px;
        }

        .codemirror-editor {
          height: 500px;
          background: white;
          margin-bottom: 20px;
          border: 1px solid grey;
        }

        .button-container {
          text-align: right;
        }

        .button-container button {
          margin-left: 10px;
          padding: 8px 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .button-container button:hover {
          background-color: #0056b3;
        }

        .save-button {
          background-color: #28a745;
        }

        .save-button:hover {
          background-color: #218838;
        }

        .cancel-button {
          background-color: #dc3545;
        }

        .cancel-button:hover {
          background-color: #c82333;
        }

    </style>
    <div class="codemirror-editor"></div>
    <div class="button-container">
      <button class="save-button">Save</button>
      <button class="cancel-button">Cancel</button>
    </div>
  `;

  // Query the editor container and buttons
  const editorContainer = el.querySelector(".codemirror-editor");

  // Initialize CodeMirror editor
  let editor = new EditorView({
    state: EditorState.create({
      doc: text,
      extensions: [basicSetup, keymap.of([indentWithTab])],
    }),
    parent: editorContainer,
  });

  // Prevent key events from propagating outside of the editor
  editorContainer.addEventListener("keydown", (e) => {
    if (e.stopPropagation) e.stopPropagation();
  });

  // Save button functionality
  const saveButton = el.querySelector(".save-button");
  saveButton.addEventListener("click", () => {
    const codemirrorContent = editor.state.doc.toString(); // Get content from CodeMirror
    if (onSave) onSave(codemirrorContent); // Call onSave callback with the editor content
  });

  // Cancel button functionality
  const cancelButton = el.querySelector(".cancel-button");
  cancelButton.addEventListener("click", () => {
    if (onCancel) onCancel(); // Optional onCancel callback
    el.remove(); // Remove the popup from DOM
  });

  // Append the popup to the body
  document.body.appendChild(el);
}

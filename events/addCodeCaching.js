export function addCodeCaching(
  editorDomElement,
  storageKey = "editorCodeCache"
) {
  const editorView = editorDomElement?.cm;

  try {
    const cachedCode = sessionStorage.getItem(storageKey);
    if (cachedCode) {
      console.log(`Loading code from sessionStorage (key: ${storageKey})`);

      editorView.dispatch({
        changes: {
          from: 0,
          to: editorView.state.doc.length,
          insert: cachedCode,
        },
      });
    }
  } catch (e) {
    console.error("Failed to load or set code from sessionStorage:", e);
  }

  const intervalId = setInterval(() => {
    const currentEditorView = editorDomElement?.cm;

    try {
      const currentCode = currentEditorView.state.doc.toString();
      sessionStorage.setItem(storageKey, currentCode);
    } catch (e) {
      console.error(
        "Failed to save code to sessionStorage during interval:",
        e
      );
    }
  }, 5000);

  return intervalId;
}

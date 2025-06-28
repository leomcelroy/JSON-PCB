function clickEditJSON(state) {
  const data = JSON.parse(JSON.stringify(state.board));

  data.components.forEach((comp) => {
    delete comp.pads;
  });

  function removeExtraData(key, value) {
    if (key === "shapes") return undefined;
    if (key === "boundingBox") return undefined;
    if (key === "pathData") return undefined;

    return value;
  }

  const newText = formatCode(JSON.stringify(data, removeExtraData));

  jsonPopUp({
    text: newText,
    onSave: (newJSON) => {
      const newBoard = JSON.parse(newJSON);
      setBoard(newBoard);
    },
  });
}

function removeExtraData(key, value) {
  if (key === "shapes") return undefined;
  if (key === "boundingBox") return undefined;
  if (key === "pathData") return undefined;

  return value;
}

function strBoard(board) {
  return JSON.stringify(board, removeExtraData);
}

export function getHoverablePaths(board) {
  let hoverablePaths = { regions: [], traces: [] };

  board.traces.forEach((trace, i) => {
    hoverablePaths.traces.push({
      shapes: trace.shapes,
      type: "traces",
      index: i,
    });
  });

  board.regions.forEach((region, i) => {
    hoverablePaths.regions.push({
      shapes: region.shapes,
      type: "regions",
      index: i,
    });
  });

  return hoverablePaths;
}

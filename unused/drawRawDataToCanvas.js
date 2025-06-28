import { drawRawData } from "./drawRawData.js";

export function drawRawDataToCanvas(state) {
  const canvas = document.querySelector(".workarea-canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const { processedBoard, colorMap, layerOrder, panZoomFns, layerNotVisible } =
    state;

  if (!processedBoard) return;

  Object.entries(processedBoard.layers)
    .sort(([layerA], [layerB]) => {
      const indexA = layerOrder.indexOf(layerA);
      const indexB = layerOrder.indexOf(layerB);
      return indexB - indexA;
    })
    .forEach(([layer, tracesRegions]) => {
      if (layerNotVisible.has(layer)) return;

      drawRawData({
        rawData,
        tracesRegions,
        color: colorMap[layer],
        tempCanvas: document.querySelector(".workarea-canvas-temp"),
        canvas,
        scale: panZoomFns.scale(),
        x: panZoomFns.x(),
        y: panZoomFns.y(),
      });
    });
}

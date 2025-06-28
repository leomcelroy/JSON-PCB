import { drawComponents } from "./drawComponents.js";
import { drawLayer } from "./drawLayer.js";

export function drawBoard(state) {
  const canvas = document.querySelector(".workarea-canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const { processedBoard, colorMap, layerOrder, layerNotVisible, panZoomFns } =
    state;

  if (!processedBoard) return;

  const layers = processedBoard.layers;

  if (layers) {
    // Sort layers based on the order in layerOrder string
    Object.entries(layers)
      .sort(([layerA], [layerB]) => {
        const indexA = layerOrder.indexOf(layerA);
        const indexB = layerOrder.indexOf(layerB);
        return indexB - indexA;
      })
      .forEach(([layer, tracesRegions]) => {
        if (layerNotVisible.has(layer)) return;
        drawLayer({
          tracesRegions,
          drills: processedBoard.drills,
          color: colorMap[layer],
          tempCanvas: document.querySelector(".workarea-canvas-temp"),
          canvas,
          scale: panZoomFns.scale(),
          x: panZoomFns.x(),
          y: panZoomFns.y(),
        });
      });

    drawComponents({
      state,
      components: processedBoard.components,
      tempCanvas: document.querySelector(".workarea-canvas-temp"),
      canvas,
      scale: panZoomFns.scale(),
      x: panZoomFns.x(),
      y: panZoomFns.y(),
    });
  }
}

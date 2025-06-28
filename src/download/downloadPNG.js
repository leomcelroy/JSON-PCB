import { changeDpiDataUrl } from "./changeDPI.js";
import { drawLayer } from "../canvas/drawLayer.js";

export function downloadPNG(state, name, dpi = 1000) {
  const { processedBoard, colorMap, layerOrder, layerNotVisible } = state;

  const layers = processedBoard.layers;
  const boundingBox = processedBoard.boardBoundingBox;
  const mmPerUnit = processedBoard.mmPerUnit;

  const limits = {
    x: [boundingBox.xMin, boundingBox.xMax],
    y: [boundingBox.yMin, boundingBox.yMax],
  };

  limits.y = limits.y.map((y) => -y).reverse();

  const w = (limits.x[1] - limits.x[0]) * mmPerUnit;
  const h = (limits.y[1] - limits.y[0]) * mmPerUnit;

  var width = (dpi * w) / mmPerUnit;
  var height = (dpi * h) / mmPerUnit;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const xr = limits.x[1] - limits.x[0];
  const yr = limits.y[1] - limits.y[0];
  const xScalingFactor = canvas.width / xr;
  const yScalingFactor = canvas.height / yr;

  const scalingFactor = Math.min(xScalingFactor, yScalingFactor) * 0.9;

  const scale = scalingFactor;

  const center = {
    x: ((limits.x[0] + limits.x[1]) / 2) * scalingFactor - canvas.width / 2,
    y: ((limits.y[0] + limits.y[1]) / 2) * scalingFactor - canvas.height / 2,
  };

  const x = -center.x;
  const y = -center.y;

  if (layers) {
    const bgColor = getComputedStyle(document.body).getPropertyValue(
      "--svg-bg"
    );
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
          scale: scale,
          x: x,
          y: y,
        });
      });
  }

  console.log(canvas);

  dlCanvas(canvas, name);
}

function dlCanvas(canvas, name) {
  var image = canvas.toDataURL("image/png");
  image = changeDpiDataUrl(image, 1000);
  var aDownloadLink = document.createElement("a");
  aDownloadLink.download = `${name}.png`;
  aDownloadLink.href = image;
  aDownloadLink.click();
}

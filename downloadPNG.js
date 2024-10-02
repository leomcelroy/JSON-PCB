import { changeDpiDataUrl } from "./changeDPI.js";
import { getBoardBoundingBox } from "./getBoardBoundingBox.js";
import { drawLayer } from "./drawLayer.js";

export function downloadPNG(state, name, dpi = 1000) {
  const { layers, colorMap, layerOrder, layerNotVisible, panZoomFns } = state;

  const boundingBox = getBoardBoundingBox(state.board);

  const limits = {
    x: [boundingBox.xMin, boundingBox.xMax],
    y: [boundingBox.yMin, boundingBox.yMax],
  };

  limits.y = limits.y.map((y) => -y).reverse();

  const w = (limits.x[1] - limits.x[0]) * state.board.mmPerUnit;
  const h = (limits.y[1] - limits.y[0]) * state.board.mmPerUnit;

  var width = (dpi * w) / state.board.mmPerUnit;
  var height = (dpi * h) / state.board.mmPerUnit;

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
      "--svg-bg",
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
          color: colorMap[layer],
          tempCanvas: document.querySelector(".workarea-canvas-temp"),
          canvas,
          scale: scale,
          x: x,
          y: y,
        });
      });

    ctx.fillStyle = bgColor;
    ctx.setTransform(scale, 0, 0, -scale, x, y);
    state.board.components.forEach((comp) => {
      comp.pads.forEach((pad) => {
        const { position, drill } = pad;

        if (drill && drill.diameter) {
          ctx.beginPath();
          ctx.arc(position[0], position[1], drill.diameter / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });
  }

  // document.body.append(canvas);
  // canvas.style = `
  //                 position: absolute;
  //                 left: 0;
  //                 top: 0;
  //                 border: 1px solid black;
  //               `;

  // setTimeout(() => {
  //   canvas.remove();
  // }, 2000);

  dlCanvas(canvas, `${name}.png`);
}

function dlCanvas(canvas, name) {
  // Convert the canvas to data
  var image = canvas.toDataURL("image/png");
  image = changeDpiDataUrl(image, 1000);
  // Create a link
  var aDownloadLink = document.createElement("a");
  // Add the name of the file to the link
  aDownloadLink.download = `${name}.png`;
  // Attach the data to the link
  aDownloadLink.href = image;
  // Get the code to click the download link
  aDownloadLink.click();
}

export function drawComponents({
  state,
  components,
  colorMap,
  tempCanvas,
  canvas,
  scale,
  x,
  y,
}) {
  const ctx = canvas.getContext("2d");
  const tempCtx = tempCanvas.getContext("2d");

  // ctx.imageSmoothingEnabled = false;
  // ctx.imageSmoothingQuality = "low";
  // tempCtx.imageSmoothingEnabled = false;
  // tempCtx.imageSmoothingQuality = "low";

  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

  const padFontSize = 14;
  const compFontSize = 14;

  tempCtx.setTransform(scale, 0, 0, scale, x, y);

  const drillFillColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--svg-bg")
    .trim();

  components.forEach((component) => {
    const { id, translate, pads, boundingBox } = component;
    pads.forEach((pad) => {
      const { id: padId, position, drill } = pad;
      const [padX, padY] = position;

      if (drill) {
        const drillRadius = drill.diameter / 2;
        tempCtx.beginPath();
        tempCtx.arc(padX, -padY, drillRadius, 0, Math.PI * 2);
        tempCtx.fillStyle = drillFillColor;
        tempCtx.fill();
        tempCtx.closePath();
      }

      tempCtx.font = `${padFontSize}px Arial`;
      tempCtx.fillStyle = "white";
      tempCtx.strokeStyle = "black";
      tempCtx.lineWidth = 3;
      tempCtx.textAlign = "center";
      tempCtx.textBaseline = "middle";
      tempCtx.globalAlpha = 0.75;

      tempCtx.save();
      tempCtx.translate(padX, -padY);
      tempCtx.scale(1 / scale, 1 / scale);
      tempCtx.strokeText(padId, 0, 0);
      tempCtx.fillText(padId, 0, 0);
      tempCtx.restore();
    });

    tempCtx.font = `${compFontSize}px Arial`;
    tempCtx.fillStyle = "black";
    // tempCtx.strokeStyle = "black";
    // tempCtx.lineWidth = 0.8;
    tempCtx.globalAlpha = 1.0;
    const [translateX, translateY] = translate;

    tempCtx.save();
    tempCtx.translate(translateX, -translateY - 15 / scale);
    tempCtx.scale(1 / scale, 1 / scale);
    // tempCtx.strokeText(id, 0, 0);
    tempCtx.fillText(id, 0, 0);
    tempCtx.restore();
  });

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(tempCanvas, 0, 0);
}

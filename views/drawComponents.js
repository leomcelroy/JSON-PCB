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
  const dpr = window.devicePixelRatio ?? 1;

  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
  const padFontSize = 12;
  const compFontSize = 12;

  tempCtx.setTransform(scale * dpr, 0, 0, scale * dpr, x * dpr, y * dpr);

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
      tempCtx.font = `${padFontSize}px Arial`; // No DPR multiplier needed
      tempCtx.fillStyle = "white";
      tempCtx.strokeStyle = "black";
      tempCtx.lineWidth = 3;
      tempCtx.textAlign = "center";
      tempCtx.textBaseline = "middle";
      tempCtx.globalAlpha = 0.75;
      tempCtx.save();
      tempCtx.translate(padX, -padY);
      tempCtx.scale(1 / scale, 1 / scale); // Scale already includes DPR
      tempCtx.strokeText(padId, 0, 0);
      tempCtx.fillText(padId, 0, 0);
      tempCtx.restore();
    });

    tempCtx.font = `${compFontSize}px Arial`; // No DPR multiplier needed
    tempCtx.fillStyle = "black";
    tempCtx.globalAlpha = 1.0;
    const [translateX, translateY] = translate;
    tempCtx.save();
    tempCtx.translate(translateX, -translateY - 15 / scale);
    tempCtx.scale(1 / scale, 1 / scale); // Scale already includes DPR
    tempCtx.fillText(id, 0, 0);
    tempCtx.restore();
  });

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(tempCanvas, 0, 0);
}

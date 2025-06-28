export function drawComponents({
  state,
  components,
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

  components.forEach((component) => {
    const { id, position: componentPosition, pads, boundingBox } = component;
    pads.forEach((pad) => {
      const { id: padId, position: padPosition } = pad;
      const padX = padPosition[0];
      const padY = padPosition[1];

      if (!state.show.padLabels) return;
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

    if (!state.show.componentLabels) return;
    tempCtx.font = `${compFontSize}px Arial`; // No DPR multiplier needed
    tempCtx.fillStyle = "black";
    tempCtx.globalAlpha = 1.0;
    const [translateX, translateY] = componentPosition;
    tempCtx.save();
    tempCtx.translate(translateX, -translateY - 15 / scale);
    tempCtx.scale(1 / scale, 1 / scale); // Scale already includes DPR
    tempCtx.fillText(id, 0, 0);
    tempCtx.restore();
  });

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(tempCanvas, 0, 0);
}

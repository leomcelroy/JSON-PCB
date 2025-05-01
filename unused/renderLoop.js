export const renderLoop = () => {
  requestAnimationFrame(renderLoop);
  // renderToCanvas(STATE);
  drawRawDataToCanvas(STATE);
};

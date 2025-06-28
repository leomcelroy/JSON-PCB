import { render } from "../state";

export function addCanvasResize() {
  const canvas = document.querySelector(".workarea-canvas");
  if (!canvas) return;
  const canvasBB = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio ?? 1;
  (canvas as HTMLCanvasElement).width = canvasBB.width * dpr;
  (canvas as HTMLCanvasElement).height = canvasBB.height * dpr;

  render();
}

window.addEventListener("resize", addCanvasResize);

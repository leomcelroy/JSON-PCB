import { createListener } from "../utils/createListener";
import { downloadPNG } from "../download/downloadPNG";
import { render } from "../state";

export function addDownloadPNG(el, state) {
  const listener = createListener(el);

  listener("click", "[download-png-btn], [download-png-btn] *", () => {
    clickDownloadPNG(state);
  });
}

function clickDownloadPNG(state) {
  let name = prompt("Please name your PNG.");
  if (!name) name = "anon";
  downloadPNG(state, name);
  render();
}

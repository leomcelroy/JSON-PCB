import { createListener } from "../utils/createListener";
import { formatCode } from "../utils/formatCode";
import { downloadText } from "../download/downloadText";

export function addDownloadJSON(el, state) {
  const listener = createListener(el);

  listener("click", "[download-json-btn], [download-json-btn] *", () => {
    clickDownloadJSON(state);
  });
}

function clickDownloadJSON(state) {
  const data = JSON.parse(JSON.stringify(state.board));

  const newText = formatCode(JSON.stringify(data));

  let name = prompt("Please name your board.");
  if (!name) name = "anon";

  downloadText(`${name}.pcb.json`, newText);
}

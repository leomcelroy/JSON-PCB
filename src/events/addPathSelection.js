import { createListener } from "../utils/createListener";
import { patchState } from "../state";

export function addPathSelection(el, state) {
  const listener = createListener(el);

  listener("mousedown", ".hoverable-path", (e) => {
    // const pathKey = e.target.dataset.pathKey.split(",");
    // console.log(pathKey);
    const pathIndex = e.target.dataset.pathIndex;

    patchState((s) => {
      s.selectedPaths.clear();
      s.selectedPaths.add(pathIndex);
    });
  });
}

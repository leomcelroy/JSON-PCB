import { setBoard } from "../setBoard";
import { patchState } from "../state";
import { createListener } from "../utils/createListener";

export function addFootprintDeletion(el, state) {
  const listener = createListener(el);

  listener(
    "mousedown",
    "[footprint-delete-btn], [footprint-delete-btn] *",
    (e) => {
      const { board } = state;
      const btn = e.target.closest("[footprint-delete-btn]");
      const id = btn.footprintId;

      if (board.components.some((comp) => comp.footprint === id)) {
        alert("Can't delete footprint which is in use.");
        return;
      }

      patchState((s) => {
        board.footprints = board.footprints.filter((x) => x.id !== id);
        setBoard(board);
      });
    }
  );
}

import { setBoard } from "../setBoard";
import { createListener } from "../utils/createListener";

export function addFootprintIdEditing(el, state) {
  const listener = createListener(el);

  listener("mousedown", "[footprint-id-btn]", (e) => {
    const { board } = state;

    const newId = prompt("Please provide a new footprint ID.");
    if (!newId || newId === "") return;
    // TODO: add validation
    const currentId = e.target.dataset.id;
    const footprint = board.footprints.find((x) => x.id === currentId);
    footprint.id = newId;
    board.components.forEach((x) => {
      if (x.footprint === currentId) x.footprint = newId;
    });
    setBoard(board);
  });
}

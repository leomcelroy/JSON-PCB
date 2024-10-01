import { patchState, setBoard, STATE } from "./state.js";
import { makePhantom } from "./makePhantom.js";

export function addComponentAdding(el) {
  function getPoint(e) {
    let rect = el.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    return [x, y];
  }

  const listener = createListener(el);

  listener(
    "mousedown",
    "[draggable-footprint], [draggable-footprint] *",
    (e) => {
      const target = e.target.closest("[draggable-footprint]");
      makePhantom(e, target, (e) => {
        const dropPoint = getPoint(e);

        const workareaSvg = document.querySelector(".workarea-svg");

        if (workareaSvg && workareaSvg.contains(e.target)) {
          const svgRect = workareaSvg.getBoundingClientRect();

          const relativeX = dropPoint[0] - svgRect.left;
          const relativeY = dropPoint[1] - svgRect.top;

          const panZoomFns = workareaSvg.panZoomFns;
          const transformedPoint = panZoomFns.getPoint(relativeX, relativeY);

          let i = 0;
          let possibleId = () => `${target.footprintId}_${i}`;

          patchState((s) => {
            while (s.board.components.map((x) => x.id).includes(possibleId()))
              i++;

            const newComp = {
              id: possibleId(),
              footprint: target.footprintId,
              translate: transformedPoint,
            };

            s.board.components.push(newComp);

            setBoard(s.board);

            s.editPath.editing = false;
            s.editModal = {
              open: true,
              type: "components",
              id: newComp.id,
            };
          });
        }
      });
    },
  );
}

const trigger = (e) => e.composedPath()[0];
const matchesTrigger = (e, selectorString) =>
  trigger(e).matches(selectorString);
const createListener = (target) => (eventName, selectorString, event) => {
  target.addEventListener(eventName, (e) => {
    if (selectorString === "" || matchesTrigger(e, selectorString)) event(e);
  });
};

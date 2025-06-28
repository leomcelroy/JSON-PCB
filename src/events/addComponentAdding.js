import { patchState } from "../state";
import { makePhantom } from "../utils/makePhantom";
import { createListener } from "../utils/createListener";
import { round } from "../utils/round";
import { setBoard } from "../setBoard";

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
      const phantom = makePhantom(e, target, (e) => {
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
            const { board } = s;

            while (
              s.processedBoard.components
                .map((x) => x.id)
                .includes(possibleId())
            )
              i++;

            const newComp = {
              id: possibleId(),
              footprint: target.footprintId,
              position: transformedPoint.map(round),
            };

            board.components.push(newComp);

            setBoard(board);

            s.selectedComponents = new Set([newComp.id]);
          });
        }
      });

      phantom.style.background = "none";
      phantom.style.border = "none";
    }
  );
}

import { patchState } from "./state.js";
import { contourToShapes } from "./contourToShapes/contourToShapes.js";

export function addAndEditPath(type) {
  let newTraceOrRegion = null;
  if (type === "traces") {
    newTraceOrRegion = {
      track: [],
      layers: ["F.Cu"],
      polarity: "+",
      thickness: 0.015,
    };
  }

  if (type === "regions") {
    newTraceOrRegion = {
      contour: [],
      layers: ["F.Cu"],
      polarity: "+",
    };
  }

  patchState((s) => {
    let index = null;

    if (type === "traces") {
      s.board.traces.push(newTraceOrRegion);
      index = s.board.traces.length - 1;
    }

    if (type === "regions") {
      s.board.regions.push(newTraceOrRegion);
      index = s.board.regions.length - 1;
    }

    s.editPath = {
      editing: true,
      data: {
        type,
        index,
        trackOrContourData: contourToShapes([]),
      },
      editMode: "DRAW",
      selectedPoints: new Set(),
    };

    s.editModal = {
      open: true,
      type,
      id: index,
    };

    s.currentPoint = null;
    s.lastPoint = null;
  });
}

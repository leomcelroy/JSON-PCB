import { Board, Path, Region, Trace, Pad } from "../types/Board";
import { LinesArcs } from "../types/LinesArcs";
import {
  ProcessedBoard,
  ProcessedTrace,
  ProcessedRegion,
  BoundingBox,
} from "../types/ProcessedBoard";
import { pathToPolyline } from "./pathTransformers/pathToPolyline";
import { pathToShapes } from "./pathTransformers/pathToShapes";
import {
  translateShapes,
  rotateShapes,
  flipShapes,
} from "./arcLines/shapeTransformations";

const BIG_NUMBER = 1e9;
const initBoundingBox = () => ({
  xMin: BIG_NUMBER,
  xMax: -BIG_NUMBER,
  yMin: BIG_NUMBER,
  yMax: -BIG_NUMBER,
});

export function processBoard(board: Board): ProcessedBoard {
  const processedBoard: ProcessedBoard = {
    footprints: [],
    components: [],
    boardBoundingBox: initBoundingBox(),
    layers: {},
    drills: [],
    mmPerUnit: board.mmPerUnit ?? 25.4,
    paths: [],
  };

  (board?.footprints || []).forEach((footprint) => {
    let boundingBox = initBoundingBox();
    const id = footprint.id;

    const polylines: Polyline[] = [];

    (footprint?.regions || []).forEach((region) => {
      const polyline = pathToPolyline(region.contour);
      polylines.push(polyline);
      boundingBox = updateBoundingBox(boundingBox, getBoundingBox(polyline));
    });

    (footprint?.traces || []).forEach((trace) => {
      const polyline = pathToPolyline(trace.track);
      polylines.push(polyline);
      boundingBox = updateBoundingBox(boundingBox, getBoundingBox(polyline));
    });

    processedBoard.footprints.push({
      id,
      polylines,
      pathData: polylinesToPathData(polylines),
      boundingBox,
    });
  });

  (board?.components || []).forEach((component) => {
    let componentBoundingBox = initBoundingBox();

    const footprint = board?.footprints.find(
      (footprint) => footprint.id === component.footprint
    );

    if (!footprint) return;

    const translate = component.position ?? [0, 0];
    const rotate = component.rotate ?? 0;
    const flip = component.flip ?? false;

    const transform: Transform = {
      translate,
      rotate,
      flip,
    };

    (footprint?.regions || []).forEach((region) => {
      const processedRegion = processRegion(region, transform);
      const boundingBox = processedRegion.boundingBox;
      componentBoundingBox = updateBoundingBox(
        componentBoundingBox,
        boundingBox
      );
    });
    (footprint?.traces || []).forEach((trace) => {
      const processedTrace = processTrace(trace, transform);
      const boundingBox = processedTrace.boundingBox;
      componentBoundingBox = updateBoundingBox(
        componentBoundingBox,
        boundingBox
      );
    });
    (footprint?.pours || []).forEach((pour) => {});
    (footprint?.drills || []).forEach((drill) => {
      processedBoard.drills.push({
        position: transformPoint(drill.position, transform),
        diameter: drill.diameter,
        start: drill.start,
        end: drill.end,
        plated: drill.plated,
      });

      const radius = drill.diameter / 2;
      const drillBoundingBox = {
        xMin: drill.position[0] + translate[0] - radius,
        xMax: drill.position[0] + translate[0] + radius,
        yMin: drill.position[1] + translate[1] - radius,
        yMax: drill.position[1] + translate[1] + radius,
      };
      componentBoundingBox = updateBoundingBox(
        componentBoundingBox,
        drillBoundingBox
      );
    });

    processedBoard.components.push({
      id: component.id,
      position: component.position,
      pads: transformPads(footprint.pads, transform), // need to transform pads
      boundingBox: componentBoundingBox,
    });
    processedBoard.boardBoundingBox = updateBoundingBox(
      processedBoard.boardBoundingBox,
      componentBoundingBox
    );
  });

  (board?.regions || []).forEach((region, index) => {
    const processedRegion = processRegion(region);
    processedBoard.paths.push({
      shapes: processedRegion.shapes,
      polyline: processedRegion.polyline,
      path: processedRegion.path,
      pathKey: ["regions", index],
      controlPoints: processedRegion.controlPoints,
      index: processedBoard.paths.length,
    });
    processedBoard.boardBoundingBox = updateBoundingBox(
      processedBoard.boardBoundingBox,
      processedRegion.boundingBox
    );
  });

  (board?.traces || []).forEach((trace, index) => {
    const processedTrace = processTrace(trace);
    processedBoard.paths.push({
      shapes: processedTrace.shapes,
      polyline: processedTrace.polyline,
      path: processedTrace.path,
      pathKey: ["traces", index],
      controlPoints: processedTrace.controlPoints,
      index: processedBoard.paths.length,
    });

    processedBoard.boardBoundingBox = updateBoundingBox(
      processedBoard.boardBoundingBox,
      processedTrace.boundingBox
    );
  });
  (board?.pours || []).forEach((pour) => {});
  (board?.drills || []).forEach((drill) => {
    processedBoard.drills.push(drill);
    const radius = drill.diameter / 2;
    const drillBoundingBox = {
      xMin: drill.position[0] - radius,
      xMax: drill.position[0] + radius,
      yMin: drill.position[1] - radius,
      yMax: drill.position[1] + radius,
    };
    processedBoard.boardBoundingBox = updateBoundingBox(
      processedBoard.boardBoundingBox,
      drillBoundingBox
    );
  });

  return processedBoard;

  function addToLayer(
    layer: string,
    type: "regions" | "traces",
    item: ProcessedRegion | ProcessedTrace
  ) {
    if (!processedBoard.layers[layer]) {
      processedBoard.layers[layer] = {
        positive: { regions: [], traces: [] },
        negative: { regions: [], traces: [] },
      };
    }

    const polarity =
      item.polarity === "+" || item.polarity === undefined
        ? "positive"
        : "negative";

    if (type === "regions") {
      processedBoard.layers[layer][polarity].regions.push(
        item as ProcessedRegion
      );
    }

    if (type === "traces") {
      processedBoard.layers[layer][polarity].traces.push(
        item as ProcessedTrace
      );
    }
  }

  function processRegion(
    region: Region,
    transform: Transform | null = null
  ): ProcessedRegion {
    const { transformedPolyline, transformedShapes } = getTransformedGeometry(
      region.contour,
      transform
    );

    const processedRegion: ProcessedRegion = {
      ...region,
      polyline: transformedPolyline,
      shapes: transformedShapes,
      boundingBox: getBoundingBox(transformedPolyline),
      path: region.contour,
      controlPoints: getPathControlPoints(region.contour),
    };

    region.layers.forEach((layer) => {
      const processedLayer = transform?.flip ? swapFB(layer) : layer;
      addToLayer(processedLayer, "regions", processedRegion);
    });

    return processedRegion;
  }

  function processTrace(
    trace: Trace,
    transform: Transform | null = null
  ): ProcessedTrace {
    const { transformedPolyline, transformedShapes } = getTransformedGeometry(
      trace.track,
      transform
    );

    const processedTrace: ProcessedTrace = {
      ...trace,
      polyline: transformedPolyline,
      shapes: transformedShapes,
      boundingBox: getBoundingBox(transformedPolyline),
      path: trace.track,
      controlPoints: getPathControlPoints(trace.track),
    };

    trace.layers.forEach((layer) => {
      const processedLayer = transform?.flip ? swapFB(layer) : layer;
      addToLayer(processedLayer, "traces", processedTrace);
    });

    return processedTrace;
  }
}

type Polyline = [number, number][];

type Transform = {
  translate: [number, number];
  rotate: number;
  flip: boolean;
};

function getTransformedGeometry(
  path: Path,
  transform: Transform | null
): { transformedPolyline: Polyline; transformedShapes: LinesArcs } {
  const polyline = pathToPolyline(path);
  const transformedPolyline = transform
    ? applyTransform(polyline, transform)
    : polyline;

  const shapes = pathToShapes(path);
  const transformedShapes = transform
    ? applyTransformShapes(shapes, transform)
    : shapes;

  return { transformedPolyline, transformedShapes };
}

function applyTransformShapes(
  shapes: LinesArcs,
  transform: Transform
): LinesArcs {
  const { translate, rotate, flip } = transform;
  let tempShapes = shapes;

  if (flip) tempShapes = flipShapes(tempShapes, "horizontal");
  tempShapes = rotateShapes(tempShapes, rotate);
  tempShapes = translateShapes(tempShapes, translate);
  return tempShapes;
}

function applyTransform(polyline: Polyline, transform: Transform): Polyline {
  const { translate, rotate, flip } = transform;
  const angleRad = (rotate * Math.PI) / 180;
  const cosA = Math.cos(angleRad);
  const sinA = Math.sin(angleRad);

  return polyline.map(([x, y]) => {
    // Apply flip
    let flippedX = flip ? -x : x;

    // Apply rotation around origin (0,0)
    let rotatedX = flippedX * cosA - y * sinA;
    let rotatedY = flippedX * sinA + y * cosA;

    // Apply translation
    let finalX = rotatedX + translate[0];
    let finalY = rotatedY + translate[1];

    return [finalX, finalY];
  });
}

function swapFB(inputString) {
  const result = inputString
    .replace(/F\./g, "TEMP")
    .replace(/B\./g, "F.")
    .replace(/TEMP/g, "B.");
  return result;
}

function getBoundingBox(polyline: Polyline): BoundingBox {
  const xValues = polyline.map(([x]) => x);
  const yValues = polyline.map(([_, y]) => y);

  return {
    xMin: Math.min(...xValues),
    xMax: Math.max(...xValues),
    yMin: Math.min(...yValues),
    yMax: Math.max(...yValues),
  };
}

function updateBoundingBox(...boundingBoxes: BoundingBox[]): BoundingBox {
  return boundingBoxes.reduce((acc, curr) => {
    return {
      xMin: Math.min(acc.xMin, curr.xMin),
      xMax: Math.max(acc.xMax, curr.xMax),
      yMin: Math.min(acc.yMin, curr.yMin),
      yMax: Math.max(acc.yMax, curr.yMax),
    };
  }, boundingBoxes[0]);
}

function polylinesToPathData(polylines: Polyline[]): string {
  return polylines.reduce((acc, cur) => {
    return acc + `M ${cur.map(([x, y]) => `${x},${y}`).join("L")}`;
  }, "");
}
function transformPads(pads: Pad[], transform: Transform): Pad[] {
  return pads.map((pad) => ({
    ...pad,
    position: transformPoint(pad.position, transform),
  }));
}

function transformPoint(
  point: [number, number],
  transform: Transform
): [number, number] {
  let [x, y] = point;
  const { translate, rotate, flip } = transform;

  // Apply flip if needed
  if (flip) {
    x = -x;
  }

  // Apply rotation
  if (rotate) {
    const angle = (rotate / 180) * Math.PI;
    const cosTheta = Math.cos(angle);
    const sinTheta = Math.sin(angle);

    const dx = x;
    const dy = y;

    x = cosTheta * dx - sinTheta * dy;
    y = sinTheta * dx + cosTheta * dy;
  }

  // Apply translation
  x += translate[0];
  y += translate[1];

  return [x, y];
}

function getPathControlPoints(path: Path): [number, number][] {
  type Point = [number, number];
  let currentPosition: Point = [0, 0];
  const controlPoints: Point[] = [];
  for (const [command, ...args] of path) {
    if (command === "start" || command === "s") {
      const [x, y] = args as Point;
      currentPosition = [x, y];
    } else if (command === "absolute" || command === "a") {
      const [x, y] = args as Point;
      currentPosition = [x, y];
    } else if (command === "relative" || command === "r") {
      const [dx, dy] = args as Point;
      currentPosition = [currentPosition[0] + dx, currentPosition[1] + dy];
    } else if (command === "close" || command === "c") {
      currentPosition = [...controlPoints[0]];
    }

    controlPoints.push(currentPosition);
  }
  return controlPoints;
}

import { Path } from "../../types/Board";
import { LinesArcs, Line, Arc } from "../../types/LinesArcs";

import { handleBiarcCorner } from "./handleBiarcCorner";
import { handleFilletCorner } from "./handleFilletCorner";
import { convertSegmentsToLinesArcs } from "./convertSegmentsToLinesArcs";

type Polyline = [number, number][];
type Segment =
  | {
      type: "polyline";
      points: [number, number][];
    }
  | {
      type: "arc";
      t1: [number, number];
      t2: [number, number];
      center: [number, number];
      radius: number;
      sweepDirection: number;
    }
  | {
      type: "point";
      coords: [number, number];
    };

export function pathToShapes(path: Path): LinesArcs {
  const segments: Segment[] = [];

  const coords: Polyline = getPathControlPoints(path);
  const isClosed = path?.at(-1)?.[0][0] === "c";
  const n = isClosed ? path.length - 1 : path.length;

  if (path.length === 0) return [];
  if (typeof path[0][1] !== "number" || typeof path[0][2] !== "number") {
    return [];
  }

  for (let i = 0; i < n; i++) {
    if (!isClosed && (i === 0 || i === n - 1)) {
      segments.push({
        type: "point",
        coords: coords[i],
      });
      continue;
    }

    const prevIndex = isClosed ? (i - 1 + n) % n : i - 1;
    const nextIndex = isClosed ? (i + 1) % n : i + 1;
    const prev = coords[prevIndex];
    const current = coords[i];
    const next = coords[nextIndex];

    const corner = path[i][3];

    if (corner === undefined) {
      segments.push({ type: "point", coords: current });
    } else if (corner === "fillet") {
      const segmentData = handleFilletCorner(current, prev, next, path[i][4]);
      segments.push(segmentData as Segment);
    } else if (corner === "biarc") {
      const newSegmentsData = handleBiarcCorner(current, prev, next, 0.5);
      segments.push(...(newSegmentsData as Segment[]));
    }
  }

  const linesArcs = convertSegmentsToLinesArcs(segments, isClosed);
  return linesArcs;
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

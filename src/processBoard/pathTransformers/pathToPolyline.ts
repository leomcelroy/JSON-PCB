import { Path } from "../../types/Board";

import { sampleArc } from "./sampleArc";
import { handleBiarcCorner } from "./handleBiarcCorner";
import { handleFilletCorner } from "./handleFilletCorner";
import { pointsEqual } from "./utils";

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

export function pathToPolyline(path: Path): Polyline {
  const polyline: Polyline = [];
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
      const segment = handleFilletCorner(current, prev, next, path[i][4]);
      segments.push(segment as Segment);
    } else if (corner === "biarc") {
      // console.log("biarc", current, prev, next, corner);
      const newSegments = handleBiarcCorner(current, prev, next, 0.5);

      segments.push(...(newSegments as Segment[]));
    }
  }

  segments.forEach((segment) => {
    if (segment.type === "point") {
      polyline.push(segment.coords);
    } else if (segment.type === "arc") {
      sampleArc(polyline, segment, 8);
    } else if (segment.type === "polyline") {
      segment.points.forEach((pt) => {
        polyline.push([...pt]);
      });
    }
  });

  if (isClosed) {
    const first = polyline[0];
    const last = polyline[polyline.length - 1];
    if (!pointsEqual(last, first)) {
      polyline.push([...first]);
    }
  }

  return polyline;
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

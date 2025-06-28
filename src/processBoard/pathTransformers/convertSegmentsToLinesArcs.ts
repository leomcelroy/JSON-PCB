import { LinesArcs, Line, Arc } from "../../types/LinesArcs";

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

// Helper function to check if two points are approximately equal
const pointsAreEqual = (
  p1: [number, number],
  p2: [number, number],
  tolerance = 1e-6
): boolean => {
  return (
    Math.abs(p1[0] - p2[0]) < tolerance && Math.abs(p1[1] - p2[1]) < tolerance
  );
};

export function convertSegmentsToLinesArcs(
  segments: Segment[],
  isClosed: boolean
): LinesArcs {
  const linesArcs: LinesArcs = [];
  let lastEndPoint: [number, number] | null = null;

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const currentStartPoint = getStartPoint(segment);
    const currentEndPoint = getEndPoint(segment);

    // Add connection line if needed (and points are not coincident)
    if (lastEndPoint && !pointsAreEqual(lastEndPoint, currentStartPoint)) {
      linesArcs.push({
        type: "line",
        start: lastEndPoint,
        end: currentStartPoint,
      });
    }

    // Process the current segment
    if (segment.type === "polyline") {
      // Add lines for the polyline segments
      for (let j = 0; j < segment.points.length - 1; j++) {
        linesArcs.push({
          type: "line",
          start: segment.points[j],
          end: segment.points[j + 1],
        });
      }
    } else if (segment.type === "arc") {
      // Add the arc
      // Calculate angles from points
      const startAngle = Math.atan2(
        segment.t1[1] - segment.center[1],
        segment.t1[0] - segment.center[0]
      );
      const endAngle = Math.atan2(
        segment.t2[1] - segment.center[1],
        segment.t2[0] - segment.center[0]
      );
      // Assume sweepDirection 1 is anticlockwise, 0 is clockwise
      const anticlockwise = segment.sweepDirection < 0;

      linesArcs.push({
        type: "arc",
        start: segment.t1,
        end: segment.t2,
        center: segment.center,
        radius: segment.radius,
        startAngle: startAngle,
        endAngle: endAngle,
        anticlockwise: anticlockwise,
      });
    } else if (segment.type === "point") {
    }

    // Update the last end point for the next iteration's connection check
    lastEndPoint = currentEndPoint;
  }

  if (isClosed && lastEndPoint !== null) {
    linesArcs.push({
      type: "line",
      start: lastEndPoint,
      end: getStartPoint(segments[0]),
    });
  }

  return linesArcs;
}

function getStartPoint(segment: Segment): [number, number] {
  if (segment.type === "point") {
    return segment.coords;
  } else if (segment.type === "arc") {
    return segment.t1;
  } else if (segment.type === "polyline") {
    // Ensure polyline has points before accessing index 0
    if (segment.points.length > 0) {
      return segment.points[0];
    }
  }
  // Handle empty or invalid polyline
  console.warn("Segment has no start point:", segment);
  return [0, 0]; // Or throw error depending on desired behavior
}

function getEndPoint(segment: Segment): [number, number] {
  if (segment.type === "point") {
    return segment.coords;
  } else if (segment.type === "arc") {
    return segment.t2;
  } else if (segment.type === "polyline") {
    // Ensure polyline has points before accessing index
    if (segment.points.length > 0) {
      return segment.points[segment.points.length - 1];
    }
  }
  // Handle empty or invalid polyline
  console.warn("Segment has no end point:", segment);
  return [0, 0]; // Or throw error depending on desired behavior
}

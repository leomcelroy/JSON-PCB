export type LinesArcs = (Line | Arc)[];

export type Line = {
  type: "line";
  start: [number, number];
  end: [number, number];
};

export type Arc = {
  type: "arc";
  center: [number, number];
  startAngle: number;
  endAngle: number;
  radius: number;
  start: [number, number];
  end: [number, number];
  anticlockwise: boolean;
};

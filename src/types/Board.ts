export type Board = {
  version: string;
  footprints: Footprint[];
  components: Component[];
  pads: Pad[];
  regions: Region[];
  traces: Trace[];
  drills: Drill[];
  nets: Net[];
  pours: Pour[];
  mmPerUnit: number;
};

export type Corner =
  | ["fillet", radius: number]
  | ["chamfer", radius: number]
  | ["biarc"]
  | [];

export type PathCommand =
  | ["start" | "s", x: number, y: number, ...Corner]
  | ["absolute" | "a", x: number, y: number, ...Corner]
  | ["relative" | "r", dx: number, dy: number, ...Corner]
  | ["close" | "c"];

// export type PathCommand2 =
//   | ["start" | "s", x: number, y: number]
//   | ["absolute" | "a", x: number, y: number]
//   | ["relative" | "r", dx: number, dy: number]
//   | ["start fillet" | "s fillet", x: number, y: number, radius: number]
//   | ["absolute fillet" | "a fillet", x: number, y: number, radius: number]
//   | ["relative fillet" | "r fillet", dx: number, dy: number, radius: number]
//   | ["start chamfer" | "s chamfer", x: number, y: number, radius: number]
//   | ["absolute chamfer" | "a chamfer", x: number, y: number, radius: number]
//   | ["relative chamfer" | "r chamfer", dx: number, dy: number, radius: number]
//   | ["start biarc" | "s biarc", x: number, y: number]
//   | ["absolute biarc" | "a biarc", x: number, y: number]
//   | ["relative biarc" | "r biarc", dx: number, dy: number]
//   | ["close" | "c"];

export type Path = PathCommand[];

export type Polarity = "+" | "-";

export type Layer = string; // Add other valid layers as needed

export type Footprint = {
  id: string;
  pads: Pad[]; // Assuming Pad is defined elsewhere or needs definition
  regions: Region[];
  traces: Trace[];
  drills: Drill[];
  nets: Net[];
  pours: Pour[];
};

export type Component = {
  id: string;
  footprint: string;
  position: [x: number, y: number];
  rotate: number;
  flip: boolean;
};

export type Pad = {
  id: string;
  position: [x: number, y: number];
};

export interface Region {
  contour: Path;
  layers: Layer[];
  polarity: Polarity;
  maskOffset?: number;
}

export interface Trace {
  track: Path;
  diameter: number;
  layers: Layer[];
  polarity: Polarity;
  maskOffset?: number;
}

export type Drill = {
  position: [x: number, y: number];
  diameter: number;
  start: Layer;
  end: Layer;
  plated: boolean;
};

export type Net = {
  name: string;
  pads: [string, string][]; // Array of [componentId, padId]
};

export type Pour = {
  contour: Path;
  layer: Layer;
  net: string; // Refers to Net name
  clearance: number;
};

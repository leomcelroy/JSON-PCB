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

export type Corner = ["fillet", number] | ["chamfer", number] | ["biarc"];

export type PathCommand =
  | ["start", number, number, Corner?]
  | ["absolute", number, number, Corner?]
  | ["relative", number, number, Corner?]
  | ["close"];

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
  position: [number, number];
  rotate: number;
  flip: boolean;
};

export type Pad = {
  id: string;
  position: [number, number];
};

export type Region = {
  contour: Path;
  layers: Layer[];
  polarity: Polarity;
  maskOffset?: number;
};

export type Trace = {
  track: Path;
  diameter: number;
  layers: Layer[];
  polarity: Polarity;
  maskOffset?: number;
};

export type Drill = {
  position: [number, number];
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

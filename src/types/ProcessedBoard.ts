import { LinesArcs } from "./LinesArcs.ts";
import { Drill, Path, Region, Trace } from "./Board";

export type ProcessedBoard = {
  footprints: Footprint[];
  components: Component[];
  boardBoundingBox: BoundingBox;
  paths: PathData[];
  layers: Layers;
  drills: Drill[];
  mmPerUnit: number;
};

export type Layers = {
  [layerName: string]: {
    positive: RegionsTraces;
    negative: RegionsTraces;
  };
};

export type PathData = {
  shapes: LinesArcs;
  polyline: [number, number][];
  path: Path;
  pathKey: ["regions" | "traces", index: number];
  index: number;
  controlPoints: [number, number][];
};

type Footprint = {
  id: string;
  polylines: [number, number][][];
  pathData: string;
  boundingBox: BoundingBox;
};

type Component = {
  id: string;
  position: [number, number];
  pads: Pad[];
  boundingBox: BoundingBox;
};

type Pad = {
  id: string;
  position: [number, number];
};

type RegionsTraces = {
  regions: ProcessedRegion[];
  traces: ProcessedTrace[];
};

export interface ProcessedRegion extends Region {
  shapes: LinesArcs;
  polyline: [number, number][];
  boundingBox: BoundingBox;
  path: Path;
  controlPoints: [number, number][];
}

export interface ProcessedTrace extends Trace {
  shapes: LinesArcs;
  polyline: [number, number][];
  boundingBox: BoundingBox;
  path: Path;
  controlPoints: [number, number][];
}

export type BoundingBox = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

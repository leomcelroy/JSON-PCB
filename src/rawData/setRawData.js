import { patchState } from "../state.js";

export function setRawData({ regions, traces, routes }) {
  const layerMap = {};
  // Initialize layerMap with all potential layers from regions and traces
  const allLayers = new Set([
    ...regions.flatMap((r) => r.layers),
    ...traces.flatMap((t) => t.layers),
  ]);
  allLayers.forEach((layerName) => {
    // Initialize structure for each layer
    layerMap[layerName] = {
      positive: { regions: [], traces: [] },
      negative: { regions: [], traces: [] },
    };
  });
  // Populate regions into the layerMap
  regions.forEach((region, i) => {
    region.layers.forEach((layerName) => {
      if (region.polarity === "+") {
        layerMap[layerName].positive.regions.push(i);
      } else {
        layerMap[layerName].negative.regions.push(i);
      }
    });
  });
  // Populate traces into the layerMap based on their polarity
  traces.forEach((trace, i) => {
    trace.layers.forEach((layerName) => {
      if (trace.polarity === "+") {
        layerMap[layerName].positive.traces.push(i);
      } else {
        // Assuming traces without explicit '+' polarity are considered negative
        // or handle based on actual data/requirements if polarity can be something else
        layerMap[layerName].negative.traces.push(i);
      }
    });
  });

  patchState((s) => {
    s.rawData.regions = regions;
    s.rawData.traces = traces;
    s.rawData.routes = routes;
    s.rawData.layers = layerMap;
  });
}

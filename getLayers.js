import { contourToShapes } from "./contourToShapes.js";

export function getLayers(board) {
    const layers = {};

    const collectShapes = (item, polarity, layer, type) => {
        if (!layers[layer])
            layers[layer] = {
                positive: { traces: [], regions: [] },
                negative: { traces: [], regions: [] },
            };
        layers[layer][polarity][type].push(item);
    };

    board.regions.forEach((region) => {
        const polarity =
            region.polarity === "+" || region.polarity === undefined
                ? "positive"
                : "negative";
        collectShapes(region, polarity, region.layer, "regions");
    });

    board.traces.forEach((trace) => {
        const polarity =
            trace.polarity === "+" || trace.polarity === undefined
                ? "positive"
                : "negative";
        collectShapes(trace, polarity, trace.layer, "traces");
    });

    board.components.forEach((component) => {
        component.pads.forEach((pad) => {
            pad.regions.forEach((region) => {
                const polarity =
                    region.polarity === "+" || region.polarity === undefined
                        ? "positive"
                        : "negative";
                collectShapes(region, polarity, region.layer, "regions");
            });

            pad.traces.forEach((trace) => {
                const polarity =
                    trace.polarity === "+" || trace.polarity === undefined
                        ? "positive"
                        : "negative";
                collectShapes(trace, polarity, trace.layer, "traces");
            });
        });
    });

    return layers;
}
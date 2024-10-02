import { sParse } from "./sParse.js";

export function kicadParse(data) {
    // Parse the KiCad module input
    const r = sParse(data);
    const scale = 1 / 25.4; // Convert from mm to inches or required units
    const pads = [];

    // Process the parsed lines to extract pad information
    for (const line of r) {
        if (line[0] !== "pad") continue; // Only process pad lines

        const name = line[1]; // Pad name
        const type = line[2]; // Pad type (SMD, thru_hole, etc.)
        const shape = line[3]; // Pad shape (circle, rect, etc.)
        const position = getNamedArray(line, "at").map(Number);
        const size = getNamedArray(line, "size").map(Number);
        const layers = getNamedArray(line, "layers");
        const drillInfo = extractDrillInfo(line);

        const pad = {
            id: name,
            position: [position[0] * scale, -position[1] * scale], // Adjust position, flip Y-axis
            regions: createRegions(shape, size, scale),
            layers: convertLayers(layers),
            drill: drillInfo,
            maskOffset: getMaskOffset(line), // Add mask offset if available
        };

        pads.push(pad);
    }

    // Return final structured object
    return {
        id: r[1], // Assuming second element is footprint/module ID
        pads: pads,
    };
}

// Convert shapes to regions
function createRegions(shape, size, scale) {
    const [width, height] = size.map((s) => s * scale);

    if (shape === "rect") {
        return [
            {
                contour: createRectangle(width, height),
                polarity: "+",
            },
        ];
    } else if (shape === "circle") {
        const radius = width / 2;
        return [
            {
                contour: createCircle(radius),
                polarity: "+",
            },
        ];
    } else if (shape === "oval") {
        return [
            {
                contour: createOval(width, height),
                polarity: "+",
            },
        ];
    } else if (shape === "roundrect") {
        const rratio = getNamedArray(line, "roundrect_rratio")[0];
        return [
            {
                contour: createRoundRect(width, height, rratio),
                polarity: "+",
            },
        ];
    }
    // Custom shape handling can be added here
    return [];
}

// Extract drill information for thru-hole pads
function extractDrillInfo(line) {
    const drillIndex = line.findIndex(
        (entry) => Array.isArray(entry) && entry[0] === "drill",
    );
    if (drillIndex === -1) return null;

    const drillSize = Number(line[drillIndex][1]) * (1 / 25.4); // Convert to inches or required units
    const plated = line[drillIndex][2] === "plated"; // Check if plated
    return {
        diameter: drillSize,
        start: "F.Cu", // Default values for drill layer
        end: "B.Cu",
        plated: plated || false,
    };
}

// Create a rectangular contour
function createRectangle(width, height) {
    return [
        ["start", -width / 2, height / 2],
        ["lineTo", width / 2, height / 2],
        ["lineTo", width / 2, -height / 2],
        ["lineTo", -width / 2, -height / 2],
        ["close"],
    ];
}

// Create a circular contour
function createCircle(radius) {
    return [
        ["start", 0, radius],
        ["arcTo", 0, -radius, { sweepAngle: 360 }],
        ["close"],
    ];
}

// Create an oval contour
function createOval(width, height) {
    return createRoundRect(width, height, 1); // Oval is a round rectangle with maximum corner radius
}

// Create a rounded rectangle contour
function createRoundRect(width, height, rratio) {
    const radius = (Math.min(width, height) * rratio) / 2;
    return [
        ["start", -width / 2 + radius, height / 2],
        ["lineTo", width / 2 - radius, height / 2],
        [
            "arcTo",
            width / 2,
            height / 2 - radius,
            { corner: ["fillet", radius] },
        ],
        ["lineTo", width / 2, -height / 2 + radius],
        [
            "arcTo",
            width / 2 - radius,
            -height / 2,
            { corner: ["fillet", radius] },
        ],
        ["lineTo", -width / 2 + radius, -height / 2],
        [
            "arcTo",
            -width / 2,
            -height / 2 + radius,
            { corner: ["fillet", radius] },
        ],
        ["lineTo", -width / 2, height / 2 - radius],
        [
            "arcTo",
            -width / 2 + radius,
            height / 2,
            { corner: ["fillet", radius] },
        ],
        ["close"],
    ];
}

// Convert KiCad layers into the required format
function convertLayers(layers) {
    return layers.map((layer) => {
        if (layer === "*") return ["F.Cu", "B.Cu"]; // Handle wildcard layers
        return layer;
    });
}

// Utility to extract named arrays from KiCad format
function getNamedArray(line, name) {
    const entry = line.find((e) => Array.isArray(e) && e[0] === name);
    return entry ? entry.slice(1) : [];
}

// Extract mask offset from line
function getMaskOffset(line) {
    const maskMargin = getNamedArray(line, "solder_mask_margin");
    return maskMargin.length ? Number(maskMargin[0]) * (1 / 25.4) : 0.03; // Default value
}

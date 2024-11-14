import { sParse } from "./sParse.js";

export function kicadParse(data) {
    let r = sParse(data);

    let scale = 1 / 25.4;
    const pads = [];
    const seenPads = new Set();

    for (const line of r) {
        const isPad = line[0] === "pad";
        const isSmd = line[2] === "smd";
        const isThru = line[2] === "thru_hole";
        const shape = line[3];

        if (isPad && (isSmd || isThru)) {
            let name = line[1];

            let at = getNamedArray(line, "at").map((x) => Number(x) * scale);
            at[1] = -at[1]; // negative Y axis
            let rotate =
                at.length === 3 ? Number(getNamedArray(line, "at")[2]) : 0;

            let layers = getNamedArray(line, "layers");
            layers = convertLayers(layers);

            let size = getNamedArray(line, "size").map(
                (x) => Number(x) * scale,
            );

            const shapeCases = {
                rect: () => rectangle(...size),
                roundrect: () => {
                    const ratio = Number(
                        getNamedArray(line, "roundrect_rratio")[0],
                    );
                    const pts = generateRoundRect(0, 0, ...size, ratio);

                    return path;
                },
                circle: () => circle(...size.map((x) => x / 2)),
                oval: () => {
                    const path = generateRoundRect(0, 0, ...size, 1);
                    return path;
                },
                custom: () => {
                    const primitives = getNamedArray(line, "primitives");

                    const poly = primitives[0][1]
                        .slice(1)
                        .map((xy, i) => [
                            i === 0 ? "start" : "lineTo",
                            Number(xy[1]) * scale,
                            Number(xy[2]) * scale,
                        ]);

                    return poly;
                },
                // "ellipse": () => circle(...size),
            };

            let shapeGeometry = shape in shapeCases ? shapeCases[shape]() : [];

            if (rotate !== 0) {
                shapeGeometry = rotatePath(shapeGeometry, rotate);
            }

            const regions = [];

            regions.push({
                contour: shapeGeometry,
                polarity: "+",
                layers,
            });

            const footprint = {
                position: at,
                regions,
            };

            const drillIndex = line.findIndex(
                (entry) => Array.isArray(entry) && entry[0] === "drill",
            );

            if (drillIndex !== -1) {
                let drillDia = Number(line[drillIndex][1]) * scale;
                if (drillDia)
                    footprint.drill = {
                        diameter: drillDia,
                        start: "F.Cu", // this should come from layers
                        end: "B.Cu",
                        plated: true, // hmm how does kicad module do this
                    };
            }

            // if shared name in same location then merge
            // if this is in the same position has a current pad add it to that one

            let merged = false;
            pads.forEach((pad) => {
                const pos = pad.position;

                if (pos[0] !== at[0] || pos[1] !== at[1]) return;

                merged = true;

                pad.regions = [...pad.regions, ...regions];
                if (footprint.drill && pad.drill)
                    pad.drill.diameter = Math.max(
                        pad.drill.diameter,
                        footprint.drill.diameter,
                    );
                if (footprint.drill) pad.drill = footprint.drill;
            });

            if (merged) continue;

            let i = 0;
            let getName = () => name + (i === 0 ? "" : i);
            while (seenPads.has(getName())) {
                i++;
            }
            pads.push({
                id: getName(),
                ...footprint,
            });
            seenPads.add(getName());
        }
    }

    const result = JSON.parse(
        JSON.stringify({
            id: r[1],
            pads,
        }),
    );

    return result;
}

const rectangle = (w, h) => {
    const p0 = [-w / 2, h / 2];
    const p1 = [w / 2, h / 2];
    const p2 = [w / 2, -h / 2];
    const p3 = [-w / 2, -h / 2];

    return [
        ["start", ...p0],
        ["lineTo", ...p1],
        ["lineTo", ...p2],
        ["lineTo", ...p3],
        ["close"],
    ];
};

const circle = (r) => {
    return [
        ["start", r, 0],
        ["arcTo", -r, 0, { sweepAngle: 180 }],
        ["arcTo", r, 0, { sweepAngle: 180 }],
    ];
};

function rotatePath(path, theta) {
    theta = (theta / 180) * Math.PI;
    const rotatePoint = ([x, y], theta) => {
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);
        const newX = x * cosTheta - y * sinTheta;
        const newY = x * sinTheta + y * cosTheta;
        return [newX, newY];
    };

    return path.map((command) => {
        if (command[0] === "close") return command;
        const [type, x, y] = command;
        const [newX, newY] = rotatePoint([x, y], theta);
        return [type, newX, newY];
    });
}

const convertLayers = (layers) =>
    layers.reduce((acc, cur) => {
        let l = cur.split(".");
        if (l.length === 0) return acc;
        else if (l[0] !== "*") return [...acc, cur];
        else return [...acc, `F.${l[1]}`, `B.${l[1]}`];
    }, []);

const getNamedArray = (line, name) => {
    const index = line.findIndex(
        (entry) => Array.isArray(entry) && entry[0] === name,
    );
    const value = line[index];

    return value ? value.slice(1) : [];
};

function generateRoundRect(centerX, centerY, width, height, rratio) {
    const radius = (Math.min(width, height) * rratio) / 2;

    const topLeft = [
        centerX - width / 2 + radius,
        centerY - height / 2 + radius,
    ];
    const topRight = [
        centerX + width / 2 - radius,
        centerY - height / 2 + radius,
    ];
    const bottomRight = [
        centerX + width / 2 - radius,
        centerY + height / 2 - radius,
    ];
    const bottomLeft = [
        centerX - width / 2 + radius,
        centerY + height / 2 - radius,
    ];

    return [
        ["start", ...topLeft, { corner: ["fillet", radius] }],
        ["lineTo", ...topRight, { corner: ["fillet", radius] }],
        ["lineTo", ...bottomRight, { corner: ["fillet", radius] }],
        ["lineTo", ...bottomLeft, { corner: ["fillet", radius] }],
        ["close"],
    ];
}

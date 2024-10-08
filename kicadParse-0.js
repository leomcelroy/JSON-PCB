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
                    // let _ = rectangle(...size);
                    // roundCorners(_);

                    const ratio = Number(
                        getNamedArray(line, "roundrect_rratio")[0],
                    );
                    const pts = generateRoundRect(0, 0, ...size, ratio);

                    return [pts];
                },
                circle: () => circle(...size.map((x) => x / 2)),
                oval: () => {
                    const pts = generateRoundRect(0, 0, ...size, 1);
                    return [pts];
                },
                custom: () => {
                    const primitives = getNamedArray(line, "primitives");

                    const poly = primitives[0][1]
                        .slice(1)
                        .map((xy) => [
                            Number(xy[1]) * scale,
                            Number(xy[2]) * scale,
                        ]);

                    return [poly];
                },
                // "ellipse": () => circle(...size),
            };

            let shapeGeometry = shape in shapeCases ? shapeCases[shape]() : [];

            if (rotate !== 0) {
                rotateShape(shapeGeometry, rotate);
            }

            const regions = [];

            shapeGeometry.forEach((s) => {
                let contour = [];

                s.forEach((p, i) => {
                    const [x, y] = p;
                    if (i === 0) {
                        contour.push(["start", x, y]);
                    } else {
                        contour.push(["lineTo", x, y]);
                    }
                });

                regions.push({
                    contour,
                    polarity: "+",
                });
            });

            const footprint = {
                position: at,
                regions,
                layers,
            };

            const drillIndex = line.findIndex(
                (entry) => Array.isArray(entry) && entry[0] === "drill",
            );

            if (drillIndex !== -1) {
                let drillDia = Number(line[drillIndex][1]) * scale;
                footprint.drill = {
                    diameter: drillDia,
                    start: "F.Cu", // this should come from layers
                    end: "B.Cu",
                    plated: true, // hmm how does kicad module do this
                };
            }

            let i = 0;
            let getName = () => name + (i === 0 ? "" : i);
            while (seenPads.has(getName())) {
                i++;
            }
            pads.push({
                id: name,
                ...footprint,
            });
            seenPads.add(getName());
        }
    }

    console.log({ r, pads });

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

    return [[p0, p1, p2, p3, p0]];
};

const circle = (r) => {
    const n = 360 / 2;
    const pts = [];

    const getX = (theta, r) => r * Math.cos(theta);
    const getY = (theta, r) => r * Math.sin(theta);

    for (let i = 0; i < n; i++) {
        const theta = ((Math.PI * 2) / n) * i;
        const x = getX(theta, r);
        const y = getY(theta, r);
        pts.push([x, y]);
    }

    const [x, y] = pts[0];
    pts.push([x, y]);

    return [pts];
};

// parser should take units

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

function generateRoundRect(
    centerX,
    centerY,
    width,
    height,
    rratio,
    numPointsPerCorner = 10,
) {
    // Calculate the radius
    var radius = (Math.min(width, height) * rratio) / 2;

    // Calculate the corner centers
    var topLeft = [centerX - width / 2 + radius, centerY - height / 2 + radius];
    var topRight = [
        centerX + width / 2 - radius,
        centerY - height / 2 + radius,
    ];
    var bottomRight = [
        centerX + width / 2 - radius,
        centerY + height / 2 - radius,
    ];
    var bottomLeft = [
        centerX - width / 2 + radius,
        centerY + height / 2 - radius,
    ];

    var points = [];

    // Generate points for each corner, we're using a simple circle equation here.
    for (var i = 0; i < numPointsPerCorner; i++) {
        var angle = ((Math.PI / 2) * i) / (numPointsPerCorner - 1);

        // Top left corner
        points.push([
            topLeft[0] - radius * Math.cos(angle),
            topLeft[1] - radius * Math.sin(angle),
        ]);
    }

    for (var i = 0; i < numPointsPerCorner; i++) {
        var angle = ((Math.PI / 2) * i) / (numPointsPerCorner - 1);

        // Top right corner
        points.push([
            topRight[0] + radius * Math.sin(angle),
            topRight[1] - radius * Math.cos(angle),
        ]);
    }

    for (var i = 0; i < numPointsPerCorner; i++) {
        var angle = ((Math.PI / 2) * i) / (numPointsPerCorner - 1);

        // Bottom right corner
        points.push([
            bottomRight[0] + radius * Math.cos(angle),
            bottomRight[1] + radius * Math.sin(angle),
        ]);
    }

    for (var i = 0; i < numPointsPerCorner; i++) {
        var angle = ((Math.PI / 2) * i) / (numPointsPerCorner - 1);

        // Bottom left corner
        points.push([
            bottomLeft[0] - radius * Math.sin(angle),
            bottomLeft[1] + radius * Math.cos(angle),
        ]);
    }

    // Add first point to the end to close the shape
    points.push(points[0]);

    return points;
}

const rotateShape = (shape, angle, point = [0, 0]) => {
    const fn = (p) => {
        let delta = (angle / 180) * Math.PI;

        let hereX = p[0] - point[0];
        let hereY = p[1] - point[1];

        let newPoint = [
            hereX * Math.cos(delta) - hereY * Math.sin(delta) + point[0],
            hereY * Math.cos(delta) + hereX * Math.sin(delta) + point[1],
        ];

        return newPoint;
    };

    return applyFn(shape, fn);

    function applyFn(shape, fn) {
        shape.forEach((pl, i) => {
            shape[i] = pl.map(fn);
        });

        return shape;
    }
};

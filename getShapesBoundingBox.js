export function getShapesBoundingBox(shapes) {
    let xMin = Infinity,
        yMin = Infinity;
    let xMax = -Infinity,
        yMax = -Infinity;

    shapes.forEach((shape) => {
        if (shape.type === "arc") {
            // Consider center, start, and end points for arc
            const {
                center,
                radius,
                start,
                end,
                startAngle,
                endAngle,
                anticlockwise,
            } = shape;

            const points = [start, end];

            // Check if the arc passes through critical points (top, bottom, left, right of the circle)
            const criticalPoints = [
                { angle: 0, point: [center[0] + radius, center[1]] }, // Right
                { angle: Math.PI / 2, point: [center[0], center[1] + radius] }, // Top
                { angle: Math.PI, point: [center[0] - radius, center[1]] }, // Left
                {
                    angle: (3 * Math.PI) / 2,
                    point: [center[0], center[1] - radius],
                }, // Bottom
            ];

            criticalPoints.forEach(({ angle, point }) => {
                if (
                    isAngleInArcRange(
                        startAngle,
                        endAngle,
                        angle,
                        anticlockwise,
                    )
                ) {
                    points.push(point);
                }
            });

            // Calculate min and max bounds for the arc
            points.forEach((point) => {
                xMin = Math.min(xMin, point[0]);
                yMin = Math.min(yMin, point[1]);
                xMax = Math.max(xMax, point[0]);
                yMax = Math.max(yMax, point[1]);
            });
        } else if (shape.type === "line") {
            // Consider start and end points for line
            const points = [shape.start, shape.end];

            points.forEach((point) => {
                xMin = Math.min(xMin, point[0]);
                yMin = Math.min(yMin, point[1]);
                xMax = Math.max(xMax, point[0]);
                yMax = Math.max(yMax, point[1]);
            });
        }
    });

    return {
        xMin,
        yMin,
        xMax,
        yMax,
    };
}

// Helper function to determine if an angle is within the arc's angular range
function isAngleInArcRange(startAngle, endAngle, testAngle, anticlockwise) {
    if (anticlockwise) {
        // Normalize angles to [0, 2π]
        if (startAngle < 0) startAngle += 2 * Math.PI;
        if (endAngle < 0) endAngle += 2 * Math.PI;
        if (testAngle < 0) testAngle += 2 * Math.PI;

        // Check if the arc spans the critical angle in the counterclockwise direction
        return testAngle <= startAngle && testAngle >= endAngle;
    } else {
        // Normalize angles to [0, 2π]
        if (startAngle < 0) startAngle += 2 * Math.PI;
        if (endAngle < 0) endAngle += 2 * Math.PI;
        if (testAngle < 0) testAngle += 2 * Math.PI;

        // Check if the arc spans the critical angle in the clockwise direction
        return testAngle >= startAngle && testAngle <= endAngle;
    }
}

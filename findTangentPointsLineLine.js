// Function to compute tangent points for a circle tangent to two lines
export function findTangentPointsLineLine(line1, line2, radius) {
    // Extract points from the line arguments
    const [Ax1, Ay1] = line1.end; // Line 1: A(x1, y1), B(x2, y2)
    const [Bx1, By1] = line1.start;
    const [Ax2, Ay2] = line2.start; // Line 2: A(x2, y2), B(x3, y3)
    const [Bx2, By2] = line2.end;

    // Step 1: Ensure that line1 and line2 share a common point A
    if (Ax1 !== Ax2 || Ay1 !== Ay2) {
        throw new Error("Lines must have the same common point A.");
    }

    const Ax = Ax1; // A is the common point of the two lines
    const Ay = Ay1;

    // Step 2: Compute direction vectors for AB and AC
    const dirAB = [Bx1 - Ax, By1 - Ay]; // Vector AB
    const dirAC = [Bx2 - Ax, By2 - Ay]; // Vector AC (corrected to use Bx2, By2 instead of Cx2, Cy2)

    // Step 3: Normalize direction vectors
    const lengthAB = Math.sqrt(dirAB[0] ** 2 + dirAB[1] ** 2);
    const lengthAC = Math.sqrt(dirAC[0] ** 2 + dirAC[1] ** 2);
    if (lengthAB === 0 || lengthAC === 0) {
        throw new Error(
            "Invalid line segment: start and end points cannot be the same.",
        );
    }
    const normAB = [dirAB[0] / lengthAB, dirAB[1] / lengthAB];
    const normAC = [dirAC[0] / lengthAC, dirAC[1] / lengthAC];

    // Step 4: Compute the bisector of the angle between AB and AC
    const bisectorVector = [
        (normAB[0] + normAC[0]) / 2,
        (normAB[1] + normAC[1]) / 2,
    ];

    // Step 5: Normalize the bisector vector
    const lengthBisector = Math.sqrt(
        bisectorVector[0] ** 2 + bisectorVector[1] ** 2,
    );
    const normBisector = [
        bisectorVector[0] / lengthBisector,
        bisectorVector[1] / lengthBisector,
    ];

    // Step 6: Compute the center of the circle
    const centerX = Ax + normBisector[0] * radius;
    const centerY = Ay + normBisector[1] * radius;

    // Step 7: Compute the tangent points on both lines (distance from the center perpendicular to the lines)
    const tangentAB = findTangentPoint(
        centerX,
        centerY,
        Ax,
        Ay,
        Bx1,
        By1,
        radius,
    );
    const tangentAC = findTangentPoint(
        centerX,
        centerY,
        Ax,
        Ay,
        Bx2,
        By2, // Corrected to use Bx2 and By2 (coordinates of C)
        radius,
    );

    // Return the center, tangent points, and the arc information
    return {
        center: [centerX, centerY],
        tangentPt1: tangentAB, // Tangent pt on line AB
        tangentPt2: tangentAC, // Tangent point on line AC
        radius: radius,
    };
}

function findTangentPoint(cx, cy, ax, ay, bx, by, radius) {
    // Vector from A to B
    const AB = [bx - ax, by - ay];

    // Log values to check inputs
    console.log("AB vector:", AB);
    console.log("Center:", cx, cy);
    console.log("A point:", ax, ay);
    console.log("B point:", bx, by);

    // Vector from center of the circle to A
    const OA = [ax - cx, ay - cy];

    // Log OA to check the vector
    console.log("OA vector:", OA);

    // Normalize AB
    const ABLength = Math.sqrt(AB[0] ** 2 + AB[1] ** 2);
    if (ABLength === 0) {
        throw new Error(
            "Invalid line segment: start and end points cannot be the same.",
        );
    }
    const ABNorm = [AB[0] / ABLength, AB[1] / ABLength];

    // Log normalized AB to check values
    console.log("Normalized AB:", ABNorm);

    // Calculate the projection of OA onto AB
    const dotProduct = OA[0] * ABNorm[0] + OA[1] * ABNorm[1];
    const projection = [ABNorm[0] * dotProduct, ABNorm[1] * dotProduct];

    // Log projection to check correctness
    console.log("Projection of OA onto AB:", projection);

    // Tangent point is the projection plus the radius in the perpendicular direction
    const tangentX = ax + projection[0] + radius * -ABNorm[1];
    const tangentY = ay + projection[1] + radius * ABNorm[0];

    // Log final tangent point to check results
    console.log("Tangent Point:", tangentX, tangentY);

    return [tangentX, tangentY];
}

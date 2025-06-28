/**
 * Handles calculating the segment for a straight corner (just a point).
 */
export function handleStraightCorner(...points) {
  return { type: "polyline", points };
}

export function isOutline(str) {
  if (typeof str !== "string") return false;

  const outlineLayers = [
    "Edge.Cuts",
    "Dimension",
    "Mechanical 1",
    "Board Outline",
    "Board Geometry",
    "Outline",
    "GKO",
    "GM1",
  ];

  return outlineLayers.some(
    (layer) => layer.toLowerCase() === str.toLowerCase(),
  );
}

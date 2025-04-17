export function getFilletChamferIndices(shape) {
  const filletChamferIndices = [];
  const closed =
    shape.at(0).start[0] === shape.at(-1).end[0] &&
    shape.at(0).start[1] === shape.at(-1).end[1];

  shape.forEach((lineOrArc, i) => {
    if (lineOrArc.type === "arc") return;
    if (lineOrArc.corner === null) return;

    const [type, radius] = lineOrArc.corner;
    filletChamferIndices.push({
      index0: i - 1 < 0 && closed ? shape.length - 1 : i - 1,
      index1: i,
      type,
      radius,
    });
  });

  return filletChamferIndices;
}

// start a new polyline
bt.moveTo(lines, x, y);
bt.moveBy(lines, dx, dy);
bt.movePolar(lines, localAngle, distance);
// bt.movePolarTo(lines, globalAngle, distance);
// bt.movePolarBy(lines, localAngle, distance);

// add to end polylines
bt.lineTo(lines, x, y);
bt.lineBy(lines, dx, dy); // step
bt.linePolar(lines, localAngle, distance); // turnForward
// bt.linePolarTo(lines, globalAngle, distance);
// bt.linePolarBy(lines, localAngle, distance);

// add arc to end polyline
// need to make sure final angle is proper
bt.arcTo(lines, x, y, ?sweepAngle);
bt.arcBy(lines, dx, dy, ?sweepAngle);
bt.arcPolar(lines, localAngle, distance, ?sweepAngle);
// bt.arcPolarTo(lines, globalAngle, distance, ?sweepAngle);
// bt.arcPolarBy(lines, localAngle, distance, ?sweepAngle);

// add point and add fillet at last corner
bt.filletTo(lines, x, y, radius);
bt.filletBy(lines, dx, dy, radius);
bt.filletPolar(lines, localAngle, distance, radius);

// add pint to end polyline which matches start of polyline
bt.close(lines)

// add point and add chamfer at last corner
bt.chamferTo(lines, x, y, radius);
bt.chamferBy(lines, dx, dy, radius);
bt.chamferPolar(lines, localAngle, distance, radius);

bt.circle(lines, cx, cy, radius);
bt.rect(lines, cx, cy, width, height)
bt.roundRect(lines, cx, cy, width, height, rounding)
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect



// positive angle is counter clockwise in Blot, sort of wish it was clockwise



// compass and straight edge
construction(
  ["lineTo", 0, 0],
  ["arcPolar", 43, 43],
  ["filletBy", 43, 43] // should this fillet the last point or this point, probably this point, which requires forsight
)

// compassRuler
// rulerCompass
// compassStraightedge

// https://www.w3schools.com/tags/ref_canvas.asp

const shape = createCompassRuler(); // new compassRuler(), compassStraightedge(), geometricConstruction

shape.lineTo(x, y)
shape.lineBy(dx, dy)
shape.linePolar(localAngle, length)
shape.moveTo(x, y)
shape.moveBy(dx, dy)
shape.movePolar(localAngle, length)
shape.arcTo(x, y, ?sweepAngle)
shape.arcBy(dx, dy, ?sweepAngle)
shape.arcPolar(localAngle, length, ?sweepAngle)
shape.filletTo(x, y, radius)
shape.filletBy(dx, dy, radius)
shape.filletPolar(localAngle, length, radius)
shape.close();
// if first point is filleted then apply that fillet
shape.rect(cx, cy, width, height);
shape.circle(cx, cy, radius);
shape.roundRect(cx, cy, width, height, cornerRadius);

// shape.apply(s => {
//   s
// })

shape.applyToPath(path => {
  
});

shape.getLines();
shape.getConstruction();
shape.copy();

// should be private
// commands // keep track of commands issued to track where to apply fillets, could be list of lines, arcs, circles
// fillets

/*
cornerRadius:

all-corners
[all-corners]
[top-left-and-bottom-right, top-right-and-bottom-left]
[top-left, top-right-and-bottom-left, bottom-right]
[top-left, top-right, bottom-right, bottom-left]
*/



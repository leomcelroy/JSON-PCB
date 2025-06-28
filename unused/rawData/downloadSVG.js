// download/downloadSVG.js

function polylineToPointsString(polyline) {
  // SVG y-coordinates are typically top-down, so we might need to flip y
  // Assuming input coordinates are standard Cartesian (y increases upwards)
  return polyline.map((pt) => `${pt[0]},${-pt[1]}`).join(" ");
}

export function getRawDataBoundingBox(rawData) {
  let xMin = Infinity,
    yMin = Infinity,
    xMax = -Infinity,
    yMax = -Infinity;

  const updateBounds = (pl, diameter = 0) => {
    const halfWidth = diameter / 2;
    pl.forEach(([x, y]) => {
      xMin = Math.min(xMin, x - halfWidth);
      xMax = Math.max(xMax, x + halfWidth);
      // Assuming y needs flipping for SVG, find bounds in original coordinate system first
      yMin = Math.min(yMin, y - halfWidth);
      yMax = Math.max(yMax, y + halfWidth);
    });
  };

  rawData.regions.forEach((r) => updateBounds(r.contour));
  rawData.traces.forEach((t) => updateBounds(t.track, t.diameter));
  rawData.routes.forEach((rt) => updateBounds(rt.track, rt.diameter));

  if (xMin === Infinity || yMin === Infinity) {
    // Return a default box if no valid bounds found
    return { x: 0, y: 0, width: 100, height: 100 };
  }

  // Return bounds in the original coordinate system (y increases upwards)
  return {
    x: xMin,
    y: yMin, // Minimum y in original coordinates
    width: xMax - xMin,
    height: yMax - yMin, // Height in original coordinates
  };
}

export function downloadRawDataSVG(
  rawData,
  colorMap,
  layerOrder,
  options = {} // Accept options object
) {
  const {
    filename = "rawData.svg",
    targetWidth: userWidth,
    targetHeight: userHeight,
  } = options;
  const { layers, regions, traces, routes } = rawData;

  if (!layers || Object.keys(layers).length === 0) {
    console.warn("No layer data found to generate SVG.");
    return;
  }

  const bbox = getRawDataBoundingBox(rawData);
  // Use bbox dimensions directly as the base for SVG size
  let baseWidth = bbox.width;
  let baseHeight = bbox.height;

  // Handle zero dimensions gracefully
  if (baseWidth <= 0) baseWidth = 100;
  if (baseHeight <= 0) baseHeight = 100;

  const aspectRatio = baseWidth / baseHeight;

  // Calculate final dimensions, allowing user override
  let finalWidth = baseWidth;
  let finalHeight = baseHeight;

  // Adjust dimensions based on user options, maintaining aspect ratio if only one is given
  if (userWidth && !userHeight) {
    finalWidth = userWidth;
    finalHeight = userWidth / aspectRatio;
  } else if (!userWidth && userHeight) {
    finalWidth = userHeight * aspectRatio;
    finalHeight = userHeight;
  } else if (userWidth && userHeight) {
    // Use user-provided dimensions directly
    finalWidth = userWidth;
    finalHeight = userHeight;
  }

  // Calculate scaling factors and offsets for coordinate transformation
  const scaleX = finalWidth / baseWidth;
  const scaleY = finalHeight / baseHeight; // Y scale might differ if aspect ratio changes
  const dataXMin = bbox.x;
  const dataYMax = bbox.y + bbox.height; // Top Y in original coordinates

  // Transformation function: Original (x, y) -> SVG (sx, sy)
  // Applies scaling, y-flip, and translation
  const transformPoint = (p) => {
    const sx = (p[0] - dataXMin) * scaleX;
    const sy = (dataYMax - p[1]) * scaleY; // Y is flipped and scaled
    return [sx, sy];
  };

  // Function to convert a polyline to SVG points string using transformation
  const transformPolylineToPointsString = (polyline) => {
    return polyline
      .map(transformPoint)
      .map((p) => `${p[0]},${p[1]}`)
      .join(" ");
  };

  const svgParts = [];
  svgParts.push(`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="${finalWidth}mm"
    height="${finalHeight}mm"
    style="background-color: #222;"
    stroke-linecap="round"
    stroke-linejoin="round">`);

  // Group elements by layer, iterating according to reversed layerOrder to match canvas draw order
  // (SVG draws later elements on top)
  [...layerOrder].reverse().forEach((layerName) => {
    const layerData = layers[layerName];
    if (!layerData) return; // Skip if layer defined in order but has no data

    const color = colorMap[layerName] || "#ffffff"; // Default to white if layer color not found
    svgParts.push(`  <g id="${layerName}" fill="none" stroke="${color}">`);

    // Positive Regions
    layerData.positive.regions.forEach((index) => {
      const region = regions[index];
      // Transform region points
      const points = transformPolylineToPointsString(region.contour);
      svgParts.push(
        `    <polygon points="${points}" fill="${color}" stroke="none" />`
      );
    });

    // Positive Traces
    layerData.positive.traces.forEach((index) => {
      const trace = traces[index];
      const points = transformPolylineToPointsString(trace.track);
      const scaledStrokeWidth = trace.diameter * scaleX; // Scale stroke width
      svgParts.push(
        `    <polyline points="${points}" stroke-width="${scaledStrokeWidth}" style="stroke-linecap: round; stroke-linejoin: round;"/>`
      );
    });

    // Negative Regions (rendered same as positive for simplicity)
    layerData.negative.regions.forEach((index) => {
      const region = regions[index];
      const points = transformPolylineToPointsString(region.contour);
      // Note: Representing negative regions accurately (knockout) in SVG can be complex.
      // This renders them as filled polygons for now. Could use masks or clipPaths.
      svgParts.push(
        `    <polygon points="${points}" fill="${color}" stroke="none" style="opacity:0.5;"/>`
      ); // Example: slightly different style
    });

    // Negative Traces (rendered same as positive for simplicity)
    layerData.negative.traces.forEach((index) => {
      const trace = traces[index];
      const points = transformPolylineToPointsString(trace.track);
      const scaledStrokeWidth = trace.diameter * scaleX; // Scale stroke width
      // Note: Representing negative traces accurately (knockout) in SVG can be complex.
      svgParts.push(
        `    <polyline points="${points}" stroke-width="${scaledStrokeWidth}" style="opacity:0.5;" />`
      ); // Example: slightly different style
    });

    svgParts.push(`  </g>`);
  });

  // Render routes - currently rendered last, might need layer association logic
  if (routes && routes.length > 0) {
    // Using a default color or perhaps determining color based on start/end layers if needed
    const routeColor = "#cccccc"; // Example default color for routes
    svgParts.push(`  <g id="routes" fill="none" stroke="${routeColor}">`);
    routes.forEach((route, index) => {
      if (route.track.length === 1) {
        const [x, y] = route.track[0];
        const [sx, sy] = transformPoint([x, y]); // Transform the point
        const scaledRadius = (route.diameter / 2) * scaleX; // Scale radius
        // Draw a circle for single-point routes
        // Use routeColor for fill, not stroke, to represent a filled point
        svgParts.push(
          `    <circle cx="${sx}" cy="${sy}" r="${scaledRadius}" fill="${routeColor}" stroke="none" />`
        );
      } else {
        // Draw a polyline for multi-point routes
        const points = transformPolylineToPointsString(route.track);
        const scaledStrokeWidth = route.diameter * scaleX; // Scale stroke width
        svgParts.push(
          `    <polyline points="${points}" stroke-width="${scaledStrokeWidth}" />`
        );
      }
    });
    svgParts.push(`  </g>`);
  }

  svgParts.push(`</svg>`);

  const svgString = svgParts.join("\n");

  // Trigger download
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

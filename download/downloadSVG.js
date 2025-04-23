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

  if (xMin === Infinity) return { x: 0, y: 0, width: 100, height: 100 }; // Default if no data

  // Adjust for SVG coordinate system (flip y)
  const svgYMin = -yMax;
  const svgYMax = -yMin;

  return {
    x: xMin,
    y: svgYMin, // Use the flipped min coordinate for SVG y
    width: xMax - xMin,
    height: svgYMax - svgYMin, // Height remains the same
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
  const margin = Math.max(bbox.width, bbox.height) * 0.05; // Add 5% margin

  // Calculate final dimensions for SVG element, maintaining aspect ratio if one is missing
  let finalWidth = bbox.width + 2 * margin;
  let finalHeight = bbox.height + 2 * margin;
  const aspectRatio = bbox.width / bbox.height;

  if (userWidth && !userHeight) {
    finalWidth = userWidth;
    finalHeight = userWidth / aspectRatio;
  } else if (!userWidth && userHeight) {
    finalWidth = userHeight * aspectRatio;
    finalHeight = userHeight;
  } else if (userWidth && userHeight) {
    finalWidth = userWidth; // Use user-provided dimensions even if aspect ratio changes
    finalHeight = userHeight;
  }
  // If neither is provided, use original bbox dimensions + margin

  const svgParts = [];
  svgParts.push(`<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="${bbox.x - margin} ${bbox.y - margin} ${bbox.width + 2 * margin} ${
    bbox.height + 2 * margin
  }"
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
      const points = polylineToPointsString(region.contour);
      svgParts.push(
        `    <polygon points="${points}" fill="${color}" stroke="none" />`
      );
    });

    // Positive Traces
    layerData.positive.traces.forEach((index) => {
      const trace = traces[index];
      const points = polylineToPointsString(trace.track);
      svgParts.push(
        `    <polyline points="${points}" stroke-width="${trace.diameter}" />`
      );
    });

    // Negative Regions (rendered same as positive for simplicity)
    layerData.negative.regions.forEach((index) => {
      const region = regions[index];
      const points = polylineToPointsString(region.contour);
      // Note: Representing negative regions accurately (knockout) in SVG can be complex.
      // This renders them as filled polygons for now. Could use masks or clipPaths.
      svgParts.push(
        `    <polygon points="${points}" fill="${color}" stroke="none" style="opacity:0.5;"/>`
      ); // Example: slightly different style
    });

    // Negative Traces (rendered same as positive for simplicity)
    layerData.negative.traces.forEach((index) => {
      const trace = traces[index];
      const points = polylineToPointsString(trace.track);
      // Note: Representing negative traces accurately (knockout) in SVG can be complex.
      svgParts.push(
        `    <polyline points="${points}" stroke-width="${trace.diameter}" style="opacity:0.5;" />`
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
      const points = polylineToPointsString(route.track);
      svgParts.push(
        `    <polyline points="${points}" stroke-width="${route.diameter}" />`
      );
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

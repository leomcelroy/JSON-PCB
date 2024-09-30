export function groupByPolarityAndLayer(contours) {
  // Create a map to group contours by layer and polarity
  const groupedContours = {};

  // Iterate through the contours and group them by layer and polarity
  contours.forEach((contour) => {
    const layer = contour.layer;
    const polarity = contour.polarity;

    // Initialize the layer object if it doesn't exist
    if (!groupedContours[layer]) {
      groupedContours[layer] = { positive: [], negative: [] };
    }

    // Push the contour into the correct polarity group
    if (polarity === "+" || polarity === undefined) {
      groupedContours[layer].positive.push(contour);
    } else if (polarity === "-") {
      groupedContours[layer].negative.push(contour);
    }
  });

  return groupedContours;
}

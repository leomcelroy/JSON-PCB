export function formatGerberCoordinate(value, unitConversionFactor = 1) {
  let s = (value * unitConversionFactor).toFixed(6);

  // Remove the floating point (0.123456 becomes 0123456)
  s = s.replace(".", "");

  // Remove leading zeroes for Gerberization
  while (s.startsWith("0")) {
    s = s.substr(1, s.length);
  }

  // If the value is 0, we want to leave one 0 still.
  if (s === "") {
    s = "0";
  }

  return s;
}

function formatGerberCoordinate2(value, unitConversionFactor = 1) {
  const scaled = Math.round(Math.abs(value) * unitConversionFactor * 1e6);
  const sign = value < 0 ? "-" : "";
  return sign + scaled.toString();
}

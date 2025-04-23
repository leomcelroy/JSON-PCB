import { generateRegionsData } from "./generateRegionsData.js";
import { generateTracesData } from "./generateTracesData.js";

// TODO: should this handle cutouts
// maybe drills should be tracks?

export function generateOutlineFile({
  projectName,
  outline,
  apertures,
  unitConversionFactor,
}) {
  const filename = generateFilename(projectName);

  const content = [
    ...generateHeader(),
    ...generateBody(outline, apertures, unitConversionFactor),
  ];

  return [filename, content.join("\n")];
}

function generateFilename(projectName, useProtel = false) {
  let filename = projectName || "anon";
  filename = `${filename.replace(".", "_")}`;

  return useProtel ? `${filename}.GKO` : `${filename}-Edge_Cuts.gbr`;
}

function generateHeader() {
  return [
    "%MOMM*%",
    "%FSLAX36Y36*%",
    "%TF.FileFunction,Profile,NP*%", // P | NP is plated or non-plated
  ];
}

function generateBody(outline, apertures, unitConversionFactor) {
  const gerberData = [];

  apertures.forEach((apertureDiameter, i) => {
    const dCode = 10 + i;
    const size = (apertureDiameter * unitConversionFactor).toFixed(4);
    gerberData.push(`%ADD${dCode}C,${size}*%`);
  });

  gerberData.push(
    ...generateRegionsData(outline.positive.regions, unitConversionFactor),
    ...generateTracesData(outline.positive.traces, unitConversionFactor),
    ...generateRegionsData(outline.negative.regions, unitConversionFactor),
    ...generateTracesData(outline.negative.traces, unitConversionFactor),
    "M02*",
  );

  return gerberData;
}

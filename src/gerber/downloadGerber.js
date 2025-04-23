import { getDrillData } from "./getDrillData.js";
import { getLayerData } from "./getLayerData.js";
import { generateDrillFile } from "./generateDrillFile.js";
import { generateOutlineFile } from "./generateOutlineFile.js";
import { generateLayerFile } from "./generateLayerFile.js";

import JSZip from "jszip";
import { saveAs } from "file-saver";

export function downloadGerber(
  gerberData,
  conversionFactor = 1.0,
  filename = "Gerbers.zip"
) {
  generateGerberFiles(gerberData, conversionFactor, filename);
}

export function boardToGerberData(board) {
  const drills = getDrillData(board);
  const { layers, apertures, outline } = getLayerData(board);
  const gerberData = { apertures, layers, drills, outline };

  return gerberData;
}

export function generateGerberFiles(pcbData, conversionFactor, filename) {
  const { layers, name, apertures, drills, outline } = pcbData;

  const unitConversionFactor = conversionFactor;

  const projectName = name ?? "anon";

  const zip = new JSZip();

  // Layers
  Object.keys(layers).forEach((layerName) => {
    zip.file(
      ...generateLayerFile({
        unitConversionFactor,
        projectName,
        layerData: layers[layerName],
        apertures,
        layerName,
      })
    );
  });

  // Outline
  zip.file(
    ...generateOutlineFile({
      unitConversionFactor,
      projectName,
      outline: outline,
      apertures,
    })
  );

  // Drills
  zip.file(
    ...generateDrillFile({
      unitConversionFactor,
      projectName,
      drills: drills,
    })
  );

  // Create ZIP
  zip.generateAsync({ type: "blob" }).then((content) => {
    saveAs(content, filename);
  });
}

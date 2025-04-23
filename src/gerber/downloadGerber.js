import { getDrillData } from "./getDrillData.js";
import { getLayerData } from "./getLayerData.js";
import { generateDrillFile } from "./generateDrillFile.js";
import { generateOutlineFile } from "./generateOutlineFile.js";
import { generateLayerFile } from "./generateLayerFile.js";

import JSZip from "jszip";
import { saveAs } from "file-saver";

export function downloadGerber(gerberData) {
  generateGerberFiles(gerberData);
}

export function boardToGerberData(board) {
  const drills = getDrillData(board);
  const { layers, apertures, outline } = getLayerData(board);
  const gerberData = { apertures, layers, drills, outline };

  return gerberData;
}

export function generateGerberFiles(pcbData) {
  const { layers, name, apertures, drills, outline } = pcbData;

  const unitConversionFactor = 25.4; // TODO: should pull this from file

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
      outline: pcbData.outline,
      apertures,
    })
  );

  // Drills
  zip.file(
    ...generateDrillFile({
      unitConversionFactor,
      projectName,
      drills: pcbData.drills,
    })
  );

  // Create ZIP
  zip.generateAsync({ type: "blob" }).then((content) => {
    saveAs(content, `${projectName}-Gerbers.zip`);
  });
}

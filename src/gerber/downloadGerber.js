import { getDrillData } from "./getDrillData.js";
import { getLayerData } from "./getLayerData.js";
import {
  generatePlatedDrillFile,
  generateNonplatedDrillFile,
} from "./generateDrillFile.js";
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

export function processedBoardToGerberData(board) {
  const drills = board.drills;
  drills.forEach((drill) => {
    drill.x = drill.position[0];
    drill.y = drill.position[1];
  });

  const { layers, apertures, outline } = getLayerData(board.layers);
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

  const platedDrills = [];
  const nonplatedDrills = [];
  // const platedRouts = [];
  // const nonplatedRouts = [];

  drills.forEach((drill) => {
    // const isRout = drill.track.flat().length === 1;
    // if (isRout && drill.plated) {
    //   platedRouts.push(drill);
    // } else if (isRout && !drill.plated) {
    //   nonplatedRouts.push(drill);
    // } else if (!isRout && drill.plated) {
    //   platedDrills.push(drill);
    // } else if (!isRout && !drill.plated) {
    //   nonplatedDrills.push(drill);
    // }

    if (drill.plated) {
      platedDrills.push(drill);
    } else if (!drill.plated) {
      nonplatedDrills.push(drill);
    }
  });

  // if (platedRouts.length > 0 || nonplatedRouts.length > 0) {
  //   console.warn("Routs are not yet supported.");
  // }

  // Drills
  zip.file(
    ...generatePlatedDrillFile({
      unitConversionFactor,
      projectName,
      drills: platedDrills,
    })
  );

  zip.file(
    ...generateNonplatedDrillFile({
      unitConversionFactor,
      projectName,
      drills: nonplatedDrills,
    })
  );

  // Create ZIP
  zip.generateAsync({ type: "blob" }).then((content) => {
    saveAs(content, filename);
  });
}

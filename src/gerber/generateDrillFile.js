// TODO: should this handle cutouts
// maybe drills should be tracks?

export function generateDrillFile({
  projectName,
  drills,
  unitConversionFactor,
}) {
  const filename = generateFilename(projectName);
  const content = [
    ...generateHeader(),
    ...generateBody(drills, unitConversionFactor),
  ];

  return [filename, content.join("\n")];
}

function generateFilename(filename, drillFormat = "EXCELLON") {
  // TODO: figure out extension here

  // protel
  // filename += ".XLN";

  if (drillFormat === "EXCELLON") {
    filename += `.drl`;
  } else if (drillFormat === "GERBER") {
    filename += `.gbr`;
  }

  return filename;
}

/*
M48
; DRILL file {SvgPcb v0.1} date 2025-02-13T19:37:51.083Z
; FORMAT={-:-/ absolute / metric / decimal}
; #@! TF.CreationDate,2025-02-13T19:37:51.083Z
; #@! TF.GenerationSoftware,SvgPcb v0.1
; #@! TF.FileFunction,MixedPlating,1,2
FMAT,2
METRIC
; #@! TA.AperFunction,Plated,PTH,ComponentDrill
%
G90
G05
T0
M30
*/

function generateHeader(drillFormat = "EXCELLON") {
  const drillHeader = [];

  // if (drillFormat === "GERBER") {
  //   drillHeader.push(`%TF.FileFunction,Plated,1,2,PTH,Drill*%`); // All drills as PTH drills for now
  //   drillHeader.push(`%TF.FilePolarity,Positive*%`);
  // }

  drillHeader.push("M48");
  drillHeader.push("FMAT,2");
  drillHeader.push("METRIC,TZ"); // we always use metric, as recommended. inch is "INCH,TZ"

  return drillHeader;
}

function generateBody(drills, unitConversionFactor) {
  const drillData = [];
  const toolMap = {};
  let toolCount = 1;

  drills.forEach((drill) => {
    const size = (drill.diameter * unitConversionFactor).toFixed(4);
    if (!toolMap[size]) {
      toolMap[size] = {
        toolName: `T${toolCount++}`,
        holes: [],
      };
    }
    toolMap[size].holes.push(drill);
  });

  Object.keys(toolMap).forEach((size) => {
    drillData.push(`${toolMap[size].toolName}C${size}`);
  });

  drillData.push("G90");
  drillData.push("T1");
  drillData.push("%");
  // G05 // drill mode

  Object.keys(toolMap).forEach((size) => {
    const { toolName, holes } = toolMap[size];
    drillData.push(toolName);
    holes.forEach((drill) => {
      const x = formatDrillCoordinate(drill.x, unitConversionFactor);
      const y = formatDrillCoordinate(drill.y, unitConversionFactor);
      drillData.push(`X${x}Y${y}`);
    });
  });

  drillData.push("T0");
  drillData.push("M30");

  return drillData;
}

function formatDrillCoordinate(value, unitConversionFactor) {
  const scaled = value * unitConversionFactor;
  return scaled.toFixed(4);
}

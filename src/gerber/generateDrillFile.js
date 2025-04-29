// TODO: should this handle cutouts
// maybe drills should be tracks?

export function generatePlatedDrillFile({
  projectName,
  drills,
  unitConversionFactor,
}) {
  console.log(drills);
  const filename = generateFilename(projectName, true);
  const content = [
    ...generateHeader(true),
    ...generateBody(drills, unitConversionFactor),
  ];

  return [filename, content.join("\n")];
}

export function generateNonplatedDrillFile({
  projectName,
  drills,
  unitConversionFactor,
}) {
  console.log(drills);
  const filename = generateFilename(projectName, false);
  const content = [
    ...generateHeader(false),
    ...generateBody(drills, unitConversionFactor),
  ];

  return [filename, content.join("\n")];
}

function generateFilename(base, plated) {
  const ext = plated ? ".drl" : ".npth.drl";
  return base + ext;
}

// function generateFilename(filename) {
//   // TODO: figure out extension here

//   // protel
//   // filename += ".XLN";

//   // EXCELLON
//   filename += `.drl`;

//   // GERBER
//   // filename += `.gbr`;

//   return filename;
// }

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

function generateHeader(plated) {
  const drillHeader = [];

  // drillHeader.push(`%FSLAX36Y36*%`);
  // drillHeader.push(`%MOMM*%"`);

  // if (plated === true) {
  //   drillHeader.push(`%TF.FileFunction,Plated,1,2,PTH,Drill*%`);
  // } else {
  //   drillHeader.push(`%TF.FileFunction,NonPlated,1,2,NPTH,Drill*%`);
  // }

  // drillHeader.push(`%TF.FilePolarity,Positive*%`);

  // drillHeader.push("M48");
  // drillHeader.push("FMAT,2");
  // drillHeader.push("METRIC,TZ"); // we always use metric, as recommended. inch is "INCH,TZ"

  // start EXCELLON header
  drillHeader.push("M48");
  drillHeader.push("FMAT,2"); // format mode
  drillHeader.push("METRIC,TZ"); // use metric coordinates

  // indicate plated vs non-plated drills
  // PTH = plated through-hole, NPTH = non-plated through-hole
  if (plated) {
    drillHeader.push("%TF.FileFunction,Plated,1,2,PTH,Drill*%");
  } else {
    drillHeader.push("%TF.FileFunction,NonPlated,1,2,NPTH,Drill*%");
  }

  // end header
  drillHeader.push("%");

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

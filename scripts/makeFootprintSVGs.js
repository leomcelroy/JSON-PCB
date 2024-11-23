import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import { footprintToData } from "./footprintToData.js";

// Directories
const inputDir = "../fab.pretty";
const outputDir = "../fab.svg";

// Ensure the output directory exists
await ensureDir(outputDir);

// Process each file in the input directory
for await (const entry of Deno.readDir(inputDir)) {
  if (!entry.isFile) continue;

  const inputFilePath = `${inputDir}/${entry.name}`;
  const outputFilePath = `${outputDir}/${entry.name.replace(/\.\w+$/, ".svg")}`;

  try {
    // Read file content
    const data = await Deno.readTextFile(inputFilePath);

    // Process file content
    const result = footprintToData(data);
    const { xMin, yMin, xMax, yMax } = result.boundingBox;

    // Split path data at 'M' (start of new subpath) and draw them separately
    const subpaths = result.pathData
      .split(/(?=M)/) // Split the path at each 'M'
      .filter((subpath) => subpath.trim().length > 0); // Filter out empty strings

    // Generate individual `<path>` elements for each subpath
    const pathElements = subpaths
      .map((subpath) => `<path d="${subpath}" />`)
      .join("\n");

    // Generate SVG content
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" transform="scale(1, -1)" viewBox="${xMin} ${yMin} ${
        xMax - xMin
      } ${yMax - yMin}">
        ${pathElements}
      </svg>
    `;

    // Write SVG content to output file
    await Deno.writeTextFile(outputFilePath, svgContent.trim());
    console.log(`Processed ${entry.name} -> ${outputFilePath}`);
  } catch (err) {
    console.error(`Error processing file ${entry.name}:`, err);
  }
}

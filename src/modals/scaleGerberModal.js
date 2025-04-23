import { html, render } from "lit-html";

export function scaleGerberModal({
  currentWidth, // in internal units
  currentHeight, // in internal units
  outputUnitLabel = "mm", // e.g., 'mm', 'inch'
  initialConversionFactor = 1.0,
  onDownload,
  layerOrder, // Pass layerOrder through if needed for download context
}) {
  console.log("scaleGerberModal called", {
    currentWidth,
    currentHeight,
    outputUnitLabel,
    initialConversionFactor,
  });
  let currentConversionFactor = initialConversionFactor;

  const closeModal = () => {
    console.log("Closing Gerber scale modal");
    const modalContainer = document.getElementById("modal-container");
    if (modalContainer) {
      render(html``, modalContainer);
    }
  };

  // Updated to display calculated dimensions in output units
  const updateDisplayedDimensions = () => {
    const conversionFactorInput = document.getElementById(
      "conversionFactorInput"
    );
    const widthDisplay = document.getElementById("widthDisplay");
    const heightDisplay = document.getElementById("heightDisplay");

    const conversionFactor = conversionFactorInput?.value
      ? parseFloat(conversionFactorInput.value)
      : currentConversionFactor;

    if (isNaN(conversionFactor) || conversionFactor <= 0) {
      widthDisplay.textContent = "Invalid Factor";
      heightDisplay.textContent = "Invalid Factor";
      return;
    }

    // Calculate dimensions in the target output units
    const widthOutputUnits = (currentWidth * conversionFactor).toFixed(4); // Use more precision if needed
    const heightOutputUnits = (currentHeight * conversionFactor).toFixed(4);

    widthDisplay.textContent = `${widthOutputUnits} ${outputUnitLabel}`;
    heightDisplay.textContent = `${heightOutputUnits} ${outputUnitLabel}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const filename = form.filename.value || "gerber_files.zip";
    const conversionFactorInput = form.conversionFactor.value;

    const conversionFactor = conversionFactorInput
      ? parseFloat(conversionFactorInput)
      : currentConversionFactor;

    if (isNaN(conversionFactor) || conversionFactor <= 0) {
      alert(`Please enter a valid positive number for the Conversion Factor.`);
      return;
    }

    // Ensure filename ends with .zip (or handle as needed)
    const finalFilename = filename.toLowerCase().endsWith(".zip")
      ? filename
      : `${filename}.zip`;

    console.log("Gerber Download triggered with:", {
      conversionFactor,
      filename: finalFilename,
    });

    // Pass the conversion factor and filename to the download handler
    onDownload({
      conversionFactor: conversionFactor,
      filename: finalFilename,
      layerOrder, // Pass layerOrder if the download function needs it
    });
    closeModal();
  };

  const template = html`
    <div
      class="fixed inset-0 bg-gray-700 opacity-50 z-40"
      @click=${closeModal}
    ></div>
    <div
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 text-black min-w-[350px]"
    >
      <h3 class="text-lg font-semibold mb-4">Gerber Download Settings</h3>
      <form @submit=${handleSubmit} @input=${updateDisplayedDimensions}>
        <p class="text-sm text-gray-600 mb-2">
          Original size: ${currentWidth.toFixed(2)} x
          ${currentHeight.toFixed(2)} units.
        </p>
        <p class="text-sm text-gray-600 mb-4">
          Enter ${outputUnitLabel.toUpperCase()} per Unit to determine the final
          dimensions.
        </p>
        <div class="mb-4">
          <label
            for="filename"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Filename (.zip):</label
          >
          <input
            type="text"
            id="filename"
            name="filename"
            value="gerber_files.zip"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div class="mb-4">
          <label
            for="conversionFactorInput"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Conversion Factor (units to ${outputUnitLabel}):</label
          >
          <input
            type="number"
            id="conversionFactorInput"
            name="conversionFactor"
            step="any"
            value="${currentConversionFactor}"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div class="mb-4 p-3 bg-gray-100 rounded border border-gray-200">
          <p class="text-sm font-medium text-gray-800">
            Resulting Dimensions (${outputUnitLabel}):
          </p>
          <p class="text-sm text-gray-600 mt-1">
            Width: <span id="widthDisplay">--- ${outputUnitLabel}</span>
          </p>
          <p class="text-sm text-gray-600">
            Height: <span id="heightDisplay">--- ${outputUnitLabel}</span>
          </p>
        </div>

        <div class="flex justify-end mt-6">
          <button
            type="button"
            @click=${closeModal}
            class="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Download Gerbers (.zip)
          </button>
        </div>
      </form>
    </div>
  `;

  // Ensure a modal container exists in your main HTML
  let modalContainer = document.getElementById("modal-container");
  if (!modalContainer) {
    modalContainer = document.createElement("div");
    modalContainer.id = "modal-container";
    document.body.appendChild(modalContainer);
  }

  render(template, modalContainer);
  console.log("Gerber scale modal render call complete.");
  // Call initial update to display correct dimensions based on initial conversion factor
  updateDisplayedDimensions();
}

import { html, render } from "lit-html";

export function scaleSvgModal({
  currentWidth, // in original units
  currentHeight, // in original units
  initialMmPerUnit,
  onDownload,
  layerOrder,
}) {
  console.log("scaleSvgModal called", {
    currentWidth,
    currentHeight,
    initialMmPerUnit,
  });
  let currentMmPerUnit = initialMmPerUnit || 1.0; // Default if not provided

  const closeModal = () => {
    console.log("Closing modal");
    render(html``, document.getElementById("modal-container"));
    // patchState(); // Re-render if necessary
  };

  // Updated to only display calculated mm based on mmPerUnit
  const updateDisplayedDimensions = () => {
    const mmPerUnitInput = document.getElementById("mmPerUnitInput");
    const widthMmDisplay = document.getElementById("widthMmDisplay");
    const heightMmDisplay = document.getElementById("heightMmDisplay");

    const mmPerUnit = mmPerUnitInput?.value
      ? parseFloat(mmPerUnitInput.value)
      : currentMmPerUnit;

    if (isNaN(mmPerUnit) || mmPerUnit <= 0) {
      widthMmDisplay.textContent = "Invalid mm/Unit";
      heightMmDisplay.textContent = "Invalid mm/Unit";
      return;
    }

    // Calculate dimensions in mm
    const widthMm = (currentWidth * mmPerUnit).toFixed(2);
    const heightMm = (currentHeight * mmPerUnit).toFixed(2);

    widthMmDisplay.textContent = `${widthMm} mm`;
    heightMmDisplay.textContent = `${heightMm} mm`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const filename = form.filename.value || "rawData.svg";
    const mmPerUnitInput = form.mmPerUnit.value;

    const mmPerUnit = mmPerUnitInput
      ? parseFloat(mmPerUnitInput)
      : currentMmPerUnit;

    if (isNaN(mmPerUnit) || mmPerUnit <= 0) {
      alert("Please enter a valid positive number for MM per Unit.");
      return;
    }

    // Dimensions in original units are now just the current dimensions
    const targetWidthInUnits = currentWidth;
    const targetHeightInUnits = currentHeight;

    // Ensure filename ends with .svg
    const finalFilename = filename.toLowerCase().endsWith(".svg")
      ? filename
      : `${filename}.svg`;

    console.log("Download triggered with:", {
      targetWidthInUnits,
      targetHeightInUnits,
      mmPerUnit,
      filename: finalFilename,
    });

    // Pass original units dimensions and the scaling factor
    onDownload({
      targetWidth: targetWidthInUnits,
      targetHeight: targetHeightInUnits,
      mmPerUnit: mmPerUnit,
      filename: finalFilename,
      layerOrder,
    });
    closeModal();
  };

  console.log("Attempting to render modal...");

  const template = html`
    <div
      class="fixed inset-0 bg-gray-700 opacity-50 z-40"
      @click=${closeModal}
    ></div>
    <div
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 text-black min-w-[350px]"
    >
      <h3 class="text-lg font-semibold mb-4">Scale SVG Download</h3>
      <form @submit=${handleSubmit} @input=${updateDisplayedDimensions}>
        <p class="text-sm text-gray-600 mb-2">
          Original size: ${currentWidth.toFixed(2)} x
          ${currentHeight.toFixed(2)} units.
        </p>
        <p class="text-sm text-gray-600 mb-4">
          Enter MM per Unit to determine the final dimensions.
        </p>
        <div class="mb-4">
          <label
            for="filename"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Filename:</label
          >
          <input
            type="text"
            id="filename"
            name="filename"
            value="rawData.svg"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div class="mb-4">
          <label
            for="mmPerUnitInput"
            class="block text-sm font-medium text-gray-700 mb-1"
            >MM per Unit:</label
          >
          <input
            type="number"
            id="mmPerUnitInput"
            name="mmPerUnit"
            step="any"
            value="${currentMmPerUnit}"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div class="mb-4 p-3 bg-gray-100 rounded border border-gray-200">
          <p class="text-sm font-medium text-gray-800">Resulting Dimensions:</p>
          <p class="text-sm text-gray-600 mt-1">
            Width: <span id="widthMmDisplay">--- mm</span>
          </p>
          <p class="text-sm text-gray-600">
            Height: <span id="heightMmDisplay">--- mm</span>
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
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Download SVG
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
  console.log("Modal render call complete.");
  // Call initial update to display correct dimensions based on initial mmPerUnit
  updateDisplayedDimensions();
}

// Basic styles (add to your CSS)
/*
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.modal-content.scale-svg-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  z-index: 101;
  color: black; // Ensure text is visible
  min-width: 300px;
}

.scale-svg-modal h3 {
    margin-top: 0;
}

.scale-svg-modal .form-group {
    margin-bottom: 15px;
}

.scale-svg-modal label {
    display: block;
    margin-bottom: 5px;
}

.scale-svg-modal input[type="text"],
.scale-svg-modal input[type="number"] {
    width: 95%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
}


.scale-svg-modal .modal-buttons {
  text-align: right;
  margin-top: 20px;
}

.scale-svg-modal button {
    padding: 8px 15px;
    margin-left: 10px;
    cursor: pointer;
}
*/

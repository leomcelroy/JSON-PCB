import { html, render } from "lit-html";
import { patchState } from "../state.js"; // Assuming patchState updates UI if needed

export function scaleSvgModal({
  currentWidth,
  currentHeight,
  onDownload,
  layerOrder,
}) {
  console.log("scaleSvgModal called", { currentWidth, currentHeight });
  const closeModal = () => {
    console.log("Closing modal");
    render(html``, document.getElementById("modal-container"));
    // patchState(); // Re-render if necessary
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const filename = form.filename.value || "rawData.svg";
    const widthInput = form.width.value;
    const heightInput = form.height.value;

    // Basic validation: ensure at least one dimension is entered
    if (!widthInput && !heightInput) {
      alert("Please enter at least one dimension (width or height).");
      return;
    }

    const targetWidth = widthInput ? parseFloat(widthInput) : null;
    const targetHeight = heightInput ? parseFloat(heightInput) : null;

    // Ensure filename ends with .svg
    const finalFilename = filename.toLowerCase().endsWith(".svg")
      ? filename
      : `${filename}.svg`;

    onDownload({
      targetWidth,
      targetHeight,
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
      <form @submit=${handleSubmit}>
        <p class="text-sm text-gray-600 mb-4">
          Enter desired dimensions (in mm). Leave one blank to maintain aspect
          ratio.
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
            for="width"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Width (mm):</label
          >
          <input
            type="number"
            id="width"
            name="width"
            step="any"
            placeholder="${currentWidth.toFixed(2)}"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div class="mb-4">
          <label
            for="height"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Height (mm):</label
          >
          <input
            type="number"
            id="height"
            name="height"
            step="any"
            placeholder="${currentHeight.toFixed(2)}"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
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
  // patchState(); // Re-render if necessary
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

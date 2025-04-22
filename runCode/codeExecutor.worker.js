import { toolkit as tk } from "../polylineToolkit/toolkit";

// codeExecutor.worker.js

async function executeDynamicModule(code, board) {
  // Create a Data URI for the code string
  const dataUri =
    "data:text/javascript;charset=utf-8," + encodeURIComponent(code);

  try {
    // Dynamically import the module
    // Note: Dynamic import() is supported in module workers
    const userModule = await import(/* @vite-ignore */ dataUri);

    // Assuming the module exports a default function that takes board
    if (userModule.default && typeof userModule.default === "function") {
      // Execute the function with the board data
      const result = userModule.default(board, tk);
      return result;
    } else {
      console.error("Worker: The user code did not export a default function.");
      throw new Error("User code did not export a default function.");
    }
  } catch (error) {
    console.error("Worker: Error executing user code:", error);
    // Re-throw the error to be caught by the onerror handler in the main thread
    throw error;
  }
}

// Listen for messages from the main thread
self.onmessage = async (event) => {
  const { code, board } = event.data;

  try {
    const result = await executeDynamicModule(code, board);
    // Send the result back to the main thread
    self.postMessage({ status: "success", result });
  } catch (error) {
    // Send error information back to the main thread
    self.postMessage({ status: "error", error: error.message });
  }
};

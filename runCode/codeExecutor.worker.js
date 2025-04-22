import { toolkit as tk } from "../polylineToolkit/toolkit";

async function executeDynamicModule(code, board) {
  const print = (...args) => {
    try {
      const stringifiedArgs = args
        .map((arg) => JSON.stringify(arg, null, 2))
        .join(" ");
      self.postMessage({ status: "print", data: stringifiedArgs });
    } catch (error) {
      self.postMessage({
        status: "print",
        data: "[Could not stringify arguments]",
      });
      console.error("Worker: Error stringifying print arguments:", error);
    }
  };

  try {
    const userFunction = new Function(
      "board",
      "tk",
      "print",
      `
      return (async () => {
        ${code}
      })();
    `
    );

    const result = await userFunction(board, tk, print);
    return result;
  } catch (error) {
    console.error("Worker: Error executing user code:", error);

    throw error;
  }
}

self.onmessage = async (event) => {
  const { code, board } = event.data;

  try {
    const result = await executeDynamicModule(code, board);

    self.postMessage({ status: "success", result });
  } catch (error) {
    self.postMessage({ status: "error", error: error.message });
  }
};

async function executeDynamicModuleImport(code, board) {
  // Create a Data URI for the code string
  const dataUri =
    "data:text/javascript;charset=utf-8," + encodeURIComponent(code);

  // Define the print function to send data back to the main thread
  const print = (...args) => {
    try {
      const stringifiedArgs = args
        .map((arg) => JSON.stringify(arg, null, 2))
        .join(" ");
      self.postMessage({ status: "print", data: stringifiedArgs });
    } catch (error) {
      // Handle potential stringification errors (like circular structures)
      self.postMessage({
        status: "print",
        data: "[Could not stringify arguments]",
      });
      console.error("Worker: Error stringifying print arguments:", error);
    }
  };

  try {
    // Dynamically import the module
    // Note: Dynamic import() is supported in module workers
    const userModule = await import(/* @vite-ignore */ dataUri);

    // Assuming the module exports a default function that takes board, tk, and print
    if (userModule.default && typeof userModule.default === "function") {
      // Execute the function with the board data, toolkit and print function
      const result = userModule.default(board, tk, print);
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

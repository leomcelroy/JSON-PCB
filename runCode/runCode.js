import { setBoard } from "../state.js";

export async function runCode(code, state) {
  const board = state.board;
  function removeExtraData(key, value) {
    if (key === "shapes") return undefined;
    if (key === "boundingBox") return undefined;
    if (key === "pathData") return undefined;

    return value;
  }

  const cleanBoard = JSON.parse(JSON.stringify(board, removeExtraData));

  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("./codeExecutor.worker.js", import.meta.url),
      {
        type: "module",
      }
    );

    worker.onmessage = (event) => {
      const { status, result, error } = event.data;
      if (status === "success") {
        resolve(result);
        console.log("resolved", result);
        setBoard(result);
      } else {
        reject(new Error(error || "Unknown worker error"));
      }

      worker.terminate();
    };

    worker.onerror = (event) => {
      event.preventDefault();

      reject(new Error(`Worker error: ${event.message || "Unknown error"}`));

      worker.terminate();
    };

    worker.postMessage({ code, board: cleanBoard });
  });
}

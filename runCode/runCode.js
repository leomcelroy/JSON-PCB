import { setBoard } from "../state.js";

let workerInstance = null;
let isWorkerBusy = false;
let pendingRequest = null;
let timeoutId = null;
let currentPromiseHandlers = null;
let pendingPromiseHandlers = null;
const WORKER_TIMEOUT = 5000; // 10 seconds

function removeExtraData(key, value) {
  if (key === "shapes") return undefined;
  if (key === "boundingBox") return undefined;
  if (key === "pathData") return undefined;

  return value;
}

function createWorker() {
  const worker = new Worker(
    new URL("./codeExecutor.worker.js", import.meta.url),
    {
      type: "module",
    }
  );

  worker.onmessage = (event) => {
    const { status, result, error, data } = event.data;

    if (status === "print") {
      console.log(JSON.parse(data));
      return; // Don't reset state for print messages
    }

    // Clear the timeout as the task completed or errored
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    const { resolve, reject } = currentPromiseHandlers || {};

    if (status === "success") {
      if (resolve) {
        resolve(result);
        console.log("resolved", result);
        setBoard(result);
      }
    } else {
      // status === "error" or unknown
      if (reject) {
        reject(new Error(error || "Unknown worker error"));
      }
      // Terminate worker on error
      workerInstance?.terminate();
      workerInstance = null;
    }

    // Handle pending request or mark as not busy
    if (pendingRequest) {
      const nextRequest = pendingRequest;
      currentPromiseHandlers = pendingPromiseHandlers;
      pendingRequest = null;
      pendingPromiseHandlers = null;
      startWorkerTask(nextRequest); // Automatically sets isWorkerBusy = true
    } else {
      isWorkerBusy = false;
      currentPromiseHandlers = null;
      // Optionally terminate idle worker here if desired,
      // but keeping it alive avoids recreation overhead.
      // workerInstance?.terminate();
      // workerInstance = null;
    }
  };

  worker.onerror = (event) => {
    event.preventDefault();

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    const { reject } = currentPromiseHandlers || {};
    if (reject) {
      reject(new Error(`Worker error: ${event.message || "Unknown error"}`));
    }

    // Terminate worker and clear state on unrecoverable error
    workerInstance?.terminate();
    workerInstance = null;

    // Handle pending request (will create a new worker) or mark as not busy
    if (pendingRequest) {
      const nextRequest = pendingRequest;
      currentPromiseHandlers = pendingPromiseHandlers;
      pendingRequest = null;
      pendingPromiseHandlers = null;
      isWorkerBusy = true; // Set busy before starting the task
      startWorkerTask(nextRequest);
    } else {
      isWorkerBusy = false;
      currentPromiseHandlers = null;
    }
  };

  return worker;
}

function handleTimeout() {
  console.warn(
    "Worker task timed out after",
    WORKER_TIMEOUT / 1000,
    "seconds. Terminating worker."
  );
  timeoutId = null; // Clear the timeout ID

  const { reject } = currentPromiseHandlers || {};
  if (reject) {
    reject(
      new Error(`Worker task timed out after ${WORKER_TIMEOUT / 1000} seconds`)
    );
  }

  // Terminate the unresponsive worker
  if (workerInstance) {
    workerInstance.terminate();
    workerInstance = null; // Ensure a new one is created next time
  }

  // Handle pending request (will create a new worker) or mark as not busy
  if (pendingRequest) {
    const nextRequest = pendingRequest;
    currentPromiseHandlers = pendingPromiseHandlers;
    pendingRequest = null;
    pendingPromiseHandlers = null;
    isWorkerBusy = true; // Set busy before starting the task
    startWorkerTask(nextRequest);
  } else {
    isWorkerBusy = false;
    currentPromiseHandlers = null;
  }
}

function startWorkerTask(request) {
  if (!workerInstance) {
    console.log("Creating new worker instance.");
    workerInstance = createWorker();
  }

  isWorkerBusy = true; // Ensure it's marked busy

  // Clear previous timeout just in case, then set a new one
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(handleTimeout, WORKER_TIMEOUT);

  console.log("Posting message to worker:", request);
  workerInstance.postMessage(request);
}

export async function runCode(code, state) {
  const board = state.board;
  const cleanBoard = JSON.parse(JSON.stringify(board, removeExtraData));
  const request = { code, board: cleanBoard };

  return new Promise((resolve, reject) => {
    const handlers = { resolve, reject };

    if (isWorkerBusy) {
      console.log("Worker busy, queueing request.");
      pendingRequest = request;
      pendingPromiseHandlers = handlers;
    } else {
      currentPromiseHandlers = handlers;
      startWorkerTask(request); // This will set isWorkerBusy = true
    }
  });
}

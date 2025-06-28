import { patchState } from "../state";
import { processBoard } from "../processBoard/processBoard";
import { Board } from "../types/Board";

type PromiseCallbacks = {
  timestamp: number;
  resolve: (value: Board) => void;
  reject: (reason?: any) => void;
};

type RequestData = {
  code: string;
  board: Board;
  timestamp: number;
};

let worker: Worker | null = null;
let pendingPromises: PromiseCallbacks[] = [];
let running = false;
let latestRequest: RequestData | null = null;

export function runCodeAsync(code: string, board: Board): Promise<Board> {
  return new Promise((resolve, reject) => {
    if (worker === null) {
      createWorker();
      if (!worker) {
        reject(new Error("Failed to create worker."));
        return;
      }
    }

    const timestamp = Date.now();
    pendingPromises.push({ timestamp, resolve, reject });

    latestRequest = { code, board, timestamp };

    if (worker && !running) {
      worker.postMessage(latestRequest);
      running = true;
      latestRequest = null;
    }
  });
}

function createWorker() {
  worker = new Worker(new URL("./codeExecutor.worker.js", import.meta.url), {
    type: "module",
  });

  if (!worker) {
    console.error("Failed to initialize worker.");
    const currentPromises = pendingPromises;
    pendingPromises = [];
    currentPromises.forEach(({ reject }) =>
      reject(new Error("Failed to initialize worker."))
    );
    running = false;
    latestRequest = null;
    return;
  }

  worker.onmessage = (event) => {
    const data = event.data;
    const { status, requestTimestamp } = data;

    if (status === "print") {
      console.log("Worker print:", JSON.parse(data.data));
      return;
    }

    running = false;

    const promisesToResolve = pendingPromises.filter(
      (p) => p.timestamp <= requestTimestamp
    );
    const remainingPromises = pendingPromises.filter(
      (p) => p.timestamp > requestTimestamp
    );
    pendingPromises = remainingPromises;

    if (promisesToResolve.length === 0 && status !== "print") {
      console.warn(
        `Received worker message for timestamp ${requestTimestamp}, but no matching pending promises found.`
      );
    }

    if (status === "success") {
      const { result } = data;
      const boardResult = result.board;
      const processedBoard = result.processedBoard;

      patchState((s) => {
        s.board = boardResult;
        s.processedBoard = processedBoard;
      });

      promisesToResolve.forEach(({ resolve }) => resolve(result));
    } else if (status === "error") {
      const errorData =
        data.error ||
        new Error(`Worker failed for request timestamp ${requestTimestamp}`);
      console.log(
        `Rejecting ${promisesToResolve.length} promises for timestamp <= ${requestTimestamp}`,
        errorData
      );
      promisesToResolve.forEach(({ reject }) => reject(errorData));
    }

    if (worker && latestRequest) {
      worker.postMessage(latestRequest);
      running = true;
      latestRequest = null;
    }
  };

  worker.onerror = (event) => {
    console.error("Unhandled worker error event:", event.message);
    event.preventDefault();

    running = false;

    const currentPromises = pendingPromises;
    pendingPromises = [];
    latestRequest = null;

    const error = new Error(event.message || "Worker error");
    console.log(
      `Worker error, rejecting ${currentPromises.length} pending promises.`
    );
    currentPromises.forEach(({ reject }) => reject(error));

    worker?.terminate();
    worker = null;
  };
}

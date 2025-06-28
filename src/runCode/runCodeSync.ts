import { patchState, STATE } from "../state";
import { processBoard } from "../processBoard/processBoard";
import { Board } from "../types/Board";
import { setBoardJSON } from "../setBoardJSON";

let worker: Worker | null = null;
let running = false;
let latestRequest: any = null;

export function runCodeSync(code: string, board: Board) {
  if (worker === null) {
    console.log("Creating new worker instance.");
    createWorker();
  }

  const request = { code, board };

  latestRequest = request;

  if (worker && !running) {
    worker.postMessage(latestRequest);
    running = true;
    latestRequest = null;
  }

  patchState((s) => {
    s.script = code.trim();
  });
}

function createWorker() {
  worker = new Worker(new URL("./codeExecutor.worker.js", import.meta.url), {
    type: "module",
  });

  worker.onmessage = (event) => {
    const data = event.data;
    const { status } = data;

    if (status === "print") {
      console.log("Worker print:", JSON.parse(data.data));

      return;
    }

    running = false;

    if (status === "success") {
      // console.log(data.result.rawData);
      // setRawData(data.result.rawData);

      // console.log({ codeResult: data.result });

      const board = data.result.board;
      const processedBoard = data.result.processedBoard;
      // console.log({ processedBoard: processBoard(board) });

      // setBoard(data.result);
      patchState((s) => {
        s.board = board;
        s.processedBoard = processedBoard;

        if (s.codePanel === "board") {
          setBoardJSON(board);
        }
      });
      return;
    }

    if (status === "error") {
      console.log("worker erred", data);
      return;
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

    worker?.terminate();
    worker = null;
  };
}

// import { setRawData } from "../rawData/setRawData.js";
import { setBoard } from "../setBoard/setBoard.js";

let worker = null;
let running = false;
let latestRequest = null;

export function runCode(code, state, onComplete) {
  if (worker === null) {
    console.log("Creating new worker instance.");
    createWorker(onComplete);
  }

  const board = state.board;

  const request = { code, board };

  latestRequest = request;

  if (!running) {
    worker.postMessage(latestRequest);
    running = true;
    latestRequest = null;
  }
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

      console.log({ codeResult: data.result });

      setBoard(data.result);
      return;
    }

    if (status === "error") {
      console.log("worker erred", data);
      return;
    }

    if (latestRequest) {
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

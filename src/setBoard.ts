import { runCodeSync } from "./runCode/runCodeSync";
import { runCodeAsync } from "./runCode/runCodeAsync";
import { Board } from "./types/Board";

export function setBoard(board: Board) {
  const code = `
    setBoard(board);
  `;

  runCodeSync(code, board);
}

export function setBoardAsync(board: Board) {
  const code = `
    setBoard(board);
  `;

  return new Promise(async (resolve) => {
    await runCodeAsync(code, board);
    resolve(board);
  });
}

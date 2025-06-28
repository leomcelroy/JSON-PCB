import { createListener } from "../utils/createListener";
import { setBoard } from "../setBoard";
import { testPCB2 } from "../blankBoard";

export function addNewFileClick(el, state) {
  const listener = createListener(el);

  listener("click", "[new-file-btn]", async () => {
    // state.editPath = {
    //   editing: false,
    //   data: null,
    //   editMode: "SELECT",
    //   selectedPoints: new Set(),
    // };
    // state.editModal = {
    //   open: false,
    //   type: "",
    //   id: null,
    // };

    // await setBoard(testPCB2);
    // document.querySelector("[center-view-btn]")?.click();

    setBoard(testPCB2);

    setTimeout(() => {
      document.querySelector("[center-view-btn]")?.click();
    }, 1000);
  });
}

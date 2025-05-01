/* SET JSON */

//   const editor = document.querySelector(".code-editor");

//   const view = editor.cm;

//   const newText = JSON.stringify(
//     newBoard,
//     (key, value) => {
//       if (key === "shapes") return undefined;
//       if (key === "boundingBox") return undefined;
//       if (key === "pathData") return undefined;

//       return value;
//     },
//     2,
//   );

//   console.time();
//   setContent(view, newText);
//   console.timeEnd();

// function setContent(view, newContent) {
//   view.dispatch({
//     changes: { from: 0, to: view.state.doc.length, insert: newContent },
//   });
// }

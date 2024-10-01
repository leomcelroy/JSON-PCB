function upload(files, onDrop) {
  const file = files[0];

  var reader = new FileReader();
  reader.readAsText(file);

  reader.onloadend = (event) => {
    let text = reader.result;
    if (onDrop) onDrop({ name: file.name, text });
  };

  return;
}

export function addDropUpload(el, ops = {}) {
  const onDrop = ops.onDrop ?? null;

  const dropModal = document.createElement("div");
  dropModal.innerHTML = `
    <style>
      .drop-modal {
        position: absolute;
        left: 0px;
        top: 0px;
        border: 3px dashed black;
        background: #8bf6dfd9;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        z-index: 9999999999;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .drop-info {
        font-size: 1.4em;
        text-align: center;
      }

      .hidden {
        display: none;
      }
    </style>
    <div class="drop-info">Upload JSON file, KiCAD Component Module, SVG Component, or JSON Component</div>
  `;
  dropModal.classList.add("drop-modal");
  dropModal.classList.add("hidden");
  document.body.appendChild(dropModal);

  const listen = createListener(el);

  listen("drop", "", function (evt) {
    let dt = evt.dataTransfer;
    let files = dt.files;

    dropModal.classList.add("hidden");

    upload(files, onDrop);

    pauseEvent(evt);
  });

  listen("dragover", "", function (evt) {
    dropModal.classList.remove("hidden");
    pauseEvent(evt);
  });

  listen("mouseleave", "", function (evt) {
    dropModal.classList.add("hidden");
  });
}

function pauseEvent(e) {
  if (e.stopPropagation) e.stopPropagation();
  if (e.preventDefault) e.preventDefault();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
}

const trigger = (e) => e.composedPath()[0];
const matchesTrigger = (e, selectorString) =>
  trigger(e).matches(selectorString);
const createListener = (target) => (eventName, selectorString, event) => {
  target.addEventListener(eventName, (e) => {
    if (selectorString === "" || matchesTrigger(e, selectorString)) event(e);
  });
};

// ---------------------------

// const round = (n) => Math.round(n * 1000) / 1000;

// function readFileUploadComp(file) {
//   var reader = new FileReader();
//   reader.readAsText(file);

//   const name = file.name.split(".")[0].replaceAll(/[\s()]/g, "");

//   reader.onloadend = (event) => {
//     let text = reader.result;
//     console.log({ name, text });
//   };
// }

// function readFileJS(file) {
//   var reader = new FileReader();
//   reader.readAsText(file);

//   reader.onloadend = (event) => {
//     let text = reader.result;
//     console.log(text);
//   };
// }

// function readFileSVG(file) {
//   var reader = new FileReader();
//   reader.readAsText(file);

//   const name = file.name.split(".")[0].replaceAll(/[\s()]/g, "");

//   reader.onloadend = (event) => {
//     let text = reader.result;

//     const parser = new DOMParser();
//     const doc = parser.parseFromString(text, "image/svg+xml");
//     const svg = doc.querySelector("svg");

//     const pls = flattenSVG(svg, { maxError: 0.001 });

//     const newComponent = {};

//     pls.forEach((pl, i) => {
//       newComponent[i] = {
//         shape: makePathData(pl),
//         pos: [0, 0],
//         layers: ["F.Cu"],
//         // index ?
//       };
//     });
//   };
// }

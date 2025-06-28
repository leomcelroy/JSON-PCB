import { html, svg } from "lit-html";

export function renderFootprintMenu(state) {
  const footprints = state?.processedBoard?.footprints ?? [];

  const results = [];

  footprints.forEach((footprint) => {
    const { id, pathData, boundingBox } = footprint;

    const boxWidth = boundingBox.xMax - boundingBox.xMin;
    const boxHeight = boundingBox.yMax - boundingBox.yMin;

    const scale = Math.min(100 / boxWidth, 100 / boxHeight);

    const translateX = -boundingBox.xMin * scale + (100 - boxWidth * scale) / 2;
    const translateY =
      -boundingBox.yMin * scale + (100 - boxHeight * scale) / 2;

    results.push(html`
      <div class="footprint-item no-select">
        <div .footprintId=${id} draggable-footprint class="footprint-icon">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g
              transform="translate(${translateX}, ${translateY}) scale(${scale})"
            >
              <path
                class="footprint-path"
                d="${pathData}"
                fill="black"
                stroke="none"
                stroke-width="2"
              />
            </g>
          </svg>
        </div>

        <div footprint-id-btn data-id=${id} class="footprint-name">${id}</div>

        <div footprint-delete-btn class="delete-btn" .footprintId=${id}>
          <i class="fa-solid fa-xmark"></i>
        </div>
      </div>
    `);
  });

  return html`
    <div class="menu-header">
      <div class="menu-title">Footprints</div>
      <a
        class="import-link"
        href="https://www.leomcelroy.com/brannock/"
        target="_blank"
        >Import</a
      >
    </div>
    <div class="footprints-list">${results}</div>
  `;
}

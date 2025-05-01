import { html } from "lit-html";
import { patchState } from "../state.js";
import { setBoard } from "../setBoard/setBoard.js";

export function renderEditModal(state) {
  if (!state.editModal.open) return "";

  const { type, id } = state.editModal;

  const content = [];

  if (type === "components") {
    const comp = state.board.components.find((x) => x.id === id);
    content.push(html`
      <div class="form-group">
        <span>ID:</span>
        <input
          type="text"
          .value=${comp.id}
          @input=${(e) => {
            state.editModal.id = e.target.value;
            comp.id = e.target.value;
            setBoard(state.board);
          }}
        />
      </div>

      <div class="form-group">
        <span>Translate X:</span>
        <input
          type="number"
          .value=${comp.translate[0] || 0}
          @input=${(e) => {
            const value = Number(e.target.value) || 0;
            comp.translate[0] = value;
            setBoard(state.board);
          }}
        />
      </div>

      <div class="form-group">
        <span>Translate Y:</span>
        <input
          type="number"
          .value=${comp.translate[1] || 0}
          @input=${(e) => {
            const value = Number(e.target.value) || 0;
            comp.translate[1] = value;
            setBoard(state.board);
          }}
        />
      </div>

      <div class="form-group">
        <span>Rotate:</span>
        <input
          type="number"
          .value=${comp.rotate || 0}
          @input=${(e) => {
            const value = Number(e.target.value) || 0;
            comp.rotate = value;
            setBoard(state.board);
          }}
        />
      </div>

      <div class="form-group">
        <span>Flip:</span>
        <input
          type="checkbox"
          .checked=${comp.flip}
          @change=${(e) => {
            comp.flip = e.target.checked;
            setBoard(state.board);
          }}
        />
      </div>
    `);
  }

  if (type === "regions") {
    const region = state.board[type][id];
    const layerOrder = state.layerOrder;
    const polarityOptions = ["+", "-"];

    content.push(html`
      <div class="form-group">
        <span>Layer</span>
        <select
          .value=${region.layers[0]}
          @change=${(e) => {
            region.layers[0] = e.target.value;
            setBoard(state.board);
          }}
        >
          ${layerOrder.map(
            (layer) =>
              html`<option
                value=${layer}
                ?selected=${region.layers[0] === layer}
              >
                ${layer}
              </option>`
          )}
        </select>
      </div>

      <div class="form-group">
        <span>Polarity</span>
        <select
          .value=${region.polarity}
          @change=${(e) => {
            region.polarity = e.target.value;
            setBoard(state.board);
          }}
        >
          ${polarityOptions.map(
            (polarity) =>
              html`<option
                value=${polarity}
                ?selected=${region.polarity === polarity}
              >
                ${polarity}
              </option>`
          )}
        </select>
      </div>
    `);
  }

  if (type === "traces") {
    const trace = state.board[type][id];

    const layerOrder = state.layerOrder;
    const polarityOptions = ["+", "-"];

    content.push(html`
      <div class="form-group">
        <span>Layer</span>
        <select
          .value=${trace.layers[0]}
          @change=${(e) => {
            trace.layers[0] = e.target.value;
            setBoard(state.board);
          }}
        >
          ${layerOrder.map(
            (layer) =>
              html`<option
                value=${layer}
                ?selected=${trace.layers[0] === layer}
              >
                ${layer}
              </option>`
          )}
        </select>
      </div>

      <div class="form-group">
        <span>Polarity</span>
        <select
          .value=${trace.polarity}
          @change=${(e) => {
            trace.polarity = e.target.value;
            setBoard(state.board);
          }}
        >
          ${polarityOptions.map(
            (polarity) =>
              html`<option
                value=${polarity}
                ?selected=${trace.polarity === polarity}
              >
                ${polarity}
              </option>`
          )}
        </select>
      </div>

      <div class="form-group">
        <span>Thickness</span>
        <input
          type="number"
          .value=${trace.thickness || 0}
          step="0.001"
          @input=${(e) => {
            const value = Number(e.target.value) || 0;
            trace.thickness = value;
            setBoard(state.board);
          }}
        />
      </div>
    `);
  }

  return html`
    <div class="modal">
      <div class="modal-header">
        <span class="modal-title"
          >Edit
          ${{ components: "Component", regions: "Region", traces: "Trace" }[
            type
          ]}</span
        >
        <button class="modal-close" @click=${() => closeModal()}>✖</button>
      </div>
      <div class="modal-content">${content}</div>
      <div
        style="width: 100%; display: flex; align-items: center; justify-content: center;"
      >
        <button class="delete-button" @click=${deleteItem}>Delete</button>
      </div>
    </div>
  `;

  function deleteItem() {
    patchState((s) => {
      if (type === "components") {
        s.board[type] = s.board[type].filter((item, i) => item.id !== id);
      } else {
        s.board[type] = s.board[type].filter((item, i) => i !== id);
        s.editPath.editing = false;
      }
      closeModal();
      setBoard(s.board);
    });
  }

  function closeModal() {
    patchState((s) => {
      s.editModal.open = false;
      s.editPath.editing = false;
      s.editPath.editMode = "SELECT";
    });
  }
}

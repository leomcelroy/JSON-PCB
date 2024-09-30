import { html } from "lit-html";
import { patchState, setBoard } from "./state.js";

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
          id="id"
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
          id="translateX"
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
          id="translateY"
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
          id="rotate"
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
          id="flip"
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

  return html`
    <div class="modal">
      <div class="modal-header">
        <span class="modal-title">Edit Modal</span>
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
    });
  }
}

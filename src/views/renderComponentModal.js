import { html } from "lit-html";
import { patchState } from "../state";
import { setBoard } from "../setBoard";

export function renderComponentModal(state) {
  if (state.selectedPaths.size !== 0) return "";
  if (state.selectedComponents.size !== 1) return "";

  const id = [...state.selectedComponents][0];

  const comp = state.board.components.find((x) => x.id === id);

  return html`
    <div class="modal">
      <div class="modal-header">
        <span class="modal-title">Edit Component</span>
        <button class="modal-close" @click=${() => closeModal()}>✖</button>
      </div>
      <div class="modal-content">
        <div class="form-group">
          <span>ID:</span>
          <input
            class="bg-gray-100"
            type="text"
            .value=${comp.id}
            @input=${(e) => {
              comp.id = e.target.value;
              state.selectedComponents = new Set([comp.id]);
              setBoard(state.board);
            }}
          />
        </div>

        <div class="form-group">
          <span>Position X:</span>
          <input
            class="bg-gray-100"
            type="number"
            .value=${comp.position[0] || 0}
            @input=${(e) => {
              const value = Number(e.target.value) || 0;
              comp.position[0] = value;
              setBoard(state.board);
            }}
          />
        </div>

        <div class="form-group">
          <span>Position Y:</span>
          <input
            class="bg-gray-100"
            type="number"
            .value=${comp.position[1] || 0}
            @input=${(e) => {
              const value = Number(e.target.value) || 0;
              comp.position[1] = value;
              setBoard(state.board);
            }}
          />
        </div>

        <div class="form-group">
          <span>Rotate:</span>
          <input
            class="bg-gray-100"
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
            class="bg-gray-100"
            type="checkbox"
            .checked=${comp.flip}
            @change=${(e) => {
              comp.flip = e.target.checked;
              setBoard(state.board);
            }}
          />
        </div>
      </div>
      <div
        style="width: 100%; display: flex; align-items: center; justify-content: center;"
      >
        <button class="delete-button" @click=${deleteItem}>Delete</button>
      </div>
    </div>
  `;

  function deleteItem() {
    patchState((s) => {
      s.board.components = s.board.components.filter((item) => item.id !== id);
      closeModal();
      setBoard(s.board);
    });
  }

  function closeModal() {
    patchState((s) => {
      s.selectedComponents.clear();
    });
  }
}

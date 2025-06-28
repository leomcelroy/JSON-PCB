export function addKeyEvents(el) {
  window.addEventListener("keydown", (e) => {
    state.heldKeys.add(e.key);

    if (e.key === "Backspace") {
      if (e.target.matches("input")) return;
      const deleteBtn = document.querySelector(".delete-button");
      if (deleteBtn) deleteBtn.click();
    }

    if (e.metaKey && e.key === "a") {
      document.querySelector("[add-trace-btn]").click();
      e.preventDefault();
    }

    if (e.key === "Escape") {
      state.editPath = {
        editing: false,
        data: null,
        editMode: "SELECT",
        selectedPoints: new Set(),
      };
      state.editModal = {
        open: false,
        type: "",
        id: null,
      };

      patchState();
    }
  });

  window.addEventListener("keyup", (e) => {
    state.heldKeys.delete(e.key);
  });
}

import { patchState, STATE } from "./state.js";
import { makePhantom } from "./makePhantom.js";

export function addLayerReordering(el) {
    let draggedLayerEl = null;
    let dropEl = null;

    const listener = createListener(el);

    listener("mousedown", ".layer-grabber", (e) => {
        draggedLayerEl = e.target.parentNode;
        makePhantom(e, draggedLayerEl, () => {
            const fromIndex = draggedLayerEl.data.index;
            const toIndex = dropEl.data.index;

            moveItemBack(STATE.layerOrder, fromIndex, toIndex);
            patchState();
            document.querySelectorAll(".drop-layer-target").forEach((el) => {
                el.classList.remove("drop-layer-target");
            });
            draggedLayerEl = null;
        });
    });

    listener("mousemove", ".layer-item, .layer-item *", (e) => {
        if (draggedLayerEl === null) return;

        document.querySelectorAll(".drop-layer-target").forEach((el) => {
            el.classList.remove("drop-layer-target");
        });
        dropEl = e.target.closest(".layer-item");
        dropEl.classList.add("drop-layer-target");
    });
}

function moveItemBack(arr, fromIndex, toIndex) {
    if (
        fromIndex < 0 ||
        fromIndex >= arr.length ||
        toIndex < 0 ||
        toIndex >= arr.length
    ) {
        throw new Error("Invalid index");
    }

    const elementToMove = arr.splice(fromIndex, 1)[0];

    // Adjust the toIndex in case the element being moved is before it.
    if (fromIndex < toIndex) {
        toIndex--;
    }

    // Insert the element right behind the target position
    arr.splice(toIndex + 1, 0, elementToMove);
    return arr;
}

function moveItem(arr, fromIndex, toIndex) {
    if (
        fromIndex < 0 ||
        fromIndex >= arr.length ||
        toIndex < 0 ||
        toIndex >= arr.length
    ) {
        throw new Error("Invalid index");
    }

    const elementToMove = arr.splice(fromIndex, 1)[0];

    // Adjust the toIndex in case the element being moved is before it.
    if (fromIndex < toIndex) {
        toIndex--;
    }

    arr.splice(toIndex, 0, elementToMove);
    return arr;
}

const trigger = (e) => e.composedPath()[0];
const matchesTrigger = (e, selectorString) =>
    trigger(e).matches(selectorString);
const createListener = (target) => (eventName, selectorString, event) => {
    target.addEventListener(eventName, (e) => {
        if (selectorString === "" || matchesTrigger(e, selectorString))
            event(e);
    });
};

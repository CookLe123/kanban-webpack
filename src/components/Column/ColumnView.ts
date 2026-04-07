import { Column } from "../../core/models/Column";
import { BoardStore } from "../../core/store/BoardStore";
import { TaskView } from "../Task/TaskView";
import { createElement, showConfirm } from "../../utils/dom";

export class ColumnView {
  constructor(
    private column: Column,
    private store: BoardStore,
  ) {}

  render(): HTMLElement {
    const el = createElement("div", "column");
    const toolbarZone = createElement("div", "toolbarZone");

    const title = createElement("h3", "", this.column.title);

    const draggableZone = createElement("div", "draggableZone", "Pull me");
    const columnHeader = createElement("div", "columnHeader");

    draggableZone.draggable = true;

    const deleteBtn = createElement("button", "deleteColumnBtn", "✕");

    deleteBtn.onclick = async () => {
      const confirmed = await showConfirm("Delete this column?");
      if (confirmed) {
        this.store.removeColumn(this.column.id);
      }
    };

    columnHeader.append(deleteBtn);

    el.addEventListener("drop", (e) => {
      e.preventDefault();

      const data = e.dataTransfer?.getData("text/plain");
      if (!data) return;

      const parsed = JSON.parse(data);

      if ("taskId" in parsed) {
        this.store.moveTask(parsed.taskId, parsed.fromColumnId, this.column.id);
        return;
      }

      if ("columnId" in parsed) {
        const rect = el.getBoundingClientRect();
        const isRight = e.clientX > rect.left + rect.width / 2;

        this.store.moveColumnRelative(parsed.columnId, this.column.id, isRight);
      }
    });

    draggableZone.addEventListener("dragstart", (e) => {
      e.stopPropagation();

      if (!e.dataTransfer) return;

      document.body.dataset.dragType = "column";
      el.classList.add("dragging-column");

      e.dataTransfer.setDragImage(el, 20, 20);
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          columnId: this.column.id,
        }),
      );
    });

    draggableZone.addEventListener("dragend", () => {
      document.body.dataset.dragType = "";
      el.classList.remove("dragging-column");
      document
        .querySelectorAll(".underBoardZone.active")
        .forEach((node) => node.classList.remove("active"));
    });

    el.addEventListener("dragover", (e) => {
      e.preventDefault();

      if (document.querySelector(".dragging")) {
        e.preventDefault();
        return;
      }

      const rect = el.getBoundingClientRect();
      const isRight = e.clientX > rect.left + rect.width / 2;

      el.classList.remove("active-left", "active-right");

      if (isRight) {
        el.classList.add("active-right");
      } else {
        el.classList.add("active-left");
      }
    });

    el.addEventListener("dragleave", () => {
      el.classList.remove("active-left", "active-right");
    });

    title.addEventListener("dblclick", () => {
      const input = createElement("input");

      title.replaceWith(input);
      input.focus();
      input.value = this.column.title;

      const save = () => {
        const value = input.value.trim();

        if (value) this.store.updateColumn(this.column.id, value);

        input.replaceWith(title);
      };

      input.addEventListener("blur", save);

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
      });
    });

    const addTaskBtn = createElement("button", "", "+ Task");
    addTaskBtn.onclick = () => {
      this.store.addTask(this.column.id, "New task");
    };

    toolbarZone.append(draggableZone, addTaskBtn);

    el.append(columnHeader, toolbarZone, title);

    this.column.taskIds.forEach((taskId) => {
      const task = this.store.getTask(taskId);
      if (task) {
        const view = new TaskView(task, this.store, this.column.id);
        el.append(view.render());
      }
    });

    return el;
  }
}

import { Column } from "../../core/models/Column";
import { BoardStore } from "../../core/store/BoardStore";
import { TaskView } from "../Task/TaskView";

export class ColumnView {
  constructor(
    private column: Column,
    private store: BoardStore,
  ) {}

  render(): HTMLElement {
    const el = document.createElement("div");
    el.className = "column";

    const title = document.createElement("h3");
    title.textContent = this.column.title;

    const draggableZone = document.createElement("div");

    draggableZone.textContent = "Pull me";
    draggableZone.className = "draggableZone";

    el.draggable = true;

    el.addEventListener("drop", (e) => {
      e.preventDefault();

      const data = e.dataTransfer?.getData("text/plain");
      if (!data) return;

      const parsed = JSON.parse(data);

      if (parsed.taskId) {
        this.store.moveTask(parsed.taskId, parsed.fromColumnId, this.column.id);
        return;
      }

      if (parsed.columnId) {
        const rect = el.getBoundingClientRect();

        const isRight = e.clientX > rect.left + rect.width / 2;

        this.store.moveColumnRelative(parsed.columnId, this.column.id, isRight);
      }
    });

    el.addEventListener("dragstart", (e) => {
      if (!e.dataTransfer) return;

      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          columnId: this.column.id,
        }),
      );
    });

    el.addEventListener("dragover", (e) => {
      e.preventDefault();

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
      const input = document.createElement("input");

      title.replaceWith(input);
      input.focus();

      const save = () => {
        const value = input.value;

        if (!!value) this.store.updateColumn(this.column.id, input.value);

        input.replaceWith(title);
      };

      input.addEventListener("blur", () => save());

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
      });
    });

    const btn = document.createElement("button");
    btn.textContent = "+ Task";
    btn.onclick = () => {
      this.store.addTask(this.column.id, "New task");
    };

    el.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    el.addEventListener("drop", (e) => {
      e.preventDefault();

      const data = e.dataTransfer?.getData("text/plain");
      if (!data) return;

      const { taskId, fromColumnId } = JSON.parse(data);

      this.store.moveTask(taskId, fromColumnId, this.column.id);
    });

    el.append(title);

    this.column.taskIds.forEach((taskId) => {
      const task = this.store.getTask(taskId);
      if (!!task) {
        const view = new TaskView(task, this.store, this.column.id);
        el.append(view.render());
      }
    });

    el.append(btn);

    return el;
  }
}

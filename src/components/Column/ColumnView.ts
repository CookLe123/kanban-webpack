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

import { BoardStore } from "../../core/store/BoardStore";
import { Task } from "../../core/models/Task";
import { createElement } from "../../utils/dom";

export class TaskView {
  constructor(
    private task: Task,
    private store: BoardStore,
    private columnId: string,
  ) {}

  render(): HTMLElement {
    const element = createElement("div", "task");

    const title = createElement("span", "", this.task.title);
    title.addEventListener("dblclick", () => {
      const input = createElement("input");
      input.value = this.task.title;

      title.replaceWith(input);
      input.focus();

      const save = () => {
        const newValue = input.value;

        if (!!newValue) this.store.updateTask(this.task.id, newValue);

        input.replaceWith(title);
      };

      input.addEventListener("blur", save);

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
      });
    });

    element.draggable = true;

    element.addEventListener("dragstart", (e) => {
      e.stopPropagation();

      if (!e.dataTransfer) return;

      element.classList.add("dragging");

      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({ taskId: this.task.id, fromColumnId: this.columnId }),
      );
    });

    element.addEventListener("dragend", () => {
      element.classList.remove("dragging");
    });

    const editButton = createElement("button", "editButton", "✏️");
    editButton.addEventListener("click", () => {});
    const deleteButton = createElement("button", "", "x");
    deleteButton.addEventListener("click", () => {
      this.store.deleteTask(this.columnId, this.task.id);
    });

    element.append(title, editButton, deleteButton);
    return element;
  }
}

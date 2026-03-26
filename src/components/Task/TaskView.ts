import { BoardStore } from "../../core/store/BoardStore";
import { Task } from "../../core/models/Task";

export class TaskView {
  constructor(
    private task: Task,
    private store: BoardStore,
    private columnId: string,
  ) {}

  render(): HTMLElement {
    const element = document.createElement("div");
    element.className = "task";

    const title = document.createElement("span");
    title.addEventListener("dblclick", () => {
      const input = document.createElement("input");
      input.value = this.task.title;

      title.replaceWith(input);
      input.focus();

      const save = () => {
        const newValue = input.value;

        this.store.updateTask(this.task.id, newValue);

        title.textContent = newValue;
        input.replaceWith(title);
      };

      input.addEventListener("blur", save);

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
      });
    });
    title.textContent = this.task.title;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "x";
    deleteButton.addEventListener("click", () => {
      this.store.deleteTask(this.columnId, this.task.id);
    });

    element.append(title, deleteButton);
    return element;
  }
}

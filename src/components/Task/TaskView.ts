import { BoardStore } from "../../core/store/BoardStore";
import { Task } from "../../core/models/Task";

export class TaskView {
  constructor(
    private task: Task,
    private store: BoardStore,
  ) {}

  render(): HTMLElement {
    const el = document.createElement("div");
    el.className = "task";
    el.textContent = this.task.title;
    return el;
  }
}

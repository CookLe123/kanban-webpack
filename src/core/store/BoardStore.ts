import { Column } from "../models/Column";
import { Task } from "../models/Task";
import { v4 as uuid } from "uuid";
import { EventBus } from "../events/EventBus";

export class BoardStore {
  private tasks = new Map<string, Task>();
  private columns = new Map<string, Column>();
  readonly events = new EventBus();

  constructor() {
    this.init();
  }

  private init() {
    const todoId = uuid();
    this.columns.set(todoId, {
      id: todoId,
      title: "To Do",
      taskIds: [],
    });
  }

  getColumns(): Column[] {
    return Array.from(this.columns.values());
  }

  getTask(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  addTask(columnId: string, title: string) {
    const task: Task = {
      id: uuid(),
      title,
      createdAt: Date.now(),
    };

    this.tasks.set(task.id, task);
    this.columns.get(columnId)?.taskIds.push(task.id);

    this.events.emit();
  }
}

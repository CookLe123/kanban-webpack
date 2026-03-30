import { Column } from "../models/Column";
import { Task } from "../models/Task";
import { v4 as uuid } from "uuid";
import { EventBus } from "../events/EventBus";

export class BoardStore {
  private tasks = new Map<string, Task>();
  private columns = new Map<string, Column>();
  readonly events = new EventBus();

  private columnOrder: string[] = [];

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

    this.columnOrder.push(todoId);
  }

  getColumns(): Column[] {
    return this.columnOrder.map((id) => this.columns.get(id)!);
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

  deleteTask(columnId: string, taskId: string) {
    this.tasks.delete(taskId);

    const column = this.columns.get(columnId);

    if (!column) return;

    column.taskIds = column.taskIds.filter((id) => id !== taskId);

    this.events.emit();
  }

  updateTask(taskId: string, newValue: string) {
    const task = this.tasks.get(taskId);

    if (!task) return;

    task.title = newValue;

    this.events.emit();
  }

  addColumn() {
    const newColumnId = uuid();

    this.columns.set(newColumnId, {
      id: newColumnId,
      taskIds: [],
      title: "Edit me",
    });

    this.columnOrder.push(newColumnId);

    this.events.emit();
  }

  updateColumn(columnId: string, newValue: string) {
    const column = this.columns.get(columnId);

    if (!column) return;

    column.title = newValue;

    this.events.emit();
  }

  moveTask(taskId: string, fromColumnId: string, toColumnId: string) {
    if (fromColumnId === toColumnId) return;

    const fromColumn = this.columns.get(fromColumnId);
    const toColumn = this.columns.get(toColumnId);

    if (!fromColumn || !toColumn) return;

    fromColumn.taskIds = fromColumn.taskIds.filter((id) => id !== taskId);
    toColumn.taskIds.push(taskId);

    this.events.emit();
  }

  moveColumnRelative(fromId: string, toId: string, after: boolean) {
    const fromIndex = this.columnOrder.indexOf(fromId);
    const toIndex = this.columnOrder.indexOf(toId);

    if (fromIndex === -1 || toIndex === -1) return;

    this.columnOrder.splice(fromIndex, 1);

    const newIndex = after ? toIndex + 1 : toIndex;

    this.columnOrder.splice(newIndex, 0, fromId);

    this.events.emit();
  }
}

import { Column } from "../models/Column";
import { Task } from "../models/Task";
import { v4 as uuid } from "uuid";
import { EventBus } from "../events/EventBus";

export class BoardStore {
  private tasks = new Map<string, Task>();
  private columns = new Map<string, Column>();
  readonly events = new EventBus();

  private rows: string[][] = [];

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

    this.rows.push([todoId as string]);
  }

  getRows(): Column[][] {
    return this.rows.map(
      (row) =>
        row.map((id) => this.columns.get(id)).filter(Boolean) as Column[],
    );
  }

  getTask(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  private findRowIndexByColumnId(columnId: string): number {
    return this.rows.findIndex((row) => row.includes(columnId));
  }

  addTask(columnId: string, title: string) {
    const taskId = uuid();
    const task: Task = {
      id: taskId,
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

  addColumn(rowIndex = this.rows.length - 1) {
    const newColumnId = uuid();

    this.columns.set(newColumnId, {
      id: newColumnId,
      taskIds: [],
      title: `Edit me ${this.columns.size + 1}`,
    });

    if (!this.rows[rowIndex]) {
      this.rows[rowIndex] = [];
    }

    this.rows[rowIndex].push(newColumnId);

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
    if (fromId === toId) return;

    let fromRowIndex = this.findRowIndexByColumnId(fromId);
    let toRowIndex = this.findRowIndexByColumnId(toId);

    if (fromRowIndex === -1 || toRowIndex === -1) return;

    const fromRow = this.rows[fromRowIndex];
    const fromIndex = fromRow.indexOf(fromId);

    fromRow.splice(fromIndex, 1);

    if (fromRow.length === 0) {
      this.rows.splice(fromRowIndex, 1);

      if (fromRowIndex < toRowIndex) {
        toRowIndex -= 1;
      }
    }

    const targetRow = this.rows[toRowIndex];
    const targetIndex = targetRow.indexOf(toId);

    const insertIndex = after ? targetIndex + 1 : targetIndex;
    targetRow.splice(insertIndex, 0, fromId);

    this.events.emit();
  }

  moveColumnToNewRow(columnId: string) {
    const rowIndex = this.findRowIndexByColumnId(columnId);
    if (rowIndex === -1) return;

    const row = this.rows[rowIndex];
    this.rows[rowIndex] = row.filter((id) => id !== columnId);

    if (this.rows[rowIndex].length === 0) {
      this.rows.splice(rowIndex, 1);
    }

    this.rows.push([columnId]);

    this.events.emit();
  }

  removeColumn(columnId: string) {
    this.columns.delete(columnId);

    this.rows = this.rows
      .map((row) => row.filter((id) => id !== columnId))
      .filter((row) => row.length > 0);

    if (this.rows.length === 0) {
      this.rows.push([]);
    }

    this.events.emit();
  }
}

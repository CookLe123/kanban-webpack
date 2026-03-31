type DragData =
  | { type: "task"; taskId: string; fromColumnId: string }
  | { type: "column"; columnId: string };

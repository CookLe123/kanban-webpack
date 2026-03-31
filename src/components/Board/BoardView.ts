import { BoardStore } from "../../core/store/BoardStore";
import { ColumnView } from "../Column/ColumnView";
import { createElement } from "../../utils/dom";

export class BoardView {
  private root = document.createElement("div");
  constructor(private store: BoardStore) {
    this.root.className = "board";

    this.store.events.subscribe(() => this.render());
  }

  render(): HTMLElement {
    this.root.innerHTML = "";

    this.store.getColumns().forEach((column) => {
      const view = new ColumnView(column, this.store);
      this.root.append(view.render());
    });

    const addColumn = createElement("button", "", "+ Column");
    addColumn.addEventListener("click", () => {
      this.store.addColumn();
    });

    this.root.append(addColumn);

    return this.root;
  }
}

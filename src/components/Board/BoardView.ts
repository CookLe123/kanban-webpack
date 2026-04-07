import { BoardStore } from "../../core/store/BoardStore";
import { ColumnView } from "../Column/ColumnView";
import { createElement, enableDragScroll } from "../../utils/dom";

export class BoardView {
  private root = document.createElement("div");
  private isPanelOpen = false;

  constructor(private store: BoardStore) {
    this.store.events.subscribe(() => this.render());
  }

  render(): HTMLElement {
    this.root.innerHTML = "";

    const boardRows = createElement("div", "boardRows");
    const rows = this.store.getRows();

    rows.forEach((row, rowIndex) => {
      const boardZone = createElement("div", "boardRow");

      enableDragScroll(boardZone);

      row.forEach((column) => {
        const view = new ColumnView(column, this.store);
        boardZone.append(view.render());
      });

      const addColumn = createElement("button", "", "+ Column");
      addColumn.addEventListener("click", () => {
        this.store.addColumn(rowIndex);
      });

      boardZone.append(addColumn);
      boardRows.append(boardZone);
    });

    const underBoardZone = createElement(
      "div",
      "underBoardZone",
      "Drop column here to create a new row",
    );

    underBoardZone.addEventListener("dragover", (e) => {
      if (document.body.dataset.dragType !== "column") return;

      e.preventDefault();
      underBoardZone.classList.add("active");
    });

    underBoardZone.addEventListener("dragleave", () => {
      underBoardZone.classList.remove("active");
    });

    underBoardZone.addEventListener("drop", (e) => {
      e.preventDefault();
      underBoardZone.classList.remove("active");

      const data = e.dataTransfer?.getData("text/plain");
      if (!data) return;

      const parsed = JSON.parse(data);

      if ("columnId" in parsed) {
        this.store.moveColumnToNewRow(parsed.columnId);
      }
    });

    const panel = createElement("div", "adminPanel");
    if (this.isPanelOpen) panel.classList.add("open");

    panel.append(createElement("h3", "", "Themes"));

    ["golden", "blue", "olive", "orange", "green"].forEach((theme) => {
      const themeButton = createElement("button", "", theme);
      themeButton.addEventListener("click", () => {
        document.documentElement.setAttribute("data-theme", theme);
      });
      panel.append(themeButton);
    });

    const toggle = createElement(
      "div",
      "adminToggle",
      this.isPanelOpen ? ">" : "<",
    );

    toggle.addEventListener("click", () => {
      this.isPanelOpen = !this.isPanelOpen;

      panel.classList.toggle("open", this.isPanelOpen);
      toggle.classList.toggle("open", this.isPanelOpen);
    });

    this.root.append(boardRows, underBoardZone, panel, toggle);

    return this.root;
  }
}

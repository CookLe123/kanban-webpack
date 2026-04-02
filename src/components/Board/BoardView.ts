import { BoardStore } from "../../core/store/BoardStore";
import { ColumnView } from "../Column/ColumnView";
import { createElement } from "../../utils/dom";

export class BoardView {
  private root = document.createElement("div");
  private isPanelOpen = false;

  constructor(private store: BoardStore) {
    this.store.events.subscribe(() => this.render());
  }

  render(): HTMLElement {
    this.root.innerHTML = "";

    const boardZone = createElement("div", "board");

    const underBoardZone = createElement("div", "underBoardZone");

    this.store.getColumns().forEach((column) => {
      const view = new ColumnView(column, this.store);
      boardZone.append(view.render());
    });

    const addColumn = createElement("button", "", "+ Column");
    addColumn.addEventListener("click", () => {
      this.store.addColumn();
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

    toggle.addEventListener("click", (e) => {
      this.isPanelOpen = !this.isPanelOpen;

      panel.classList.toggle("open", this.isPanelOpen);
      toggle.classList.toggle("open", this.isPanelOpen);
    });

    boardZone.append(addColumn);

    this.root.append(boardZone, underBoardZone, panel, toggle);

    return this.root;
  }
}

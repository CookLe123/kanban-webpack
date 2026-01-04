import { Column } from '../../core/models/Column';
import { BoardStore } from '../../core/store/BoardStore';

export class ColumnView {
    constructor(
        private column: Column,
        private store: BoardStore
    ) {}

    render(): HTMLElement {
        const el = document.createElement('div');
        el.className = 'column';

        const title = document.createElement('h3');
        title.textContent = this.column.title;

        const btn = document.createElement('button');
        btn.textContent = '+ Task';
        btn.onclick = () => {
            this.store.addTask(this.column.id, 'New task');
            location.reload();
        };

        el.append(title, btn);
        return el;
    }
}
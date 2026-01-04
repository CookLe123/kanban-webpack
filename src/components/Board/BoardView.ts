import { BoardStore } from '../../core/store/BoardStore';
import { ColumnView } from '../Column/ColumnView';

export class BoardView {
    constructor(private store: BoardStore) {}

    render(): HTMLElement {
        const board = document.createElement('div');
        board.className = 'board';

        this.store.getColumns().forEach(column => {
            const view = new ColumnView(column, this.store);
            board.appendChild(view.render());
        });

        return board;
    }
}
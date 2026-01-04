import './styles/main.css';
import { BoardStore } from './core/store/BoardStore';
import { BoardView } from './components/Board/BoardView';

const root = document.getElementById('app');
if (!root) {
    throw new Error('Root element not found');
}

const store = new BoardStore();
const boardView = new BoardView(store);

root.appendChild(boardView.render());
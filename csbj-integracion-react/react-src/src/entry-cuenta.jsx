import { createRoot } from 'react-dom/client';
import AccountPanel from './components/AccountPanel.jsx';

const el = document.getElementById('react-cuenta-root');
if (el) {
  createRoot(el).render(<AccountPanel />);
}

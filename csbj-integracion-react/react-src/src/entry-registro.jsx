import { createRoot } from 'react-dom/client';
import RegistroForm from './components/RegistroForm.jsx';

const el = document.getElementById('react-registro-root');
if (el) {
  createRoot(el).render(<RegistroForm />);
}

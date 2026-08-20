import { createRoot } from 'react-dom/client';
import LoginForm from './components/LoginForm.jsx';

const el = document.getElementById('react-login-root');
if (el) {
  createRoot(el).render(<LoginForm />);
}

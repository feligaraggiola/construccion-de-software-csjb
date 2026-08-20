import { useState } from 'react';
import { api } from '../api.js';

export default function LoginForm() {
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!identificador.trim() || !password) {
      setError('Ingresá tu correo/DNI y tu contraseña.');
      return;
    }

    setCargando(true);
    try {
      await api.login(identificador.trim(), password);
      setExito(true);
      // Redirige al panel de socio una vez logueado
      window.location.href = 'mi-cuenta.html';
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={`field ${error ? 'invalid' : ''}`}>
        <label htmlFor="login-user">Correo electrónico o DNI</label>
        <input
          type="text"
          id="login-user"
          placeholder="ejemplo@correo.com"
          value={identificador}
          onChange={(e) => setIdentificador(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="login-pass">Contraseña</label>
        <div className="input-wrap">
          <input
            type={verPassword ? 'text' : 'password'}
            id="login-pass"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="toggle-pass"
            onClick={() => setVerPassword((v) => !v)}
          >
            {verPassword ? 'Ocultar' : 'Ver'}
          </button>
        </div>
      </div>

      <div className="form-aux">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-mid)' }}>
          <input type="checkbox" style={{ accentColor: 'var(--gold-500)' }} /> Recordarme
        </label>
        <a href="#">¿Olvidaste tu contraseña?</a>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239,91,91,0.1)', border: '1px solid rgba(239,91,91,0.3)',
          color: '#ef5b5b', padding: '12px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16,
        }}>
          {error}
        </div>
      )}

      {exito && (
        <div style={{
          background: 'rgba(52,199,123,0.1)', border: '1px solid rgba(52,199,123,0.3)',
          color: '#34c77b', padding: '12px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16,
        }}>
          Sesión iniciada. Redirigiendo...
        </div>
      )}

      <button type="submit" className="btn btn-gold btn-block" disabled={cargando}>
        {cargando ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  );
}

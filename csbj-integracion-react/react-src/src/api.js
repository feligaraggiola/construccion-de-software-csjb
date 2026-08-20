// =========================================================
// CSBJ — Cliente para hablar con la API en PHP
// =========================================================
// La URL base se define en el <script> de cada página HTML,
// antes de cargar el bundle de React, así:
//   <script>window.CSBJ_API_BASE = 'http://localhost:8000/api';</script>
// Si no se define, usa '/api' como valor por defecto (útil en producción,
// cuando el frontend y la API viven bajo el mismo dominio).

const API_BASE = window.CSBJ_API_BASE || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}/${path}`, {
    credentials: 'include', // necesario para que viaje la cookie de sesión
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || 'Ocurrió un error inesperado.');
    error.campos = data.campos || null;
    error.status = res.status;
    throw error;
  }

  return data;
}

export const api = {
  login: (identificador, password) =>
    request('login.php', { method: 'POST', body: JSON.stringify({ identificador, password }) }),

  registro: (payload) =>
    request('registro.php', { method: 'POST', body: JSON.stringify(payload) }),

  logout: () =>
    request('logout.php', { method: 'POST' }),

  getMiCuenta: () =>
    request('mi-cuenta.php', { method: 'GET' }),

  updateMiCuenta: (payload) =>
    request('mi-cuenta.php', { method: 'PUT', body: JSON.stringify(payload) }),
};

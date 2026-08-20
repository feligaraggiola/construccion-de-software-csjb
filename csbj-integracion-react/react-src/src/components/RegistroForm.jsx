import { useState } from 'react';
import { api } from '../api.js';

const initial = {
  nombre: '', apellido: '', dni: '', email: '',
  password: '', passwordConfirm: '', acepto: false,
};

export default function RegistroForm() {
  const [form, setForm] = useState(initial);
  const [verPass, setVerPass] = useState(false);
  const [verPass2, setVerPass2] = useState(false);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);

  function setField(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function validar() {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'Ingresá tu nombre.';
    if (!form.apellido.trim()) e.apellido = 'Ingresá tu apellido.';
    if (!/^\d{7,8}$/.test(form.dni)) e.dni = 'Ingresá un DNI válido.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Ingresá un correo válido.';
    if (form.password.length < 6) e.password = 'Mínimo 6 caracteres.';
    if (form.password !== form.passwordConfirm) e.passwordConfirm = 'Las contraseñas no coinciden.';
    if (!form.acepto) e.acepto = 'Tenés que aceptar los términos.';
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setErrorGeneral('');

    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) return;

    setCargando(true);
    try {
      await api.registro({
        nombre: form.nombre,
        apellido: form.apellido,
        dni: form.dni,
        email: form.email,
        password: form.password,
      });
      setExito(true);
      window.location.href = 'mi-cuenta.html';
    } catch (err) {
      setErrorGeneral(err.message);
      if (err.campos) setErrores((prev) => ({ ...prev, ...err.campos }));
    } finally {
      setCargando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="field-row">
        <div className={`field ${errores.nombre ? 'invalid' : ''}`}>
          <label htmlFor="reg-nombre">Nombre</label>
          <input type="text" id="reg-nombre" placeholder="Nombre"
                 value={form.nombre} onChange={(e) => setField('nombre', e.target.value)} />
          {errores.nombre && <span className="field-error" style={{ display: 'block' }}>{errores.nombre}</span>}
        </div>
        <div className={`field ${errores.apellido ? 'invalid' : ''}`}>
          <label htmlFor="reg-apellido">Apellido</label>
          <input type="text" id="reg-apellido" placeholder="Apellido"
                 value={form.apellido} onChange={(e) => setField('apellido', e.target.value)} />
          {errores.apellido && <span className="field-error" style={{ display: 'block' }}>{errores.apellido}</span>}
        </div>
      </div>

      <div className={`field ${errores.dni ? 'invalid' : ''}`}>
        <label htmlFor="reg-dni">DNI</label>
        <input type="text" id="reg-dni" placeholder="Ej: 12345678"
               value={form.dni} onChange={(e) => setField('dni', e.target.value)} />
        {errores.dni && <span className="field-error" style={{ display: 'block' }}>{errores.dni}</span>}
      </div>

      <div className={`field ${errores.email ? 'invalid' : ''}`}>
        <label htmlFor="reg-email">Correo electrónico</label>
        <input type="email" id="reg-email" placeholder="ejemplo@correo.com"
               value={form.email} onChange={(e) => setField('email', e.target.value)} />
        {errores.email && <span className="field-error" style={{ display: 'block' }}>{errores.email}</span>}
      </div>

      <div className={`field ${errores.password ? 'invalid' : ''}`}>
        <label htmlFor="reg-password">Contraseña</label>
        <div className="input-wrap">
          <input type={verPass ? 'text' : 'password'} id="reg-password" placeholder="Mínimo 6 caracteres"
                 value={form.password} onChange={(e) => setField('password', e.target.value)} />
          <button type="button" className="toggle-pass" onClick={() => setVerPass((v) => !v)}>
            {verPass ? 'Ocultar' : 'Ver'}
          </button>
        </div>
        {errores.password && <span className="field-error" style={{ display: 'block' }}>{errores.password}</span>}
      </div>

      <div className={`field ${errores.passwordConfirm ? 'invalid' : ''}`}>
        <label htmlFor="reg-password-confirm">Confirmar contraseña</label>
        <div className="input-wrap">
          <input type={verPass2 ? 'text' : 'password'} id="reg-password-confirm" placeholder="Repetí tu contraseña"
                 value={form.passwordConfirm} onChange={(e) => setField('passwordConfirm', e.target.value)} />
          <button type="button" className="toggle-pass" onClick={() => setVerPass2((v) => !v)}>
            {verPass2 ? 'Ocultar' : 'Ver'}
          </button>
        </div>
        {errores.passwordConfirm && <span className="field-error" style={{ display: 'block' }}>{errores.passwordConfirm}</span>}
      </div>

      <div className="field check-row" style={{ marginBottom: 22 }}>
        <input type="checkbox" id="reg-terms" checked={form.acepto}
               onChange={(e) => setField('acepto', e.target.checked)} />
        <label htmlFor="reg-terms" style={{ textTransform: 'none', letterSpacing: 'normal', fontWeight: 400 }}>
          Acepto los <a href="#">Términos y Condiciones</a> y la <a href="#">Política de Privacidad</a>
          {errores.acepto && <span className="field-error" style={{ display: 'block', marginTop: 4 }}>{errores.acepto}</span>}
        </label>
      </div>

      {errorGeneral && (
        <div style={{
          background: 'rgba(239,91,91,0.1)', border: '1px solid rgba(239,91,91,0.3)',
          color: '#ef5b5b', padding: '12px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16,
        }}>
          {errorGeneral}
        </div>
      )}

      {exito && (
        <div style={{
          background: 'rgba(52,199,123,0.1)', border: '1px solid rgba(52,199,123,0.3)',
          color: '#34c77b', padding: '12px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16,
        }}>
          ¡Cuenta creada correctamente! Redirigiendo...
        </div>
      )}

      <button type="submit" className="btn btn-gold btn-block" disabled={cargando}>
        {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>
    </form>
  );
}

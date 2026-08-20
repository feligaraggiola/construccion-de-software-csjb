import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function AccountPanel() {
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  useEffect(() => {
    api.getMiCuenta()
      .then(({ usuario }) => {
        setUsuario(usuario);
        setForm(usuario);

        // Actualiza también el saludo y los datos fijos de "Mi panel",
        // que están fuera de este componente (son HTML estático de la página).
        const saludoEl = document.getElementById('panel-saludo');
        const nroSocioEl = document.getElementById('panel-nro-socio');
        const categoriaEl = document.getElementById('panel-categoria');
        const avatarEl = document.getElementById('nav-avatar');

        if (saludoEl) saludoEl.textContent = `¡Hola, ${usuario.nombre}!`;
        if (nroSocioEl) nroSocioEl.textContent = usuario.nro_socio;
        if (categoriaEl) categoriaEl.textContent = `★ ${usuario.categoria}`;
        if (avatarEl) {
          const iniciales = `${usuario.nombre?.[0] || ''}${usuario.apellido?.[0] || ''}`.toUpperCase();
          avatarEl.textContent = iniciales || '--';
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  function setField(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setExito(false);
    setGuardando(true);
    try {
      await api.updateMiCuenta({
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono,
        pais: form.pais,
        provincia: form.provincia,
        localidad: form.localidad,
        dpto: form.dpto,
        domicilio: form.domicilio,
      });
      setUsuario(form);
      setExito(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return <p className="muted">Cargando tus datos...</p>;
  }

  if (error && !usuario) {
    // Sesión vencida o inexistente: mandamos al login
    return (
      <div style={{ textAlign: 'center', padding: '30px 0' }}>
        <p className="muted" style={{ marginBottom: 16 }}>{error}</p>
        <a href="login.html" className="btn btn-gold">Iniciar sesión</a>
      </div>
    );
  }

  return (
    <>
      <div className="account-header" style={{ marginBottom: 22 }}>
        <div>
          <span className="eyebrow">¡Hola, {usuario.nombre}!</span>
          <div className="member-badges">
            <span>N° de socio <b>{usuario.nro_socio}</b></span>
            <span>Categoría <b style={{ color: 'var(--gold-500)' }}>★ {usuario.categoria}</b></span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="field-row">
          <div className="field">
            <label htmlFor="ap-nombre">Nombre</label>
            <input type="text" id="ap-nombre" value={form.nombre || ''} onChange={(e) => setField('nombre', e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="ap-apellido">Apellido</label>
            <input type="text" id="ap-apellido" value={form.apellido || ''} onChange={(e) => setField('apellido', e.target.value)} required />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="ap-dni">DNI</label>
            <input type="text" id="ap-dni" value={form.dni || ''} disabled />
          </div>
          <div className="field">
            <label htmlFor="ap-tel">Teléfono</label>
            <input type="tel" id="ap-tel" value={form.telefono || ''} onChange={(e) => setField('telefono', e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="ap-email">Correo electrónico</label>
          <input type="email" id="ap-email" value={form.email || ''} disabled />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="ap-prov">Provincia</label>
            <input type="text" id="ap-prov" value={form.provincia || ''} onChange={(e) => setField('provincia', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="ap-loc">Localidad</label>
            <input type="text" id="ap-loc" value={form.localidad || ''} onChange={(e) => setField('localidad', e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="ap-dom">Domicilio</label>
          <input type="text" id="ap-dom" value={form.domicilio || ''} onChange={(e) => setField('domicilio', e.target.value)} />
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
            Datos actualizados correctamente.
          </div>
        )}

        <button type="submit" className="btn btn-gold" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </>
  );
}
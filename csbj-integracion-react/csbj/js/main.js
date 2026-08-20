// =========================================================
// CSBJ — Club de Socios Boca Juniors — main.js
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  markActiveNav();
  initMobileNav();
  initTabs();
  initPasswordToggles();
  initFormValidation();
  initTicketStepper();
  initSeatSelector();
  initCountdown();
});

/* ---------- Marca el link activo del nav según la página ---------- */
function markActiveNav(){
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .account-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path) link.classList.add('active');
  });
}

/* ---------- Menú móvil ---------- */
function initMobileNav(){
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    const expanded = links.classList.contains('open');
    toggle.setAttribute('aria-expanded', expanded);
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

/* ---------- Tabs genéricos (data-tabs / data-tab / data-panel) ---------- */
function initTabs(){
  document.querySelectorAll('[data-tabs]').forEach(group => {
    const tabs = group.querySelectorAll('.tab');
    const panelsContainer = document.querySelector(group.dataset.tabs);
    if (!panelsContainer) return;
    const panels = panelsContainer.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const target = panelsContainer.querySelector(`[data-panel="${tab.dataset.tab}"]`);
        if (target) target.classList.add('active');
      });
    });
  });
}

/* ---------- Mostrar / ocultar contraseña ---------- */
function initPasswordToggles(){
  document.querySelectorAll('.toggle-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (!input) return;
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      btn.setAttribute('aria-label', isPass ? 'Ocultar contraseña' : 'Mostrar contraseña');
      btn.textContent = isPass ? 'Ocultar' : 'Ver';
    });
  });
}

/* ---------- Validación simple de formularios (login / registro) ---------- */
function initFormValidation(){
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('[required]').forEach(input => {
        const field = input.closest('.field');
        if (!field) return;
        const filled = input.type === 'checkbox' ? input.checked : input.value.trim().length > 0;
        field.classList.toggle('invalid', !filled);
        if (!filled) valid = false;
      });

      // Confirmación de contraseña (si existe)
      const pass = form.querySelector('#password');
      const confirm = form.querySelector('#password-confirm');
      if (pass && confirm) {
        const field = confirm.closest('.field');
        const match = pass.value === confirm.value && confirm.value.length > 0;
        field.classList.toggle('invalid', !match);
        if (!match) {
          field.querySelector('.field-error').textContent = 'Las contraseñas no coinciden.';
          valid = false;
        }
      }

      if (valid) {
        const successBox = form.querySelector('[data-success]') || document.querySelector('[data-form-success]');
        if (successBox) {
          successBox.style.display = 'block';
          form.reset();
          successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          alert('¡Listo! Los datos se enviaron correctamente (demo sin backend).');
        }
      }
    });
  });
}

/* ---------- Stepper de compra de entradas ---------- */
function initTicketStepper(){
  const steps = document.querySelectorAll('.step');
  const nextBtns = document.querySelectorAll('[data-step-next]');
  const prevBtns = document.querySelectorAll('[data-step-prev]');
  const stages = document.querySelectorAll('[data-stage]');
  if (!steps.length || !stages.length) return;

  let current = 1;

  function render(){
    steps.forEach(s => {
      const n = Number(s.dataset.step);
      s.classList.toggle('active', n === current);
      s.classList.toggle('done', n < current);
    });
    stages.forEach(st => {
      st.style.display = Number(st.dataset.stage) === current ? '' : 'none';
    });
  }

  nextBtns.forEach(btn => btn.addEventListener('click', () => {
    if (current < steps.length) { current++; render(); window.scrollTo({top: document.querySelector('.tickets-layout')?.offsetTop - 100 || 0, behavior:'smooth'}); }
  }));
  prevBtns.forEach(btn => btn.addEventListener('click', () => {
    if (current > 1) { current--; render(); }
  }));

  render();
}

/* ---------- Selección de sector en compra de entradas ---------- */
function initSeatSelector(){
  const items = document.querySelectorAll('.legend-item');
  const totalEl = document.querySelector('[data-ticket-total]');
  if (!items.length) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      if (totalEl) {
        totalEl.textContent = item.dataset.price ? `$${Number(item.dataset.price).toLocaleString('es-AR')}` : '$0';
      }
      const sectorName = document.querySelector('[data-ticket-sector]');
      if (sectorName) sectorName.textContent = item.dataset.sector || '—';
    });
  });
}

/* ---------- Cuenta regresiva próximo partido (home) ---------- */
function initCountdown(){
  const el = document.querySelector('[data-countdown]');
  if (!el) return;
  const target = new Date(el.dataset.countdown).getTime();

  function tick(){
    const diff = target - Date.now();
    if (diff <= 0) { el.textContent = '¡Es hoy!'; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    el.textContent = `Faltan ${d}d ${h}h ${m}m`;
  }
  tick();
  setInterval(tick, 60000);
}

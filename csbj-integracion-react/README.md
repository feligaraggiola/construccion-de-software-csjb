# CSBJ — Integración de React con PHP + MySQL

Este paquete agrega **React** solo en `login.html`, `registro.html` y la
sección "Mis datos" de `mi-cuenta.html`. El resto del sitio (Inicio,
Partidos, Noticias, Entradas, y el resto del panel de socio) sigue siendo
HTML/CSS estático, sin cambios.

```
React (login / registro / mis datos)
        │  fetch()
        ▼
API en PHP (carpeta backend/api)
        │  PDO
        ▼
MySQL (base de datos "csbj")
```

## Estructura de carpetas

```
csbj/                    → tu sitio ya existente (index, partidos, etc.)
  js/react/               → acá caen los .bundle.js compilados por Vite
backend/                  → API en PHP
  config/db.php           → credenciales de conexión a MySQL
  config/cors.php         → cabeceras CORS + manejo de sesión
  api/login.php
  api/registro.php
  api/logout.php
  api/mi-cuenta.php
  sql/schema.sql          → script para crear la base y la tabla usuarios
react-src/                → código fuente de React (sin compilar)
  src/api.js
  src/components/LoginForm.jsx
  src/components/RegistroForm.jsx
  src/components/AccountPanel.jsx
  src/entry-login.jsx
  src/entry-registro.jsx
  src/entry-cuenta.jsx
  vite.login.config.js
  vite.registro.config.js
  vite.cuenta.config.js
```

## 1. Base de datos

Con MySQL corriendo localmente:

```bash
mysql -u root -p < backend/sql/schema.sql
```

Esto crea la base `csbj` y la tabla `usuarios`. No hace falta insertar
usuarios a mano: se crean solos al registrarse desde `registro.html`.

Si tu usuario/contraseña de MySQL no son `root` / (vacío), editá
`backend/config/db.php`.

## 2. Levantar la API en PHP

Necesitás PHP instalado (8.x recomendado). Desde la carpeta `backend/`:

```bash
php -S localhost:8000
```

Con eso los endpoints quedan disponibles en:
- `http://localhost:8000/api/login.php`
- `http://localhost:8000/api/registro.php`
- `http://localhost:8000/api/logout.php`
- `http://localhost:8000/api/mi-cuenta.php`

## 3. Compilar los componentes de React

Necesitás Node.js instalado (18+). Desde la carpeta `react-src/`:

```bash
npm install
npm run build
```

Esto genera automáticamente:
- `csbj/js/react/login.bundle.js`
- `csbj/js/react/registro.bundle.js`
- `csbj/js/react/cuenta.bundle.js`

Cada vez que modifiques un componente `.jsx`, volvés a correr `npm run build`
(o el script individual, ej. `npm run build:login`) para regenerar el bundle.

## 4. Abrir el sitio

Como `login.html`, `registro.html` y `mi-cuenta.html` ahora hacen `fetch`
a `http://localhost:8000`, lo más prolijo es servir también el sitio
estático con un servidor (no abrirlo con doble clic), para evitar
problemas de cookies/CORS con `file://`:

```bash
cd csbj
php -S localhost:5173
```

Y abrís `http://localhost:5173/index.html` en el navegador.

Si cambiás el puerto o el dominio en algún paso, actualizá:
- `backend/config/cors.php` → variable `$allowedOrigin`
- El `<script>window.CSBJ_API_BASE = '...'</script>` al final de
  `login.html`, `registro.html` y `mi-cuenta.html`

## 5. Probar el flujo

1. Entrá a `registro.html`, completá el formulario y creá una cuenta.
   Esto inserta un registro real en la tabla `usuarios` de MySQL.
2. Te redirige automáticamente a `mi-cuenta.html`.
3. En la sección "Mis datos" vas a ver los datos que acabás de cargar,
   traídos en vivo desde la base con `GET /api/mi-cuenta.php`.
4. Si los editás y le das "Guardar cambios", se actualiza el registro
   en MySQL con `PUT /api/mi-cuenta.php`.
5. Cerrás sesión y volvés a entrar desde `login.html` con el mismo
   DNI/correo y contraseña.

## Notas para la entrega / documentación del proyecto

- El resto del sitio (Inicio, Partidos, Noticias, Entradas, y las demás
  secciones del panel de socio como Mis entradas, Beneficios, Historial)
  siguen siendo HTML/CSS estático — no requieren backend para esta entrega.
- La sesión se maneja con cookies de sesión de PHP (`session_start()`),
  no con JWT, para mantenerlo simple.
- Las contraseñas se guardan con `password_hash()` (bcrypt), nunca en
  texto plano.
- Esto es un entorno de **desarrollo local**. Para producción habría que:
  mover las credenciales de `db.php` a variables de entorno, servir todo
  bajo el mismo dominio (para no necesitar CORS), y usar HTTPS.

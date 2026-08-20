<?php
// POST /api/registro.php
// Body JSON: { nombre, apellido, dni, email, password }

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['error' => 'Método no permitido.']);
}

$body = getJsonBody();

$nombre   = trim($body['nombre']   ?? '');
$apellido = trim($body['apellido'] ?? '');
$dni      = trim($body['dni']      ?? '');
$email    = trim($body['email']    ?? '');
$password = (string)($body['password'] ?? '');

// --- Validaciones básicas ---
$errores = [];
if ($nombre === '')                       $errores['nombre']   = 'El nombre es obligatorio.';
if ($apellido === '')                     $errores['apellido'] = 'El apellido es obligatorio.';
if (!preg_match('/^\d{7,8}$/', $dni))     $errores['dni']      = 'Ingresá un DNI válido (7 u 8 dígitos).';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errores['email'] = 'Ingresá un correo válido.';
if (strlen($password) < 6)                $errores['password'] = 'La contraseña debe tener al menos 6 caracteres.';

if ($errores) {
    respond(422, ['error' => 'Datos inválidos.', 'campos' => $errores]);
}

$pdo = getConnection();

// Verificar que no exista ya el DNI o el email
$check = $pdo->prepare('SELECT id FROM usuarios WHERE dni = ? OR email = ?');
$check->execute([$dni, $email]);
if ($check->fetch()) {
    respond(409, ['error' => 'Ya existe un socio registrado con ese DNI o correo.']);
}

// Generar número de socio simple (correlativo a partir del último id)
$last = $pdo->query('SELECT COALESCE(MAX(id), 0) AS max_id FROM usuarios')->fetch();
$nroSocio = str_pad((string)($last['max_id'] + 100001), 6, '0', STR_PAD_LEFT);

$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare('
    INSERT INTO usuarios (nro_socio, nombre, apellido, dni, email, password_hash)
    VALUES (?, ?, ?, ?, ?, ?)
');
$stmt->execute([$nroSocio, $nombre, $apellido, $dni, $email, $hash]);

$userId = (int)$pdo->lastInsertId();

// Loguear automáticamente al usuario recién creado
$_SESSION['user_id'] = $userId;

respond(201, [
    'mensaje' => 'Cuenta creada correctamente.',
    'usuario' => [
        'id'        => $userId,
        'nro_socio' => $nroSocio,
        'nombre'    => $nombre,
        'apellido'  => $apellido,
        'email'     => $email,
    ],
]);

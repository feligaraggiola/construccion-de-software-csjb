<?php
// POST /api/login.php
// Body JSON: { identificador, password }  -> identificador puede ser email o DNI

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['error' => 'Método no permitido.']);
}

$body = getJsonBody();
$identificador = trim($body['identificador'] ?? '');
$password      = (string)($body['password'] ?? '');

if ($identificador === '' || $password === '') {
    respond(422, ['error' => 'Ingresá tu correo/DNI y tu contraseña.']);
}

$pdo = getConnection();
$stmt = $pdo->prepare('SELECT * FROM usuarios WHERE email = ? OR dni = ? LIMIT 1');
$stmt->execute([$identificador, $identificador]);
$usuario = $stmt->fetch();

if (!$usuario || !password_verify($password, $usuario['password_hash'])) {
    respond(401, ['error' => 'Correo/DNI o contraseña incorrectos.']);
}

$_SESSION['user_id'] = (int)$usuario['id'];

unset($usuario['password_hash']); // nunca devolver el hash al frontend

respond(200, [
    'mensaje' => 'Sesión iniciada correctamente.',
    'usuario' => $usuario,
]);

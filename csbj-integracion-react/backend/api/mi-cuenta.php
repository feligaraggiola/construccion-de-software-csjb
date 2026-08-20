<?php
// GET /api/mi-cuenta.php  -> devuelve los datos del socio logueado
// PUT /api/mi-cuenta.php  -> actualiza los datos del socio logueado

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

if (!isset($_SESSION['user_id'])) {
    respond(401, ['error' => 'No hay una sesión activa. Iniciá sesión nuevamente.']);
}

$pdo = getConnection();
$userId = (int)$_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare('SELECT id, nro_socio, nombre, apellido, dni, email, telefono, pais, provincia, localidad, dpto, domicilio, categoria, fecha_registro FROM usuarios WHERE id = ?');
    $stmt->execute([$userId]);
    $usuario = $stmt->fetch();

    if (!$usuario) {
        respond(404, ['error' => 'Socio no encontrado.']);
    }

    respond(200, ['usuario' => $usuario]);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $body = getJsonBody();

    $campos = ['nombre', 'apellido', 'telefono', 'pais', 'provincia', 'localidad', 'dpto', 'domicilio'];
    $sets = [];
    $valores = [];

    foreach ($campos as $campo) {
        if (array_key_exists($campo, $body)) {
            $sets[] = "$campo = ?";
            $valores[] = trim((string)$body[$campo]);
        }
    }

    if (!$sets) {
        respond(422, ['error' => 'No se enviaron campos para actualizar.']);
    }

    $valores[] = $userId;
    $sql = 'UPDATE usuarios SET ' . implode(', ', $sets) . ' WHERE id = ?';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($valores);

    respond(200, ['mensaje' => 'Datos actualizados correctamente.']);
}

respond(405, ['error' => 'Método no permitido.']);

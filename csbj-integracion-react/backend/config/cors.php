<?php
// =========================================================
// CSBJ — Cabeceras CORS + inicio de sesión
// =========================================================
// Se incluye al principio de cada endpoint.
// Permite que React (corriendo en otro puerto durante el desarrollo,
// ej. http://localhost:5173) pueda llamar a esta API y mantener
// la sesión mediante cookies.

$allowedOrigin = 'http://localhost:5173'; // cambiar por el dominio real en producción

header("Access-Control-Allow-Origin: $allowedOrigin");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// El navegador manda un OPTIONS "preflight" antes del POST/PUT real.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'samesite' => 'Lax',
]);
session_start();

// Helper para leer el body JSON de la petición
function getJsonBody(): array {
    $data = json_decode(file_get_contents('php://input'), true);
    return is_array($data) ? $data : [];
}

// Helper para responder en JSON y cortar la ejecución
function respond(int $status, array $data): void {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

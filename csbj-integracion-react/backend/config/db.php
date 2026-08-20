<?php
// =========================================================
// CSBJ — Conexión a la base de datos (PDO / MySQL)
// =========================================================
// Cambiá estos 4 valores según tu entorno local.
// En un proyecto real, esto NO debería subirse a un repo público
// (usar variables de entorno), pero para el trabajo práctico alcanza así.

define('DB_HOST', 'localhost');
define('DB_NAME', 'csbj');
define('DB_USER', 'root');
define('DB_PASS', '');

function getConnection(): PDO {
    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'No se pudo conectar a la base de datos.']);
        exit;
    }
}

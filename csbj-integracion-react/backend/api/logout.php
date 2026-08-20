<?php
// POST /api/logout.php

require_once __DIR__ . '/../config/cors.php';

$_SESSION = [];
session_destroy();

respond(200, ['mensaje' => 'Sesión cerrada.']);
